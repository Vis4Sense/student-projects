"""
Author: Henry X
Date: 2025/10/16 10:00
File: test_azure_connection.py
Description: [Add your description here]
"""

"""
测试 Azure OpenAI 连接
运行: python test_azure_connection.py
"""

import asyncio
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from config import settings
import logging
import sys

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_azure_openai():
    """测试 Azure OpenAI 连接"""
    try:
        # 初始化客户端
        llm = AzureChatOpenAI(
            azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
            api_key=settings.AZURE_OPENAI_API_KEY,
            azure_deployment=settings.AZURE_OPENAI_DEPLOYMENT,
            api_version=settings.AZURE_OPENAI_API_VERSION,
            temperature=0.2
        )

        logger.info("✅ Azure OpenAI client initialized successfully")
        logger.info(f"   Endpoint: {settings.AZURE_OPENAI_ENDPOINT}")
        logger.info(f"   Deployment: {settings.AZURE_OPENAI_DEPLOYMENT}")

        # 测试调用
        messages = [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content="Say 'Connection successful!' if you can read this.")
        ]

        response = await llm.ainvoke(messages)
        logger.info(f"✅ Test response: {response.content}")

        return True

    except Exception as e:
        logger.error(f"❌ Azure OpenAI connection failed: {e}")
        return False


if __name__ == "__main__":
    success = asyncio.run(test_azure_openai())
    if success:
        print("\n🎉 Azure OpenAI is ready to use!")
    else:
        print("\n⚠️  Please check your configuration in .env")
