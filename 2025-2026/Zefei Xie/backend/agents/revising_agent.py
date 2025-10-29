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
    """Revising agent that evaluates papers based on PRISMA guidelines and records rejection reasons."""

    def __init__(self):
        super().__init__(name="RevisingAgent")

    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Process the state and return the next state"""
        papers = state["raw_papers"]
        query = state["original_query"]

        logger.info(f"RevisingAgent reviewing {len(papers)} papers")

        accepted = []
        rejected = []

        for paper in papers:
            if paper.human_tag == "accepted":
                accepted.append(paper)
            elif paper.human_tag == "rejected":
                rejected.append(PaperReviewDecision(
                    paper_id=paper.id,
                    paper=paper,
                    decision="reject",
                    reason="Manually rejected by user",
                    is_overridden=False
                ))
            else:
                decision = await self._evaluate_paper(paper, query)

                if decision["decision"] == "accept":
                    accepted.append(paper)
                else:
                    rejected.append(PaperReviewDecision(
                        paper_id=paper.id,
                        paper=paper,
                        decision="reject",
                        reason=decision["reason"],
                        is_overridden=False
                    ))

        # Rejection summary
        rejection_summary = self._summarize_rejections(rejected)

        state["accepted_papers"] = accepted
        state["rejected_decisions"] = rejected
        state["rejection_summary"] = rejection_summary
        state["current_stage"] = "revising_complete"
        state["awaiting_human_review"] = True

        self.log_decision("paper_filtering", f"Accepted: {len(accepted)}, Rejected: {len(rejected)}")

        return state

    async def _evaluate_paper(self, paper: Paper, query: str) -> Dict[str, Any]:
        """Review a paper based on PRISMA guidelines"""
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
            # Decoding error - included by default
            return {"decision": "accept", "reason": "Parse error - included by default"}

    def _summarize_rejections(self, rejected: List[PaperReviewDecision]) -> Dict[str, int]:
        """Summarize the rejection reasons"""
        summary = {}
        for decision in rejected:
            reason = decision.reason
            summary[reason] = summary.get(reason, 0) + 1
        return summary
