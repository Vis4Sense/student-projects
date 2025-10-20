"""
Author: Henry X
Date: 2025/10/16 9:23
File: external_api.py
Description: [Add your description here]
"""

import aiohttp
from typing import List
from models.schemas import Paper
from config import settings
import logging
import xml.etree.ElementTree as ET

logger = logging.getLogger(__name__)


class ArxivAPI:
    """ArXiv API"""

    def __init__(self):
        self.base_url = settings.ARXIV_API_URL

    async def search(self, query: str, max_results: int = 20) -> List[Paper]:
        """Search ArXiv"""
        params = {
            "search_query": f"all:{query}",
            "start": 0,
            "max_results": max_results,
            "sortBy": "relevance",
            "sortOrder": "descending"
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.base_url, params=params) as response:
                    xml_data = await response.text()
                    return self._parse_arxiv_response(xml_data)
        except Exception as e:
            logger.error(f"ArXiv API error: {e}")
            return []

    def _parse_arxiv_response(self, xml_data: str) -> List[Paper]:
        """Parse ArXiv response"""
        papers = []
        root = ET.fromstring(xml_data)

        # ArXiv uses Atom namespace
        ns = {'atom': 'http://www.w3.org/2005/Atom'}

        for entry in root.findall('atom:entry', ns):
            try:
                paper = Paper(
                    id=entry.find('atom:id', ns).text,
                    title=entry.find('atom:title', ns).text.strip(),
                    abstract=entry.find('atom:summary', ns).text.strip(),
                    authors=[
                        author.find('atom:name', ns).text
                        for author in entry.findall('atom:author', ns)
                    ],
                    url=entry.find('atom:id', ns).text,
                    published_date=entry.find('atom:published', ns).text,
                    source="arxiv"
                )
                papers.append(paper)
            except Exception as e:
                logger.warning(f"Failed to parse paper: {e}")
                continue

        return papers
