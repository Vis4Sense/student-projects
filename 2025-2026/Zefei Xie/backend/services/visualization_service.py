"""
Author: Henry X
Date: 2025/10/16 9:28
File: visualization_service.py
Description: [Add your description here]
"""

from typing import Dict, Any, List
from models.schemas import VisualizationData, PipelineState
import logging

logger = logging.getLogger(__name__)


class VisualizationService:
    """将工作流状态转换为可视化数据"""

    @staticmethod
    def generate_visualization(state: PipelineState) -> VisualizationData:
        """生成前端可视化所需的节点和边数据"""
        nodes = []
        edges = []

        # 节点 1: Search Agent
        nodes.append({
            "id": "search_agent",
            "type": "agent",
            "label": "Search Agent",
            "status": VisualizationService._get_node_status(state, "search"),
            "data": {
                "keywords": [kw.dict() for kw in state.search_output.keywords] if state.search_output else [],
                "paper_count": len(state.search_output.papers) if state.search_output else 0,
                "reasoning": state.search_output.reasoning if state.search_output else ""
            }
        })

        # 节点 2: Revising Agent
        nodes.append({
            "id": "revising_agent",
            "type": "agent",
            "label": "Revising Agent",
            "status": VisualizationService._get_node_status(state, "revising"),
            "data": {
                "accepted_count": len(state.revising_output.accepted_papers) if state.revising_output else 0,
                "rejected_count": len(state.revising_output.rejected_papers) if state.revising_output else 0,
                "rejection_reasons": state.revising_output.rejection_summary if state.revising_output else {}
            }
        })

        # 节点 3: Synthesis Agent
        nodes.append({
            "id": "synthesis_agent",
            "type": "agent",
            "label": "Synthesis Agent",
            "status": VisualizationService._get_node_status(state, "synthesis"),
            "data": {
                "answer_preview": state.synthesis_output.answer[:200] + "..." if state.synthesis_output else "",
                "citation_count": len(state.synthesis_output.citations) if state.synthesis_output else 0
            }
        })

        # 边: 连接 Agent
        edges.append({
            "id": "search_to_revising",
            "source": "search_agent",
            "target": "revising_agent",
            "label": f"{len(state.search_output.papers) if state.search_output else 0} papers",
            "animated": state.stage in ["search", "revising"]
        })

        edges.append({
            "id": "revising_to_synthesis",
            "source": "revising_agent",
            "target": "synthesis_agent",
            "label": f"{len(state.revising_output.accepted_papers) if state.revising_output else 0} accepted",
            "animated": state.stage == "synthesis"
        })

        # 添加人工干预标记
        for intervention in state.human_interventions:
            nodes.append({
                "id": f"human_intervention_{intervention['timestamp']}",
                "type": "intervention",
                "label": f"Human: {intervention['action_type']}",
                "data": intervention
            })

        # 计算进度
        stage_progress = {
            "search": 1.0 if state.search_output else 0.0,
            "revising": 1.0 if state.revising_output else 0.0,
            "synthesis": 1.0 if state.synthesis_output else 0.0
        }

        return VisualizationData(
            nodes=nodes,
            edges=edges,
            current_stage=state.stage,
            stage_progress=stage_progress
        )

    @staticmethod
    def _get_node_status(state: PipelineState, stage: str) -> str:
        """获取节点状态"""
        stage_map = {
            "search": state.search_output is not None,
            "revising": state.revising_output is not None,
            "synthesis": state.synthesis_output is not None
        }

        if stage_map.get(stage, False):
            return "completed"
        elif state.stage == stage:
            return "running"
        else:
            return "pending"
