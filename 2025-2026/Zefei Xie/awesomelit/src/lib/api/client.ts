import axios from 'axios';
import type { HumanInterventionRequest } from '@/types/intervention';
import type { PipelineState} from '@/types/pipeline';
import type { VisualizationData } from '@/types/workflow';
import {ChatMessage, ChatResponse} from "@/types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 600000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const pipelineApi = {
    // start pipeline
    start: async (query: string): Promise<PipelineState> => {
        const response = await apiClient.post<PipelineState>('/pipeline/start', {
            query,
            max_results: 50,
        });
        return response.data;
    },

    // get pipeline staus
    get: async (pipelineId: string): Promise<PipelineState> => {
        const response = await apiClient.get<PipelineState>(`/pipeline/${pipelineId}`);
        return response.data;
    },

    // Get visualization data
    getVisualization: async (pipelineId: string): Promise<VisualizationData> => {
        const response = await apiClient.get<VisualizationData>(
            `/pipeline/${pipelineId}/visualization`
        );
        return response.data;
    },

    // continue pipeline
    continue: async (pipelineId: string) => {
        const response = await apiClient.post(`/pipeline/${pipelineId}/continue`);
        return response.data;
    },

    // Apply human intervention
    applyIntervention: async (
        pipelineId: string,
        intervention: HumanInterventionRequest
    ) => {
        const response = await apiClient.post(
            `/pipeline/${pipelineId}/intervention`,
            intervention
        );
        return response.data;
    },

    // Get human intervention history
    getInterventionHistory: async (pipelineId: string) => {
        const response = await apiClient.get(`/pipeline/${pipelineId}/interventions`);
        return response.data;
    },

    // Get accepted papers
    getRejectedPapers: async (pipelineId: string) => {
        const response = await apiClient.get(`/pipeline/${pipelineId}/papers/rejected`);
        return response.data;
    },

    // Get accepted papers
    getStats: async (pipelineId: string) => {
        const response = await apiClient.get(`/pipeline/${pipelineId}/stats`);
        return response.data;
    },

    // Run full automated pipeline
    runFull: async (query: string): Promise<PipelineState> => {
        const response = await apiClient.post<PipelineState>('/pipeline/run-full', {
            query,
        });
        return response.data;
    },

    // Get pipeline summary
    getSummary: async (pipelineId: string) => {
        const response = await apiClient.get(`/pipeline/${pipelineId}/summary`);
        return response.data;
    },

    restart: async (
        pipelineId: string,
        stage: 'search' | 'revising' | 'synthesis',
        userNote?: string
    ): Promise<{
        status: string;
        message: string;
        pipeline_id: string;
        restarted_from: string;
        current_stage: string;
        preserved_data?: {
            keywords?: number;
            papers?: number;
            accepted_papers?: number;
        };
    }> => {
        const response = await apiClient.post(
            `/pipeline/${pipelineId}/restart`,
            userNote ? { user_note: userNote } : null,
            {
                params: { stage }
            }
        );
        return response.data;
    },
    // Restart pipeline with new query (for iteration)
    restartWithQuery: async (
        pipelineId: string,
        newQuery: string
    ): Promise<{
        status: string;
        message: string;
        pipeline_id: string;
        old_query: string;
        new_query: string;
        current_stage: string;
        note: string;
    }> => {
        const response = await apiClient.post(
            `/pipeline/${pipelineId}/restart-with-query`,
            null,
            {
                params: { new_query: newQuery }
            }
        );
        return response.data;
    },

    // Extract future work and generate refined queries
    extractAndRefineQueries: async (
        pipelineId: string
    ): Promise<{
        status: string;
        pipeline_id: string;
        original_query: string;
        future_work: {
            raw_content: string;
            all_items: string[];
            selected_items: string[];
            selected_indices: number[];
            total_count: number;
            used_count: number;
        };
        refined_queries: Array<{
            query: string;
            focus_area: string;
            rationale: string;
        }>;
        metadata: {
            timestamp: string;
            pattern_used: number;
            num_queries_generated: number;
        };
    }> => {
        const response = await apiClient.post(
            `/pipeline/${pipelineId}/extract-and-refine-queries`
        );
        return response.data;
    },

     checkVizRefresh: async (pipelineId: string) => {
        const response = await apiClient.get(
            `/pipeline/${pipelineId}/needs-viz-refresh`
        );
        return response.data;
    },

     getPaperVisualization: async (pipelineId: string) => {
        const response = await apiClient.get(
            `/pipeline/${pipelineId}/paper-visualization`
        );
        return response.data;
    },
};


export const chatApi = {
    // Non-streaming chat
    chat: async (messages: ChatMessage[]): Promise<string> => {
        const response = await apiClient.post<ChatResponse>('/chat', {
            messages,
        });
        return response.data.message;
    },

    // Streaming chat
    chatStream: async (
        messages: ChatMessage[],
        onChunk: (chunk: string) => void,
        onError?: (error: string) => void,
        onComplete?: () => void
    ): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);

                        if (data === '[DONE]') {
                            onComplete?.();
                            return;
                        }

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                onChunk(parsed.content);
                            } else if (parsed.error) {
                                onError?.(parsed.error);
                                return;
                            }
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e);
                        }
                    }
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            onError?.(errorMessage);
        }
    },
};