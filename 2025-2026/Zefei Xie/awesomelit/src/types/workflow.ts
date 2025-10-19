import { Paper, Keyword } from './pipeline';

export type NodeStatus = 'pending' | 'running' | 'completed' | 'error' | 'awaiting_review';

export type WorkflowNodeType =
    | 'query'
    | 'keyword_gen'
    | 'keyword'
    | 'paper_pool'
    | 'agent';

// 查询节点数据
export interface QueryNodeData {
    query: string;
    timestamp: string;
}

// 关键词生成节点数据
export interface KeywordGenNodeData {
    keywords_count: number;
    reasoning: string;
    status: NodeStatus;
}

// 关键词节点数据
export interface KeywordNodeData {
    keyword: string;
    importance: number;
    is_custom: boolean;
    papers: Paper[];
    papers_count: number;
    selected_papers: string[]; // 用户选中的论文 ID
    status: NodeStatus;
}

// 论文池节点数据
export interface PaperPoolNodeData {
    total_papers: number;
    papers_by_keyword: Record<string, string[]>;
    duplicates_removed: number;
    status: NodeStatus;
}

// Agent 节点数据
export interface AgentNodeData {
    agent_type: 'revising' | 'synthesis';
    status: NodeStatus;
    output?: any;
}

export interface VisualizationData {
    nodes: Array<{
        id: string;
        type: WorkflowNodeType;
        label: string;
        position: { x: number; y: number };
        data: any;
    }>;
    edges: Array<{
        id: string;
        source: string;
        target: string;
        label?: string;
        animated?: boolean;
    }>;
    current_stage: string;
    stage_progress: Record<string, number>;
}
