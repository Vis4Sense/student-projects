"""
Author: Henry X
Date: 2025/10/19 13:51
File: intervention_service.py
Description: [Add your description here]
"""

"""
人工干预服务 - 处理各类人工干预操作
"""
from typing import Dict, Any, List, Optional
from models.schemas import (
    HumanInterventionRequest, InterventionRecord, PipelineState,
    KeywordModel, Paper, KeywordSearchResult
)
from agents.search_agent import SearchAgent
import uuid
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class InterventionService:
    """处理人工干预的核心服务"""

    def __init__(self):
        self.search_agent = SearchAgent()
        self.interventions_history: List[InterventionRecord] = []

    async def apply_intervention(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """
        应用人工干预

        返回: {"success": bool, "message": str, "changes": dict}
        """
        try:
            if intervention.action_type == "edit_keywords":
                return await self._handle_keyword_edit(pipeline, intervention)

            elif intervention.action_type == "adjust_keyword_results":
                return self._handle_keyword_results_adjustment(pipeline, intervention)

            elif intervention.action_type == "override_paper":
                return self._handle_paper_override(pipeline, intervention)

            elif intervention.action_type == "edit_answer":
                return self._handle_answer_edit(pipeline, intervention)

            elif intervention.action_type == "rerun_stage":
                return await self._handle_stage_rerun(pipeline, intervention)

            else:
                return {
                    "success": False,
                    "message": f"Unknown action type: {intervention.action_type}"
                }

        except Exception as e:
            logger.error(f"Intervention failed: {e}")
            return {
                "success": False,
                "message": f"Error applying intervention: {str(e)}"
            }

    # ============================================================
    # 1. 关键词干预
    # ============================================================

    async def _handle_keyword_edit(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """
        处理关键词编辑干预

        支持的操作:
        - 添加新关键词
        - 删除现有关键词
        - 修改关键词文本
        - 调整关键词重要性
        """
        if not pipeline.search_output:
            return {"success": False, "message": "Search not completed yet"}

        details = intervention.details
        changes = []

        # 获取当前关键词列表
        current_keywords = pipeline.search_output.keywords.copy()
        current_results = pipeline.search_output.keyword_results.copy()

        # 操作 1: 添加新关键词
        if "add_keywords" in details:
            new_keywords = details["add_keywords"]  # List[dict]
            for kw_data in new_keywords:
                new_kw = KeywordModel(
                    keyword=kw_data["keyword"],
                    importance=kw_data.get("importance", 1.0),
                    is_custom=True  # 标记为用户自定义
                )
                current_keywords.append(new_kw)

                # 立即搜索该关键词
                papers = await self.search_agent.arxiv_api.search(
                    query=new_kw.keyword,
                    max_results=20
                )

                # 标记论文
                for paper in papers:
                    paper.found_by_keywords.append(new_kw.keyword)

                # 创建搜索结果
                result = KeywordSearchResult(
                    keyword=new_kw,
                    papers=papers,
                    search_timestamp=datetime.now()
                )
                current_results.append(result)

                changes.append(f"Added keyword '{new_kw.keyword}' → found {len(papers)} papers")

        # 操作 2: 删除关键词
        if "remove_keywords" in details:
            remove_list = details["remove_keywords"]  # List[str]
            for kw_text in remove_list:
                # 从关键词列表移除
                current_keywords = [kw for kw in current_keywords if kw.keyword != kw_text]

                # 从搜索结果移除
                removed_result = next((r for r in current_results if r.keyword.keyword == kw_text), None)
                if removed_result:
                    current_results.remove(removed_result)
                    changes.append(f"Removed keyword '{kw_text}' and its {removed_result.papers_count} papers")

        # 操作 3: 修改关键词文本
        if "edit_keywords" in details:
            edits = details["edit_keywords"]  # Dict[old_kw: new_kw]
            for old_kw, new_kw_text in edits.items():
                # 找到并更新关键词
                for kw in current_keywords:
                    if kw.keyword == old_kw:
                        kw.keyword = new_kw_text
                        kw.is_custom = True

                # 重新搜索该关键词
                papers = await self.search_agent.arxiv_api.search(
                    query=new_kw_text,
                    max_results=20
                )

                # 更新搜索结果
                for result in current_results:
                    if result.keyword.keyword == old_kw:
                        result.keyword.keyword = new_kw_text
                        result.papers = papers
                        result.papers_count = len(papers)
                        result.search_timestamp = datetime.now()

                changes.append(f"Changed '{old_kw}' → '{new_kw_text}' (re-searched)")

        # 操作 4: 调整重要性
        if "adjust_importance" in details:
            adjustments = details["adjust_importance"]  # Dict[kw: new_importance]
            for kw_text, new_importance in adjustments.items():
                for kw in current_keywords:
                    if kw.keyword == kw_text:
                        old_importance = kw.importance
                        kw.importance = new_importance
                        changes.append(f"Adjusted '{kw_text}' importance: {old_importance} → {new_importance}")

        # 重新合并和去重
        merged_papers, papers_by_keyword = self.search_agent._merge_and_deduplicate(current_results)

        # 更新 pipeline
        pipeline.search_output.keywords = current_keywords
        pipeline.search_output.keyword_results = current_results
        pipeline.search_output.papers = merged_papers
        pipeline.search_output.papers_by_keyword = papers_by_keyword
        pipeline.search_output.total_papers_before_dedup = sum(r.papers_count for r in current_results)

        # 记录干预
        self._record_intervention(pipeline, intervention, changes)

        return {
            "success": True,
            "message": "Keywords updated successfully",
            "changes": changes,
            "new_paper_count": len(merged_papers)
        }

    # ============================================================
    # 2. 关键词结果调整
    # ============================================================

    def _handle_keyword_results_adjustment(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """
        调整单个关键词的搜索结果

        例如: 从 "interpretability" 的结果中移除某篇不相关的论文
        """
        if not pipeline.search_output:
            return {"success": False, "message": "Search not completed yet"}

        details = intervention.details
        target_keyword = details.get("keyword")
        action = details.get("action")  # "remove_paper" or "add_paper"
        paper_id = details.get("paper_id")

        if not all([target_keyword, action, paper_id]):
            return {"success": False, "message": "Missing required fields"}

        # 找到目标关键词的搜索结果
        keyword_result = next(
            (r for r in pipeline.search_output.keyword_results if r.keyword.keyword == target_keyword),
            None
        )

        if not keyword_result:
            return {"success": False, "message": f"Keyword '{target_keyword}' not found"}

        if action == "remove_paper":
            # 从该关键词的结果中移除论文
            original_count = len(keyword_result.papers)
            keyword_result.papers = [p for p in keyword_result.papers if p.id != paper_id]
            keyword_result.papers_count = len(keyword_result.papers)

            # 重新合并
            merged_papers, papers_by_keyword = self.search_agent._merge_and_deduplicate(
                pipeline.search_output.keyword_results
            )
            pipeline.search_output.papers = merged_papers
            pipeline.search_output.papers_by_keyword = papers_by_keyword

            self._record_intervention(pipeline, intervention, [
                f"Removed paper {paper_id} from keyword '{target_keyword}' results"
            ])

            return {
                "success": True,
                "message": f"Paper removed from '{target_keyword}' results",
                "papers_removed": original_count - len(keyword_result.papers)
            }

        return {"success": False, "message": f"Unknown action: {action}"}

    # ============================================================
    # 3. 论文筛选干预
    # ============================================================

    def _handle_paper_override(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """
        推翻 Revising Agent 的论文筛选决策

        例如: 将被拒绝的论文重新接受
        """
        if not pipeline.revising_output:
            return {"success": False, "message": "Revising stage not completed yet"}

        details = intervention.details
        paper_id = details.get("paper_id")
        action = details.get("action")  # "accept" or "reject"
        reason = details.get("reason", "Manual override by user")

        if action == "accept":
            # 从拒绝列表移到接受列表
            rejected_decision = next(
                (d for d in pipeline.revising_output.rejected_papers if d.paper_id == paper_id),
                None
            )

            if not rejected_decision:
                return {"success": False, "message": "Paper not found in rejected list"}

            # 找到原始论文
            paper = next(
                (p for p in pipeline.search_output.papers if p.id == paper_id),
                None
            )

            if not paper:
                return {"success": False, "message": "Original paper not found"}

            # 移动论文
            pipeline.revising_output.rejected_papers.remove(rejected_decision)
            pipeline.revising_output.accepted_papers.append(paper)

            # 标记为人工推翻
            rejected_decision.is_overridden = True
            rejected_decision.human_note = reason

            self._record_intervention(pipeline, intervention, [
                f"Accepted paper '{paper.title[:50]}...' (overriding AI decision)"
            ])

            return {
                "success": True,
                "message": "Paper accepted",
                "paper_title": paper.title,
                "original_rejection_reason": rejected_decision.reason
            }

        elif action == "reject":
            # 从接受列表移到拒绝列表
            paper = next(
                (p for p in pipeline.revising_output.accepted_papers if p.id == paper_id),
                None
            )

            if not paper:
                return {"success": False, "message": "Paper not found in accepted list"}

            from models.schemas import PaperReviewDecision

            # 创建拒绝决策
            rejection = PaperReviewDecision(
                paper_id=paper_id,
                decision="reject",
                reason=reason,
                is_overridden=True,
                human_note="Manually rejected by user"
            )

            pipeline.revising_output.accepted_papers.remove(paper)
            pipeline.revising_output.rejected_papers.append(rejection)

            self._record_intervention(pipeline, intervention, [
                f"Rejected paper '{paper.title[:50]}...' (manual decision)"
            ])

            return {
                "success": True,
                "message": "Paper rejected",
                "paper_title": paper.title
            }

        return {"success": False, "message": f"Unknown action: {action}"}

    # ============================================================
    # 4. 答案编辑
    # ============================================================

    def _handle_answer_edit(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """编辑最终答案"""
        if not pipeline.synthesis_output:
            return {"success": False, "message": "Synthesis stage not completed yet"}

        details = intervention.details
        new_answer = details.get("edited_answer")

        if not new_answer:
            return {"success": False, "message": "No edited answer provided"}

        original_answer = pipeline.synthesis_output.answer
        pipeline.synthesis_output.answer = new_answer

        # 可选：分析变化
        changes_summary = f"Answer edited (original: {len(original_answer)} chars → new: {len(new_answer)} chars)"

        self._record_intervention(pipeline, intervention, [changes_summary])

        return {
            "success": True,
            "message": "Answer updated",
            "original_length": len(original_answer),
            "new_length": len(new_answer)
        }

    # ============================================================
    # 5. 重新运行阶段
    # ============================================================

    async def _handle_stage_rerun(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """
        重新运行某个阶段

        例如: 在修改关键词后重新运行 Search Agent
        """
        details = intervention.details
        stage = details.get("stage")  # "search", "revising", "synthesis"

        if stage == "search":
            # 重新运行搜索（使用当前的关键词）
            from graph.state import AgentState

            state = AgentState(
                original_query=pipeline.search_output.reasoning.split("'")[1],  # 提取原始查询
                pipeline_id=pipeline.pipeline_id,
                search_keywords=pipeline.search_output.keywords,
                keyword_search_results=[],
                raw_papers=[],
                search_reasoning="",
                accepted_papers=[],
                rejected_decisions=[],
                rejection_summary={},
                final_answer="",
                citations=[],
                answer_structure={},
                current_stage="search",
                human_interventions=[],
                errors=[],
                awaiting_human_review=False,
                human_feedback=None
            )

            updated_state = await self.search_agent.process(state)

            # 更新 pipeline
            pipeline.search_output.keyword_results = updated_state["keyword_search_results"]
            pipeline.search_output.papers = updated_state["raw_papers"]

            self._record_intervention(pipeline, intervention, [
                f"Re-ran search stage with {len(pipeline.search_output.keywords)} keywords"
            ])

            return {
                "success": True,
                "message": "Search stage re-executed",
                "new_paper_count": len(updated_state["raw_papers"])
            }

        return {"success": False, "message": f"Rerun not supported for stage: {stage}"}

    # ============================================================
    # 辅助方法
    # ============================================================

    def _record_intervention(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest,
            changes: List[str]
    ):
        """记录干预到审计日志"""
        record = InterventionRecord(
            intervention_id=str(uuid.uuid4()),
            pipeline_id=intervention.pipeline_id,
            stage=intervention.stage,
            action_type=intervention.action_type,
            details=intervention.details,
            user_note=intervention.user_note,
            timestamp=intervention.timestamp,
            impact_summary="; ".join(changes)
        )

        self.interventions_history.append(record)
        pipeline.human_interventions.append(record.dict())

        logger.info(f"Recorded intervention: {intervention.action_type} in {intervention.stage}")
