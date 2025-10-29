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
    """SearchAgent """

    def __init__(self):
        super().__init__(name="SearchAgent")
        self.arxiv_api = ArxivAPI()

    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state["original_query"]
        logger.info(f"SearchAgent processing query: {query}")

        # Get keywords from LLM
        keywords = await self._generate_keywords(query)
        logger.info(f"Generated {len(keywords)} keywords: {[kw.keyword for kw in keywords]}")

        # Searches papers for each keyword
        keyword_results = await self._search_by_keywords(keywords)

        # Get merged and deduplicated papers
        merged_papers, papers_by_keyword = self._merge_and_deduplicate(keyword_results)

        # Generate reasoning
        reasoning = self._generate_reasoning(query, keywords, keyword_results, merged_papers)

        # Create search output
        search_output = SearchAgentOutput(
            keywords=keywords,
            keyword_results=keyword_results,
            papers=merged_papers,
            papers_by_keyword=papers_by_keyword,
            reasoning=reasoning,
            total_papers_before_dedup=sum(len(kr.papers) for kr in keyword_results)
        )

        # Update state
        state["search_keywords"] = keywords
        state["keyword_search_results"] = keyword_results  # 新增字段
        state["raw_papers"] = merged_papers
        state["search_reasoning"] = reasoning
        state["current_stage"] = "search_complete"

        self.log_decision("keyword_generation", reasoning)

        return state

    async def _generate_keywords(self, query: str) -> List[KeywordModel]:
        """Use LLM to generate keywords for the given query"""
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
        """Search papers for each keyword using ArXiv API"""
        keyword_results = []

        for kw in keywords:
            logger.info(f"Searching for keyword: '{kw.keyword}'")

            # Use ArXiv API to search for papers
            papers = await self.arxiv_api.search(
                query=kw.keyword,
                max_results=2  # Number of papers to retrieve
            )

            # Tag papers with keyword
            for paper in papers:
                paper.human_tag = "neutral"
                if kw.keyword not in paper.found_by_keywords:
                    paper.found_by_keywords.append(kw.keyword)

            # Create search result object
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
        Gather and merge papers from each keyword search result,
        """
        seen_titles = {}  # title -> Paper
        papers_by_keyword = {}  # keyword -> [paper_ids]

        for result in keyword_results:
            keyword_name = result.keyword.keyword
            papers_by_keyword[keyword_name] = []

            for paper in result.papers:
                # Use normalized title to deduplicate
                title_normalized = paper.title.lower().strip()

                if title_normalized in seen_titles:
                    existing_paper = seen_titles[title_normalized]
                    if keyword_name not in existing_paper.found_by_keywords:
                        existing_paper.found_by_keywords.append(keyword_name)
                    papers_by_keyword[keyword_name].append(existing_paper.id)
                else:
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
        """Generate reasoning for the search results"""
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
