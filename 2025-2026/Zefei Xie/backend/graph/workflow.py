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
    """研究工作流 - LangGraph 实现"""

    def __init__(self):
        self.search_agent = SearchAgent()
        self.revising_agent = RevisingAgent()
        self.synthesis_agent = SynthesisAgent()

        self.graph = self._build_graph()

    def _build_graph(self) -> StateGraph:
        """构建 LangGraph 工作流"""
        workflow = StateGraph(AgentState)

        # 添加节点
        workflow.add_node("search", self._search_node)
        workflow.add_node("revising", self._revising_node)
        workflow.add_node("synthesis", self._synthesis_node)
        workflow.add_node("human_review", self._human_review_node)

        # 定义边
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
        """搜索节点"""
        return await self.search_agent.process(state)

    async def _revising_node(self, state: AgentState) -> AgentState:
        """筛选节点"""
        return await self.revising_agent.process(state)

    async def _synthesis_node(self, state: AgentState) -> AgentState:
        """综合节点"""
        return await self.synthesis_agent.process(state)

    async def _human_review_node(self, state: AgentState) -> AgentState:
        """人工审核节点 - 暂停等待人工干预"""
        logger.info("Workflow paused for human review")
        state["current_stage"] = "awaiting_human_review"
        # 这里实际上会被外部的 FastAPI 路由中断
        return state

    def _should_wait_for_human(self, state: AgentState) -> str:
        """判断是否需要人工审核"""
        if state.get("awaiting_human_review", False):
            return "human_review"
        return "synthesis"

    async def run(self, initial_state: AgentState) -> AgentState:
        """运行完整工作流"""
        return await self.graph.ainvoke(initial_state)
