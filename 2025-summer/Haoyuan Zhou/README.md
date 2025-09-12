# Intelligent Medical Term Ranking System (LTR - Learn to Rank)

## Project Overview

This is an intelligent medical term ranking system based on machine learning and user preference learning. The system integrates advanced AI re-ranking technology and can automatically optimize the search ranking results of medical concepts based on users' historical choices and preferences.

## Core Features

### 1. Intelligent Search and Ranking
- **Lettuce Integration**: Deep integration with Lettuce medical term mapping service to obtain high-quality OMOP concept mapping results
- **AI Re-ranking**: Uses Qwen3-Reranker-4B model for intelligent re-ranking
- **Hybrid Ranking Strategy**: Combines AI model scores and feature similarity to provide optimal ranking results

### 2. User Preference Learning
- **Automatic Learning**: The system automatically learns user selection behaviors and preference patterns
- **Feature Analysis**: Analyzes user preferences for medical domains, concept classes, and vocabularies
- **Personalized Ranking**: Personalizes search results based on learned preferences

### 3. Adjustable Weight System
- **Dynamic Weights**: Supports real-time adjustment of the balance between AI model weights and feature similarity weights
- **Preference Storage**: User weight configurations are permanently saved
- **Flexible Configuration**: Provides 0-100% weight adjustment range

### 4. User Rating System
- **Star Rating**: Supports 1-5 star concept rating system
- **Explicit Feedback**: Records explicit user ratings for specific queries and concepts
- **Intelligent Application**: Rating data automatically influences subsequent ranking results

### 5. Preference Management
- **Data Import/Export**: Supports backup and recovery of user preference data
- **Preference Reset**: One-click reset of all learning data
- **Visual Analytics**: Provides detailed preference statistics and visualization charts

## Technical Architecture

### Core Components

1. **UserPreferenceManager** - User Preference Manager
   - Responsible for storing and retrieving user selection records
   - Manages feature preference statistics and weight configurations
   - Provides data import/export functionality

2. **EnhancedQwen3Reranker** - Enhanced Qwen3 Re-ranker
   - Integrates with Ollama service to call Qwen3-Reranker-4B model
   - Constructs intelligent prompts based on preferences
   - Processes model output and performs result parsing

3. **IntelligentHybridReranker** - Intelligent Hybrid Re-ranker
   - Combines AI model scores and feature similarity
   - Implements adjustable weight hybrid ranking strategy
   - Integrates explicit ratings and implicit preferences

4. **EnhancedLearnToRankDemo** - Enhanced Learn-to-Rank Demo System
   - Provides complete web interface
   - Handles user interactions and data management
   - Generates preference analysis reports

### Technology Stack

- **Backend**: Python 3.8+
- **Web Framework**: Gradio
- **Data Processing**: Pandas, NumPy
- **HTTP Client**: Requests
- **AI Model**: Qwen3-Reranker-4B (via Ollama)
- **Data Storage**: JSON files
- **Medical Term Service**: Lettuce API

## Installation Requirements

### System Dependencies
```bash
Python >= 3.8
Ollama Service
Lettuce Medical Term Mapping Service
```

### Python Package Dependencies
```bash
pip install gradio pandas numpy requests
```

### AI Model Installation
```bash
# Start Ollama service
ollama serve

# Download Qwen3-Reranker model
ollama pull dengcao/Qwen3-Reranker-4B:Q5_K_M
```

### Lettuce Service Configuration
```bash
# Start service in Lettuce directory
cd Lettuce
uv run --env-file .env python app.py
```

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start Service Dependencies

**Start Lettuce Service:**
```bash
cd Lettuce
python app.py
```

**Start Ollama Service:**
```bash
ollama serve
ollama pull dengcao/Qwen3-Reranker-4B:Q5_K_M
```

### 3. Run System
```bash
python 2.py
```

### 4. Access Web Interface
Open browser and visit: `http://127.0.0.1:7860`

## Usage Guide

### Basic Search
1. Enter medical terms in the search box, e.g., "acetaminophen"
2. Adjust AI model weight slider (0-100%)
3. Click "Search" button to get ranking results

### Record Preferences
1. Copy concept ID from search results
2. Paste concept ID in "Record Preference" area
3. Select rating (1-5 stars)
4. Click "Record Selection"

### Weight Adjustment
- **High AI Model Weight**: More reliant on AI model's semantic understanding capabilities
- **High Feature Similarity Weight**: More reliant on user historical preference patterns

### Preference Management
- **Reset Preferences**: Clear all learning data
- **Export Preferences**: Backup current preference settings
- **Import Preferences**: Restore previous preference settings
- **View Analytics**: Display detailed preference statistics charts

## Data Structure

### User Preference Data Structure
```json
{
  "user_selections": [
    {
      "timestamp": "2024-09-12T10:30:00",
      "query": "acetaminophen",
      "selected_features": {
        "concept_name": "Acetaminophen",
        "concept_id": "1125315",
        "domain": "Drug",
        "class": "Ingredient"
      },
      "rating": 5
    }
  ],
  "feature_preferences": {
    "Domain": {"Drug": 15, "Procedure": 8},
    "Class": {"Ingredient": 12, "Clinical Drug": 6}
  },
  "explicit_ratings": {
    "acetaminophen_1125315": 5
  },
  "weight_preferences": {
    "model_weight": 0.6,
    "feature_weight": 0.4
  }
}
```

## Configuration

### Service Endpoint Configuration
- **Lettuce API**: `http://127.0.0.1:8000/pipeline/`
- **Ollama API**: `http://localhost:11434`
- **Web Interface**: `http://127.0.0.1:7860`

### Performance Parameters
- **Search Result Count**: Default 15 results
- **Display Result Count**: Top 12 results
- **Re-ranking Timeout**: 30 seconds
- **Lettuce Timeout**: 120 seconds (first load requires longer time)

## Troubleshooting

### Common Issues

**1. Lettuce Service Connection Failed**
```
Solutions:
- Confirm Lettuce service is running
- Check if port 8000 is occupied
- View Lettuce service logs
```

**2. Qwen3-Reranker Model Unavailable**
```
Solutions:
- Start Ollama service: ollama serve
- Download model: ollama pull dengcao/Qwen3-Reranker-4B:Q5_K_M
- Check if model is successfully installed: ollama list
```

**3. Empty Search Results**
```
Solutions:
- Check if query term is a valid medical term
- Confirm Lettuce service responds normally
- Try using example query term: "acetaminophen"
```

### Log Information
The system outputs detailed runtime logs to the console, including:
- Service connection status
- Search request processing
- Model call results
- Error information and retry records






## Dataset and Resources

### OMOP Medical Concept Dataset
This system uses standardized medical concept datasets provided by OHDSI:
- **ATHENA Concept Search**: [https://athena.ohdsi.org/search-terms/start](https://athena.ohdsi.org/search-terms/start)
- **Data Standard**: OMOP Common Data Model (CDM)
- **Vocabularies**: Includes major medical standard vocabularies such as SNOMED CT, ICD-10, RxNorm, LOINC, etc.

## Acknowledgments

Thanks to the following open source projects and services:
- [ATHENA](https://athena.ohdsi.org/) - OHDSI Standardized Medical Concept Dataset
- [Lettuce](https://github.com/lettuce-project) - Medical Term Mapping Service
- [Ollama](https://ollama.ai/) - Local AI Model Service
- [Qwen3-Reranker](https://huggingface.co/dengcao/Qwen3-Reranker-4B) - AI Re-ranking Model
- [Gradio](https://gradio.app/) - Web Interface Framework
- [OMOP CDM](https://www.ohdsi.org/data-standardization/) - Medical Data Standard

---

**Last Updated**: September 12, 2025