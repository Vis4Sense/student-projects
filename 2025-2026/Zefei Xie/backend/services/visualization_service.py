"""
Author: Henry X
Date: 2025/10/16 9:28
File: visualization_service.py
Description: [Add your description here]
"""

from models.schemas import VisualizationData, PipelineState
import logging

logger = logging.getLogger(__name__)


class VisualizationService:
    """将工作流状态转换为可视化数据（增强版）"""

    @staticmethod
    def generate_visualization(state: PipelineState) -> VisualizationData:
        """生成前端可视化所需的节点和边数据"""
        nodes = []
        edges = []

        # ============ 节点 1: Search Agent（主节点）============
        nodes.append({
            "id": "search_agent",
            "type": "agent",
            "label": "Search Agent",
            "status": VisualizationService._get_node_status(state, "search"),
            "data": {
                "total_papers": len(state.search_output.papers) if state.search_output else 0,
                "reasoning": state.search_output.reasoning if state.search_output else ""
            }
        })

        # ============ 子节点: 每个关键词 ============
        if state.search_output and state.search_output.keyword_results:
            for i, result in enumerate(state.search_output.keyword_results):
                keyword_node_id = f"keyword_{i}"

                # 创建关键词节点
                nodes.append({
                    "id": keyword_node_id,
                    "type": "keyword",
                    "label": f"KW: {result.keyword.keyword}",
                    "status": "completed",
                    "data": {
                        "keyword": result.keyword.keyword,
                        "importance": result.keyword.importance,
                        "papers_count": result.papers_count,
                        "is_custom": result.keyword.is_custom,
                        "papers": [p.dict() for p in result.papers[:5]]  # 只显示前5篇
                    }
                })

                # 连接 Search Agent → 关键词节点
                edges.append({
                    "id": f"search_to_{keyword_node_id}",
                    "source": "search_agent",
                    "target": keyword_node_id,
                    "label": f"{result.papers_count} papers",
                    "animated": False
                })

        # ============ 节点 2: Paper Pool（论文池）============
        nodes.append({
            "id": "paper_pool",
            "type": "pool",
            "label": "Paper Pool",
            "status": "completed" if state.search_output else "pending",
            "data": {
                "total_unique_papers": len(state.search_output.papers) if state.search_output else 0,
                "duplicates_removed": state.search_output.total_papers_before_dedup - len(
                    state.search_output.papers) if state.search_output else 0,
                "papers_by_keyword": state.search_output.papers_by_keyword if state.search_output else {}
            }
        })

        # 连接所有关键词 → Paper Pool
        if state.search_output and state.search_output.keyword_results:
            for i in range(len(state.search_output.keyword_results)):
                edges.append({
                    "id": f"keyword_{i}_to_pool",
                    "source": f"keyword_{i}",
                    "target": "paper_pool",
                    "animated": False
                })

        # ============ 节点 3: Revising Agent ============
        nodes.append({
            "id": "revising_agent",
            "type": "agent",
            "label": "Revising Agent",
            "status": VisualizationService._get_node_status(state, "revising"),
            "data": {
                "accepted_count": len(state.revising_output.accepted_papers) if state.revising_output else 0,
                "rejected_count": len(state.revising_output.rejected_papers) if state.revising_output else 0
            }
        })

        edges.append({
            "id": "pool_to_revising",
            "source": "paper_pool",
            "target": "revising_agent",
            "label": f"{len(state.search_output.papers) if state.search_output else 0} papers",
            "animated": state.stage == "revising"
        })

        # ============ 节点 4: Synthesis Agent ============
        nodes.append({
            "id": "synthesis_agent",
            "type": "agent",
            "label": "Synthesis Agent",
            "status": VisualizationService._get_node_status(state, "synthesis"),
            "data": {
                "citation_count": len(state.synthesis_output.citations) if state.synthesis_output else 0
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
