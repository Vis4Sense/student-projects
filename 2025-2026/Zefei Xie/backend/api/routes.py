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
    SynthesisAgentOutput, KeywordSearchResult
)
from graph.workflow import ResearchWorkflow
from graph.state import AgentState
from services.intervention_service import InterventionService
from services.visualization_service import VisualizationService
from services.decision_history import DecisionHistoryService
import uuid
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["research"])

# 全局服务实例
workflow = ResearchWorkflow()
viz_service = VisualizationService()
intervention_service = InterventionService()
history_service = DecisionHistoryService()

# 存储运行中的管道状态
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
        intervention: HumanInterventionRequest
):
    """
    应用人工干预（增强版）

    支持的干预类型:
    1. edit_keywords - 修改关键词
       {
           "action_type": "edit_keywords",
           "details": {
               "add_keywords": [{"keyword": "new_kw", "importance": 0.9}],
               "remove_keywords": ["old_kw"],
               "edit_keywords": {"old": "new"},
               "adjust_importance": {"kw1": 0.8}
           }
       }

    2. adjust_keyword_results - 调整单个关键词的结果
       {
           "action_type": "adjust_keyword_results",
           "details": {
               "keyword": "interpretability",
               "action": "remove_paper",
               "paper_id": "arxiv_123"
           }
       }

    3. override_paper - 推翻论文筛选决策
       {
           "action_type": "override_paper",
           "details": {
               "paper_id": "arxiv_456",
               "action": "accept",
               "reason": "This paper is actually relevant"
           }
       }

    4. edit_answer - 编辑最终答案
       {
           "action_type": "edit_answer",
           "details": {
               "edited_answer": "New answer text..."
           }
       }
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]

    # 使用 InterventionService 处理干预
    result = await intervention_service.apply_intervention(pipeline, intervention)

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])

    return result


@router.get("/pipeline/{pipeline_id}/interventions")
async def get_intervention_history(pipeline_id: str):
    """获取所有干预历史"""
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]
    return {
        "pipeline_id": pipeline_id,
        "total_interventions": len(pipeline.human_interventions),
        "interventions": pipeline.human_interventions
    }


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


# 在现有的 routes.py 中添加以下端点

@router.get("/pipeline/{pipeline_id}/keywords", response_model=List[KeywordSearchResult])
async def get_keyword_results(pipeline_id: str):
    """
    获取每个关键词的搜索结果

    返回示例:
    [
        {
            "keyword": {"keyword": "interpretability", "importance": 1.0},
            "papers": [...],
            "papers_count": 15
        },
        ...
    ]
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]
    if not pipeline.search_output:
        return []

    return pipeline.search_output.keyword_results


@router.get("/pipeline/{pipeline_id}/papers/by-keyword/{keyword}")
async def get_papers_by_keyword(pipeline_id: str, keyword: str):
    """
    获取某个关键词找到的所有论文

    示例: GET /pipeline/xxx/papers/by-keyword/interpretability
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]
    if not pipeline.search_output:
        return {"papers": []}

    # 找到该关键词的搜索结果
    keyword_result = next(
        (kr for kr in pipeline.search_output.keyword_results if kr.keyword.keyword == keyword),
        None
    )

    if not keyword_result:
        raise HTTPException(status_code=404, detail=f"Keyword '{keyword}' not found")

    return {
        "keyword": keyword,
        "papers_count": keyword_result.papers_count,
        "papers": keyword_result.papers
    }


@router.get("/pipeline/{pipeline_id}/stats")
async def get_search_statistics(pipeline_id: str):
    """
    获取搜索统计信息

    返回示例:
    {
        "total_keywords": 3,
        "total_papers_before_dedup": 45,
        "total_unique_papers": 32,
        "duplicates_removed": 13,
        "keyword_breakdown": {
            "interpretability": 15,
            "explainability": 18,
            "transparency": 12
        }
    }
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]
    if not pipeline.search_output:
        return {"error": "Search not completed yet"}

    keyword_breakdown = {
        kr.keyword.keyword: kr.papers_count
        for kr in pipeline.search_output.keyword_results
    }

    return {
        "total_keywords": len(pipeline.search_output.keywords),
        "total_papers_before_dedup": pipeline.search_output.total_papers_before_dedup,
        "total_unique_papers": len(pipeline.search_output.papers),
        "duplicates_removed": pipeline.search_output.total_papers_before_dedup - len(pipeline.search_output.papers),
        "keyword_breakdown": keyword_breakdown
    }
