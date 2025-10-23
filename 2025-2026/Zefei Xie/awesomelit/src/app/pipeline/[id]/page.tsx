'use client';

import { use, useEffect, useState } from 'react';
import { usePipeline } from '@/lib/hooks/usePipeline';
import { useSelectedNode } from '@/lib/hooks/useSelectedNode';
import Header from '@/components/layout/Header';
import LeftPanel from '@/components/layout/LeftPanel';
import RightPanel from '@/components/layout/RightPanel';
import BottomPanel from '@/components/layout/BottomPanel';
import { X } from 'lucide-react';

export default function PipelinePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const pipelineId = resolvedParams.id;

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
        <div className="h-screen flex flex-col bg-gray-100 relative">
            {/* Header with Continue button */}
            <Header
                pipeline={pipeline}
                isLoading={isLoading}
                onContinue={continuePipeline}
                continueLoading={continueLoading}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
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

            {/* Right Panel*/}
            {isPanelOpen && (
                <>
                    <div
                        onClick={handleClosePanel}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-[80%] h-[80%] max-w-7xl flex flex-col overflow-hidden"
                        >
                            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white flex-shrink-0">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Node Inspector</h2>
                                    {selectedNode && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {selectedNode.type} • {selectedNode.id}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={handleClosePanel}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <RightPanel
                                    pipeline={pipeline}
                                    onApplyIntervention={handleApplyIntervention}
                                    isLoading={applyInterventionLoading}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
