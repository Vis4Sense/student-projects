"""
Author: Henry X
Date: 2025/10/16 9:12
File: routes.py
Description: [Add your description here]
"""
import numpy as np
from fastapi import APIRouter, HTTPException, BackgroundTasks
import json
from fastapi.responses import StreamingResponse
from models.chat_model import ChatRequest, ChatResponse
from models.schemas import (
    SearchRequest, HumanInterventionRequest, PipelineState,
    VisualizationData, Paper, PaperReviewDecision, SearchAgentOutput, KeywordModel, RevisingAgentOutput,
    SynthesisAgentOutput, KeywordSearchResult, QueryRecord, SemanticDelta
)
from graph.workflow import ResearchWorkflow
from graph.state import AgentState
from services.embed_service import embed_service
from services.intervention_service import InterventionService
from services.llm_service import LLMService
from services.paperVisualizationService import paper_visualization_service
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
llm_service = LLMService()
embed_service = embed_service
paper_visualization_service = paper_visualization_service

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

    query_record = QueryRecord(query_text=request.query, parent_query=None, status="pending")
    pipeline_state.query_history.append(query_record)

    logger.info(f"Started pipeline: {pipeline_id}")
    return pipeline_state


async def run_search_stage(pipeline_id: str, state: AgentState, mode="manual"):
    """Searches for papers based on the original query"""
    try:
        # Only run the search agent if it hasn't already been run
        updated_state = await workflow.search_agent.process(state, mode)

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

        # Add papers to history papers list
        pipeline.historyPapers.extend(pipeline.search_output.papers)

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

        accepted_ids = {paper.id for paper in updated_state["accepted_papers"]}
        rejected_ids = {decision.paper_id for decision in updated_state["rejected_decisions"]}

        for paper in pipeline.historyPapers:
            if paper.id in accepted_ids:
                paper.human_tag = "accepted"
            elif paper.id in rejected_ids:
                paper.human_tag = "rejected"

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

        original_query = ""
        if pipeline.search_output and pipeline.search_output.reasoning:
            try:
                reasoning_text = pipeline.search_output.reasoning
                if "Based on query '" in reasoning_text and "', generated" in reasoning_text:
                    start = reasoning_text.find("Based on query '") + len("Based on query '")
                    end = reasoning_text.find("', generated", start)
                    original_query = reasoning_text[start:end]
            except (IndexError, AttributeError):
                pass

        for record in pipeline.query_history:
            if record.query_text == original_query:
                record.status = "completed"
                # copy the pipeline.search_output to the record.output
                record.output = pipeline.synthesis_output.model_copy(deep=True)

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

        # Initialize pipeline state
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

        # Create initial pipeline state and store it
        pipeline_state = PipelineState(
            pipeline_id=pipeline_id,
            stage="search",
            search_output=None,
            revising_output=None,
            synthesis_output=None
        )

        query_record = QueryRecord(query_text=request.query, parent_query=None, status="pending")
        pipeline_state.query_history.append(query_record)
        active_pipelines[pipeline_id] = pipeline_state

        # Create execution in history
        history_service.create_execution(pipeline_id, request.query)

        # ============================================================
        # Stage 1: Search Agent
        # ============================================================
        logger.info(f"[{pipeline_id}] Stage 1/3: Search Agent")
        await run_search_stage(pipeline_id, initial_state, mode="auto")

        if active_pipelines[pipeline_id].stage == "error":
            raise Exception("Search stage failed")

        logger.info(f"[{pipeline_id}] Search completed: {len(active_pipelines[pipeline_id].search_output.papers)} papers found")

        # ============================================================
        # Stage 2: Revising Agent
        # ============================================================
        logger.info(f"[{pipeline_id}] Stage 2/3: Revising Agent")
        await run_revising_stage(pipeline_id)

        if active_pipelines[pipeline_id].stage == "error":
            raise Exception("Revising stage failed")

        logger.info(f"[{pipeline_id}] Revising completed: {len(active_pipelines[pipeline_id].revising_output.accepted_papers)} papers accepted")

        # ============================================================
        # Stage 3: Synthesis Agent
        # ============================================================
        logger.info(f"[{pipeline_id}] Stage 3/3: Synthesis Agent")
        await run_synthesis_stage(pipeline_id)

        if active_pipelines[pipeline_id].stage == "error":
            raise Exception("Synthesis stage failed")

        logger.info(f"[{pipeline_id}] Synthesis completed")

        # ============================================================
        # Return final pipeline state
        # ============================================================
        final_pipeline_state = active_pipelines[pipeline_id]
        logger.info(f"[{pipeline_id}] Full pipeline completed successfully")

        return final_pipeline_state

    except Exception as e:
        logger.error(f"[{pipeline_id}] Full pipeline failed: {e}")

        # Create error state
        if pipeline_id in active_pipelines:
            active_pipelines[pipeline_id].stage = "error"
        else:
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


async def create_query_record_with_semantic_analysis(
        original_query: str,
        new_query: str,
) -> QueryRecord:
    import numpy as np  # <-- Keep local import

    semantic_delta = None
    embedding_calculation_successful = False

    # 预初始化变量，以便在异常处理中安全访问
    added_concepts = []
    removed_concepts = []
    magnitude = 0.0
    embeddings = None  # 预初始化 embeddings

    try:
        # Step 1: Use LLM to analyze added/removed concepts
        # ... (LLM prompt setup remains the same) ...
        analysis_prompt = f"""Compare these two research queries and identify the semantic changes:

Original Query: "{original_query}"
New Query: "{new_query}"

Analyze what concepts/keywords are:
1. ADDED in the new query (concepts that appear in new but not in original)
2. REMOVED or de-emphasized from the original query
3. At most 3 tags each

Respond with ONLY valid JSON (no markdown):
{{
  "added_concepts": ["concept1", "concept2"],
  "removed_concepts": ["concept1", "concept2"]
}}

Keep concepts concise (1-3 words each). Focus on key semantic differences."""

        messages = [
            {
                "role": "system",
                "content": "You are a semantic analysis expert. Respond only with valid JSON."
            },
            {
                "role": "user",
                "content": analysis_prompt
            }
        ]

        # Get LLM analysis
        response = await llm_service.chat(messages)

        # Parse JSON response
        content = response.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        concept_analysis = json.loads(content)
        added_concepts = concept_analysis.get("added_concepts", [])
        removed_concepts = concept_analysis.get("removed_concepts", [])

        logger.info(f"LLM analysis - Added: {added_concepts}, Removed: {removed_concepts}")

        # Step 2A: Retrieve embeddings (Still inside try block for service error handling)
        embeddings = embed_service.get_embeddings([original_query, new_query])

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM concept analysis: {e}")
        # added_concepts/removed_concepts

    except Exception as e:
        # 捕获其他服务错误，如 LLM 或 embed_service 连接失败
        logger.error(f"Failed during LLM chat or embedding retrieval: {e}")


    # Step 2B: Compute embedding-based magnitude (NumPy operations)
    if embeddings is not None and len(embeddings) == 2:
        try:
            original_vec = np.array(embeddings[0])
            new_vec = np.array(embeddings[1])

            if original_vec.size > 0 and new_vec.size > 0:
                # 规范化向量
                original_norm = original_vec / (np.linalg.norm(original_vec) + 1e-10)
                new_norm = new_vec / (np.linalg.norm(new_vec) + 1e-10)

                # Cosine similarity
                similarity = np.dot(original_norm, new_norm)

                # Magnitude
                magnitude = float(1 - similarity)
                embedding_calculation_successful = True

                logger.info(f"Computed semantic magnitude: {magnitude:.3f} (similarity: {similarity:.3f})")
            else:
                logger.warning("Embeddings retrieved but are empty vectors.")

        except Exception as e:
            # 捕获 NumPy 内部的错误，例如形状不匹配或 LinAlgError
            logger.error(f"NumPy vector calculation failed: {e}")
            # magnitude 保持 0.0

    # Step 2.5: Fallback Magnitude Calculation
    if not embedding_calculation_successful:
        # Fallback: use a heuristic based on concept changes
        concept_count = len(added_concepts) + len(removed_concepts)

        # Limit heuristic magnitude to 1.0 (e.g., max change rate of 10 keywords)
        magnitude = min(concept_count / 10.0, 1.0)
        logger.warning(f"Using fallback magnitude calculation: {magnitude:.3f} based on {concept_count} concepts.")

    # Step 3: Create SemanticDelta (Only if we have concepts OR magnitude > 0)
    if magnitude > 0 or len(added_concepts) > 0 or len(removed_concepts) > 0:
        semantic_delta = SemanticDelta(
            magnitude=magnitude,
            added=added_concepts,
            removed=removed_concepts,
        )
    else:
        # If everything is empty/zero, keep semantic_delta as None
        semantic_delta = None

    # Step 4: Create and return QueryRecord
    record = QueryRecord(
        query_text=new_query,
        parent_query=original_query,
        status="unexplored",
        output=None,
        semantic_delta=semantic_delta
    )

    return record


@router.post("/pipeline/{pipeline_id}/restart")
async def restart_pipeline(
        pipeline_id: str,
        stage: str,
        background_tasks: BackgroundTasks
):
    """
    Restart a pipeline from a specific stage

    This endpoint allows you to reset the pipeline state to before a specific stage
    and re-execute from that point.

    Parameters:
    - pipeline_id: The ID of the pipeline to restart
    - stage: The stage to restart from. Valid values:
        * "search": Reset to initial state and re-run search
        * "revising": Keep search results, re-run revising and synthesis
        * "synthesis": Keep search and revising results, re-run synthesis only

    Returns:
    - Status information about the restart operation
    """
    from datetime import datetime, timezone

    # Validate pipeline exists
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    # Validate stage parameter
    valid_stages = ["search", "revising", "synthesis"]
    if stage not in valid_stages:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid stage '{stage}'. Must be one of: {', '.join(valid_stages)}"
        )

    pipeline = active_pipelines[pipeline_id]

    logger.info(f"Restarting pipeline {pipeline_id} from stage: {stage}")

    current_timestamp = datetime.now(timezone.utc).isoformat()

    original_query = ""
    if pipeline.search_output and pipeline.search_output.reasoning:
        try:
            reasoning_text = pipeline.search_output.reasoning
            if "Based on query '" in reasoning_text and "', generated" in reasoning_text:
                start = reasoning_text.find("Based on query '") + len("Based on query '")
                end = reasoning_text.find("', generated", start)
                original_query = reasoning_text[start:end]
        except (IndexError, AttributeError):
            pass

    for record in pipeline.query_history:
        if record.query_text == original_query:
            record.status = "pending"
            record.output = None
            break


    try:
        if stage == "search":
            # Clear the historyPapers
            for paper in pipeline.historyPapers:
                if paper.found_by_query == original_query:
                    pipeline.historyPapers.remove(paper)

            # Clear all outputs
            pipeline.search_output = None
            pipeline.revising_output = None
            pipeline.synthesis_output = None
            pipeline.stage = "search"

            # Record intervention
            pipeline.human_interventions.append({
                "timestamp": current_timestamp, 
                "action_type": "restart",
                "stage": "search",
                "details": {"restarted_from": stage}
            })

            # Re-run search stage
            initial_state = AgentState(
                original_query=original_query,
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
                human_interventions=pipeline.human_interventions,
                errors=[],
                awaiting_human_review=False,
                human_feedback=None,
                keyword_search_results=[]
            )

            background_tasks.add_task(run_search_stage, pipeline_id, initial_state)

            return {
                "status": "success",
                "message": "Pipeline reset to initial state, re-running search stage",
                "pipeline_id": pipeline_id,
                "restarted_from": stage,
                "current_stage": "search"
            }

        elif stage == "revising":
            # Keep search results, clear revising and synthesis
            if not pipeline.search_output:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot restart from revising stage: search results not available"
                )

            # Clear revising and synthesis outputs
            pipeline.revising_output = None
            pipeline.synthesis_output = None
            pipeline.stage = "revising"

            # Record intervention
            pipeline.human_interventions.append({
                "timestamp": current_timestamp,
                "action_type": "restart",
                "stage": "revising",
                "details": {"restarted_from": stage}
            })

            # Re-run revising stage
            background_tasks.add_task(run_revising_stage, pipeline_id)

            return {
                "status": "success",
                "message": "Pipeline reset to after search stage, re-running revising stage",
                "pipeline_id": pipeline_id,
                "restarted_from": stage,
                "current_stage": "revising",
                "preserved_data": {
                    "keywords": len(pipeline.search_output.keywords),
                    "papers": len(pipeline.search_output.papers)
                }
            }

        elif stage == "synthesis":
            # Keep search and revising results, clear synthesis only
            if not pipeline.search_output:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot restart from synthesis stage: search results not available"
                )
            if not pipeline.revising_output:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot restart from synthesis stage: revising results not available"
                )

            # Clear synthesis output only
            pipeline.synthesis_output = None
            pipeline.stage = "synthesis"

            # Record intervention
            pipeline.human_interventions.append({
                "timestamp": current_timestamp,
                "action_type": "restart",
                "stage": "synthesis",
                "details": {"restarted_from": stage}
            })

            # Re-run synthesis stage
            background_tasks.add_task(run_synthesis_stage, pipeline_id)

            return {
                "status": "success",
                "message": "Pipeline reset to after revising stage, re-running synthesis stage",
                "pipeline_id": pipeline_id,
                "restarted_from": stage,
                "current_stage": "synthesis",
                "preserved_data": {
                    "keywords": len(pipeline.search_output.keywords),
                    "papers": len(pipeline.search_output.papers),
                    "accepted_papers": len(pipeline.revising_output.accepted_papers)
                }
            }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Failed to restart pipeline {pipeline_id} from stage {stage}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to restart pipeline: {str(e)}"
        )


@router.post("/pipeline/{pipeline_id}/restart-with-query")
async def restart_pipeline_with_new_query(
        pipeline_id: str,
        new_query: str,
        background_tasks: BackgroundTasks
):
    """
    Restart a pipeline from search stage with a new query

    This endpoint allows you to restart the pipeline from the search stage
    while preserving the pipeline ID and using a new refined query.

    Parameters:
    - pipeline_id: The ID of the pipeline to restart
    - new_query: The new query string to use for the search stage

    Returns:
    - Status information about the restart operation
    """
    from datetime import datetime, timezone

    # Validate pipeline exists
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    # Validate new_query is not empty
    if not new_query or not new_query.strip():
        raise HTTPException(
            status_code=400,
            detail="new_query cannot be empty"
        )

    pipeline = active_pipelines[pipeline_id]

    logger.info(f"Restarting pipeline {pipeline_id} from search stage with new query: {new_query}")

    current_timestamp = datetime.now(timezone.utc).isoformat()

    original_query = ""
    if pipeline.search_output and pipeline.search_output.reasoning:
        try:
            reasoning_text = pipeline.search_output.reasoning
            if "Based on query '" in reasoning_text and "', generated" in reasoning_text:
                start = reasoning_text.find("Based on query '") + len("Based on query '")
                end = reasoning_text.find("', generated", start)
                original_query = reasoning_text[start:end]
        except (IndexError, AttributeError):
            pass

    # Update query records
    flag = True
    for record in pipeline.query_history:
        if record.query_text == new_query:
            record.status = "pending"
            flag = False
            break

    # If the new query is not in the query_history, add it
    if flag:
        record = await create_query_record_with_semantic_analysis(
            original_query=original_query,
            new_query=new_query,
        )
        record.status = "pending"
        pipeline.query_history.append(record)


    try:

        # Clear all outputs (similar to search restart)
        pipeline.search_output = None
        pipeline.revising_output = None
        pipeline.synthesis_output = None
        pipeline.stage = "search"

        # Record intervention with detailed information
        pipeline.human_interventions.append({
            "timestamp": current_timestamp,
            "action_type": "restart_with_new_query",
            "stage": "search",
            "details": {
                "old_query": original_query,
                "new_query": new_query,
                "reason": "User refined the research question for next iteration"
            }
        })

        # Create new initial state with the new query
        initial_state = AgentState(
            original_query=new_query,
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
            human_interventions=pipeline.human_interventions,
            errors=[],
            awaiting_human_review=False,
            human_feedback=None,
            keyword_search_results=[]
        )

        # Re-run search stage with new query
        background_tasks.add_task(run_search_stage, pipeline_id, initial_state)

        return {
            "status": "success",
            "message": "Pipeline restarted from search stage with new query",
            "pipeline_id": pipeline_id,
            "old_query": original_query,
            "new_query": new_query,
            "current_stage": "search",
            "note": "This allows iterative refinement of the research question based on previous exploration"
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Failed to restart pipeline {pipeline_id} with new query: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to restart pipeline with new query: {str(e)}"
        )


@router.post("/pipeline/{pipeline_id}/extract-and-refine-queries")
async def extract_future_work_and_generate_queries(
        pipeline_id: str
):
    """
    Extract Future Work section and generate multiple refined queries for next iteration

    This endpoint:
    1. Extracts the Future Work section from the synthesis output
    2. Generates multiple specific research queries based on different future work directions
    3. Each query focuses on a different aspect of the future work

    Parameters:
    - pipeline_id: The ID of the pipeline (required path parameter)
    - num_queries: Number of refined queries to generate (default: 3, max: 5)
    - selected_future_work_items: Optional list of indices to focus on (if None, uses all)

    Returns:
    - Extracted future work content
    - Multiple refined queries with their focus areas
    - Suggestions for next iteration
    """
    from datetime import datetime, timezone
    import re
    import json


    # Validate pipeline exists
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]

    # Check if synthesis is completed
    if not pipeline.synthesis_output:
        raise HTTPException(
            status_code=400,
            detail="Synthesis not completed yet. Cannot extract future work."
        )

    # PipelineState 的 synthesis_output.answer
    answer = pipeline.synthesis_output.answer

    try:
        # === Step 1: Extract Future Work from final answer ===
        logger.info(f"Extracting future work from pipeline {pipeline_id} synthesis output")

        patterns = [
            r'##?\s*Future\s+[^\n]*\n+(.*?)\n+##?\s*Conclusion',

            r'(?i)Future\s+[^\n]*\n+(.*?)\n+Conclusion',

            # markdown heading（### Future work (something)）
            r'###?\s*Future\s+[^\n]*\n+(.*?)\n+###?\s*Conclusion',

            # bold markdown（**Future Work (notes)**）
            r'\*\*Future\s+[^\n]*\*\*\s*\n+(.*?)\n+\*\*Conclusion',

            r'Future\s+[^\n]*\s*\n+(.*?)\n+Conclusion',
        ]

        future_work_content = None
        used_pattern = None

        for i, pattern in enumerate(patterns):
            match = re.search(pattern, answer, re.DOTALL | re.IGNORECASE)
            if match:
                future_work_content = match.group(1).strip()
                used_pattern = i
                break

        if not future_work_content:
            raise HTTPException(
                status_code=404,
                detail="Could not find 'Future Work' section in the synthesis answer. "
                       "Please ensure the answer contains both 'Future work' and 'Conclusion' sections."
            )

        logger.info(f"Successfully extracted future work content ({len(future_work_content)} chars)")

        # Parse future work items (bullet points)
        future_work_items = []
        lines = future_work_content.split('\n')
        current_item = ""

        for line in lines:
            line = line.strip()
            # Check if line starts with bullet point
            if re.match(r'^[-*•]\s+|^\d+\.\s+', line):
                if current_item:
                    future_work_items.append(current_item.strip())
                # Start new item (remove bullet point)
                current_item = re.sub(r'^[-*•]\s+|^\d+\.\s+', '', line)
            else:
                # Continue current item
                if line:
                    current_item += " " + line

        # Add last item
        if current_item:
            future_work_items.append(current_item.strip())

        logger.info(f"Parsed {len(future_work_items)} future work items")


        selected_items = future_work_items
        selected_indices = list(range(len(future_work_items)))

        # Extract original query from synthesis output
        original_query = ""
        if pipeline.search_output and pipeline.search_output.reasoning:
            try:
                reasoning_text = pipeline.search_output.reasoning
                if "Based on query '" in reasoning_text and "', generated" in reasoning_text:
                    start = reasoning_text.find("Based on query '") + len("Based on query '")
                    end = reasoning_text.find("', generated", start)
                    original_query = reasoning_text[start:end]
            except (IndexError, AttributeError):
                pass

        logger.info(f"Original query: {original_query}")

        # === Step 2: Generate Multiple Refined Queries using LLMService ===
        logger.info(f"Generating refined queries using LLMService")

        prompt = f"""Based on the following original research question and future work directions, 
generate DIFFERENT refined research questions for the next iteration of literature review.

Original Query: {original_query}

Future Work Directions:
{chr(10).join(f"{i + 1}. {item}" for i, item in enumerate(selected_items))}

Requirements:
2. Each question should focus on a DIFFERENT aspect or direction from the future work
3. Questions should be specific, focused, and actionable for literature search
4. Questions should build upon the original research interest
5. Avoid overlap between questions - each should explore a unique angle
6. At most 5 angles

Format your response as a JSON array (ONLY output valid JSON, no markdown):
[
  {{
    "query": "The refined research question",
    "focus_area": "Brief description of which future work direction(s) this addresses",
    "rationale": "Why this direction is valuable for next iteration"
  }}
]

Generate queries now:"""

        messages = [
            {
                "role": "system",
                "content": "You are a research assistant helping to refine research questions based on literature review findings. Always respond with valid JSON format."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]

        # Use LLMService for non-streaming chat
        response_content = await llm_service.chat(messages)

        logger.info(f"LLM response received: {response_content[:200]}...")

        # Parse JSON response
        try:
            # Extract JSON (handle markdown code blocks if any)
            content = response_content.strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            refined_queries = json.loads(content)

            if not isinstance(refined_queries, list):
                raise ValueError("Response is not a JSON array")

            for query in refined_queries:
                record = await create_query_record_with_semantic_analysis(
                    original_query=original_query,
                    new_query=query["query"],
                )
                pipeline.query_history.append(record)

            # Validate structure
            for idx, q in enumerate(refined_queries):
                if not all(key in q for key in ["query", "focus_area", "rationale"]):
                    raise ValueError(f"Query {idx} missing required fields")

            logger.info(f"Successfully parsed {len(refined_queries)} refined queries")

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Response content: {response_content}")
            raise HTTPException(
                status_code=500,
                detail="Failed to parse refined queries from LLM response. Invalid JSON format."
            )
        except Exception as e:
            logger.error(f"Failed to process LLM response: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process refined queries: {str(e)}"
            )

        # === Step 3: Record intervention in PipelineState ===
        current_timestamp = datetime.now(timezone.utc).isoformat()
        pipeline.human_interventions.append({
            "timestamp": current_timestamp,
            "action_type": "extract_and_refine_queries",
            "stage": "synthesis",
            "details": {
                "future_work_items_count": len(selected_items),
                "selected_indices": selected_indices,
                "generated_queries_count": len(refined_queries),
                "pattern_used": used_pattern
            }
        })

        logger.info(f"Recorded intervention for pipeline {pipeline_id}")

        # === Step 4: Return comprehensive response ===
        return {
            "status": "success",
            "pipeline_id": pipeline_id,
            "original_query": original_query,

            "future_work": {
                "raw_content": future_work_content,
                "all_items": future_work_items,
                "selected_items": selected_items,
                "selected_indices": selected_indices,
                "total_count": len(future_work_items),
                "used_count": len(selected_items)
            },

            "refined_queries": refined_queries,

            "metadata": {
                "timestamp": current_timestamp,
                "pattern_used": used_pattern,
                "num_queries_generated": len(refined_queries)
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to extract and refine queries for pipeline {pipeline_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract and refine queries: {str(e)}"
        )


@router.get("/pipeline/{pipeline_id}/needs-viz-refresh")
async def check_viz_refresh(pipeline_id: str):
    """
    Returns:
        {
            "needs_refresh": true/false,
            "papers_count": 50,
            "last_updated": "2025-11-17T..."
        }
    """
    if pipeline_id not in active_pipelines:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = active_pipelines[pipeline_id]

    return {
        "needs_refresh": getattr(pipeline, 'needs_viz_refresh', False),
        "papers_count": len(pipeline.historyPapers) if hasattr(pipeline, 'historyPapers') else 0,
        "last_updated": pipeline.viz_last_updated.isoformat() if hasattr(pipeline,
                                                                         'viz_last_updated') and pipeline.viz_last_updated else None,
        "current_stage": pipeline.stage
    }


@router.get("/pipeline/{pipeline_id}/paper-visualization")
async def get_paper_visualization(
        pipeline_id: str,
):

    pipeline = active_pipelines[pipeline_id]

    try:
        visualization_data = paper_visualization_service.prepare_visualization_data(
            history_papers=pipeline.historyPapers,
        )

        pipeline.needs_viz_refresh = False

        visualization_data["can_visualize"] = True
        visualization_data["current_stage"] = pipeline.stage

        return visualization_data

    except Exception as e:
        logger.error(f"Visualization failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
