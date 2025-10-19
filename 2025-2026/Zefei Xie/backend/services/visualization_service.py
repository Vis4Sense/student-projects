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

        # ============ 1. Query 节点 ============
        nodes.append({
            "id": "query",
            "type": "query",
            "label": "User Query",
            "position": {"x": 400, "y": 50},  # 👈 确保有 position
            "data": {
                "query": state.search_output.reasoning.split("'")[1] if state.search_output else "",
                "timestamp": state.created_at.isoformat() if hasattr(state.created_at, 'isoformat') else str(
                    state.created_at)
            }
        })

        # ============ 2. Keyword Generation 节点 ============
        nodes.append({
            "id": "keyword_gen",
            "type": "keyword_gen",
            "label": "Generate Keywords",
            "position": {"x": 400, "y": 150},  # 👈 确保有 position
            "data": {
                "keywords_count": len(state.search_output.keywords) if state.search_output else 0,
                "reasoning": state.search_output.reasoning if state.search_output else "",
                "status": "completed" if state.search_output else "running"
            }
        })

        edges.append({
            "id": "query_to_keygen",
            "source": "query",
            "target": "keyword_gen",
            "animated": not state.search_output
        })

        # ============ 3. 每个 Keyword 节点 ============
        if state.search_output and state.search_output.keyword_results:
            keyword_count = len(state.search_output.keyword_results)
            spacing = 200
            start_x = 400 - (keyword_count - 1) * spacing / 2

            for i, result in enumerate(state.search_output.keyword_results):
                keyword_id = f"keyword_{i}"

                nodes.append({
                    "id": keyword_id,
                    "type": "keyword",
                    "label": result.keyword.keyword,
                    "position": {"x": start_x + i * spacing, "y": 300},  # 👈 确保有 position
                    "data": {
                        "keyword": result.keyword.keyword,
                        "importance": result.keyword.importance,
                        "is_custom": result.keyword.is_custom,
                        "papers": [p.dict() for p in result.papers[:5]],  # 只传前5篇避免数据过大
                        "papers_count": result.papers_count,
                        "selected_papers": [],
                        "status": "completed"
                    }
                })

                # 连接 Keyword Gen → Keyword
                edges.append({
                    "id": f"keygen_to_{keyword_id}",
                    "source": "keyword_gen",
                    "target": keyword_id,
                    "label": f"{result.papers_count} papers",
                    "animated": False
                })

        # ============ 4. Paper Pool 节点 ============
        nodes.append({
            "id": "paper_pool",
            "type": "paper_pool",
            "label": "Paper Pool",
            "position": {"x": 400, "y": 500},  # 👈 确保有 position
            "data": {
                "total_papers": len(state.search_output.papers) if state.search_output else 0,
                "papers_by_keyword": state.search_output.papers_by_keyword if state.search_output else {},
                "duplicates_removed": (
                    state.search_output.total_papers_before_dedup - len(state.search_output.papers)
                    if state.search_output else 0
                ),
                "status": "completed" if state.search_output else "pending"
            }
        })

        # 连接所有 Keyword → Paper Pool
        if state.search_output and state.search_output.keyword_results:
            for i in range(len(state.search_output.keyword_results)):
                edges.append({
                    "id": f"keyword_{i}_to_pool",
                    "source": f"keyword_{i}",
                    "target": "paper_pool",
                    "animated": False
                })

        # ============ 5. Revising Agent 节点 ============
        nodes.append({
            "id": "revising_agent",
            "type": "agent",
            "label": "Revising Agent",
            "position": {"x": 400, "y": 650},  # 👈 确保有 position
            "data": {
                "agent_type": "revising",
                "status": VisualizationService._get_node_status(state, "revising"),
                "output": {
                    "accepted_count": len(state.revising_output.accepted_papers) if state.revising_output else 0,
                    "rejected_count": len(state.revising_output.rejected_papers) if state.revising_output else 0
                } if state.revising_output else None
            }
        })

        edges.append({
            "id": "pool_to_revising",
            "source": "paper_pool",
            "target": "revising_agent",
            "label": f"{len(state.search_output.papers) if state.search_output else 0} papers",
            "animated": state.stage == "revising"
        })

        # ============ 6. Synthesis Agent 节点 ============
        nodes.append({
            "id": "synthesis_agent",
            "type": "agent",
            "label": "Synthesis Agent",
            "position": {"x": 400, "y": 800},  # 👈 确保有 position
            "data": {
                "agent_type": "synthesis",
                "status": VisualizationService._get_node_status(state, "synthesis"),
                "output": {
                    "citation_count": len(state.synthesis_output.citations) if state.synthesis_output else 0
                } if state.synthesis_output else None
            }
        })

        edges.append({
            "id": "revising_to_synthesis",
            "source": "revising_agent",
            "target": "synthesis_agent",
            "label": f"{len(state.revising_output.accepted_papers) if state.revising_output else 0} accepted",
            "animated": state.stage == "synthesis"
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

