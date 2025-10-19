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
    """搜索关键词模型"""
    keyword: str
    importance: float = Field(default=1.0, ge=0.0, le=1.0)
    is_custom: bool = False  # 是否由用户自定义

class SearchRequest(BaseModel):
    """搜索请求"""
    query: str
    keywords: List[KeywordModel] = []
    max_results: int = 100

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
    found_by_keywords: List[str] = []  # 记录是哪些关键词找到的

class KeywordSearchResult(BaseModel):
    """单个关键词的搜索结果"""
    keyword: KeywordModel
    papers: List[Paper]
    search_timestamp: datetime = Field(default_factory=datetime.now)
    papers_count: int = 0

    def __init__(self, **data):
        super().__init__(**data)
        self.papers_count = len(self.papers)


class SearchAgentOutput(BaseModel):
    """搜索 Agent 输出"""
    keywords: List[KeywordModel]
    keyword_results: List[KeywordSearchResult]  # 每个关键词的独立结果
    papers: List[Paper]  # 所有论文的去重集合
    papers_by_keyword: Dict[str, List[str]]  # 关键词 -> 论文ID 的映射
    reasoning: str
    total_papers_before_dedup: int = 0  # 去重前的总数


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

class KeywordInterventionDetail(BaseModel):
    """关键词级别的干预细节"""
    action: Literal["add", "remove", "edit", "adjust_importance"]
    keyword: Optional[str] = None  # 原关键词
    new_keyword: Optional[str] = None  # 新关键词（用于编辑）
    importance: Optional[float] = None  # 新重要性
    reason: Optional[str] = None  # 干预原因

class PaperInterventionDetail(BaseModel):
    """论文级别的干预细节"""
    action: Literal["accept", "reject", "restore"]
    paper_id: str
    reason: Optional[str] = None
    target_keyword: Optional[str] = None  # 如果要从特定关键词的结果中移除

class AnswerInterventionDetail(BaseModel):
    """答案编辑干预细节"""
    original_answer: str
    edited_answer: str
    changes_summary: Optional[str] = None

class HumanInterventionRequest(BaseModel):
    """人工干预请求（增强版）"""
    pipeline_id: str
    stage: Literal["search", "revising", "synthesis"]
    action_type: Literal[
        "edit_keywords",        # 修改关键词（可能触发重新搜索）
        "adjust_keyword_results",  # 调整单个关键词的结果
        "override_paper",       # 推翻论文筛选决策
        "edit_answer",          # 编辑最终答案
        "rerun_stage"          # 重新运行某个阶段
    ]
    details: Dict[str, Any]  # 根据 action_type 包含不同的数据
    timestamp: datetime = Field(default_factory=datetime.now)
    user_note: Optional[str] = None  # 用户备注

class InterventionRecord(BaseModel):
    """干预记录（用于审计）"""
    intervention_id: str
    pipeline_id: str
    stage: str
    action_type: str
    details: Dict[str, Any]
    user_note: Optional[str]
    timestamp: datetime
    impact_summary: Optional[str] = None  # 干预的影响摘要

class VisualizationData(BaseModel):
    """可视化数据"""
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    current_stage: str
    stage_progress: Dict[str, float]
