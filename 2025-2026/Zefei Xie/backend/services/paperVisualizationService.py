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

            # Group papers by query first
            query_groups = self._group_by_query(history_papers)

            # Generate coordinates for both papers and queries together
            paper_coordinates, query_coordinates = self._generate_coordinates_together(
                history_papers,
                list(query_groups.keys())
            )

            query_colors = self._assign_query_colors(list(query_groups.keys()))

            visualization_data = self._assemble_data(
                history_papers,
                paper_coordinates,
                query_coordinates,
                query_groups,
                query_colors
            )

            logger.info("Visualization data prepared successfully")
            return visualization_data

        except Exception as e:
            logger.error(f"Failed to prepare visualization data: {e}")
            raise

    def _generate_coordinates_together(
            self,
            papers: List[Paper],
            queries: List[str]
    ) -> Tuple[List[Tuple[float, float]], Dict[str, Tuple[float, float]]]:
        """
        Generate 2D coordinates for papers and queries together in the same space

        Args:
            papers: List of Paper objects
            queries: List of query strings

        Returns:
            Tuple of (paper_coordinates, query_coordinates_dict)
        """
        logger.info(f"Generating 2D coordinates for {len(papers)} papers and {len(queries)} queries together...")

        # Prepare texts: papers first, then queries
        paper_abstracts = [paper.abstract for paper in papers]
        all_texts = paper_abstracts + queries

        # Generate coordinates for all texts together
        all_coordinates = self.embed_service.get_2d_coordinates(all_texts, method="umap")

        # Split coordinates back
        paper_coordinates = all_coordinates[:len(papers)]
        query_coordinate_list = all_coordinates[len(papers):]

        # Create query coordinates dictionary
        query_coordinates = {
            query: coord
            for query, coord in zip(queries, query_coordinate_list)
        }

        logger.info(f"✅ Generated {len(paper_coordinates)} paper coordinates and {len(query_coordinates)} query coordinates")

        return paper_coordinates, query_coordinates

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
            paper_coordinates: List[Tuple[float, float]],
            query_coordinates: Dict[str, Tuple[float, float]],
            query_groups: Dict[str, List[str]],
            query_colors: Dict[str, str]
    ) -> Dict[str, Any]:

        papers_data = []
        for paper, (x, y) in zip(papers, paper_coordinates):
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

        # Build queries_data from the coordinates dictionary
        queries_data = []
        for query, (x, y) in query_coordinates.items():
            queries_data.append({
                "query": query,
                "x": float(x),
                "y": float(y),
            })
            logger.info(f"✅ Query '{query}': ({x:.2f}, {y:.2f})")

        return {
            "status": "success",
            "papers": papers_data,
            "query_groups": query_groups,
            "query_colors": query_colors,
            "queries": list(query_groups.keys()),
            "queries_data": queries_data,
            "metadata": {
                "embedding_method": "umap",
                "embedding_model": self.embed_service.model_name,
                "generated_at": datetime.now().isoformat()
            },
            "statistics": statistics
        }


paper_visualization_service = PaperVisualizationService()
