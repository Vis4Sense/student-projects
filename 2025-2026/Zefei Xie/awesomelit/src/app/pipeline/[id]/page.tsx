'use client';

import {use, useEffect, useRef, useState} from 'react';
import { usePipeline } from '@/lib/hooks/usePipeline';
import { useSelectedNode } from '@/lib/hooks/useSelectedNode';
import Header from '@/components/layout/Header';
import LeftPanel from '@/components/layout/LeftPanel';
import RightPanel from '@/components/layout/RightPanel';
import BottomPanel from '@/components/layout/BottomPanel';
import { X } from 'lucide-react';
import AIChatPanel, {AIChatPanelRef} from "@/components/layout/AIChatPanel";

export default function PipelinePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const pipelineId = resolvedParams.id;
    const chatPanelRef = useRef<AIChatPanelRef>(null);

    const {
        pipeline,
        visualization,
        interventionHistory,
        isLoading,
        applyIntervention,
        applyInterventionLoading,
        continue: continuePipeline,
        continueLoading,
    } = usePipeline(pipelineId);

    const { selectedNode, selectNode, clearSelection } = useSelectedNode();
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const handleNodeSelect = (nodeId: string, nodeType: string) => {
        selectNode(nodeId, nodeType);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setTimeout(() => clearSelection(), 300);
    };

    const handleApplyIntervention = (intervention: any) => {
        applyIntervention({
            pipeline_id: pipelineId,
            ...intervention,
        });
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isPanelOpen) {
                handleClosePanel();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isPanelOpen]);

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <Header
                pipeline={pipeline}
                isLoading={isLoading}
                onContinue={continuePipeline}
                continueLoading={continueLoading}
            />

            <div className="flex-1 flex overflow-hidden p-4 gap-4">
                {/* Left: AI Chat Panel*/}
                <div className="w-1/5 min-w-0 flex-shrink-0">
                    <AIChatPanel
                        ref={chatPanelRef}
                        systemPrompt="You are a helpful research assistant specializing in academic papers and literature review."
                        className="h-full"
                    />
                </div>

                {/* Center: Main Content Area*/}
                <div
                    className={`
                        flex flex-col gap-4 min-w-0
                        transition-all duration-300 ease-in-out
                        ${isPanelOpen ? 'flex-[1]' : 'flex-1'}
                    `}
                >
                    {/* Top: Workflow Canvas */}
                    <div className="flex-[3] min-h-0">
                        <LeftPanel
                            visualization={visualization}
                            onNodeSelect={handleNodeSelect}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Bottom: Intervention Log */}
                    <div className="flex-[2] min-h-0">
                        <BottomPanel
                            interventionHistory={interventionHistory}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                <div
                    className={`
                        flex flex-col bg-white rounded-xl shadow-lg overflow-hidden
                        transition-all duration-300 ease-in-out flex-shrink-0
                        ${isPanelOpen ? 'w-[800px] opacity-100' : 'w-0 opacity-0'}
                    `}
                >
                    {isPanelOpen && (
                        <>
                            {/* Panel Header */}
                            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white flex-shrink-0">
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-lg font-semibold text-gray-900 truncate">Node Inspector</h2>
                                    {selectedNode && (
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                            {selectedNode.type} • {selectedNode.id}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={handleClosePanel}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Panel Content */}
                            <div className="flex-1 overflow-y-auto">
                                <RightPanel
                                    pipeline={pipeline}
                                    onApplyIntervention={handleApplyIntervention}
                                    isLoading={applyInterventionLoading}
                                    chatPanelRef={chatPanelRef}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
