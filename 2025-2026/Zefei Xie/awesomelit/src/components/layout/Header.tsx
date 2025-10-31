'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { PipelineState } from '@/types/pipeline';

interface HeaderProps {
    pipeline: PipelineState | undefined;
    isLoading: boolean;
    onContinue?: () => void;
    continueLoading?: boolean;
}

export default function Header({
                                   pipeline,
                                   isLoading,
                                   onContinue,
                                   continueLoading = false
                               }: HeaderProps) {
    const router = useRouter();

    const stageLabels = {
        search: 'Searching',
        search_complete: 'Search Complete',
        revising: 'Revising Papers',
        revising_complete: 'Revising Complete',
        synthesis: 'Synthesizing Answer',
        completed: 'Completed',
        error: 'Error'
    };

    const canContinue = pipeline &&
        pipeline.stage !== 'completed' &&
        pipeline.stage !== 'error' &&
        !['search', 'revising', 'synthesis'].includes(pipeline.stage);

    const getButtonText = () => {
        if (!pipeline) return 'Continue';
        if (continueLoading) return 'Processing...';
        if (pipeline.stage === 'search_complete') return 'Continue to Revising';
        if (pipeline.stage === 'revising_complete') return 'Continue to Synthesis';
        if (pipeline.stage === 'search') return 'Search in progress...';
        if (pipeline.stage === 'revising') return 'Revising in progress...';
        if (pipeline.stage === 'synthesis') return 'Synthesizing answer...';
        return 'Continue';
    };

    const handleBack = () => {
        router.push(`/auto/${pipeline?.pipeline_id}`);
    };

    return (
        <header className="bg-white border-b border-gray-300 px-6 py-4">
            <div className="flex justify-between items-center">
                {/* Left Section: Back Button + Title */}
                <div className="flex items-center gap-4">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all group"
                        title="Back to home"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    {/* Title and Status */}
                    <div className="border-l border-gray-300 pl-4">
                        <h1 className="text-2xl font-bold text-gray-900">AwesomeLit</h1>
                        {pipeline && (
                            <p className="text-sm text-gray-600 mt-1">
                                Pipeline: <span className="font-mono">{pipeline.pipeline_id.slice(0, 8)}...</span> |
                                Stage: <span className="font-semibold">{stageLabels[pipeline.stage as keyof typeof stageLabels]}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Section: Status + Continue Button */}
                <div className="flex items-center gap-4">
                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Processing...</span>
                        </div>
                    )}

                    {/* Continue button */}
                    {canContinue && onContinue && (
                        <button
                            onClick={onContinue}
                            disabled={continueLoading}
                            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                        >
                            {getButtonText()}
                        </button>
                    )}

                    {/* Finish button */}
                    { pipeline && pipeline.stage === 'completed' && (
                        <button
                            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                            onClick={handleBack}
                        >
                            Check Report
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
