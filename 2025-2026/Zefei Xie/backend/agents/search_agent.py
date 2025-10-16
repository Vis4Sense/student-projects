"""
Author: Henry X
Date: 2025/10/16 9:24
File: search_agent.py
Description: [Add your description here]
"""

from typing import Dict, Any, List
from agents.base_agent import BaseAgent
from models.schemas import KeywordModel, Paper
from services.external_api import ArxivAPI
import json
import logging

logger = logging.getLogger(__name__)


class SearchAgent(BaseAgent):
    """搜索 Agent - 负责关键词生成和论文检索"""

    def __init__(self):
        super().__init__(name="SearchAgent")
        self.arxiv_api = ArxivAPI()

    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        1. 分析用户查询
        2. 生成搜索关键词
        3. 调用学术 API 检索论文
        """
        query = state["original_query"]
        logger.info(f"SearchAgent processing query: {query}")

        # 步骤 1: 生成关键词
        keywords = await self._generate_keywords(query)

        # 步骤 2: 检索论文
        papers = await self._search_papers(keywords)

        # 步骤 3: 生成推理说明
        reasoning = await self._generate_reasoning(query, keywords, len(papers))

        # 更新状态
        state["search_keywords"] = keywords
        state["raw_papers"] = papers
        state["search_reasoning"] = reasoning
        state["current_stage"] = "search_complete"

        self.log_decision("keyword_generation", reasoning)

        return state

    async def _generate_keywords(self, query: str) -> List[KeywordModel]:
        """使用 LLM 生成搜索关键词"""
        system_prompt = """You are an expert research assistant. 
        Given a research question, generate 3-5 precise academic search keywords.
        Return ONLY a JSON array of keywords with importance scores.

        Example output:
        [
            {"keyword": "large language models", "importance": 1.0},
            {"keyword": "systematic review", "importance": 0.8}
        ]
        """

        user_message = f"Research question: {query}"

        response = await self._llm_call(system_prompt, user_message)

        try:
            keywords_data = json.loads(response)
            return [
                KeywordModel(
                    keyword=kw["keyword"],
                    importance=kw["importance"],
                    is_custom=False
                )
                for kw in keywords_data
            ]
        except json.JSONDecodeError:
            logger.error("Failed to parse keywords JSON")
            # 降级方案：简单分词
            return [KeywordModel(keyword=query, importance=1.0, is_custom=False)]

    async def _search_papers(self, keywords: List[KeywordModel]) -> List[Paper]:
        """调用 ArXiv API 检索论文"""
        all_papers = []

        for kw in keywords[:3]:  # 限制前 3 个关键词
            papers = await self.arxiv_api.search(
                query=kw.keyword,
                max_results=20
            )
            all_papers.extend(papers)

        # 去重（基于 title）
        seen_titles = set()
        unique_papers = []
        for paper in all_papers:
            if paper.title not in seen_titles:
                seen_titles.add(paper.title)
                unique_papers.append(paper)

        return unique_papers[:50]  # 限制最多 50 篇

    async def _generate_reasoning(self, query: str, keywords: List[KeywordModel], paper_count: int) -> str:
        """生成搜索推理说明"""
        kw_str = ", ".join([kw.keyword for kw in keywords])
        return f"Based on query '{query}', generated keywords: {kw_str}. Retrieved {paper_count} papers."
