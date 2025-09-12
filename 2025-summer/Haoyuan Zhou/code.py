"""
acetaminophen
"""

import json
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional
import gradio as gr
import requests
from collections import defaultdict
import os
import time
from datetime import datetime


class UserPreferenceManager:


    def __init__(self, storage_path="user_preferences_enhanced.json"):
        self.storage_path = storage_path
        self.preferences = self.load_preferences()

    def load_preferences(self) -> Dict:
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, 'r') as f:
                    return json.load(f)
            except:
                return self._initialize_preferences()
        return self._initialize_preferences()

    def _initialize_preferences(self) -> Dict:
        return {
            "user_selections": [],  # Complete record of user selections
            "feature_preferences": {},  # Feature preference statistics
            "explicit_ratings": {},  # Explicit rating records
            "weight_preferences": {"model_weight": 0.5, "feature_weight": 0.5}  # Store weight preferences
        }

    def record_selection(self, query: str, selected_item: Dict, rating: Optional[int] = None):
        """Record complete features of user selection"""
        selection_record = {
            "timestamp": datetime.now().isoformat(),
            "query": query,
            "selected_features": {
                "concept_name": selected_item.get('Concept_Name'),
                "concept_id": selected_item.get('Concept_ID'),
                "domain": selected_item.get('Domain'),
                "class": selected_item.get('Class'),
                "vocabulary_id": selected_item.get('Vocabulary_ID'),
                "similarity_score": selected_item.get('Similarity_Score')
            },
            "rating": rating  # User explicit rating (1-5)
        }

        self.preferences["user_selections"].append(selection_record)
        self._update_feature_preferences(selected_item)

        if rating:
            key = f"{query}_{selected_item['Concept_ID']}"
            self.preferences["explicit_ratings"][key] = rating

        self.save_preferences()
        return selection_record

    def _update_feature_preferences(self, item: Dict):
        """Update feature preference statistics"""
        # Calculate selection frequency for each feature
        for feature in ['Domain', 'Class', 'Vocabulary_ID']:
            value = item.get(feature)
            if value:
                if feature not in self.preferences["feature_preferences"]:
                    self.preferences["feature_preferences"][feature] = {}

                if value not in self.preferences["feature_preferences"][feature]:
                    self.preferences["feature_preferences"][feature][value] = 0

                self.preferences["feature_preferences"][feature][value] += 1

    def get_user_preference_profile(self) -> Dict:
        """Get user preference profile"""
        return {
            "total_selections": len(self.preferences["user_selections"]),
            "feature_preferences": self.preferences["feature_preferences"],
            "recent_selections": self.preferences["user_selections"][-10:],  # Last 10 selections
            "weight_preferences": self.preferences.get("weight_preferences", {"model_weight": 0.5, "feature_weight": 0.5})
        }

    def update_weight_preferences(self, model_weight: float, feature_weight: float):
        """Update weight preferences"""
        self.preferences["weight_preferences"] = {
            "model_weight": model_weight,
            "feature_weight": feature_weight
        }
        self.save_preferences()

    def save_preferences(self):
        with open(self.storage_path, 'w') as f:
            json.dump(self.preferences, f, indent=2)

    def get_explicit_rating(self, query: str, concept_id: str) -> Optional[int]:
        """Return stored rating (1-5) for (query, concept_id) if any"""
        key = f"{query}_{concept_id}"
        return self.preferences.get("explicit_ratings", {}).get(key)

    def reset_preferences(self) -> bool:
        """Reset all user preferences to initial state"""
        try:
            self.preferences = self._initialize_preferences()
            self.save_preferences()
            return True
        except Exception as e:
            print(f"Error resetting preferences: {e}")
            return False

    def export_preferences(self, export_path: str = None) -> str:
        """Export user preferences to file"""
        if export_path is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            export_path = f"user_preferences_export_{timestamp}.json"
        
        try:
            with open(export_path, 'w') as f:
                json.dump(self.preferences, f, indent=2)
            return export_path
        except Exception as e:
            raise Exception(f"Error exporting preferences: {e}")

    def import_preferences(self, import_path: str) -> bool:
        """Import user preferences from file"""
        try:
            with open(import_path, 'r') as f:
                imported_prefs = json.load(f)
            
            # Validate the imported data structure
            required_keys = ["user_selections", "feature_preferences", "explicit_ratings", "weight_preferences"]
            if all(key in imported_prefs for key in required_keys):
                self.preferences = imported_prefs
                self.save_preferences()
                return True
            else:
                raise Exception("Invalid preference file format")
        except Exception as e:
            print(f"Error importing preferences: {e}")
            return False

    def get_preference_statistics(self) -> Dict:
        """Get statistics for preference visualization"""
        stats = {
            "total_selections": len(self.preferences["user_selections"]),
            "total_ratings": len(self.preferences["explicit_ratings"]),
            "feature_distribution": {},
            "rating_distribution": {},
            "selection_timeline": [],
            "weight_history": self.preferences.get("weight_preferences", {})
        }
        
        # Feature distribution statistics
        for feature, values in self.preferences["feature_preferences"].items():
            stats["feature_distribution"][feature] = dict(sorted(values.items(), key=lambda x: x[1], reverse=True)[:10])
        
        # Rating distribution
        ratings = list(self.preferences["explicit_ratings"].values())
        for i in range(1, 6):
            stats["rating_distribution"][f"{i} stars"] = ratings.count(i)
        
        # Selection timeline (last 30 selections)
        recent_selections = self.preferences["user_selections"][-30:]
        for selection in recent_selections:
            if selection.get("timestamp"):
                try:
                    date_str = selection["timestamp"][:10]  # Get date part
                    stats["selection_timeline"].append({
                        "date": date_str,
                        "query": selection["query"],
                        "concept": selection["selected_features"]["concept_name"]
                    })
                except:
                    continue
        
        return stats


def query_lettuce(term: str, url="http://127.0.0.1:8000/pipeline/"):
    """
    Call Lettuce API to get medical term mapping suggestions
    """
    headers = {"Content-Type": "application/json"}
    data = {"names": [term]}  # Lettuce expects a list of names

    # 增加重试机制
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # 增加超时时间，因为Lettuce首次加载模型需要较长时间
            response = requests.post(
                url,
                json=data,
                headers=headers,
                timeout=120  # 增加到120秒
            )

            if response.status_code != 200:
                print(f"Error: HTTP {response.status_code}")
                print(f"Response: {response.text}")
                if attempt < max_retries - 1:
                    print(f"Retrying... (attempt {attempt + 2}/{max_retries})")
                    time.sleep(2)  # 等待2秒后重试
                    continue
                return None

            # Parse streaming response
            lines = response.text.strip().split("\n")
            parsed_data = []

            for line in lines:
                if line.startswith("data: "):
                    json_part = line[6:].strip()
                    try:
                        parsed_data.append(json.loads(json_part))
                    except json.JSONDecodeError as e:
                        print(f"JSON parse fail: {e}")

            # Extract important information
            return extract_lettuce_info(parsed_data)

        except requests.exceptions.ConnectionError as e:
            if attempt < max_retries - 1:
                print(f"Connection error (attempt {attempt + 1}/{max_retries}), retrying...")
                time.sleep(2)
                continue
            print("Error: Cannot connect to Lettuce server at http://127.0.0.1:8000")
            print("Please make sure the Lettuce server is running: uv run --env-file .env python app.py")
            return None
        except requests.exceptions.Timeout:
            if attempt < max_retries - 1:
                print(f"Request timed out (attempt {attempt + 1}/{max_retries}), retrying...")
                time.sleep(2)
                continue
            print("Error: Request timed out (120 seconds)")
            print("This might happen on first run when Lettuce is loading models.")
            print("Please try again.")
            return None
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"Unexpected error (attempt {attempt + 1}/{max_retries}): {e}")
                time.sleep(2)
                continue
            print(f"Unexpected error: {e}")
            return None

    return None


def extract_lettuce_info(parsed_data):
    """
    Extract information from Lettuce response and convert to required format
    """
    results = []

    # Flatten data
    flattened_data = []
    for item in parsed_data:
        if isinstance(item, list):
            flattened_data.extend(item)
        else:
            flattened_data.append(item)

    # Extract OMOP concepts
    for item in flattened_data:
        if not isinstance(item, dict):
            continue

        event = item.get('event', '')
        data = item.get('data', {})

        if event == 'omop_output':
            search_term = data.get('search_term', '')
            for concept in data.get('CONCEPT', []):
                result = {
                    "Informal_Name": search_term,
                    "Reply": search_term.capitalize(),
                    "Concept_Name": concept.get('concept_name', ''),
                    "Concept_ID": str(concept.get('concept_id', '')),
                    "Domain": concept.get('domain_id', ''),
                    "Class": concept.get('concept_class_id', ''),
                    "Concept_Code": concept.get('concept_code', ''),
                    "Vocabulary_ID": concept.get('vocabulary_id', ''),
                    "Similarity_Score": float(concept.get('concept_name_similarity_score', 0))
                }
                results.append(result)

    return results


def get_lettuce_data(query: str, num_results: int = 15) -> pd.DataFrame:
    """
    Get data from Lettuce service
    """
    lettuce_results = query_lettuce(query)

    if not lettuce_results:
        return pd.DataFrame()  # Return empty DataFrame if Lettuce fails

    # Convert to DataFrame
    df = pd.DataFrame(lettuce_results[:num_results])

    # Ensure all required columns exist
    required_columns = [
        "Informal_Name", "Reply", "Concept_Name", "Concept_ID",
        "Domain", "Class", "Concept_Code", "Vocabulary_ID", "Similarity_Score"
    ]

    for col in required_columns:
        if col not in df.columns:
            df[col] = "" if col != "Similarity_Score" else 0

    return df


class EnhancedQwen3Reranker:
    """Enhanced Qwen3-Reranker - intelligent ranking based on user preference features"""

    def __init__(self, model_name="dengcao/Qwen3-Reranker-4B:Q5_K_M", ollama_host="http://localhost:11434"):
        self.model_name = model_name
        self.ollama_host = ollama_host
        self.model_available = self.check_model()

    def check_model(self) -> bool:
        """Check if model is available"""
        try:
            response = requests.get(f"{self.ollama_host}/api/tags")
            if response.status_code != 200:
                print("Warning: Ollama service not running")
                return False

            models = response.json().get('models', [])
            model_names = [m['name'] for m in models]

            if self.model_name in model_names:
                print(f"Model {self.model_name} ready")
                return True

            # Find other Qwen Reranker models
            for model in model_names:
                if 'qwen' in model.lower() and 'reranker' in model.lower():
                    self.model_name = model
                    print(f"Found Qwen Reranker model: {model}")
                    return True

            print(f"Model {self.model_name} not found")
            return False

        except Exception as e:
            print(f"Warning: Failed to connect to Ollama: {e}")
            return False

    def rerank_with_preferences(self, query: str, documents: List[Dict],
                                user_profile: Dict, top_k: int = 10) -> List[Tuple[Dict, float]]:
        """Rerank based on user preference features"""

        if not self.model_available:
            print("Warning: Model unavailable, using default ranking")
            return [(doc, doc.get('Similarity_Score', 0)) for doc in documents[:top_k]]

        try:
            # Build prompt with user preferences
            prompt = self._build_preference_aware_prompt(query, documents, user_profile)

            # Call model
            response = requests.post(
                f"{self.ollama_host}/api/generate",
                json={
                    "model": self.model_name,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "top_p": 0.9,
                        "seed": 42,
                        "num_predict": 256
                    }
                },
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                model_output = result.get('response', '')

                # Parse model output and rerank
                reranked = self._parse_preference_based_output(model_output, documents)
                return reranked[:top_k]
            else:
                print(f"Warning: Model call failed: {response.status_code}")
                return [(doc, doc.get('Similarity_Score', 0)) for doc in documents[:top_k]]

        except Exception as e:
            print(f"Warning: Reranking error: {e}")
            return [(doc, doc.get('Similarity_Score', 0)) for doc in documents[:top_k]]

    def _build_preference_aware_prompt(self, query: str, documents: List[Dict],
                                       user_profile: Dict) -> str:
        """Build prompt with user preferences"""

        # Extract user preference features
        feature_prefs = user_profile.get('feature_preferences', {})
        recent_selections = user_profile.get('recent_selections', [])

        # Build preference description
        pref_description = []
        if 'Domain' in feature_prefs:
            top_domains = sorted(feature_prefs['Domain'].items(),
                                 key=lambda x: x[1], reverse=True)[:3]
            if top_domains:
                pref_description.append(f"Preferred domains: {', '.join([d[0] for d in top_domains])}")

        if 'Class' in feature_prefs:
            top_classes = sorted(feature_prefs['Class'].items(),
                                 key=lambda x: x[1], reverse=True)[:3]
            if top_classes:
                pref_description.append(f"Preferred classes: {', '.join([c[0] for c in top_classes])}")

        # Build document list
        doc_list = []
        for i, doc in enumerate(documents[:10]):
            doc_info = (f"[{i}] {doc['Concept_Name']} "
                        f"(Domain: {doc.get('Domain', 'Unknown')}, "
                        f"Class: {doc.get('Class', 'Unknown')}, "
                        f"Vocabulary: {doc.get('Vocabulary_ID', 'Unknown')})")
            doc_list.append(doc_info)

        # Build recent selection examples
        recent_examples = []
        for sel in recent_selections[-3:]:
            if sel.get('selected_features'):
                feat = sel['selected_features']
                recent_examples.append(
                    f"- {feat.get('concept_name')} "
                    f"(Domain: {feat.get('domain')}, Class: {feat.get('class')})"
                )

        # Combine prompt
        prompt = f"""You are a medical term ranking expert. Based on the user's historical preferences, 
rank the following medical concepts for the query.

Query: {query}

User Preferences:
{chr(10).join(pref_description) if pref_description else 'No specific preferences yet'}

Recent User Selections:
{chr(10).join(recent_examples) if recent_examples else 'No recent selections'}

Medical Concepts to Rank:
{chr(10).join(doc_list)}

Task: Rank these concepts from most to least relevant, considering both:
1. Relevance to the query "{query}"
2. Alignment with user's historical preferences

Output format: List the indices in order of relevance, separated by commas.
Example: 2,0,5,1,3,4,6,7,8,9

Your ranking:"""

        return prompt

    def _parse_preference_based_output(self, output: str, documents: List[Dict]) -> List[Tuple[Dict, float]]:
        """Parse preference-based model output"""
        try:
            import re

            # Extract numbers
            numbers = re.findall(r'\d+', output)

            if not numbers:
                print("Warning: Cannot parse model output, using original order")
                return [(doc, doc.get('Similarity_Score', 0)) for doc in documents]

            # Rerank according to model output
            indices = [int(n) for n in numbers if int(n) < len(documents)]

            reranked = []
            used_indices = set()

            # Add documents according to model ranking
            for idx in indices:
                if idx not in used_indices and idx < len(documents):
                    # Decreasing score
                    score = 100 - len(reranked) * 5
                    reranked.append((documents[idx], score))
                    used_indices.add(idx)

            # Add unranked documents
            for i, doc in enumerate(documents):
                if i not in used_indices:
                    reranked.append((doc, doc.get('Similarity_Score', 0)))

            return reranked

        except Exception as e:
            print(f"Warning: Parse failed: {e}")
            return [(doc, doc.get('Similarity_Score', 0)) for doc in documents]


class IntelligentHybridReranker:
    """Intelligent Hybrid Reranker - based on feature similarity and user preferences"""

    def __init__(self):
        self.qwen_reranker = EnhancedQwen3Reranker()
        self.preference_manager = UserPreferenceManager()
        self.rating_mix = 0.4  # 0~1, weight of explicit rating inside the preference score

    def rerank(self, query: str, documents: List[Dict], model_weight: float = 0.5) -> List[Dict]:
        """Intelligent reranking based on user preference features with adjustable weights"""

        # Ensure weights sum to 1
        feature_weight = 1.0 - model_weight

        # Get user preference profile
        user_profile = self.preference_manager.get_user_preference_profile()

        # Update weight preferences in preference manager
        self.preference_manager.update_weight_preferences(model_weight, feature_weight)

        # Use AI model to rerank based on preferences
        model_results = self.qwen_reranker.rerank_with_preferences(
            query, documents, user_profile, top_k=len(documents)
        )

        enhanced_results = []
        for doc, model_score in model_results:
            # 1) Implicit: feature-based similarity (0~100)
            feature_similarity = self._calculate_feature_similarity(doc, user_profile)

            # 2) Explicit: user rating for this concept under current query (1~5), convert to 0~100
            rating_value = self.preference_manager.get_explicit_rating(query, doc.get('Concept_ID'))
            rating_score = (rating_value / 5.0) * 100 if rating_value else 0

            # 3) Combine explicit rating and feature similarity into "preference score" (0~100)
            preference_score = (1 - self.rating_mix) * feature_similarity + self.rating_mix * rating_score

            # 4) Final score = model score * model weight + preference score * preference weight
            final_score = model_score * model_weight + preference_score * feature_weight

            doc['Model_Score'] = model_score
            doc['Feature_Similarity'] = feature_similarity
            doc['Rating'] = rating_value if rating_value is not None else 0
            doc['Final_Score'] = final_score
            doc['Model_Weight'] = model_weight
            doc['Feature_Weight'] = feature_weight
            doc['Preference_Score'] = preference_score

            enhanced_results.append((doc, final_score))

        # Sort by final score
        enhanced_results.sort(key=lambda x: x[1], reverse=True)

        # Add rank
        ranked_docs = []
        for i, (doc, _) in enumerate(enhanced_results):
            doc['Rank'] = i + 1
            ranked_docs.append(doc)

        return ranked_docs

    def _calculate_feature_similarity(self, doc: Dict, user_profile: Dict) -> float:
        """Calculate document feature similarity with user preferences"""
        similarity_score = 0
        feature_prefs = user_profile.get('feature_preferences', {})

        if not feature_prefs:
            return 50  # Return medium score when no preferences

        # Calculate similarity for each feature
        weights = {'Domain': 0.4, 'Class': 0.3, 'Vocabulary_ID': 0.3}

        for feature, weight in weights.items():
            if feature in feature_prefs:
                value = doc.get(feature)
                if value and value in feature_prefs[feature]:
                    # Calculate score based on selection frequency
                    freq = feature_prefs[feature][value]
                    total_freq = sum(feature_prefs[feature].values())
                    similarity_score += weight * (freq / total_freq) * 100

        return similarity_score


class EnhancedLearnToRankDemo:
    """Enhanced Learn to Rank Demo System with Adjustable Weights"""

    def __init__(self):
        self.hybrid_reranker = IntelligentHybridReranker()
        self.current_results = None
        self.current_query = None
        # Load saved weight preferences
        user_profile = self.hybrid_reranker.preference_manager.get_user_preference_profile()
        weight_prefs = user_profile.get('weight_preferences', {"model_weight": 0.5, "feature_weight": 0.5})
        self.current_model_weight = weight_prefs['model_weight']

        # Check Lettuce service status
        self.lettuce_available = self.check_lettuce_status()

    def check_lettuce_status(self) -> bool:
        """Check if Lettuce service is available"""
        try:
            # 使用更长的超时时间进行状态检查
            response = requests.get("http://127.0.0.1:8000/docs", timeout=10)
            return response.status_code == 200
        except:
            return False

    def search(self, query: str, model_weight: float):
        """Execute search and apply intelligent ranking with adjustable weights"""

        if not query:
            return None, "Please enter query term", "", ""

        # Check Lettuce availability
        if not self.lettuce_available:
            self.lettuce_available = self.check_lettuce_status()
            if not self.lettuce_available:
                return None, "Error: Lettuce service is not running. Please start it with: uv run --env-file .env python app.py", "", ""

        self.current_query = query
        self.current_model_weight = model_weight

        # Get results from Lettuce
        print(f"Searching for: {query}")  # 添加调试信息
        raw_results = get_lettuce_data(query, num_results=12)

        if raw_results.empty:
            # 重新检查Lettuce状态
            self.lettuce_available = self.check_lettuce_status()
            if not self.lettuce_available:
                return None, "Lettuce service connection lost. Please restart the service.", "", ""
            else:
                return None, "No results found for the query. Please try a different term.", "", ""

        documents = raw_results.to_dict('records')

        # Always use AI and preference learning with adjustable weights
        reranked_docs = self.hybrid_reranker.rerank(query, documents, model_weight)
        self.current_results = pd.DataFrame(reranked_docs)

        # Prepare display
        display_df = self.current_results[[
            'Rank', 'Concept_Name', 'Concept_ID', 'Domain', 'Class',
            'Vocabulary_ID', 'Similarity_Score', 'Model_Score', 'Rating',
            'Feature_Similarity', 'Final_Score'
        ]].copy()

        # Format scores
        for col in ['Similarity_Score', 'Model_Score', 'Feature_Similarity', 'Final_Score']:
            if col in display_df.columns:
                display_df[col] = display_df[col].round(2)

        status = f"Found {len(reranked_docs)} results (AI intelligent ranking + preference learning)"

        # Get user preference information
        user_profile = self.hybrid_reranker.preference_manager.get_user_preference_profile()

        # Calculate feature weight
        feature_weight = 1.0 - model_weight

        info = f"""**Ranking Strategy:**
- AI model weight: {model_weight:.1%}
- Feature similarity: {feature_weight:.1%}

**User Preference Learning:**
- Historical selection count: {user_profile['total_selections']}
- Preference features: {len(user_profile['feature_preferences'])} dimensions

**Qwen3-Reranker Status:**
{'Connected' if self.hybrid_reranker.qwen_reranker.model_available else 'Not connected'}

**Lettuce Status:**
{'Connected' if self.lettuce_available else 'Not connected'}
"""

        # Generate preference report
        pref_report = self._generate_preference_report(user_profile)

        return display_df, status, info, pref_report

    def _generate_preference_report(self, user_profile: Dict) -> str:
        """Generate user preference report"""

        report = "### User Preference Analysis Report\n\n"

        # Display current weight settings
        weight_prefs = user_profile.get('weight_preferences', {"model_weight": 0.5, "feature_weight": 0.5})
        report += f"**Current Weight Settings:**\n"
        report += f"- Model Weight: {weight_prefs['model_weight']:.1%}\n"
        report += f"- Feature Weight: {weight_prefs['feature_weight']:.1%}\n\n"

        feature_prefs = user_profile.get('feature_preferences', {})

        if feature_prefs:
            report += "**Preference Feature Distribution:**\n\n"

            for feature, values in feature_prefs.items():
                if values:
                    report += f"*{feature}:*\n"
                    sorted_values = sorted(values.items(), key=lambda x: x[1], reverse=True)[:5]
                    for value, count in sorted_values:
                        report += f"  - {value}: {count} times\n"
                    report += "\n"
        else:
            report += "No preference data yet\n\n"

        recent = user_profile.get('recent_selections', [])
        if recent:
            report += f"**Recent selections ({len(recent)} items):**\n"
            for sel in recent[-5:]:
                if sel.get('selected_features'):
                    feat = sel['selected_features']
                    report += f"- {feat.get('concept_name')} ({feat.get('domain')})\n"

        return report

    def record_selection_with_rating(self, concept_id: str, rating: int):
        """Record user selection and rating"""

        if not self.current_query or not concept_id:
            return "Please search and select a concept first", ""

        if self.current_results is None:
            return "No search results", ""

        # Find selected item
        selected_rows = self.current_results[
            self.current_results['Concept_ID'] == concept_id
        ]

        if selected_rows.empty:
            return "Concept ID not found", ""

        selected_item = selected_rows.iloc[0].to_dict()

        # Record selection and rating
        selection_record = self.hybrid_reranker.preference_manager.record_selection(
            self.current_query, selected_item, rating
        )

        feedback = f"""Selection recorded:
- Concept: {selected_item['Concept_Name']}
- Domain: {selected_item.get('Domain')}
- Class: {selected_item.get('Class')}
- Rating: {rating} stars
"""

        # Update preference report
        user_profile = self.hybrid_reranker.preference_manager.get_user_preference_profile()
        updated_report = self._generate_preference_report(user_profile)

        return feedback, updated_report

    def reset_user_preferences(self):
        """Reset all user preferences"""
        success = self.hybrid_reranker.preference_manager.reset_preferences()
        if success:
            # Update current weight to default
            self.current_model_weight = 0.5
            return "Preferences reset successfully!", self._generate_preference_report({
                "total_selections": 0,
                "feature_preferences": {},
                "recent_selections": [],
                "weight_preferences": {"model_weight": 0.5, "feature_weight": 0.5}
            })
        else:
            return "Failed to reset preferences", ""

    def export_user_preferences(self):
        """Export user preferences to file"""
        try:
            export_path = self.hybrid_reranker.preference_manager.export_preferences()
            return f"Preferences exported to: {export_path}", ""
        except Exception as e:
            return f"Export failed: {str(e)}", ""

    def import_user_preferences(self, file_path: str):
        """Import user preferences from file"""
        if not file_path:
            return "Please provide a file path", ""
        
        success = self.hybrid_reranker.preference_manager.import_preferences(file_path)
        if success:
            # Update current weight from imported preferences
            user_profile = self.hybrid_reranker.preference_manager.get_user_preference_profile()
            weight_prefs = user_profile.get('weight_preferences', {"model_weight": 0.5, "feature_weight": 0.5})
            self.current_model_weight = weight_prefs['model_weight']
            
            updated_report = self._generate_preference_report(user_profile)
            return f"Preferences imported successfully from: {file_path}", updated_report
        else:
            return "Import failed - please check file format and path", ""

    def get_preference_visualization_data(self):
        """Get data for preference visualization"""
        stats = self.hybrid_reranker.preference_manager.get_preference_statistics()
        
        # Create visualization HTML
        viz_html = self._create_preference_charts(stats)
        return viz_html

    def _create_preference_charts(self, stats: Dict) -> str:
        """Create HTML charts for preference visualization"""
        html = """
        <div style="padding: 20px; background: #f8f9fa; border-radius: 10px;">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">User Preference Analytics</h3>
        """
        
        # Overview statistics
        html += f"""
        <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); min-width: 150px;">
                <h4 style="margin: 0; color: #3498db;">Total Selections</h4>
                <p style="font-size: 24px; margin: 5px 0 0 0; font-weight: bold; color: #2c3e50;">{stats['total_selections']}</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); min-width: 150px;">
                <h4 style="margin: 0; color: #e74c3c;">Total Ratings</h4>
                <p style="font-size: 24px; margin: 5px 0 0 0; font-weight: bold; color: #2c3e50;">{stats['total_ratings']}</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); min-width: 150px;">
                <h4 style="margin: 0; color: #f39c12;">Current Model Weight</h4>
                <p style="font-size: 24px; margin: 5px 0 0 0; font-weight: bold; color: #2c3e50;">{stats['weight_history'].get('model_weight', 0.5):.1%}</p>
            </div>
        </div>
        """
        
        # Feature distribution charts
        if stats['feature_distribution']:
            html += """
            <div style="background: white; padding: 15px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="color: #2c3e50; margin-bottom: 15px;">Feature Preferences</h4>
            """
            
            for feature, values in stats['feature_distribution'].items():
                if values:
                    html += f"""
                    <div style="margin-bottom: 15px;">
                        <h5 style="color: #34495e; margin-bottom: 8px;">{feature}</h5>
                        <div style="background: #ecf0f1; border-radius: 4px; padding: 8px;">
                    """
                    
                    # Create horizontal bar chart
                    max_count = max(values.values()) if values else 1
                    for item, count in list(values.items())[:5]:  # Top 5 items
                        percentage = (count / max_count) * 100
                        html += f"""
                        <div style="display: flex; align-items: center; margin-bottom: 4px;">
                            <div style="width: 100px; font-size: 12px; color: #7f8c8d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{item}</div>
                            <div style="flex: 1; margin: 0 10px;">
                                <div style="background: #bdc3c7; height: 20px; border-radius: 10px; overflow: hidden;">
                                    <div style="background: linear-gradient(90deg, #3498db, #2ecc71); height: 100%; width: {percentage}%; transition: width 0.3s;"></div>
                                </div>
                            </div>
                            <div style="width: 30px; font-size: 12px; color: #2c3e50; text-align: right; font-weight: bold;">{count}</div>
                        </div>
                        """
                    
                    html += "</div></div>"
            
            html += "</div>"
        
        # Rating distribution
        if any(stats['rating_distribution'].values()):
            html += """
            <div style="background: white; padding: 15px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="color: #2c3e50; margin-bottom: 15px;">Rating Distribution</h4>
                <div style="display: flex; gap: 10px; justify-content: space-around; flex-wrap: wrap;">
            """
            
            colors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#27ae60']
            for i, (rating, count) in enumerate(stats['rating_distribution'].items()):
                html += f"""
                <div style="text-align: center; min-width: 60px;">
                    <div style="background: {colors[i]}; color: white; padding: 10px; border-radius: 8px; margin-bottom: 5px;">
                        <div style="font-weight: bold; font-size: 18px;">{count}</div>
                    </div>
                    <div style="font-size: 12px; color: #7f8c8d;">{rating}</div>
                </div>
                """
            
            html += "</div></div>"
        
        # Recent activity timeline
        if stats['selection_timeline']:
            html += """
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="color: #2c3e50; margin-bottom: 15px;">Recent Activity</h4>
                <div style="max-height: 200px; overflow-y: auto;">
            """
            
            for activity in stats['selection_timeline'][-10:]:  # Last 10 activities
                html += f"""
                <div style="padding: 8px; margin-bottom: 5px; background: #f8f9fa; border-radius: 4px; border-left: 4px solid #3498db;">
                    <div style="display: flex; justify-content: between; align-items: center;">
                        <div style="flex: 1;">
                            <strong style="color: #2c3e50;">{activity.get('concept', 'Unknown')}</strong>
                            <div style="font-size: 12px; color: #7f8c8d;">Query: {activity.get('query', 'Unknown')}</div>
                        </div>
                        <div style="font-size: 11px; color: #95a5a6;">{activity.get('date', '')}</div>
                    </div>
                </div>
                """
            
            html += "</div></div>"
        
        html += "</div>"
        return html

    def check_model_status(self) -> str:
        """Check model and service status"""
        status = []

        # Check Lettuce
        self.lettuce_available = self.check_lettuce_status()
        if self.lettuce_available:
            status.append("Lettuce service: Connected")
        else:
            status.append("Lettuce service: Not connected")
            status.append("   Run: uv run --env-file .env python app.py")

        # Check Qwen3-Reranker
        if self.hybrid_reranker.qwen_reranker.check_model():
            status.append(f"Qwen3-Reranker: Ready ({self.hybrid_reranker.qwen_reranker.model_name})")
        else:
            status.append("Qwen3-Reranker: Not ready")
            status.append("   1. Start Ollama: ollama serve")
            status.append("   2. Pull model: ollama pull dengcao/Qwen3-Reranker-4B:Q5_K_M")

        return "\n".join(status)


def create_enhanced_app():
    """Create enhanced application interface with weight adjustment"""
    demo = EnhancedLearnToRankDemo()

    with gr.Blocks(title="Intelligent Medical Term Ranking System", theme=gr.themes.Soft()) as app:
        with gr.Row():
            with gr.Column(scale=1):
                gr.Markdown("### Search Settings")

                query_input = gr.Textbox(
                    label="Query term",
                    placeholder="Enter medical term, e.g.: acetaminophen",
                    value=""
                )


                gr.Markdown("---")
                gr.Markdown("### Weight Adjustment")
                gr.Markdown("Adjust the balance between AI model and feature similarity")

                # Weight adjustment slider
                model_weight_slider = gr.Slider(
                    label="AI Model Weight",
                    minimum=0.0,
                    maximum=1.0,
                    step=0.05,
                    value=demo.current_model_weight,
                )

                # Display feature weight
                feature_weight_display = gr.Textbox(
                    label="Feature Similarity Weight",
                    value=f"{1.0 - demo.current_model_weight:.2f}",
                    interactive=False,
                )

                # Weight adjustment visualization
                weight_viz = gr.Markdown(
                    value=f"""**Current Weight Distribution:**
                    
Model: {demo.current_model_weight:.0%} | Feature: {(1.0 - demo.current_model_weight):.0%}
                    """,
                    elem_id="weight-viz"
                )

                search_btn = gr.Button("Search", variant="primary")

                gr.Markdown("---")
                service_status = gr.Textbox(
                    label="Service Status",
                    interactive=False,
                    lines=5
                )
                check_btn = gr.Button("Check Status", size="sm")

                gr.Markdown("---")
                gr.Markdown("### Record Preference")
                gr.Markdown("Select a result and rate (1-5 stars)")

                with gr.Row():
                    concept_input = gr.Textbox(
                        label="Concept ID",
                        placeholder="Enter Concept ID"
                    )
                    rating_input = gr.Slider(
                        label="Rating",
                        minimum=1,
                        maximum=5,
                        step=1,
                        value=3
                    )

                record_btn = gr.Button("Record selection", variant="secondary")
                selection_feedback = gr.Textbox(
                    label="Feedback",
                    interactive=False
                )

                gr.Markdown("---")
                gr.Markdown("### Preference Management")
                gr.Markdown("Manage your learning preferences")

                with gr.Row():
                    reset_btn = gr.Button("Reset Preferences", size="sm", variant="stop")
                    export_btn = gr.Button("Export", size="sm")
                
                import_file = gr.Textbox(
                    label="Import file path",
                    placeholder="Enter path to preference file...",
                    scale=3
                )
                
                with gr.Row():
                    import_btn = gr.Button("Import", size="sm")
                    viz_btn = gr.Button("Show Analytics", size="sm", variant="secondary")

                preference_feedback = gr.Textbox(
                    label="Preference Management Feedback",
                    interactive=False,
                    lines=2
                )

            with gr.Column(scale=2):
                search_status = gr.Textbox(
                    label="Search status",
                    interactive=False
                )

                results_table = gr.DataFrame(
                    label="Search results",
                    interactive=False,
                    wrap=True
                )

                with gr.Row():
                    with gr.Column():
                        ranking_info = gr.Markdown(label="Ranking information")

                    with gr.Column():
                        preference_report = gr.Markdown(label="Preference report")

                # Preference Visualization Panel
                preference_analytics = gr.HTML(
                    label="Preference Analytics",
                    value="<div style='padding: 20px; text-align: center; color: #7f8c8d;'>Click 'Show Analytics' to view your preference insights</div>"
                )

        # Function to update feature weight and visualization when model weight changes
        def update_weights(model_weight):
            feature_weight = 1.0 - model_weight
            weight_viz_text = f"""**Current Weight Distribution:**
            
Model: {model_weight:.0%} | Feature: {feature_weight:.0%}
            """
            return f"{feature_weight:.2f}", weight_viz_text

        # Connect weight slider to update function
        model_weight_slider.change(
            update_weights,
            inputs=[model_weight_slider],
            outputs=[feature_weight_display, weight_viz]
        )

        # Event binding
        search_btn.click(
            demo.search,
            inputs=[query_input, model_weight_slider],
            outputs=[results_table, search_status, ranking_info, preference_report]
        )

        record_btn.click(
            demo.record_selection_with_rating,
            inputs=[concept_input, rating_input],
            outputs=[selection_feedback, preference_report]
        )

        check_btn.click(
            demo.check_model_status,
            outputs=[service_status]
        )

        # Preference management event binding
        reset_btn.click(
            demo.reset_user_preferences,
            outputs=[preference_feedback, preference_report]
        )

        export_btn.click(
            demo.export_user_preferences,
            outputs=[preference_feedback]
        )

        import_btn.click(
            demo.import_user_preferences,
            inputs=[import_file],
            outputs=[preference_feedback, preference_report]
        )

        viz_btn.click(
            demo.get_preference_visualization_data,
            outputs=[preference_analytics]
        )

        # Initialize
        app.load(
            demo.check_model_status,
            outputs=[service_status]
        )

    return app


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("   Intelligent Medical Term Learn to Rank System")
    print("   with Real Lettuce Integration")
    print("=" * 60)

    # Check Lettuce service
    print("\nChecking Lettuce service...")
    try:
        response = requests.get("http://127.0.0.1:8000/docs", timeout=10)
        if response.status_code == 200:
            print("Lettuce service is running")
        else:
            print("Lettuce service not responding properly")
    except:
        print("Cannot connect to Lettuce service")
        print("\nTo start Lettuce:")
        print("1. Navigate to lettuce directory")
        print("2. Run: uv run --env-file .env python app.py")
        print("\nSystem will NOT work without Lettuce service!")

    # Check Qwen3-Reranker model
    print("\nChecking Qwen3-Reranker model...")
    reranker = EnhancedQwen3Reranker()

    if not reranker.model_available:
        print("\nPlease install the required model:")
        print("\nPlease follow these steps to install the model:")
        print("\n1) Start Ollama service:")
        print("   ollama serve")
        print("\n2) Download Qwen3-Reranker model:")
        print("   ollama pull dengcao/Qwen3-Reranker-4B:Q5_K_M")
        print("\nPlease install the required model:")
    else:
        print(f"\nModel ready! Using: {reranker.model_name}")

    # Create and launch application
    app = create_enhanced_app()

    print("\n" + "=" * 20)
    print("\nSystem ready!")
    print("\nLaunching web interface...")
    print("Open in browser: http://127.0.0.1:7860")
    print("\nPress Ctrl+C to stop server")
    print("-" * 60)

    app.launch(
        server_name="127.0.0.1",
        server_port=7860,
        share=False,
        show_error=True
    )