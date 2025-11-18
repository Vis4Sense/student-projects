"""
Author: Henry X
Date: 2025/11/16 17:08
File: embed_service.py.py
Description: [Add your description here]
"""

import logging
import numpy as np
from typing import List, Tuple, Optional
from pathlib import Path
import pickle
import os
from sentence_transformers import SentenceTransformer
from sklearn.manifold import TSNE
import umap
import config

logger = logging.getLogger(__name__)
settings = config.settings

class EmbedService:
    """
    Embedding Service for converting text to 2D coordinates

    Features:
    - Automatic model download
    - Caching of embeddings
    - Support for TSNE and UMAP dimensionality reduction
    - Support for Azure OpenAI embeddings
    """

    def __init__(
            self,
            model_name: str = "all-MiniLM-L6-v2",
            cache_dir: Optional[str] = None,
            reduction_method: str = "umap",
            use_azure: Optional[bool] = None
    ):
        """
        Initialize Embedding Service

        Args:
            model_name: HuggingFace model name or Azure deployment name
            cache_dir: Directory to cache models and embeddings
            reduction_method: "tsne" or "umap" for dimensionality reduction
            use_azure: Whether to use Azure OpenAI (defaults to env var EMBEDDING_USE_AZURE)
        """
        self.model_name = model_name
        self.reduction_method = reduction_method.lower()

        # Determine whether to use Azure
        if use_azure is None:
            use_azure = settings.EMBEDDING_USE_AZURE
        self.use_azure = use_azure

        # Set cache directory
        if cache_dir:
            self.cache_dir = Path(cache_dir)
        else:
            self.cache_dir = Path("./cache/embeddings")

        self.cache_dir.mkdir(parents=True, exist_ok=True)

        # Initialize model
        self.model = None
        self.azure_client = None
        self._load_model()

        # Cache for embeddings
        self.embedding_cache = {}

        logger.info(f"EmbedService initialized")
        logger.info(f"Using Azure: {self.use_azure}")
        logger.info(f"Model: {model_name}")
        logger.info(f"Reduction method: {self.reduction_method}")

    def _load_model(self):
        """Load embedding model (local or Azure)"""
        try:
            if self.use_azure:
                self._load_azure_client()
            else:
                self._load_local_model()

        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise RuntimeError(f"Failed to load embedding model: {e}")

    def _load_local_model(self):
        """Load local SentenceTransformer model"""
        logger.info(f"Loading local embedding model: {self.model_name}")

        self.model = SentenceTransformer(
            self.model_name,
            cache_folder=str(self.cache_dir / "models")
        )

        logger.info(f"Local model loaded successfully")

    def _load_azure_client(self):
        """Initialize Azure OpenAI client"""
        try:
            from openai import AzureOpenAI
        except ImportError:
            raise ImportError(
                "openai package is required for Azure embeddings. "
                "Install it with: pip install openai"
            )

        logger.info(f"Initializing Azure OpenAI client")

        # Get Azure configuration from environment variables
        api_key = settings.AZURE_OPENAI_API_KEY
        endpoint = settings.AZURE_OPENAI_ENDPOINT
        api_version = settings.AZURE_OPENAI_API_VERSION
        deployment_name = settings.AZURE_EMBEDDING_DEPLOYMENT

        if not api_key or not endpoint:
            raise ValueError(
                "Azure OpenAI requires AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT "
                "environment variables to be set"
            )

        self.azure_client = AzureOpenAI(
            api_key=api_key,
            api_version=api_version,
            azure_endpoint=endpoint
        )

        # Update model name to deployment name
        self.model_name = deployment_name

        logger.info(f"Azure OpenAI client initialized with deployment: {deployment_name}")

    def get_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Get embeddings for a list of texts

        Args:
            texts: List of text strings (e.g., abstracts)

        Returns:
            numpy array of shape (n_texts, embedding_dim)
        """
        if not texts:
            return np.array([])

        try:
            logger.info(f"Generating embeddings for {len(texts)} texts")

            if self.use_azure:
                embeddings = self._get_azure_embeddings(texts)
            else:
                embeddings = self._get_local_embeddings(texts)

            logger.info(f"Generated embeddings with shape: {embeddings.shape}")
            return embeddings

        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            raise

    def _get_local_embeddings(self, texts: List[str]) -> np.ndarray:
        """Get embeddings using local SentenceTransformer model"""
        embeddings = self.model.encode(
            texts,
            show_progress_bar=len(texts) > 10,
            convert_to_numpy=True,
            batch_size=32
        )
        return embeddings

    def _get_azure_embeddings(self, texts: List[str]) -> np.ndarray:
        """Get embeddings using Azure OpenAI"""
        embeddings = []

        batch_size = 16

        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]

            response = self.azure_client.embeddings.create(
                input=batch,
                model=self.model_name
            )

            # Extract embeddings from response
            batch_embeddings = [item.embedding for item in response.data]
            embeddings.extend(batch_embeddings)

            if len(texts) > 10:
                logger.info(f"Processed {min(i + batch_size, len(texts))}/{len(texts)} texts")

        return np.array(embeddings)

    def reduce_dimensions_tsne(
            self,
            embeddings: np.ndarray,
            n_components: int = 2,
            perplexity: int = 30,
            random_state: int = 42
    ) -> np.ndarray:
        """
        Reduce embeddings to 2D using t-SNE

        Args:
            embeddings: High-dimensional embeddings
            n_components: Target dimensions (default: 2)
            perplexity: t-SNE perplexity parameter
            random_state: Random seed

        Returns:
            2D coordinates
        """
        try:
            logger.info(f"Reducing dimensions with t-SNE (perplexity={perplexity})")

            # Adjust perplexity if dataset is small
            n_samples = embeddings.shape[0]
            if n_samples < perplexity * 3:
                perplexity = max(5, n_samples // 3)
                logger.warning(f"Adjusted perplexity to {perplexity} due to small dataset")

            tsne = TSNE(
                n_components=n_components,
                perplexity=perplexity,
                random_state=random_state,
                max_iter=1000
            )

            coords_2d = tsne.fit_transform(embeddings)

            logger.info(f"t-SNE reduction complete: {coords_2d.shape}")
            return coords_2d

        except Exception as e:
            logger.error(f"t-SNE reduction failed: {e}")
            raise

    def reduce_dimensions_umap(
            self,
            embeddings: np.ndarray,
            n_components: int = 2,
            n_neighbors: int = 15,
            min_dist: float = 0.1,
            random_state: int = 42
    ) -> np.ndarray:
        """
        Reduce embeddings to 2D using UMAP

        Args:
            embeddings: High-dimensional embeddings
            n_components: Target dimensions
            n_neighbors: UMAP n_neighbors parameter
            min_dist: UMAP min_dist parameter
            random_state: Random seed

        Returns:
            2D coordinates
        """
        try:
            logger.info(f"Reducing dimensions with UMAP (n_neighbors={n_neighbors})")

            # Adjust n_neighbors if dataset is small
            n_samples = embeddings.shape[0]
            if n_samples < n_neighbors:
                n_neighbors = max(2, n_samples - 1)
                logger.warning(f"Adjusted n_neighbors to {n_neighbors} due to small dataset")

            reducer = umap.UMAP(
                n_components=n_components,
                n_neighbors=n_neighbors,
                min_dist=min_dist,
                random_state=random_state,
                metric='cosine'
            )

            coords_2d = reducer.fit_transform(embeddings)

            logger.info(f"UMAP reduction complete: {coords_2d.shape}")
            return coords_2d

        except Exception as e:
            logger.error(f"UMAP reduction failed: {e}")
            raise

    def get_2d_coordinates(
            self,
            texts: List[str],
            method: Optional[str] = None
    ) -> List[Tuple[float, float]]:
        """
        Get 2D coordinates for a list of texts

        Args:
            texts: List of text strings (e.g., abstracts)
            method: "tsne" or "umap" (overrides default)

        Returns:
            List of (x, y) coordinate tuples
        """
        if not texts:
            return []

        # Use specified method or default
        method = method or self.reduction_method

        try:
            # Generate embeddings
            embeddings = self.get_embeddings(texts)

            # Reduce to 2D
            if method == "tsne":
                coords_2d = self.reduce_dimensions_tsne(embeddings)
            elif method == "umap":
                coords_2d = self.reduce_dimensions_umap(embeddings)
            else:
                raise ValueError(f"Unknown reduction method: {method}")

            # Convert to list of tuples
            coordinates = [(float(x), float(y)) for x, y in coords_2d]

            logger.info(f"Generated {len(coordinates)} 2D coordinates")
            return coordinates

        except Exception as e:
            logger.error(f"Failed to get 2D coordinates: {e}")
            raise

    def get_single_2d_coordinate(
            self,
            text: str,
            reference_texts: Optional[List[str]] = None
    ) -> Tuple[float, float]:
        """
        Get 2D coordinate for a single text

        Note: For meaningful 2D projection, need reference texts

        Args:
            text: Single text string
            reference_texts: Reference texts for context

        Returns:
            (x, y) coordinate tuple
        """
        if reference_texts:
            all_texts = reference_texts + [text]
            coords = self.get_2d_coordinates(all_texts)
            return coords[-1]  # Return last coordinate (for input text)
        else:
            # If no reference, just return embedding projected to 2D
            coords = self.get_2d_coordinates([text])
            return coords[0]

    def save_cache(self, cache_file: str = "embedding_cache.pkl"):
        """Save embedding cache to disk"""
        try:
            cache_path = self.cache_dir / cache_file
            with open(cache_path, 'wb') as f:
                pickle.dump(self.embedding_cache, f)
            logger.info(f"Saved embedding cache to {cache_path}")
        except Exception as e:
            logger.error(f"Failed to save cache: {e}")

    def load_cache(self, cache_file: str = "embedding_cache.pkl"):
        """Load embedding cache from disk"""
        try:
            cache_path = self.cache_dir / cache_file
            if cache_path.exists():
                with open(cache_path, 'rb') as f:
                    self.embedding_cache = pickle.load(f)
                logger.info(f"Loaded embedding cache from {cache_path}")
            else:
                logger.info("No cache file found")
        except Exception as e:
            logger.error(f"Failed to load cache: {e}")


# Global instance
embed_service = EmbedService(
    model_name="all-MiniLM-L6-v2",
    reduction_method="umap",
    cache_dir="./model",
)
