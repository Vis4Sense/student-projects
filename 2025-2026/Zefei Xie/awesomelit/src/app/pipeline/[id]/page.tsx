'use client';

import { use, useEffect } from 'react'; // 👈 添加 useEffect
import { usePipeline } from '@/lib/hooks/usePipeline';
import { useSelectedNode } from '@/lib/hooks/useSelectedNode';
import Header from '@/components/layout/Header';
import LeftPanel from '@/components/layout/LeftPanel';
import RightPanel from '@/components/layout/RightPanel';
import BottomPanel from '@/components/layout/BottomPanel';

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

    const { selectNode } = useSelectedNode();

    const handleNodeSelect = (nodeId: string, nodeType: string) => {
        selectNode(nodeId, nodeType);
    };

    const handleApplyIntervention = (intervention: any) => {
        applyIntervention({
            pipeline_id: pipelineId,
            ...intervention,
        });
    };

    useEffect(() => {
        if (pipeline) {
            console.log('Pipeline state updated:', {
                stage: pipeline.stage,
                hasSearchOutput: !!pipeline.search_output,
                hasRevisingOutput: !!pipeline.revising_output,
                hasSynthesisOutput: !!pipeline.synthesis_output,
            });
        }
    }, [pipeline]);

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <Header pipeline={pipeline} isLoading={isLoading} />
            <br/>
            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden p-4 space-x-4 bg-gray-100">
                {/* Left: Workflow Canvas */}
                <div className="w-1/2 flex flex-col space-y-4">
                    <div className="flex-1 min-h-0 p-1">
                        <LeftPanel
                            visualization={visualization}
                            onNodeSelect={handleNodeSelect}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Bottom: Intervention Log */}
                    <div className="h-64 p-1">
                        <BottomPanel
                            interventionHistory={interventionHistory}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Right: Inspector Panel */}
                <div className="p-1 w-1/2">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <RightPanel
                            pipeline={pipeline}
                            onApplyIntervention={handleApplyIntervention}
                            isLoading={applyInterventionLoading}
                        />
                    </div>
                </div>

            </div>

            {/* Continue Button */}
            {pipeline && pipeline.stage !== 'completed' && pipeline.stage !== 'error' && (
                <div className="px-4 pb-4">
                    <button
                        onClick={() => continuePipeline()}
                        disabled={continueLoading || ['search', 'revising', 'synthesis'].includes(pipeline.stage)}
                        className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {continueLoading ? (
                            'Processing...'
                        ) : pipeline.stage === 'search_complete' ? (
                            'Continue to Revising'
                        ) : pipeline.stage === 'revising_complete' ? (
                            'Continue to Synthesis'
                        ) : pipeline.stage === 'search' ? (
                            'Search in progress...'
                        ) : pipeline.stage === 'revising' ? (
                            'Revising in progress...'
                        ) : pipeline.stage === 'synthesis' ? (
                            'Synthesizing answer...'
                        ) : (
                            'Continue'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

