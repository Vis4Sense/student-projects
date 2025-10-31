"""
Author: Henry X
Date: 2025/10/16 9:12
File: routes.py
Description: [Add your description here]
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
import json
from fastapi.responses import StreamingResponse
from models.chat_model import ChatRequest, ChatResponse
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


@router.post("/chat", response_model=ChatResponse, tags=["chat"])
async def chat(request: ChatRequest):
    """
    Non-streaming chat endpoint

    Send messages and get a complete response

    - **messages**: List of chat messages with role and content
    - Returns the complete AI response
    """
    try:
        logger.info(f"Received chat request with {len(request.messages)} messages")

        # Import llm_service here to avoid circular imports
        from services.llm_service import llm_service

        # Convert ChatMessage to dict format
        messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]

        response = await llm_service.chat(messages_dict)
        return ChatResponse(message=response)

    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/stream", tags=["chat"])
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint

    Send messages and get a streaming response in SSE format

    - **messages**: List of chat messages with role and content
    - Returns Server-Sent Events (SSE) streaming response
    - Each data chunk format: `data: {"content": "..."}`
    - End marker: `data: [DONE]`
    """

    async def generate():
        try:
            logger.info(f"Starting stream for {len(request.messages)} messages")

            # Import llm_service here to avoid circular imports
            from services.llm_service import llm_service

            # Convert ChatMessage to dict format
            messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]

            chunk_count = 0
            async for chunk in llm_service.chat_stream(messages_dict):
                chunk_count += 1
                # SSE format
                yield f"data: {json.dumps({'content': chunk}, ensure_ascii=False)}\n\n"

            logger.info(f"Stream completed with {chunk_count} chunks")
            yield "data: [DONE]\n\n"

        except Exception as e:
            logger.error(f"Stream error: {str(e)}")
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable Nginx buffering
        }
    )


@router.post("/pipeline/run-full", response_model=PipelineState)
async def run_full_pipeline(request: SearchRequest):
    """
    Run the complete research pipeline from start to finish without interruption

    This endpoint executes all three stages sequentially:
    1. Search Agent - Generate keywords and retrieve papers
    2. Revising Agent - Filter and review papers
    3. Synthesis Agent - Generate final answer with citations

    Returns the complete pipeline state with all results.
    """
    pipeline_id = str(uuid.uuid4())

    try:
        logger.info(f"Starting full pipeline: {pipeline_id} with query: {request.query}")

        # ============================================================
        # Stage 1: Search Agent
        # ============================================================
        logger.info(f"[{pipeline_id}] Stage 1/3: Search Agent")

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
            current_stage="search",
            human_interventions=[],
            errors=[],
            awaiting_human_review=False,
            human_feedback=None,
            keyword_search_results=[]
        )

        # Create execution in history
        history_service.create_execution(pipeline_id, request.query)

        # Execute search agent
        search_state = await workflow.search_agent.process(initial_state)

        # Build search output
        search_output = SearchAgentOutput(
            keywords=search_state["search_keywords"],
            keyword_results=search_state["keyword_search_results"],
            papers=search_state["raw_papers"],
            papers_by_keyword={},
            reasoning=search_state["search_reasoning"],
            total_papers_before_dedup=sum(
                kr.papers_count for kr in search_state["keyword_search_results"]
            )
        )

        # Calculate papers_by_keyword
        papers_by_keyword = {}
        for result in search_state["keyword_search_results"]:
            papers_by_keyword[result.keyword.keyword] = [
                p.id for p in result.papers
            ]
        search_output.papers_by_keyword = papers_by_keyword

        logger.info(f"[{pipeline_id}] Search completed: {len(search_state['raw_papers'])} papers found")

        # ============================================================
        # Stage 2: Revising Agent
        # ============================================================
        logger.info(f"[{pipeline_id}] Stage 2/3: Revising Agent")

        revising_state = AgentState(
            original_query=request.query,  # 直接使用 request.query
            pipeline_id=pipeline_id,
            search_keywords=search_state["search_keywords"],
            keyword_search_results=search_state["keyword_search_results"],
            raw_papers=search_state["raw_papers"],
            search_reasoning=search_state["search_reasoning"],
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

        # Execute revising agent
        revising_state = await workflow.revising_agent.process(revising_state)

        # Build revising output
        revising_output = RevisingAgentOutput(
            accepted_papers=revising_state["accepted_papers"],
            rejected_papers=revising_state["rejected_decisions"],
            rejection_summary=revising_state["rejection_summary"]
        )

        logger.info(f"[{pipeline_id}] Revising completed: {len(revising_state['accepted_papers'])} papers accepted")

        # ============================================================
        # Stage 3: Synthesis Agent
        # ============================================================
        logger.info(f"[{pipeline_id}] Stage 3/3: Synthesis Agent")

        synthesis_state = AgentState(
            original_query=request.query,
            pipeline_id=pipeline_id,
            search_keywords=search_state["search_keywords"],
            keyword_search_results=search_state["keyword_search_results"],
            raw_papers=search_state["raw_papers"],
            search_reasoning=search_state["search_reasoning"],
            accepted_papers=revising_state["accepted_papers"],
            rejected_decisions=revising_state["rejected_decisions"],
            rejection_summary=revising_state["rejection_summary"],
            final_answer="",
            citations=[],
            answer_structure={},
            current_stage="synthesis",
            human_interventions=[],
            errors=[],
            awaiting_human_review=False,
            human_feedback=None
        )

        # Execute synthesis agent
        synthesis_state = await workflow.synthesis_agent.process(synthesis_state)

        # Build synthesis output
        synthesis_output = SynthesisAgentOutput(
            answer=synthesis_state["final_answer"],
            citations=synthesis_state["citations"],
            confidence_score=0.85,
            structure=synthesis_state["answer_structure"]
        )

        logger.info(f"[{pipeline_id}] Synthesis completed")

        # ============================================================
        # Build final pipeline state
        # ============================================================
        pipeline_state = PipelineState(
            pipeline_id=pipeline_id,
            stage="completed",
            search_output=search_output,
            revising_output=revising_output,
            synthesis_output=synthesis_output
        )

        # Store in active pipelines
        active_pipelines[pipeline_id] = pipeline_state

        # Complete execution in history
        history_service.complete_execution(pipeline_id)

        logger.info(f"[{pipeline_id}] Full pipeline completed successfully")

        return pipeline_state

    except Exception as e:
        logger.error(f"[{pipeline_id}] Full pipeline failed: {e}")

        # Create error state
        error_state = PipelineState(
            pipeline_id=pipeline_id,
            stage="error"
        )
        active_pipelines[pipeline_id] = error_state

        raise HTTPException(
            status_code=500,
            detail=f"Pipeline execution failed: {str(e)}"
        )


@router.get("/pipeline/{pipeline_id}/summary")
async def get_pipeline_summary(pipeline_id: str):
    """
    Get a concise summary of the completed pipeline

    Useful for quickly checking the results of a full pipeline run.
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]

    summary = {
        "pipeline_id": pipeline_id,
        "stage": pipeline.stage
    }

    # Search summary
    if pipeline.search_output:
        summary["search"] = {
            "keywords_count": len(pipeline.search_output.keywords),
            "total_papers_found": pipeline.search_output.total_papers_before_dedup,
            "unique_papers": len(pipeline.search_output.papers),
            "duplicates_removed": pipeline.search_output.total_papers_before_dedup - len(pipeline.search_output.papers)
        }

    # Revising summary
    if pipeline.revising_output:
        summary["revising"] = {
            "papers_reviewed": len(pipeline.revising_output.accepted_papers) + len(
                pipeline.revising_output.rejected_papers),
            "accepted": len(pipeline.revising_output.accepted_papers),
            "rejected": len(pipeline.revising_output.rejected_papers),
            "rejection_reasons": pipeline.revising_output.rejection_summary
        }

    # Synthesis summary
    if pipeline.synthesis_output:
        summary["synthesis"] = {
            "answer_length": len(pipeline.synthesis_output.answer),
            "citations_count": len(pipeline.synthesis_output.citations),
            "confidence_score": pipeline.synthesis_output.confidence_score,
            "sections": list(pipeline.synthesis_output.structure.keys()) if pipeline.synthesis_output.structure else []
        }

    return summary
