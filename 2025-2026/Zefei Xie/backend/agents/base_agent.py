"""
Author: Henry X
Date: 2025/10/16 9:17
File: base_agent.py
Description: [Add your description here]
"""

from abc import ABC, abstractmethod
from typing import Any, Dict
from langchain_openai import AzureChatOpenAI, ChatOpenAI  # 改为 Azure 版本
from langchain_core.messages import HumanMessage, SystemMessage
from config import settings
import logging

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """All agents should inherit from this class."""

    def __init__(self, name: str):
        self.name = name

        # llm
        if settings.PROVIDER == "openai":
            self.llm = ChatOpenAI(
                model=settings.OPENAI_MODEL,
                temperature=0.2,
                openai_api_key=settings.OPENAI_API_KEY
            )
        elif settings.PROVIDER == "azure":
            self.llm = AzureChatOpenAI(
                azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
                api_key=settings.AZURE_OPENAI_API_KEY,
                azure_deployment=settings.AZURE_OPENAI_DEPLOYMENT,
                api_version=settings.AZURE_OPENAI_API_VERSION,
            )
            logger.info(f"Initialized {name} with Azure OpenAI deployment: {settings.AZURE_OPENAI_DEPLOYMENT}")

    @abstractmethod
    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a response based on the current state.
        """
        pass

    async def _llm_call(self, system_prompt: str, user_message: str) -> str:
        """llm调用"""
        try:
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_message)
            ]
            response = await self.llm.ainvoke(messages)
            return response.content
        except Exception as e:
            logger.error(f"{self.name} LLM call failed: {e}")
            raise

    def log_decision(self, decision_type: str, reasoning: str):
        """reasoning"""
        logger.info(f"[{self.name}] Decision: {decision_type} | Reasoning: {reasoning}")

