"""
Author: Henry X
Date: 2025/10/16 9:28
File: decision_history.py
Description: [Add your description here]
"""

from typing import List, Dict, Any
from datetime import datetime
from models.domain import AgentDecision, WorkflowExecution
import json
import logging

logger = logging.getLogger(__name__)


class DecisionHistoryService:
    """记录和查询 Agent 决策历史"""

    def __init__(self):
        self.executions: Dict[str, WorkflowExecution] = {}

    def create_execution(self, execution_id: str, user_query: str) -> WorkflowExecution:
        """创建新的工作流执行"""
        execution = WorkflowExecution(
            execution_id=execution_id,
            user_query=user_query
        )
        self.executions[execution_id] = execution
        logger.info(f"Created execution: {execution_id}")
        return execution

    def add_decision(self, execution_id: str, decision: AgentDecision):
        """添加 Agent 决策记录"""
        if execution_id in self.executions:
            self.executions[execution_id].decisions.append(decision)
            logger.info(f"Added decision to {execution_id}: {decision.agent_name} - {decision.decision_type}")

    def add_human_intervention(self, execution_id: str, intervention: Dict[str, Any]):
        """记录人工干预"""
        if execution_id in self.executions:
            self.executions[execution_id].human_interventions.append(intervention)
            logger.info(f"Human intervention in {execution_id}: {intervention['action_type']}")

    def complete_execution(self, execution_id: str):
        """标记工作流完成"""
        if execution_id in self.executions:
            self.executions[execution_id].status = "completed"
            self.executions[execution_id].end_time = datetime.now()

    def get_execution(self, execution_id: str) -> WorkflowExecution:
        """获取执行记录"""
        return self.executions.get(execution_id)

    def get_decision_chain(self, execution_id: str) -> List[AgentDecision]:
        """获取完整决策链"""
        execution = self.executions.get(execution_id)
        return execution.decisions if execution else []

    def export_execution_report(self, execution_id: str) -> Dict[str, Any]:
        """导出执行报告（用于审计）"""
        execution = self.executions.get(execution_id)
        if not execution:
            return {}

        return {
            "execution_id": execution.execution_id,
            "user_query": execution.user_query,
            "status": execution.status,
            "start_time": execution.start_time.isoformat(),
            "end_time": execution.end_time.isoformat() if execution.end_time else None,
            "stages_completed": execution.stages_completed,
            "decisions": [
                {
                    "agent": d.agent_name,
                    "type": d.decision_type,
                    "reasoning": d.reasoning,
                    "confidence": d.confidence,
                    "timestamp": d.timestamp.isoformat()
                }
                for d in execution.decisions
            ],
            "human_interventions": execution.human_interventions
        }
