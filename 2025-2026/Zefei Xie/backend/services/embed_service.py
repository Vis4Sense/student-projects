"""
Author: Henry X
Date: 2025/11/16 17:08
File: embed_service.py
Description: Embedding Service with comprehensive caching support
"""

import logging
import numpy as np
from typing import List, Tuple, Optional
from pathlib import Path
import pickle
import hashlib
import atexit
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
    - Intelligent caching of embeddings (works with both local and Azure)
    - Support for TSNE and UMAP dimensionality reduction
    - Support for Azure OpenAI embeddings
    - Persistent cache with automatic save on exit
    """

    def __init__(
            self,
            model_name: str = "all-MiniLM-L6-v2",
            cache_dir: Optional[str] = None,
            reduction_method: str = "umap",
            use_azure: Optional[bool] = None,
            enable_cache: bool = True
    ):
        """
        Initialize Embedding Service

        Args:
            model_name: HuggingFace model name or Azure deployment name
            cache_dir: Directory to cache models and embeddings
            reduction_method: "tsne" or "umap" for dimensionality reduction
            use_azure: Whether to use Azure OpenAI (defaults to env var EMBEDDING_USE_AZURE)
            enable_cache: Whether to enable embedding cache
        """
        self.model_name = model_name
        self.reduction_method = reduction_method.lower()
        self.enable_cache = enable_cache

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

        # Cache for embeddings: {text_hash: embedding_vector}
        self.embedding_cache = {}

        # Load existing cache if available
        if self.enable_cache:
            self.load_cache()
            # Register auto-save on exit
            atexit.register(self.save_cache)

        logger.info(f"EmbedService initialized")
        logger.info(f"Using Azure: {self.use_azure}")
        logger.info(f"Model: {model_name}")
        logger.info(f"Reduction method: {self.reduction_method}")
        logger.info(f"Cache enabled: {self.enable_cache}")
        if self.enable_cache:
            logger.info(f"Cache size: {len(self.embedding_cache)} items")

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

    def _get_text_hash(self, text: str) -> str:
        """
        Generate hash for text to use as cache key

        Args:
            text: Input text

        Returns:
            MD5 hash string
        """
        # Include model name in hash to avoid conflicts between different models
        key = f"{self.model_name}:{text}"
        return hashlib.md5(key.encode('utf-8')).hexdigest()

    def _get_cached_embeddings(self, texts: List[str]) -> Tuple[List[int], np.ndarray, List[str]]:
        """
        Check cache for embeddings

        Args:
            texts: List of input texts

        Returns:
            cached_indices: Indices of texts found in cache
            cached_embeddings: Embeddings from cache
            uncached_texts: Texts not found in cache
        """
        if not self.enable_cache:
            return [], np.array([]), texts

        cached_indices = []
        cached_embeddings = []
        uncached_texts = []

        for idx, text in enumerate(texts):
            text_hash = self._get_text_hash(text)
            if text_hash in self.embedding_cache:
                cached_indices.append(idx)
                cached_embeddings.append(self.embedding_cache[text_hash])
            else:
                uncached_texts.append(text)

        cached_embeddings = np.array(cached_embeddings) if cached_embeddings else np.array([])

        if cached_indices:
            logger.info(f"Cache hit: {len(cached_indices)}/{len(texts)} embeddings")

        return cached_indices, cached_embeddings, uncached_texts

    def _cache_embeddings(self, texts: List[str], embeddings: np.ndarray):
        """
        Cache embeddings for texts

        Args:
            texts: List of texts
            embeddings: Corresponding embeddings
        """
        if not self.enable_cache:
            return

        for text, embedding in zip(texts, embeddings):
            text_hash = self._get_text_hash(text)
            self.embedding_cache[text_hash] = embedding

        logger.debug(f"Cached {len(texts)} new embeddings")

    def get_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Get embeddings for a list of texts (with caching)

        Args:
            texts: List of text strings (e.g., abstracts)

        Returns:
            numpy array of shape (n_texts, embedding_dim)
        """
        if not texts:
            return np.array([])

        try:
            logger.info(f"Generating embeddings for {len(texts)} texts")

            # Check cache first
            cached_indices, cached_embeddings, uncached_texts = self._get_cached_embeddings(texts)

            # Generate embeddings for uncached texts
            if uncached_texts:
                logger.info(f"Generating {len(uncached_texts)} new embeddings via {'Azure' if self.use_azure else 'local model'}")
                if self.use_azure:
                    new_embeddings = self._get_azure_embeddings(uncached_texts)
                else:
                    new_embeddings = self._get_local_embeddings(uncached_texts)

                # Cache new embeddings
                self._cache_embeddings(uncached_texts, new_embeddings)
            else:
                new_embeddings = np.array([])

            # Combine cached and new embeddings in correct order
            if len(cached_indices) == 0:
                # All new
                embeddings = new_embeddings
            elif len(uncached_texts) == 0:
                # All cached
                embeddings = cached_embeddings
            else:
                # Mix of cached and new - reconstruct original order
                embedding_dim = new_embeddings.shape[1] if new_embeddings.size > 0 else cached_embeddings.shape[1]
                embeddings = np.zeros((len(texts), embedding_dim))

                # Fill in cached embeddings
                for i, idx in enumerate(cached_indices):
                    embeddings[idx] = cached_embeddings[i]

                # Fill in new embeddings
                new_idx = 0
                for idx in range(len(texts)):
                    if idx not in cached_indices:
                        embeddings[idx] = new_embeddings[new_idx]
                        new_idx += 1

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
            # Generate embeddings (with caching)
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

    def save_cache(self, cache_file: Optional[str] = None):
        """
        Save embedding cache to disk

        Args:
            cache_file: Cache file name (auto-generated if None)
        """
        if not self.enable_cache:
            return

        try:
            if cache_file is None:
                # Use model-specific cache file name
                model_safe = self.model_name.replace('/', '_').replace(':', '_').replace(' ', '_')
                cache_file = f"embedding_cache_{model_safe}.pkl"

            cache_path = self.cache_dir / cache_file
            with open(cache_path, 'wb') as f:
                pickle.dump(self.embedding_cache, f)
            logger.info(f"Saved {len(self.embedding_cache)} embeddings to {cache_path}")
        except Exception as e:
            logger.error(f"Failed to save cache: {e}")

    def load_cache(self, cache_file: Optional[str] = None):
        """
        Load embedding cache from disk

        Args:
            cache_file: Cache file name (auto-generated if None)
        """
        if not self.enable_cache:
            return

        try:
            if cache_file is None:
                # Use model-specific cache file name
                model_safe = self.model_name.replace('/', '_').replace(':', '_').replace(' ', '_')
                cache_file = f"embedding_cache_{model_safe}.pkl"

            cache_path = self.cache_dir / cache_file
            if cache_path.exists():
                with open(cache_path, 'rb') as f:
                    self.embedding_cache = pickle.load(f)
                logger.info(f"Loaded {len(self.embedding_cache)} embeddings from {cache_path}")
            else:
                logger.info(f"No cache file found at {cache_path}")
        except Exception as e:
            logger.error(f"Failed to load cache: {e}")
            self.embedding_cache = {}

    def clear_cache(self):
        """Clear in-memory cache"""
        self.embedding_cache = {}
        logger.info("Embedding cache cleared")

    def get_cache_stats(self) -> dict:
        """
        Get cache statistics

        Returns:
            Dictionary with cache information
        """
        return {
            "cache_enabled": self.enable_cache,
            "cached_items": len(self.embedding_cache),
            "model": self.model_name,
            "cache_dir": str(self.cache_dir),
            "use_azure": self.use_azure,
            "reduction_method": self.reduction_method
        }


# Global instance
embed_service = EmbedService(
    model_name="all-MiniLM-L6-v2",
    reduction_method="umap",
    cache_dir="./model",
    enable_cache=True
)
