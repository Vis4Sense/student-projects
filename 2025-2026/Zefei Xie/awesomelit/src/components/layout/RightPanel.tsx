'use client';

import SearchInspector from '@/components/inspection/SearchInspector';
import RevisingInspector from '@/components/inspection/RevisingInspector';
import SynthesisInspector from '@/components/inspection/SynthesisInspector';
import type { PipelineState } from '@/types/pipeline';
import { useSelectedNode } from '@/lib/hooks/useSelectedNode';
import { AIChatPanelRef } from '@/components/layout/AIChatPanel';
import { RefObject } from 'react'; //

interface RightPanelProps {
    pipeline: PipelineState | undefined;
    onApplyIntervention: (intervention: any) => void;
    isLoading: boolean;
    chatPanelRef: RefObject<AIChatPanelRef | null>;
}

export default function RightPanel({
                                       pipeline,
                                       onApplyIntervention,
                                       isLoading,
                                       chatPanelRef
                                   }: RightPanelProps) {
    const { selectedNode } = useSelectedNode();

    if (!selectedNode) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                    <p className="text-lg font-medium">Select a node</p>
                    <p className="text-sm mt-1">Click on any node in the workflow to inspect it</p>
                </div>
            </div>
        );
    }

    // Search stage - Query Keyword Gen
    if (selectedNode.type === 'keyword_gen') {
        return (
            <SearchInspector
                nodeId={selectedNode.id}
                nodeType={selectedNode.type}
                searchOutput={pipeline?.search_output}
                onApplyIntervention={onApplyIntervention}
                isLoading={isLoading}
                chatPanelRef={chatPanelRef}
            />
        );
    }

    // Keyword
    if (selectedNode.type === 'keyword') {
        return (
            <SearchInspector
                nodeId={selectedNode.id}
                nodeType={selectedNode.type}
                searchOutput={pipeline?.search_output}
                onApplyIntervention={onApplyIntervention}
                isLoading={isLoading}
                chatPanelRef={chatPanelRef}
            />
        );
    }

    // Paper_Pool
    if (selectedNode.type === 'paper_pool') {
        return (
            <SearchInspector
                nodeId={selectedNode.id}
                nodeType={selectedNode.type}
                searchOutput={pipeline?.search_output}
                onApplyIntervention={onApplyIntervention}
                isLoading={isLoading}
                chatPanelRef={chatPanelRef}
            />
        );
    }

    // Revising stage
    if (selectedNode.type === 'agent' && selectedNode.id.includes('revising')) {
        return (
            <RevisingInspector
                revisingOutput={pipeline?.revising_output}
                onApplyIntervention={onApplyIntervention}
                isLoading={isLoading}
            />
        );
    }

    // Synthesis stage
    if (selectedNode.type === 'agent' && selectedNode.id.includes('synthesis')) {
        return (
            <SynthesisInspector
                synthesisOutput={pipeline?.synthesis_output}
                onApplyIntervention={onApplyIntervention}
                isLoading={isLoading}
            />
        );
    }

    return (
        <div className="flex items-center justify-center h-full text-gray-400">
            <p>No inspector available for this node type: {selectedNode.type}</p>
        </div>
    );
}
