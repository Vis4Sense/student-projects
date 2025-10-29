import axios from 'axios';
import type { HumanInterventionRequest } from '@/types/intervention';
import type { PipelineState} from '@/types/pipeline';
import type { VisualizationData } from '@/types/workflow';
import {ChatMessage, ChatResponse} from "@/types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
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