"""
Author: Henry X
Date: 2025/10/16 9:25
File: revising_agent.py
Description: [Add your description here]
"""

from typing import Dict, Any, List
from agents.base_agent import BaseAgent
from models.schemas import Paper, PaperReviewDecision
import json
import logging

logger = logging.getLogger(__name__)


class RevisingAgent(BaseAgent):
    """筛选 Agent - 根据 PRISMA 标准筛选论文"""

    def __init__(self):
        super().__init__(name="RevisingAgent")

    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        1. 评估每篇论文的相关性
        2. 根据标准接受/拒绝
        3. 记录拒绝理由
        """
        papers = state["raw_papers"]
        query = state["original_query"]

        logger.info(f"RevisingAgent reviewing {len(papers)} papers")

        accepted = []
        rejected = []

        for paper in papers:
            decision = await self._evaluate_paper(paper, query)

            if decision["decision"] == "accept":
                accepted.append(paper)
            else:
                rejected.append(PaperReviewDecision(
                    paper_id=paper.id,
                    decision="reject",
                    reason=decision["reason"],
                    is_overridden=False
                ))

        # 统计拒绝理由
        rejection_summary = self._summarize_rejections(rejected)

        state["accepted_papers"] = accepted
        state["rejected_decisions"] = rejected
        state["rejection_summary"] = rejection_summary
        state["current_stage"] = "revising_complete"
        state["awaiting_human_review"] = True  # 标记需要人工审核

        self.log_decision("paper_filtering", f"Accepted: {len(accepted)}, Rejected: {len(rejected)}")

        return state

    async def _evaluate_paper(self, paper: Paper, query: str) -> Dict[str, Any]:
        """评估单篇论文"""
        system_prompt = """You are a systematic review expert following PRISMA guidelines.
        Evaluate if a paper is relevant to the research question.

        Rejection criteria:
        - No clear methodology described
        - Abstract doesn't mention experimental validation
        - Topic is tangentially related
        - Not in English

        Return JSON:
        {
            "decision": "accept" or "reject",
            "reason": "brief explanation"
        }
        """

        user_message = f"""
        Research Question: {query}

        Paper Title: {paper.title}
        Abstract: {paper.abstract[:500]}

        Should this paper be included?
        """

        response = await self._llm_call(system_prompt, user_message)

        try:
            return json.loads(response)
        except json.JSONDecodeError:
            # 降级：保守接受
            return {"decision": "accept", "reason": "Parse error - included by default"}

    def _summarize_rejections(self, rejected: List[PaperReviewDecision]) -> Dict[str, int]:
        """统计拒绝理由"""
        summary = {}
        for decision in rejected:
            reason = decision.reason
            summary[reason] = summary.get(reason, 0) + 1
        return summary
