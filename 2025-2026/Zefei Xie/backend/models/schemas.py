"""
Author: Henry X
Date: 2025/10/16 8:59
File: schemas.py
Description: [Add your description here]
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class KeywordModel(BaseModel):
    """搜索关键词模型"""
    keyword: str
    importance: float = Field(default=1.0, ge=0.0, le=1.0)
    is_custom: bool = False  # 是否由用户自定义

class SearchRequest(BaseModel):
    """搜索请求"""
    query: str
    keywords: List[KeywordModel] = []
    max_results: int = 100

class SearchAgentOutput(BaseModel):
    """搜索 Agent 输出"""
    keywords: List[KeywordModel]
    papers: List[Dict[str, Any]]
    reasoning: str

class Paper(BaseModel):
    """论文模型"""
    id: str
    title: str
    abstract: str
    authors: List[str]
    url: str
    published_date: str
    source: str = "arxiv"
    relevance_score: float = 0.0

class PaperReviewDecision(BaseModel):
    """论文审核决策"""
    paper_id: str
    decision: str  # "accept", "reject"
    reason: str
    is_overridden: bool = False
    human_note: Optional[str] = None

class RevisingAgentOutput(BaseModel):
    """筛选 Agent 输出"""
    accepted_papers: List[Paper]
    rejected_papers: List[PaperReviewDecision]
    rejection_summary: Dict[str, int]  # 拒绝理由统计

class SynthesisRequest(BaseModel):
    """综合请求"""
    original_question: str
    papers: List[Paper]

class Citation(BaseModel):
    """引用模型"""
    paper_id: str
    paper_title: str
    excerpt: str
    confidence: float

class SynthesisAgentOutput(BaseModel):
    """综合 Agent 输出"""
    answer: str
    citations: List[Citation]
    confidence_score: float
    structure: Dict[str, Any]

class PipelineState(BaseModel):
    """管道整体状态"""
    pipeline_id: str
    stage: str  # "search", "revising", "synthesis", "completed"
    search_output: Optional[SearchAgentOutput] = None
    revising_output: Optional[RevisingAgentOutput] = None
    synthesis_output: Optional[SynthesisAgentOutput] = None
    human_interventions: List[Dict[str, Any]] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class HumanInterventionRequest(BaseModel):
    """人工干预请求"""
    pipeline_id: str
    stage: str  # "search", "revising", "synthesis"
    action_type: str  # "edit_keyword", "override_paper", "edit_answer"
    details: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.now)

class VisualizationData(BaseModel):
    """可视化数据"""
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    current_stage: str
    stage_progress: Dict[str, float]
