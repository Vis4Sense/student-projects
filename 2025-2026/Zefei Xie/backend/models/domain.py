"""
Author: Henry X
Date: 2025/10/16 9:05
File: domain.py
Description: [Add your description here]
"""

from typing import List, Optional
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class AgentDecision:
    """Agent decision"""
    agent_name: str
    decision_type: str
    input_data: dict
    output_data: dict
    reasoning: str
    confidence: float
    timestamp: datetime = field(default_factory=datetime.now)

@dataclass
class WorkflowExecution:
    """workflow execution"""
    execution_id: str
    user_query: str
    stages_completed: List[str] = field(default_factory=list)
    decisions: List[AgentDecision] = field(default_factory=list)
    human_interventions: List[dict] = field(default_factory=list)
    status: str = "running"
    start_time: datetime = field(default_factory=datetime.now)
    end_time: Optional[datetime] = None
