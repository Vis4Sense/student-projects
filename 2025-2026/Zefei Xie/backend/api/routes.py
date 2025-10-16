"""
Author: Henry X
Date: 2025/10/16 9:12
File: routes.py
Description: [Add your description here]
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.schemas import (
    SearchRequest, HumanInterventionRequest, PipelineState,
    VisualizationData, Paper, PaperReviewDecision, SearchAgentOutput, KeywordModel, RevisingAgentOutput,
    SynthesisAgentOutput
)
from graph.workflow import ResearchWorkflow
from graph.state import AgentState
from services.visualization_service import VisualizationService
from services.decision_history import DecisionHistoryService
import uuid
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["research"])

# 全局服务实例（生产环境应使用依赖注入）
workflow = ResearchWorkflow()
viz_service = VisualizationService()
history_service = DecisionHistoryService()

# 存储运行中的管道状态（生产环境应使用 Redis/数据库）
active_pipelines: Dict[str, PipelineState] = {}


@router.post("/pipeline/start", response_model=PipelineState)
async def start_pipeline(request: SearchRequest, background_tasks: BackgroundTasks):
    """
    启动研究工作流

    1. 创建新的 pipeline_id
    2. 初始化状态
    3. 在后台启动 Search Agent
    """
    pipeline_id = str(uuid.uuid4())

    # 创建初始状态
    initial_state = AgentState(
        original_query=request.query,
        pipeline_id=pipeline_id,
        search_keywords=[],
        raw_papers=[],
        search_reasoning="",
        accepted_papers=[],
        rejected_decisions=[],
        rejection_summary={},
        final_answer="",
        citations=[],
        answer_structure={},
        current_stage="initializing",
        human_interventions=[],
        errors=[],
        awaiting_human_review=False,
        human_feedback=None
    )

    # 创建执行记录
    history_service.create_execution(pipeline_id, request.query)

    # 启动工作流（仅执行 Search Agent）
    background_tasks.add_task(run_search_stage, pipeline_id, initial_state)

    # 返回初始状态
    pipeline_state = PipelineState(
        pipeline_id=pipeline_id,
        stage="search",
        created_at=initial_state.get("created_at")
    )
    active_pipelines[pipeline_id] = pipeline_state

    logger.info(f"Started pipeline: {pipeline_id}")
    return pipeline_state


async def run_search_stage(pipeline_id: str, state: AgentState):
    """后台任务：运行 Search Agent"""
    try:
        # 只运行搜索阶段
        updated_state = await workflow.search_agent.process(state)

        # 更新存储的状态
        pipeline = active_pipelines[pipeline_id]
        pipeline.stage = "search_complete"
        pipeline.search_output = SearchAgentOutput(
            keywords=updated_state["search_keywords"],
            papers=updated_state["raw_papers"],
            reasoning=updated_state["search_reasoning"]
        )

    except Exception as e:
        logger.error(f"Search stage failed for {pipeline_id}: {e}")
        active_pipelines[pipeline_id].stage = "error"


@router.get("/pipeline/{pipeline_id}", response_model=PipelineState)
async def get_pipeline_status(pipeline_id: str):
    """获取管道当前状态"""
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    return active_pipelines[pipeline_id]


@router.get("/pipeline/{pipeline_id}/visualization", response_model=VisualizationData)
async def get_visualization(pipeline_id: str):
    """获取可视化数据"""
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline_state = active_pipelines[pipeline_id]
    return viz_service.generate_visualization(pipeline_state)


@router.post("/pipeline/{pipeline_id}/intervention")
async def apply_human_intervention(
        pipeline_id: str,
        intervention: HumanInterventionRequest,
        background_tasks: BackgroundTasks
):
    """
    应用人工干预

    支持的干预类型:
    - edit_keyword: 修改搜索关键词
    - override_paper: 推翻论文筛选决策
    - edit_answer: 编辑最终答案
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]

    # 记录干预
    intervention_record = intervention.dict()
    pipeline.human_interventions.append(intervention_record)
    history_service.add_human_intervention(pipeline_id, intervention_record)

    # 根据干预类型执行操作
    if intervention.action_type == "edit_keyword":
        # 修改关键词后重新搜索
        new_keywords = intervention.details.get("keywords", [])
        pipeline.search_output.keywords = [
            KeywordModel(**kw) for kw in new_keywords
        ]
        background_tasks.add_task(rerun_search, pipeline_id)

    elif intervention.action_type == "override_paper":
        # 推翻论文决策
        paper_id = intervention.details.get("paper_id")
        action = intervention.details.get("action")  # "accept" or "reject"

        if action == "accept":
            # 从拒绝列表移到接受列表
            rejected_paper = next(
                (p for p in pipeline.revising_output.rejected_papers if p.paper_id == paper_id),
                None
            )
            if rejected_paper:
                # 找到原始论文
                paper = next(
                    (p for p in pipeline.search_output.papers if p.id == paper_id),
                    None
                )
                if paper:
                    pipeline.revising_output.accepted_papers.append(paper)
                    pipeline.revising_output.rejected_papers.remove(rejected_paper)

    elif intervention.action_type == "edit_answer":
        # 编辑最终答案
        new_answer = intervention.details.get("answer")
        pipeline.synthesis_output.answer = new_answer

    logger.info(f"Applied intervention to {pipeline_id}: {intervention.action_type}")
    return {"status": "success", "message": "Intervention applied"}


async def rerun_search(pipeline_id: str):
    """重新运行搜索（在关键词被修改后）"""
    pipeline = active_pipelines[pipeline_id]

    # 重新调用 Search Agent
    state = AgentState(
        original_query=pipeline.search_output.reasoning,  # 使用原始查询
        pipeline_id=pipeline_id,
        search_keywords=pipeline.search_output.keywords,
        # ... 其他字段
    )

    updated_state = await workflow.search_agent._search_papers(state["search_keywords"])
    pipeline.search_output.papers = updated_state


@router.post("/pipeline/{pipeline_id}/continue")
async def continue_pipeline(pipeline_id: str, background_tasks: BackgroundTasks):
    """
    继续执行工作流到下一个阶段

    - 如果当前在 search_complete，执行 Revising Agent
    - 如果在 revising_complete，执行 Synthesis Agent
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]

    if pipeline.stage == "search_complete":
        background_tasks.add_task(run_revising_stage, pipeline_id)
        return {"status": "running", "next_stage": "revising"}

    elif pipeline.stage == "revising_complete":
        background_tasks.add_task(run_synthesis_stage, pipeline_id)
        return {"status": "running", "next_stage": "synthesis"}

    else:
        return {"status": "waiting", "message": "No action needed"}


async def run_revising_stage(pipeline_id: str):
    """后台任务：运行 Revising Agent"""
    try:
        pipeline = active_pipelines[pipeline_id]

        state = AgentState(
            original_query="",  # 从 pipeline 获取
            pipeline_id=pipeline_id,
            raw_papers=pipeline.search_output.papers,
            # ... 填充其他必要字段
        )

        updated_state = await workflow.revising_agent.process(state)

        # 更新状态
        pipeline.stage = "revising_complete"
        pipeline.revising_output = RevisingAgentOutput(
            accepted_papers=updated_state["accepted_papers"],
            rejected_papers=updated_state["rejected_decisions"],
            rejection_summary=updated_state["rejection_summary"]
        )

    except Exception as e:
        logger.error(f"Revising stage failed for {pipeline_id}: {e}")
        pipeline.stage = "error"


async def run_synthesis_stage(pipeline_id: str):
    """后台任务：运行 Synthesis Agent"""
    try:
        pipeline = active_pipelines[pipeline_id]

        state = AgentState(
            original_query="",  # 从 pipeline 获取
            pipeline_id=pipeline_id,
            accepted_papers=pipeline.revising_output.accepted_papers,
            # ... 填充其他必要字段
        )

        updated_state = await workflow.synthesis_agent.process(state)

        # 更新状态
        pipeline.stage = "completed"
        pipeline.synthesis_output = SynthesisAgentOutput(
            answer=updated_state["final_answer"],
            citations=updated_state["citations"],
            confidence_score=0.85,  # 可以从 Agent 计算
            structure=updated_state["answer_structure"]
        )

        # 标记完成
        history_service.complete_execution(pipeline_id)

    except Exception as e:
        logger.error(f"Synthesis stage failed for {pipeline_id}: {e}")
        pipeline.stage = "error"


@router.get("/pipeline/{pipeline_id}/history")
async def get_decision_history(pipeline_id: str):
    """获取完整决策历史（用于审计）"""
    return history_service.export_execution_report(pipeline_id)


@router.get("/pipeline/{pipeline_id}/papers/rejected", response_model=List[PaperReviewDecision])
async def get_rejected_papers(pipeline_id: str):
    """获取被拒绝的论文列表（供人工审核）"""
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]
    if not pipeline.revising_output:
        return []

    return pipeline.revising_output.rejected_papers
