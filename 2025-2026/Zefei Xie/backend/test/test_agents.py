"""
Author: Henry X
Date: 2025/10/16 10:34
File: test_agents.py
Description: [Add your description here]
"""

import asyncio
import sys
from pathlib import Path
from datetime import datetime
import json

# 添加项目根目录到 Python 路径
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# 加载环境变量
from dotenv import load_dotenv

load_dotenv(BASE_DIR / ".env", override=True)

from agents.search_agent import SearchAgent
from agents.revising_agent import RevisingAgent
from agents.synthesis_agent import SynthesisAgent
from graph.state import AgentState
from config import settings
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============================================================
# 测试辅助函数
# ============================================================

def print_section(title: str):
    """打印美化的章节标题"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70 + "\n")


def print_subsection(title: str):
    """打印子标题"""
    print(f"\n{'─' * 70}")
    print(f"  {title}")
    print(f"{'─' * 70}")


def create_initial_state(query: str) -> AgentState:
    """创建初始状态"""
    return AgentState(
        original_query=query,
        pipeline_id=f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        search_keywords=[],
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


# ============================================================
# 测试 1: Search Agent
# ============================================================

async def test_search_agent():
    """测试搜索 Agent"""
    print_section("TEST 1: Search Agent")

    try:
        # 创建 Search Agent
        search_agent = SearchAgent()
        logger.info("✅ Search Agent initialized")

        # 测试查询
        test_query = "What are the latest techniques in large language model interpretability?"
        logger.info(f"📝 Test Query: {test_query}")

        # 创建初始状态
        state = create_initial_state(test_query)

        # 执行搜索
        print("\n🔍 Running Search Agent...")
        updated_state = await search_agent.process(state)

        # 验证结果
        print_subsection("Search Results")

        keywords = updated_state.get("search_keywords", [])
        papers = updated_state.get("raw_papers", [])
        reasoning = updated_state.get("search_reasoning", "")

        print(f"✅ Keywords Generated: {len(keywords)}")
        for i, kw in enumerate(keywords[:5], 1):
            print(f"   {i}. {kw.keyword} (importance: {kw.importance})")

        print(f"\n✅ Papers Retrieved: {len(papers)}")
        for i, paper in enumerate(papers[:3], 1):
            print(f"\n   {i}. {paper.title[:80]}...")
            print(f"      Authors: {', '.join(paper.authors[:2])}")
            print(f"      URL: {paper.url}")

        print(f"\n✅ Reasoning: {reasoning[:200]}...")

        return updated_state

    except Exception as e:
        logger.error(f"❌ Search Agent test failed: {e}")
        raise


# ============================================================
# 测试 2: Revising Agent
# ============================================================

async def test_revising_agent(state: AgentState):
    """测试筛选 Agent"""
    print_section("TEST 2: Revising Agent")

    try:
        # 创建 Revising Agent
        revising_agent = RevisingAgent()
        logger.info("✅ Revising Agent initialized")

        papers_count = len(state.get("raw_papers", []))
        logger.info(f"📄 Papers to review: {papers_count}")

        # 执行筛选
        print("\n🔎 Running Revising Agent...")
        updated_state = await revising_agent.process(state)

        # 验证结果
        print_subsection("Filtering Results")

        accepted = updated_state.get("accepted_papers", [])
        rejected = updated_state.get("rejected_decisions", [])
        rejection_summary = updated_state.get("rejection_summary", {})

        print(f"✅ Accepted Papers: {len(accepted)}")
        for i, paper in enumerate(accepted[:3], 1):
            print(f"   {i}. {paper.title[:80]}...")

        print(f"\n❌ Rejected Papers: {len(rejected)}")
        for i, decision in enumerate(rejected[:3], 1):
            print(f"   {i}. Reason: {decision.reason}")

        print(f"\n📊 Rejection Summary:")
        for reason, count in rejection_summary.items():
            print(f"   - {reason}: {count} papers")

        return updated_state

    except Exception as e:
        logger.error(f"❌ Revising Agent test failed: {e}")
        raise


# ============================================================
# 测试 3: Synthesis Agent
# ============================================================

async def test_synthesis_agent(state: AgentState):
    """测试综合 Agent"""
    print_section("TEST 3: Synthesis Agent")

    try:
        # 创建 Synthesis Agent
        synthesis_agent = SynthesisAgent()
        logger.info("✅ Synthesis Agent initialized")

        papers_count = len(state.get("accepted_papers", []))
        logger.info(f"📚 Papers to synthesize: {papers_count}")

        # 执行综合
        print("\n📝 Running Synthesis Agent...")
        updated_state = await synthesis_agent.process(state)

        # 验证结果
        print_subsection("Synthesis Results")

        answer = updated_state.get("final_answer", "")
        citations = updated_state.get("citations", [])
        structure = updated_state.get("answer_structure", {})

        print(f"✅ Final Answer Generated:")
        print(f"\n{answer[:500]}...\n")

        print(f"✅ Citations: {len(citations)}")
        for i, citation in enumerate(citations[:3], 1):
            print(f"\n   [{i}] {citation.paper_title}")
            print(f"       Excerpt: {citation.excerpt[:100]}...")
            print(f"       Confidence: {citation.confidence}")

        print(f"\n✅ Answer Structure:")
        for section, content in structure.items():
            print(f"   - {section}: {len(content)} characters")

        return updated_state

    except Exception as e:
        logger.error(f"❌ Synthesis Agent test failed: {e}")
        raise


# ============================================================
# 测试 4: 完整工作流
# ============================================================

async def test_full_workflow():
    """测试完整的 Agent 工作流"""
    print_section("TEST 4: Full Agent Workflow")

    try:
        test_query = "What are effective methods for making large language models more transparent?"
        logger.info(f"🎯 Test Query: {test_query}")

        # 步骤 1: Search
        print("\n[STEP 1/3] Search Agent...")
        state = create_initial_state(test_query)
        state = await test_search_agent()

        # 步骤 2: Revising
        print("\n[STEP 2/3] Revising Agent...")
        state = await test_revising_agent(state)

        # 步骤 3: Synthesis
        print("\n[STEP 3/3] Synthesis Agent...")
        state = await test_synthesis_agent(state)

        # 保存结果
        save_test_results(state)

        print_section("✅ FULL WORKFLOW COMPLETED SUCCESSFULLY")
        return True

    except Exception as e:
        logger.error(f"❌ Full workflow test failed: {e}")
        print_section("❌ WORKFLOW FAILED")
        return False


def save_test_results(state: AgentState):
    """保存测试结果到文件"""
    output_dir = BASE_DIR / "test_results"
    output_dir.mkdir(exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = output_dir / f"agent_test_{timestamp}.json"

    # 转换为可序列化的格式
    results = {
        "pipeline_id": state.get("pipeline_id"),
        "query": state.get("original_query"),
        "search": {
            "keywords": [kw.dict() for kw in state.get("search_keywords", [])],
            "papers_count": len(state.get("raw_papers", [])),
            "reasoning": state.get("search_reasoning", "")
        },
        "revising": {
            "accepted_count": len(state.get("accepted_papers", [])),
            "rejected_count": len(state.get("rejected_decisions", [])),
            "rejection_summary": state.get("rejection_summary", {})
        },
        "synthesis": {
            "answer": state.get("final_answer", ""),
            "citations_count": len(state.get("citations", [])),
            "structure": state.get("answer_structure", {})
        }
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    logger.info(f"💾 Test results saved to: {output_file}")


# ============================================================
# 主测试入口
# ============================================================

async def main():
    """主测试函数"""
    print("\n" + "=" * 70)
    print("  🧪 Agent System Integration Test")
    print("=" * 70)
    print(f"\n⚙️  Configuration:")
    print(f"   Endpoint: {settings.AZURE_OPENAI_ENDPOINT}")
    print(f"   Deployment: {settings.AZURE_OPENAI_DEPLOYMENT}")
    print(f"   API Version: {settings.AZURE_OPENAI_API_VERSION}")
    print("=" * 70)

    # 选择测试模式
    print("\n📋 Test Menu:")
    print("   1. Test Search Agent only")
    print("   2. Test Revising Agent only (requires Search first)")
    print("   3. Test Synthesis Agent only (requires Search + Revising)")
    print("   4. Test Full Workflow (recommended)")
    print("   5. Exit")

    choice = input("\n👉 Enter your choice (1-5): ").strip()

    if choice == "1":
        await test_search_agent()
    elif choice == "2":
        state = await test_search_agent()
        await test_revising_agent(state)
    elif choice == "3":
        state = await test_search_agent()
        state = await test_revising_agent(state)
        await test_synthesis_agent(state)
    elif choice == "4":
        success = await test_full_workflow()
        return success
    elif choice == "5":
        print("\n👋 Exiting...")
        return True
    else:
        print("\n❌ Invalid choice")
        return False

    return True


if __name__ == "__main__":
    try:
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        sys.exit(1)
