"""
Author: Henry X
Date: 2025/10/16 9:12
File: routes.py
Description: [Add your description here]
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.schemas import (
    SearchRequest, HumanInterventionRequest, PipelineState,
    VisualizationData, Paper, PaperReviewDecision, SearchAgentOutput, KeywordModel, RevisingAgentOutput,
    SynthesisAgentOutput, KeywordSearchResult
)
from graph.workflow import ResearchWorkflow
from graph.state import AgentState
from services.intervention_service import InterventionService
from services.visualization_service import VisualizationService
from services.decision_history import DecisionHistoryService
import uuid
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["research"])

# Global variables
workflow = ResearchWorkflow()
viz_service = VisualizationService()
intervention_service = InterventionService()
history_service = DecisionHistoryService()

# Store active pipelines in memory
active_pipelines: Dict[str, PipelineState] = {}


@router.post("/pipeline/start", response_model=PipelineState)
async def start_pipeline(request: SearchRequest, background_tasks: BackgroundTasks):
    """
    Start a new research pipeline
    """
    pipeline_id = str(uuid.uuid4())

    # Initialize the state object
    initial_state = AgentState(
        original_query=request.query,
        pipeline_id=pipeline_id,
        search_keywords=[],
        raw_papers=[],
        search_reasoning="",
        accepted_papers=[],
        rejected_decisions=[],
        rejection_summary={},
        final_answer="",
        citations=[],
        answer_structure={},
        current_stage="initializing",
        human_interventions=[],
        errors=[],
        awaiting_human_review=False,
        human_feedback=None,
        keyword_search_results=[]
    )

    # Create a new execution in the decision history
    history_service.create_execution(pipeline_id, request.query)

    # Start the search agent in a background task
    background_tasks.add_task(run_search_stage, pipeline_id, initial_state)

    # return the state object
    pipeline_state = PipelineState(
        pipeline_id=pipeline_id,
        stage="search",
    )
    active_pipelines[pipeline_id] = pipeline_state

    logger.info(f"Started pipeline: {pipeline_id}")
    return pipeline_state


async def run_search_stage(pipeline_id: str, state: AgentState):
    """Searches for papers based on the original query"""
    try:
        # Only run the search agent if it hasn't already been run
        updated_state = await workflow.search_agent.process(state)

        # Update the active pipeline state
        pipeline = active_pipelines[pipeline_id]
        pipeline.stage = "search_complete"

        # Searches for papers based on the search keywords
        pipeline.search_output = SearchAgentOutput(
            keywords=updated_state["search_keywords"],
            keyword_results=updated_state["keyword_search_results"],
            papers=updated_state["raw_papers"],
            papers_by_keyword={},
            reasoning=updated_state["search_reasoning"],
            total_papers_before_dedup=sum(
                kr.papers_count for kr in updated_state["keyword_search_results"]
            )
        )

        # calculate papers_by_keyword
        papers_by_keyword = {}
        for result in updated_state["keyword_search_results"]:
            papers_by_keyword[result.keyword.keyword] = [
                p.id for p in result.papers
            ]
        pipeline.search_output.papers_by_keyword = papers_by_keyword

        logger.info(f"Search stage completed for {pipeline_id}")

    except Exception as e:
        logger.error(f"Search stage failed for {pipeline_id}: {e}")
        active_pipelines[pipeline_id].stage = "error"


@router.get("/pipeline/{pipeline_id}", response_model=PipelineState)
async def get_pipeline_status(pipeline_id: str):
    """get the status of a pipeline"""
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    return active_pipelines[pipeline_id]


@router.get("/pipeline/{pipeline_id}/visualization", response_model=VisualizationData)
async def get_visualization(pipeline_id: str):
    """get the visualization of a pipeline"""
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline_state = active_pipelines[pipeline_id]
    return viz_service.generate_visualization(pipeline_state)


@router.post("/pipeline/{pipeline_id}/intervention")
async def apply_human_intervention(
        pipeline_id: str,
        intervention: HumanInterventionRequest
):
    """
    1. edit_keywords
       {
           "action_type": "edit_keywords",
           "details": {
               "add_keywords": [{"keyword": "new_kw", "importance": 0.9}],
               "remove_keywords": ["old_kw"],
               "edit_keywords": {"old": "new"},
               "adjust_importance": {"kw1": 0.8}
           }
       }

    2. adjust_keyword_results
       {
           "action_type": "adjust_keyword_results",
           "details": {
               "keyword": "interpretability",
               "action": "remove_paper",
               "paper_id": "arxiv_123"
           }
       }

    3. override_paper
       {
           "action_type": "override_paper",
           "details": {
               "paper_id": "arxiv_456",
               "action": "accept",
               "reason": "This paper is actually relevant"
           }
       }

    4. edit_answer
       {
           "action_type": "edit_answer",
           "details": {
               "edited_answer": "New answer text..."
           }
       }
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]

    # InterventionService
    result = await intervention_service.apply_intervention(pipeline, intervention)

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])

    return result


@router.get("/pipeline/{pipeline_id}/interventions")
async def get_intervention_history(pipeline_id: str):
    """get intervention history for a pipeline"""
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]
    return {
        "pipeline_id": pipeline_id,
        "total_interventions": len(pipeline.human_interventions),
        "interventions": pipeline.human_interventions
    }


@router.post("/pipeline/{pipeline_id}/continue")
async def continue_pipeline(pipeline_id: str, background_tasks: BackgroundTasks):
    """
    continue a pipeline from the current stage
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]

    logger.info(f"Continue request for pipeline {pipeline_id}, current stage: {pipeline.stage}")

    if pipeline.stage == "search_complete":
        # Revising Agent
        pipeline.stage = "revising"
        background_tasks.add_task(run_revising_stage, pipeline_id)
        return {
            "status": "success",
            "message": "Starting revising stage",
            "next_stage": "revising"
        }

    elif pipeline.stage == "revising_complete":
        # Synthesis Agent
        pipeline.stage = "synthesis"
        background_tasks.add_task(run_synthesis_stage, pipeline_id)
        return {
            "status": "success",
            "message": "Starting synthesis stage",
            "next_stage": "synthesis"
        }

    elif pipeline.stage == "completed":
        return {
            "status": "completed",
            "message": "Pipeline already completed"
        }

    elif pipeline.stage in ["search", "revising", "synthesis"]:
        return {
            "status": "running",
            "message": f"Stage '{pipeline.stage}' is still running, please wait"
        }

    else:
        return {
            "status": "error",
            "message": f"Cannot continue from stage '{pipeline.stage}'"
        }


async def run_revising_stage(pipeline_id: str):
    """ Revising Agent"""
    try:
        pipeline = active_pipelines[pipeline_id]

        state = AgentState(
            original_query=pipeline.search_output.reasoning.split("'")[1] if pipeline.search_output else "",
            pipeline_id=pipeline_id,
            search_keywords=pipeline.search_output.keywords,
            keyword_search_results=pipeline.search_output.keyword_results,
            raw_papers=pipeline.search_output.papers,
            search_reasoning=pipeline.search_output.reasoning,
            accepted_papers=[],
            rejected_decisions=[],
            rejection_summary={},
            final_answer="",
            citations=[],
            answer_structure={},
            current_stage="revising",
            human_interventions=[],
            errors=[],
            awaiting_human_review=False,
            human_feedback=None
        )

        updated_state = await workflow.revising_agent.process(state)

        # Update state
        pipeline.stage = "revising_complete"
        pipeline.revising_output = RevisingAgentOutput(
            accepted_papers=updated_state["accepted_papers"],
            rejected_papers=updated_state["rejected_decisions"],
            rejection_summary=updated_state["rejection_summary"]
        )

        logger.info(f"Revising stage completed for {pipeline_id}")

    except Exception as e:
        logger.error(f"Revising stage failed for {pipeline_id}: {e}")
        pipeline.stage = "error"


async def run_synthesis_stage(pipeline_id: str):
    """Synthesis Agent"""
    try:
        pipeline = active_pipelines[pipeline_id]

        state = AgentState(
            original_query=pipeline.search_output.reasoning.split("'")[1] if pipeline.search_output else "",
            pipeline_id=pipeline_id,
            search_keywords=pipeline.search_output.keywords,
            keyword_search_results=pipeline.search_output.keyword_results,
            raw_papers=pipeline.search_output.papers,
            search_reasoning=pipeline.search_output.reasoning,
            accepted_papers=pipeline.revising_output.accepted_papers,
            rejected_decisions=pipeline.revising_output.rejected_papers,
            rejection_summary=pipeline.revising_output.rejection_summary,
            final_answer="",
            citations=[],
            answer_structure={},
            current_stage="synthesis",
            human_interventions=[],
            errors=[],
            awaiting_human_review=False,
            human_feedback=None
        )

        updated_state = await workflow.synthesis_agent.process(state)

        # Update state
        pipeline.stage = "completed"
        pipeline.synthesis_output = SynthesisAgentOutput(
            answer=updated_state["final_answer"],
            citations=updated_state["citations"],
            confidence_score=0.85,
            structure=updated_state["answer_structure"]
        )

        # Finish execution
        history_service.complete_execution(pipeline_id)

        logger.info(f"Synthesis stage completed for {pipeline_id}")

    except Exception as e:
        logger.error(f"Synthesis stage failed for {pipeline_id}: {e}")
        pipeline.stage = "error"


@router.get("/pipeline/{pipeline_id}/history")
async def get_decision_history(pipeline_id: str):
    """Get decision history for a pipeline"""
    return history_service.export_execution_report(pipeline_id)


@router.get("/pipeline/{pipeline_id}/papers/rejected", response_model=List[PaperReviewDecision])
async def get_rejected_papers(pipeline_id: str):
    """Get all rejected papers for a pipeline"""
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]
    if not pipeline.revising_output:
        return []

    return pipeline.revising_output.rejected_papers


@router.get("/pipeline/{pipeline_id}/keywords", response_model=List[KeywordSearchResult])
async def get_keyword_results(pipeline_id: str):
    """
    Get all keywords and their search results for a pipeline

    [
        {
            "keyword": {"keyword": "interpretability", "importance": 1.0},
            "papers": [...],
            "papers_count": 15
        },
        ...
    ]
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]
    if not pipeline.search_output:
        return []

    return pipeline.search_output.keyword_results


@router.get("/pipeline/{pipeline_id}/papers/by-keyword/{keyword}")
async def get_papers_by_keyword(pipeline_id: str, keyword: str):
    """
    Get all papers for a keyword in a pipeline

    GET /pipeline/xxx/papers/by-keyword/interpretability
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]
    if not pipeline.search_output:
        return {"papers": []}

    # Find the keyword result for the given keyword
    keyword_result = next(
        (kr for kr in pipeline.search_output.keyword_results if kr.keyword.keyword == keyword),
        None
    )

    if not keyword_result:
        raise HTTPException(status_code=404, detail=f"Keyword '{keyword}' not found")

    return {
        "keyword": keyword,
        "papers_count": keyword_result.papers_count,
        "papers": keyword_result.papers
    }


@router.get("/pipeline/{pipeline_id}/stats")
async def get_search_statistics(pipeline_id: str):
    """
    Get search statistics for a pipeline

    {
        "total_keywords": 3,
        "total_papers_before_dedup": 45,
        "total_unique_papers": 32,
        "duplicates_removed": 13,
        "keyword_breakdown": {
            "interpretability": 15,
            "explainability": 18,
            "transparency": 12
        }
    }
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]
    if not pipeline.search_output:
        return {"error": "Search not completed yet"}

    keyword_breakdown = {
        kr.keyword.keyword: kr.papers_count
        for kr in pipeline.search_output.keyword_results
    }

    return {
        "total_keywords": len(pipeline.search_output.keywords),
        "total_papers_before_dedup": pipeline.search_output.total_papers_before_dedup,
        "total_unique_papers": len(pipeline.search_output.papers),
        "duplicates_removed": pipeline.search_output.total_papers_before_dedup - len(pipeline.search_output.papers),
        "keyword_breakdown": keyword_breakdown
    }
