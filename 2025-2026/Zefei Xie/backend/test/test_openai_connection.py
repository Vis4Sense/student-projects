"""
Author: Henry X
Date: 2025/10/16 10:17
File: test_openai_connection.py
Description: [Add your description here]
"""
import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_openai():
    """测试 Azure OpenAI 连接"""
    try:
        # 初始化客户端
        llm = ChatOpenAI(
            model=settings.OPENAI_MODEL,
            temperature=0.2,
            openai_api_key=settings.OPENAI_API_KEY
        )

        logger.info("✅ OpenAI client initialized successfully")
        logger.info(f"   Model: {settings.OPENAI_MODEL}")

        # 测试调用
        messages = [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content="Say 'Connection successful!' if you can read this.")
        ]

        response = await llm.ainvoke(messages)
        logger.info(f"✅ Test response: {response.content}")

        return True

    except Exception as e:
        logger.error(f"❌ OpenAI connection failed: {e}")
        return False


if __name__ == "__main__":
    success = asyncio.run(test_openai())
    if success:
        print("\n🎉 OpenAI is ready to use!")
    else:
        print("\n⚠️  Please check your configuration in .env")