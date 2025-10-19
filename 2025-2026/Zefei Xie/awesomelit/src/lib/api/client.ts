import axios from 'axios';
import type { HumanInterventionRequest } from '@/types/intervention';
import type { PipelineState} from '@/types/pipeline';
import type { VisualizationData } from '@/types/workflow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const pipelineApi = {
    // 启动新 pipeline
    start: async (query: string): Promise<PipelineState> => {
        const response = await apiClient.post<PipelineState>('/pipeline/start', {
            query,
            max_results: 50,
        });
        return response.data;
    },

    // 获取 pipeline 状态
    get: async (pipelineId: string): Promise<PipelineState> => {
        const response = await apiClient.get<PipelineState>(`/pipeline/${pipelineId}`);
        return response.data;
    },

    // 获取可视化数据
    getVisualization: async (pipelineId: string): Promise<VisualizationData> => {
        const response = await apiClient.get<VisualizationData>(
            `/pipeline/${pipelineId}/visualization`
        );
        return response.data;
    },

    // 继续执行下一阶段
    continue: async (pipelineId: string) => {
        const response = await apiClient.post(`/pipeline/${pipelineId}/continue`);
        return response.data;
    },

    // 应用人工干预
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

    // 获取干预历史
    getInterventionHistory: async (pipelineId: string) => {
        const response = await apiClient.get(`/pipeline/${pipelineId}/interventions`);
        return response.data;
    },

    // 获取被拒绝的论文
    getRejectedPapers: async (pipelineId: string) => {
        const response = await apiClient.get(`/pipeline/${pipelineId}/papers/rejected`);
        return response.data;
    },

    // 获取统计信息
    getStats: async (pipelineId: string) => {
        const response = await apiClient.get(`/pipeline/${pipelineId}/stats`);
        return response.data;
    },
};
