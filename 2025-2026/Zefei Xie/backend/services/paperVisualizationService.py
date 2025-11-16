"""
Author: Henry X
Date: 2025/11/16 18:00
File: paperVisualizationService.py
Description: [Add your description here]
"""

# services/visualization_service.py
import logging
from typing import List, Dict, Tuple, Optional, Any
from datetime import datetime
from collections import defaultdict

from models.schemas import Paper
from services.embed_service import embed_service


logger = logging.getLogger(__name__)


class PaperVisualizationService:
    """Paper Evolution Visualization Service - 按 query 分组"""

    def __init__(self):
        self.embed_service = embed_service
        logger.info("PaperVisualizationService initialized")

    def prepare_visualization_data(
            self,
            history_papers: List[Paper]
    ) -> Dict[str, Any]:
        """

        Returns:
            {
                "papers": [{
                    "x": 12.34,
                    "y": 56.78,
                    "display": {
                        "color": "#4caf50",
                        "border_color": "#e3342f",
                        "size": 12.5
                    }
                }],
                "query_groups": {...},
                "query_colors": {...}
            }
        """
        if not history_papers:
            return {
                "status": "empty",
                "message": "No papers to visualize",
                "papers": [],
                "query_groups": {}
            }

        try:
            logger.info(f"Preparing visualization for {len(history_papers)} papers")

            coordinates = self._generate_coordinates(history_papers)

            query_groups = self._group_by_query(history_papers)

            query_colors = self._assign_query_colors(list(query_groups.keys()))

            visualization_data = self._assemble_data(
                history_papers,
                coordinates,
                query_groups,
                query_colors
            )

            logger.info("Visualization data prepared successfully")
            return visualization_data

        except Exception as e:
            logger.error(f"Failed to prepare visualization data: {e}")
            raise

    def _generate_coordinates(self, papers: List[Paper]) -> List[Tuple[float, float]]:
        logger.info("Generating 2D coordinates...")
        abstracts = [paper.abstract for paper in papers]
        coordinates = self.embed_service.get_2d_coordinates(abstracts, method="umap")
        return coordinates

    def _group_by_query(self, papers: List[Paper]) -> Dict[str, List[str]]:
        query_groups = defaultdict(list)

        for paper in papers:
            query = paper.found_by_query or "Unknown Query"
            query_groups[query].append(paper.id)

        return dict(query_groups)

    def _assign_query_colors(self, queries: List[str]) -> Dict[str, str]:
        border_colors = [
            "#e3342f",
            "#f6993f",
            "#ffed4e",
            "#38c172",
            "#4dc0b5",
            "#3490dc",
            "#6574cd",
            "#9561e2",
            "#f66d9b",
        ]

        query_colors = {}
        for idx, query in enumerate(queries):
            query_colors[query] = border_colors[idx % len(border_colors)]

        return query_colors

    def _get_status_color(self, status: str) -> str:
        color_map = {
            "accepted": "#4caf50",
            "rejected": "#f44336",
            "neutral": "#2196f3"
        }
        return color_map.get(status, "#9e9e9e")

    def _assemble_data(
            self,
            papers: List[Paper],
            coordinates: List[Tuple[float, float]],
            query_groups: Dict[str, List[str]],
            query_colors: Dict[str, str]
    ) -> Dict[str, Any]:

        papers_data = []
        for paper, (x, y) in zip(papers, coordinates):
            query = paper.found_by_query or "Unknown Query"
            status = paper.human_tag or "neutral"

            papers_data.append({
                "paper_id": paper.id,
                "title": paper.title,
                "authors": paper.authors,
                "abstract": paper.abstract[:200] + "..." if len(paper.abstract) > 200 else paper.abstract,
                "url": paper.url,
                "published_date": paper.published_date,

                "x": float(x),
                "y": float(y),

                "found_by_query": query,

                "status": status,
                "relevance_score": paper.relevance_score,
                "found_by_keywords": paper.found_by_keywords,

                "display": {
                    "color": self._get_status_color(status),
                    "border_color": query_colors[query],
                    "size": 5 + paper.relevance_score * 10,
                    "opacity": 0.8
                }
            })

        statistics = {
            "total_papers": len(papers),
            "total_queries": len(query_groups),
            "total_accepted": sum(1 for p in papers_data if p["status"] == "accepted"),
            "total_rejected": sum(1 for p in papers_data if p["status"] == "rejected"),
            "total_neutral": sum(1 for p in papers_data if p["status"] == "neutral"),
            "papers_per_query": {
                query: len(paper_ids)
                for query, paper_ids in query_groups.items()
            }
        }

        return {
            "status": "success",
            "papers": papers_data,
            "query_groups": query_groups,
            "query_colors": query_colors,
            "queries": list(query_groups.keys()),
            "metadata": {
                "embedding_method": "umap",
                "embedding_model": self.embed_service.model_name,
                "generated_at": datetime.now().isoformat()
            },
            "statistics": statistics
        }


paper_visualization_service = PaperVisualizationService()
