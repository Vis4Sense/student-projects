"""
Author: Henry X
Date: 2025/10/16 9:24
File: search_agent.py
Description: [Add your description here]
"""

from typing import Dict, Any, List
from agents.base_agent import BaseAgent
from models.schemas import KeywordModel, Paper, KeywordSearchResult, SearchAgentOutput
from services.external_api import ArxivAPI
import json
import logging
from datetime import datetime

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
        3. 为每个关键词分别检索论文
        4. 合并并去重
        """
        query = state["original_query"]
        logger.info(f"SearchAgent processing query: {query}")

        # 步骤 1: 生成关键词
        keywords = await self._generate_keywords(query)
        logger.info(f"Generated {len(keywords)} keywords: {[kw.keyword for kw in keywords]}")

        # 步骤 2: 为每个关键词独立搜索
        keyword_results = await self._search_by_keywords(keywords)

        # 步骤 3: 合并并去重
        merged_papers, papers_by_keyword = self._merge_and_deduplicate(keyword_results)

        # 步骤 4: 生成推理说明
        reasoning = self._generate_reasoning(query, keywords, keyword_results, merged_papers)

        # 步骤 5: 创建输出对象
        search_output = SearchAgentOutput(
            keywords=keywords,
            keyword_results=keyword_results,
            papers=merged_papers,
            papers_by_keyword=papers_by_keyword,
            reasoning=reasoning,
            total_papers_before_dedup=sum(len(kr.papers) for kr in keyword_results)
        )

        # 更新状态
        state["search_keywords"] = keywords
        state["keyword_search_results"] = keyword_results  # 新增字段
        state["raw_papers"] = merged_papers
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
                    importance=kw.get("importance", 1.0),
                    is_custom=False
                )
                for kw in keywords_data
            ]
        except json.JSONDecodeError:
            logger.error("Failed to parse keywords JSON")
            return [KeywordModel(keyword=query, importance=1.0, is_custom=False)]

    async def _search_by_keywords(self, keywords: List[KeywordModel]) -> List[KeywordSearchResult]:
        """为每个关键词独立搜索并记录结果"""
        keyword_results = []

        for kw in keywords:
            logger.info(f"Searching for keyword: '{kw.keyword}'")

            # 调用 ArXiv API
            papers = await self.arxiv_api.search(
                query=kw.keyword,
                max_results=20  # 每个关键词最多 20 篇
            )

            # 为每篇论文标记是由哪个关键词找到的
            for paper in papers:
                if kw.keyword not in paper.found_by_keywords:
                    paper.found_by_keywords.append(kw.keyword)

            # 创建关键词搜索结果
            result = KeywordSearchResult(
                keyword=kw,
                papers=papers,
                search_timestamp=datetime.now()
            )

            keyword_results.append(result)
            logger.info(f"  → Found {len(papers)} papers for '{kw.keyword}'")

        return keyword_results

    def _merge_and_deduplicate(
            self,
            keyword_results: List[KeywordSearchResult]
    ) -> tuple[List[Paper], Dict[str, List[str]]]:
        """
        合并所有关键词的搜索结果并去重

        返回:
            - merged_papers: 去重后的论文列表
            - papers_by_keyword: 关键词 -> 论文ID 的映射
        """
        seen_titles = {}  # title -> Paper
        papers_by_keyword = {}  # keyword -> [paper_ids]

        for result in keyword_results:
            keyword_name = result.keyword.keyword
            papers_by_keyword[keyword_name] = []

            for paper in result.papers:
                # 使用标题作为去重依据
                title_normalized = paper.title.lower().strip()

                if title_normalized in seen_titles:
                    # 论文已存在，更新关键词列表
                    existing_paper = seen_titles[title_normalized]
                    if keyword_name not in existing_paper.found_by_keywords:
                        existing_paper.found_by_keywords.append(keyword_name)
                    papers_by_keyword[keyword_name].append(existing_paper.id)
                else:
                    # 新论文，添加到集合
                    seen_titles[title_normalized] = paper
                    papers_by_keyword[keyword_name].append(paper.id)

        merged_papers = list(seen_titles.values())

        logger.info(
            f"Merged results: {len(merged_papers)} unique papers from {sum(len(kr.papers) for kr in keyword_results)} total")

        return merged_papers, papers_by_keyword

    def _generate_reasoning(
            self,
            query: str,
            keywords: List[KeywordModel],
            keyword_results: List[KeywordSearchResult],
            merged_papers: List[Paper]
    ) -> str:
        """生成详细的搜索推理说明"""
        kw_details = []
        for result in keyword_results:
            kw_details.append(
                f"'{result.keyword.keyword}' (importance: {result.keyword.importance}) → {result.papers_count} papers"
            )

        total_before_dedup = sum(len(kr.papers) for kr in keyword_results)
        duplicates = total_before_dedup - len(merged_papers)

        reasoning = f"""Based on query '{query}', generated {len(keywords)} keywords:
{chr(10).join(f'  - {detail}' for detail in kw_details)}

Total papers retrieved: {total_before_dedup}
After deduplication: {len(merged_papers)} unique papers
Duplicates removed: {duplicates}"""

        return reasoning
