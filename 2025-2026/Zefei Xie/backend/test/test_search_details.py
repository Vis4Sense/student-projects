"""
Author: Henry X
Date: 2025/10/19 13:48
File: test_search_details.py
Description: [Add your description here]
"""

"""
测试 Search Agent 的详细关键词追踪功能
运行: python test/test_search_detail.py
"""

import asyncio
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from dotenv import load_dotenv

load_dotenv(BASE_DIR / ".env", override=True)

from agents.search_agent import SearchAgent
from graph.state import AgentState
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def print_section(title: str):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70 + "\n")


async def test_keyword_tracking():
    """测试关键词追踪功能"""
    print_section("Testing Keyword-Level Search Tracking")

    # 创建 Search Agent
    agent = SearchAgent()

    # 创建测试状态
    state = AgentState(
        original_query="What are effective methods for interpreting large language models?",
        pipeline_id="test_keyword_tracking",
        search_keywords=[],
        keyword_search_results=[],
        raw_papers=[],
        search_reasoning="",
        accepted_papers=[],
        rejected_decisions=[],
        rejection_summary={},
        final_answer="",
        citations=[],
        answer_structure={},
        current_stage="initialized",
        human_interventions=[],
        errors=[],
        awaiting_human_review=False,
        human_feedback=None
    )

    # 运行搜索
    logger.info("🔍 Starting search...")
    updated_state = await agent.process(state)

    # 打印详细结果
    print_section("Keyword-Level Results")

    keyword_results = updated_state["keyword_search_results"]

    for i, result in enumerate(keyword_results, 1):
        print(f"\n📌 Keyword {i}: '{result.keyword.keyword}'")
        print(f"   Importance: {result.keyword.importance}")
        print(f"   Papers found: {result.papers_count}")
        print(f"   Search time: {result.search_timestamp}")

        print(f"\n   Top 3 papers:")
        for j, paper in enumerate(result.papers[:3], 1):
            print(f"      {j}. {paper.title[:60]}...")
            print(f"         Found by keywords: {', '.join(paper.found_by_keywords)}")

    print_section("Merged Results")

    merged_papers = updated_state["raw_papers"]
    print(f"✅ Total unique papers: {len(merged_papers)}")
    print(f"📊 Total papers before dedup: {sum(kr.papers_count for kr in keyword_results)}")
    print(f"🗑️  Duplicates removed: {sum(kr.papers_count for kr in keyword_results) - len(merged_papers)}")

    print("\n📄 Papers found by multiple keywords:")
    for paper in merged_papers:
        if len(paper.found_by_keywords) > 1:
            print(f"   - {paper.title[:60]}...")
            print(f"     Keywords: {', '.join(paper.found_by_keywords)}")

    print_section("Search Reasoning")
    print(updated_state["search_reasoning"])


if __name__ == "__main__":
    asyncio.run(test_keyword_tracking())
