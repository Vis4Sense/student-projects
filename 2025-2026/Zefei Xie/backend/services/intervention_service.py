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
    """Defines the interface for handling human interventions"""

    def __init__(self):
        self.search_agent = SearchAgent()
        self.interventions_history: List[InterventionRecord] = []

    async def apply_intervention(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """
        Apply a human intervention to a pipeline state
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
    # 1. Keyword edit
    # ============================================================

    async def _handle_keyword_edit(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """
        Dead-simple keyword edit: add, remove, or edit keywords
        """
        if not pipeline.search_output:
            return {"success": False, "message": "Search not completed yet"}

        details = intervention.details
        changes = []

        # Get current state
        current_keywords = pipeline.search_output.keywords.copy()
        current_results = pipeline.search_output.keyword_results.copy()

        # Add new keywords
        if "add_keywords" in details:
            new_keywords = details["add_keywords"]  # List[dict]
            for kw_data in new_keywords:
                new_kw = KeywordModel(
                    keyword=kw_data["keyword"],
                    importance=kw_data.get("importance", 1.0),
                    is_custom=True  # Tag as custom
                )
                current_keywords.append(new_kw)

                # Search for papers
                papers = await self.search_agent.arxiv_api.search(
                    query=new_kw.keyword,
                    max_results=20
                )

                # Tag papers with new keyword
                for paper in papers:
                    paper.found_by_keywords.append(new_kw.keyword)

                # Create new search result
                result = KeywordSearchResult(
                    keyword=new_kw,
                    papers=papers,
                    search_timestamp=datetime.now()
                )
                current_results.append(result)

                changes.append(f"Added keyword '{new_kw.keyword}' → found {len(papers)} papers")

        # Remove keywords
        if "remove_keywords" in details:
            remove_list = details["remove_keywords"]  # List[str]
            for kw_text in remove_list:
                # Remove from current_keywords
                current_keywords = [kw for kw in current_keywords if kw.keyword != kw_text]

                # Remove from papers_by_keyword
                removed_result = next((r for r in current_results if r.keyword.keyword == kw_text), None)
                if removed_result:
                    current_results.remove(removed_result)
                    changes.append(f"Removed keyword '{kw_text}' and its {removed_result.papers_count} papers")

        # Re-search for keywords
        if "edit_keywords" in details:
            edits = details["edit_keywords"]  # Dict[old_kw: new_kw]
            for old_kw, new_kw_text in edits.items():
                # Find keyword in current keywords
                for kw in current_keywords:
                    if kw.keyword == old_kw:
                        kw.keyword = new_kw_text
                        kw.is_custom = True

                # Research for new keyword
                papers = await self.search_agent.arxiv_api.search(
                    query=new_kw_text,
                    max_results=20 #调整搜索结果数量
                )

                # Update search results
                for result in current_results:
                    if result.keyword.keyword == old_kw:
                        result.keyword.keyword = new_kw_text
                        result.papers = papers
                        result.papers_count = len(papers)
                        result.search_timestamp = datetime.now()

                changes.append(f"Changed '{old_kw}' → '{new_kw_text}' (re-searched)")

        # Adjust keyword importance
        if "adjust_importance" in details:
            adjustments = details["adjust_importance"]  # Dict[kw: new_importance]
            for kw_text, new_importance in adjustments.items():
                for kw in current_keywords:
                    if kw.keyword == kw_text:
                        old_importance = kw.importance
                        kw.importance = new_importance
                        changes.append(f"Adjusted '{kw_text}' importance: {old_importance} → {new_importance}")

        # Re-merge and deduplicate papers
        merged_papers, papers_by_keyword = self.search_agent._merge_and_deduplicate(current_results)

        # Update pipeline state
        pipeline.search_output.keywords = current_keywords
        pipeline.search_output.keyword_results = current_results
        pipeline.search_output.papers = merged_papers
        pipeline.search_output.papers_by_keyword = papers_by_keyword
        pipeline.search_output.total_papers_before_dedup = sum(r.papers_count for r in current_results)

        # Record intervention
        self._record_intervention(pipeline, intervention, changes)

        return {
            "success": True,
            "message": "Keywords updated successfully",
            "changes": changes,
            "new_paper_count": len(merged_papers)
        }

    # ============================================================
    # 2. keyword results adjustment
    # ============================================================

    def _handle_keyword_results_adjustment(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """
        Adjust the search results for a specific keyword
        """
        if not pipeline.search_output:
            return {"success": False, "message": "Search not completed yet"}

        details = intervention.details
        target_keyword = details.get("keyword")
        action = details.get("action")  # "remove_paper" or "add_paper"
        paper_id = details.get("paper_id")

        if not all([target_keyword, action, paper_id]):
            return {"success": False, "message": "Missing required fields"}

        # find
        keyword_result = next(
            (r for r in pipeline.search_output.keyword_results if r.keyword.keyword == target_keyword),
            None
        )

        if not keyword_result:
            return {"success": False, "message": f"Keyword '{target_keyword}' not found"}

        if action == "remove_paper":
            original_count = len(keyword_result.papers)
            keyword_result.papers = [p for p in keyword_result.papers if p.id != paper_id]
            keyword_result.papers_count = len(keyword_result.papers)

            # remove from papers_by_keyword
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
    # 3. Paper override
    # ============================================================

    def _handle_paper_override(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """
        Override the AI decision on a paper
        """
        if not pipeline.revising_output:
            return {"success": False, "message": "Revising stage not completed yet"}

        details = intervention.details
        paper_id = details.get("paper_id")
        action = details.get("action")  # "accept" or "reject"
        reason = details.get("reason", "Manual override by user")

        if action == "accept":
            # move to accepted list
            rejected_decision = next(
                (d for d in pipeline.revising_output.rejected_papers if d.paper_id == paper_id),
                None
            )

            if not rejected_decision:
                return {"success": False, "message": "Paper not found in rejected list"}

            # find original paper
            paper = next(
                (p for p in pipeline.search_output.papers if p.id == paper_id),
                None
            )

            if not paper:
                return {"success": False, "message": "Original paper not found"}

            # move to accepted list
            pipeline.revising_output.rejected_papers.remove(rejected_decision)
            pipeline.revising_output.accepted_papers.append(paper)

            # tag
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
            # check if paper is already in accepted list
            paper = next(
                (p for p in pipeline.revising_output.accepted_papers if p.id == paper_id),
                None
            )

            if not paper:
                return {"success": False, "message": "Paper not found in accepted list"}

            from models.schemas import PaperReviewDecision

            # Create a new rejection decision
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
    # 4. Edit answer
    # ============================================================

    def _handle_answer_edit(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """Edit the answer"""
        if not pipeline.synthesis_output:
            return {"success": False, "message": "Synthesis stage not completed yet"}

        details = intervention.details
        new_answer = details.get("edited_answer")

        if not new_answer:
            return {"success": False, "message": "No edited answer provided"}

        original_answer = pipeline.synthesis_output.answer
        pipeline.synthesis_output.answer = new_answer

        changes_summary = f"Answer edited (original: {len(original_answer)} chars → new: {len(new_answer)} chars)"

        self._record_intervention(pipeline, intervention, [changes_summary])

        return {
            "success": True,
            "message": "Answer updated",
            "original_length": len(original_answer),
            "new_length": len(new_answer)
        }

    # ============================================================
    # 5. Rerun stage
    # ============================================================

    async def _handle_stage_rerun(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest
    ) -> Dict[str, Any]:
        """
        rerun a stage of the pipeline
        """
        details = intervention.details
        stage = details.get("stage")  # "search", "revising", "synthesis"

        if stage == "search":
            # re-run search stage
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
    # Auxiliary functions
    # ============================================================

    def _record_intervention(
            self,
            pipeline: PipelineState,
            intervention: HumanInterventionRequest,
            changes: List[str]
    ):
        """Record a human intervention in the pipeline state"""
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
