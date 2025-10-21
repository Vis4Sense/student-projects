"""
Author: Henry X
Date: 2025/10/16 9:29
File: workflow.py
Description: [Add your description here]
"""

from langgraph.graph import StateGraph, END
from graph.state import AgentState
from agents.search_agent import SearchAgent
from agents.revising_agent import RevisingAgent
from agents.synthesis_agent import SynthesisAgent
import logging

logger = logging.getLogger(__name__)


class ResearchWorkflow:
    """LangGraph workflow for research paper"""

    def __init__(self):
        self.search_agent = SearchAgent()
        self.revising_agent = RevisingAgent()
        self.synthesis_agent = SynthesisAgent()

        self.graph = self._build_graph()

    def _build_graph(self) -> StateGraph:
        """Build LangGraph workflow graph"""
        workflow = StateGraph(AgentState)

        # Add nodes
        workflow.add_node("search", self._search_node)
        workflow.add_node("revising", self._revising_node)
        workflow.add_node("synthesis", self._synthesis_node)
        workflow.add_node("human_review", self._human_review_node)

        # Define edges and conditional edges
        workflow.set_entry_point("search")
        workflow.add_edge("search", "revising")
        workflow.add_conditional_edges(
            "revising",
            self._should_wait_for_human,
            {
                "human_review": "human_review",
                "synthesis": "synthesis"
            }
        )
        workflow.add_edge("human_review", "synthesis")
        workflow.add_edge("synthesis", END)

        return workflow.compile()

    async def _search_node(self, state: AgentState) -> AgentState:
        """Search node"""
        return await self.search_agent.process(state)

    async def _revising_node(self, state: AgentState) -> AgentState:
        """Final revision node"""
        return await self.revising_agent.process(state)

    async def _synthesis_node(self, state: AgentState) -> AgentState:
        """Synthesis node"""
        return await self.synthesis_agent.process(state)

    async def _human_review_node(self, state: AgentState) -> AgentState:
        """Human review node"""
        logger.info("Workflow paused for human review")
        state["current_stage"] = "awaiting_human_review"
        # Here will be the code for human review process
        return state

    def _should_wait_for_human(self, state: AgentState) -> str:
        """Judge whether to wait for human review"""
        if state.get("awaiting_human_review", False):
            return "human_review"
        return "synthesis"

    async def run(self, initial_state: AgentState) -> AgentState:
        """Run the workflow"""
        return await self.graph.ainvoke(initial_state)
