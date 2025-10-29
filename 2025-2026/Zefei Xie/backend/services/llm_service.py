"""
Author: Henry X
Date: 2025/10/30
File: llm_service.py
Description: LLM service for chat functionality
"""

import logging
from typing import AsyncGenerator, List, Dict
from langchain_openai import ChatOpenAI, AzureChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from config import settings

logger = logging.getLogger(__name__)


class LLMService:
    """LLM service for handling chat requests"""

    def __init__(self, name: str = "default"):
        self.name = name
        self.llm = self._initialize_llm()

    def _initialize_llm(self):
        """Initialize LLM client"""
        if settings.PROVIDER == "openai":
            llm = ChatOpenAI(
                model=settings.OPENAI_MODEL,
                openai_api_key=settings.OPENAI_API_KEY,
                streaming=True,
            )
            logger.info(f"Initialized {self.name} with OpenAI model: {settings.OPENAI_MODEL}")

        elif settings.PROVIDER == "azure":
            llm = AzureChatOpenAI(
                azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
                api_key=settings.AZURE_OPENAI_API_KEY,
                azure_deployment=settings.AZURE_OPENAI_DEPLOYMENT,
                api_version=settings.AZURE_OPENAI_API_VERSION,
                streaming=True,
            )
            logger.info(f"Initialized {self.name} with Azure OpenAI deployment: {settings.AZURE_OPENAI_DEPLOYMENT}")
        else:
            raise ValueError(f"Unsupported provider: {settings.PROVIDER}")

        return llm

    def _convert_messages(self, messages: List[Dict[str, str]]):
        """Convert message format"""
        converted = []
        for msg in messages:
            role = msg.get("role")
            content = msg.get("content")

            if role == "system":
                converted.append(SystemMessage(content=content))
            elif role == "user":
                converted.append(HumanMessage(content=content))
            elif role == "assistant":
                converted.append(AIMessage(content=content))

        return converted

    async def chat_stream(
            self,
            messages: List[Dict[str, str]]
    ) -> AsyncGenerator[str, None]:
        """Streaming chat"""
        try:
            langchain_messages = self._convert_messages(messages)

            async for chunk in self.llm.astream(langchain_messages):
                if chunk.content:
                    yield chunk.content

        except Exception as e:
            logger.error(f"Stream error: {str(e)}")
            raise

    async def chat(self, messages: List[Dict[str, str]]) -> str:
        """Non-streaming chat"""
        try:
            langchain_messages = self._convert_messages(messages)
            response = await self.llm.ainvoke(langchain_messages)
            return response.content

        except Exception as e:
            logger.error(f"Chat error: {str(e)}")
            raise


# Global instance
llm_service = LLMService()
