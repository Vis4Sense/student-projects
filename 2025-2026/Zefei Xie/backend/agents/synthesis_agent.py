"""
Author: Henry X
Date: 2025/10/16 9:26
File: synthesis_agent.py
Description: [Add your description here]
"""

from typing import Dict, Any, List
from agents.base_agent import BaseAgent
from models.schemas import Paper, Citation
import json
import logging

logger = logging.getLogger(__name__)


class SynthesisAgent(BaseAgent):
    """Synthesis agent"""

    def __init__(self):
        super().__init__(name="SynthesisAgent")

    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Process the state and generate an answer"""
        papers = state["accepted_papers"]
        query = state["original_query"]

        logger.info(f"SynthesisAgent synthesizing from {len(papers)} papers")

        # Generate answer and citations
        answer_data = await self._synthesize_answer(query, papers)

        state["final_answer"] = answer_data["answer"]
        state["citations"] = answer_data["citations"]
        state["answer_structure"] = answer_data["structure"]
        state["current_stage"] = "synthesis_complete"

        self.log_decision("answer_generation", f"Generated answer with {len(answer_data['citations'])} citations")

        return state

    async def _synthesize_answer(self, query: str, papers: List[Paper]) -> Dict[str, Any]:
        """Synthesize an answer from the given papers and query"""
        system_prompt = """You are a research synthesis expert.
        Given a question and relevant papers, write a comprehensive answer.

        Requirements:
        1. Cite specific papers for each claim
        2. Structure answer with clear sections
        3. Be objective and evidence-based

        Return JSON:
        {
            "answer": "full text with [1], [2] citation markers",
            "citations": [
                {
                    "paper_id": "paper1",
                    "paper_title": "Title",
                    "excerpt": "relevant quote",
                    "confidence": 0.9
                }
            ],
            "structure": {
                "introduction": "...",
                "main_findings": "...",
                "conclusion": "..."
            }
        }
        """

        papers_text = "\n\n".join([
            f"[{i + 1}] {p.title}\nAbstract: {p.abstract[:300]}"
            for i, p in enumerate(papers[:10])  # Limit to 10 papers for demo purposes
        ])

        user_message = f"""
        Question: {query}

        Available Papers:
        {papers_text}

        Synthesize a comprehensive answer.
        """

        response = await self._llm_call(system_prompt, user_message)

        try:
            data = json.loads(response)
            # Convert citation data to Citation objects
            data["citations"] = [
                Citation(**c) for c in data.get("citations", [])
            ]
            return data
        except json.JSONDecodeError:
            return {
                "answer": "Error generating answer",
                "citations": [],
                "structure": {}
            }
