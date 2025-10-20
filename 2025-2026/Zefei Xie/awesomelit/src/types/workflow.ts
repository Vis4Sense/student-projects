import { Paper, Keyword } from './pipeline';

export type NodeStatus = 'pending' | 'running' | 'completed' | 'error' | 'awaiting_review';

export type WorkflowNodeType =
    | 'query'
    | 'keyword_gen'
    | 'keyword'
    | 'paper_pool'
    | 'agent';

// Query node data
export interface QueryNodeData {
    query: string;
    timestamp: string;
}

// Keyword Gen node data
export interface KeywordGenNodeData {
    keywords_count: number;
    reasoning: string;
    status: NodeStatus;
}

// Keyword node
export interface KeywordNodeData {
    keyword: string;
    importance: number;
    is_custom: boolean;
    papers: Paper[];
    papers_count: number;
    selected_papers: string[]; // 用户选中的论文 ID
    status: NodeStatus;
}

// Paper Pool node data
export interface PaperPoolNodeData {
    total_papers: number;
    papers_by_keyword: Record<string, string[]>;
    duplicates_removed: number;
    status: NodeStatus;
}

// Agent node data
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
