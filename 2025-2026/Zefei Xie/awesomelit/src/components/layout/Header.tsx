'use client';

import type { PipelineState } from '@/types/pipeline';

interface HeaderProps {
    pipeline: PipelineState | undefined;
    isLoading: boolean;
}

export default function Header({ pipeline, isLoading }: HeaderProps) {
    const stageLabels = {
        search: 'Searching',
        revising: 'Revising Papers',
        synthesis: 'Synthesizing Answer',
        completed: 'Completed',
    };

    return (
        <header className="bg-white border border-black rounded-lg px-6 py-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Research Agent System</h1>
                    {pipeline && (
                        <p className="text-sm text-gray-600 mt-1">
                            Pipeline: {pipeline.pipeline_id.slice(0, 8)}... |
                            Stage: <span className="font-semibold">{stageLabels[pipeline.stage as keyof typeof stageLabels]}</span>
                        </p>
                    )}
                </div>

                {isLoading && (
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Processing...</span>
                    </div>
                )}
            </div>
        </header>
    );
}
