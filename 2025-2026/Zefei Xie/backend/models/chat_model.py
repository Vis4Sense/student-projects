"""
Author: Henry X
Date: 2025/10/29 18:13
File: chat_model.py
Description: [Add your description here]
"""
from typing import List

from pydantic import BaseModel


class ChatMessage(BaseModel):
    """Chat message model"""
    role: str  # "system", "user", "assistant"
    content: str

    class Config:
        json_schema_extra = {
            "example": {
                "role": "user",
                "content": "Hello!"
            }
        }


class ChatRequest(BaseModel):
    """Chat request model"""
    messages: List[ChatMessage]

    class Config:
        json_schema_extra = {
            "example": {
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "Hello!"}
                ]
            }
        }


class ChatResponse(BaseModel):
    """Chat response model"""
    message: str

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Hello! How can I help you today?"
            }
        }