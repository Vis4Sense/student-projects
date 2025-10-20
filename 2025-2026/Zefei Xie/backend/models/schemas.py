"""
Author: Henry X
Date: 2025/10/16 8:59
File: schemas.py
Description: [Add your description here]
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime


class KeywordModel(BaseModel):
    """searches.models.Keyword"""
    keyword: str
    importance: float = Field(default=1.0, ge=0.0, le=1.0)
    is_custom: bool = False  # 是否由用户自定义

class SearchRequest(BaseModel):
    """searches.models.SearchRequest"""
    query: str
    keywords: List[KeywordModel] = []
    max_results: int = 100

class Paper(BaseModel):
    """Paper model"""
    id: str
    title: str
    abstract: str
    authors: List[str]
    url: str
    published_date: str
    source: str = "arxiv"
    relevance_score: float = 0.0
    found_by_keywords: List[str] = []  # 记录是哪些关键词找到的

class KeywordSearchResult(BaseModel):
    """single keyword search result"""
    keyword: KeywordModel
    papers: List[Paper]
    search_timestamp: datetime = Field(default_factory=datetime.now)
    papers_count: int = 0

    def __init__(self, **data):
        super().__init__(**data)
        self.papers_count = len(self.papers)


class SearchAgentOutput(BaseModel):
    """search agent output"""
    keywords: List[KeywordModel]
    keyword_results: List[KeywordSearchResult]  # 每个关键词的独立结果
    papers: List[Paper]  # 所有论文的去重集合
    papers_by_keyword: Dict[str, List[str]]  # 关键词 -> 论文ID 的映射
    reasoning: str
    total_papers_before_dedup: int = 0  # 去重前的总数


class PaperReviewDecision(BaseModel):
    """Paper review decision"""
    paper_id: str
    decision: str  # "accept", "reject"
    reason: str
    is_overridden: bool = False
    human_note: Optional[str] = None

class RevisingAgentOutput(BaseModel):
    """Revising agent output"""
    accepted_papers: List[Paper]
    rejected_papers: List[PaperReviewDecision]
    rejection_summary: Dict[str, int]  # 拒绝理由统计

class SynthesisRequest(BaseModel):
    """Synthesis request"""
    original_question: str
    papers: List[Paper]

class Citation(BaseModel):
    """Citation"""
    paper_id: str
    paper_title: str
    excerpt: str
    confidence: float

class SynthesisAgentOutput(BaseModel):
    """Synthesis agent output"""
    answer: str
    citations: List[Citation]
    confidence_score: float
    structure: Dict[str, Any]

class PipelineState(BaseModel):
    """Pipeline state"""
    pipeline_id: str
    stage: Literal[
        "search",
        "search_complete",
        "revising",
        "revising_complete",
        "synthesis",
        "completed",
        "error"
    ]
    search_output: Optional[SearchAgentOutput] = None
    revising_output: Optional[RevisingAgentOutput] = None
    synthesis_output: Optional[SynthesisAgentOutput] = None
    human_interventions: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class KeywordInterventionDetail(BaseModel):
    """Detail of keyword intervention"""
    action: Literal["add", "remove", "edit", "adjust_importance"]
    keyword: Optional[str] = None  # 原关键词
    new_keyword: Optional[str] = None  # 新关键词（用于编辑）
    importance: Optional[float] = None  # 新重要性
    reason: Optional[str] = None  # 干预原因

class PaperInterventionDetail(BaseModel):
    """Detail of paper intervention"""
    action: Literal["accept", "reject", "restore"]
    paper_id: str
    reason: Optional[str] = None
    target_keyword: Optional[str] = None  # 如果要从特定关键词的结果中移除

class AnswerInterventionDetail(BaseModel):
    """Detail of answer intervention"""
    original_answer: str
    edited_answer: str
    changes_summary: Optional[str] = None

class HumanInterventionRequest(BaseModel):
    """Human intervention request"""
    pipeline_id: str
    stage: Literal["search", "revising", "synthesis"]
    action_type: Literal[
        "edit_keywords",
        "adjust_keyword_results",
        "override_paper",
        "edit_answer",
        "rerun_stage"
    ]
    details: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.now)
    user_note: Optional[str] = None

class InterventionRecord(BaseModel):
    """Intervention record"""
    intervention_id: str
    pipeline_id: str
    stage: str
    action_type: str
    details: Dict[str, Any]
    user_note: Optional[str]
    timestamp: datetime
    impact_summary: Optional[str] = None  # 干预的影响摘要

class VisualizationData(BaseModel):
    """Visualization data"""
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    current_stage: str
    stage_progress: Dict[str, float]
