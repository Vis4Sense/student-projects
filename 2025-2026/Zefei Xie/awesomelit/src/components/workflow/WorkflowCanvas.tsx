'use client';

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MiniMap,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import QueryNode from './nodes/QueryNode';
import KeywordGenNode from './nodes/KeywordGenNode';
import KeywordNode from './nodes/KeywordNode';
import PaperPoolNode from './nodes/PaperPoolNode';
import AgentNode from './nodes/AgentNode';
import type { VisualizationData } from '@/types/workflow';

const nodeTypes = {
    query: QueryNode,
    keyword_gen: KeywordGenNode,
    keyword: KeywordNode,
    paper_pool: PaperPoolNode,
    agent: AgentNode,
};

interface WorkflowCanvasProps {
    visualizationData: VisualizationData | undefined;
    onNodeClick: (nodeId: string, nodeType: string) => void;
    isLoading?: boolean;
}

export default function WorkflowCanvas({
                                           visualizationData,
                                           onNodeClick,
                                           isLoading = false,
                                       }: WorkflowCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

    // 当可视化数据更新时，更新节点和边
    useEffect(() => {
        if (!visualizationData) return;

        const newNodes = visualizationData.nodes.map((node) => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: {
                ...node.data,
                onNodeClick,
            },
            selected: false,
        }));

        const newEdges = visualizationData.edges.map((edge) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.label,
            animated: edge.animated,
        }));

        setNodes(newNodes);
        setEdges(newEdges);
    }, [visualizationData, setNodes, setEdges, onNodeClick]);

    const handleNodeClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            onNodeClick(node.id, node.type || 'unknown');
        },
        [onNodeClick]
    );

    return (
        <div className="w-full h-full bg-gray-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
            {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center rounded-lg">
                    <div className="bg-white px-4 py-2 rounded shadow">Loading...</div>
                </div>
            )}
        </div>
    );
}
