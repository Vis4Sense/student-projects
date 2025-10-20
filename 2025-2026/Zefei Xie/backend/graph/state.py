"""
Author: Henry X
Date: 2025/10/16 8:58
File: state.py.py
Description: [Add your description here]
"""

from typing import TypedDict, List, Optional, Dict, Any
from models.schemas import Paper, KeywordModel, PaperReviewDecision, Citation, KeywordSearchResult


class AgentState(TypedDict):
    """LangGraph"""
    # Input
    original_query: str
    pipeline_id: str

    # Search Agent
    search_keywords: List[KeywordModel]
    keyword_search_results: List[KeywordSearchResult]
    raw_papers: List[Paper]
    search_reasoning: str

    # Revising Agent
    accepted_papers: List[Paper]
    rejected_decisions: List[PaperReviewDecision]
    rejection_summary: Dict[str, int]

    # Synthesis Agent
    final_answer: str
    citations: List[Citation]
    answer_structure: Dict[str, Any]

    # Management Agent
    current_stage: str
    human_interventions: List[Dict[str, Any]]
    errors: List[str]

    # Internal State
    awaiting_human_review: bool
    human_feedback: Optional[Dict[str, Any]]

