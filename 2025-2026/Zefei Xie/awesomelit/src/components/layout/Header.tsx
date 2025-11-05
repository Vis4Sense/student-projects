'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, X, AlertTriangle } from 'lucide-react';
import type { PipelineState } from '@/types/pipeline';

interface HeaderProps {
    pipeline: PipelineState | undefined;
    isLoading: boolean;
    onContinue?: () => void;
    continueLoading?: boolean;
    onRestart?: (stage: 'search' | 'revising' | 'synthesis') => Promise<void>;
}

const STAGE_INFO = {
    search: {
        emoji: '🔍',
        label: 'Search',
        description: 'Reset to initial state and re-run search',
        warning: 'This will clear ALL results',
        clears: ['Search', 'Revising', 'Synthesis'],
        preserves: undefined
    },
    revising: {
        emoji: '✏️',
        label: 'Revising',
        description: 'Keep search results, re-run revising',
        warning: 'This will clear revising and synthesis results',
        clears: ['Revising', 'Synthesis'],
        preserves: ['Search results']
    },
    synthesis: {
        emoji: '📝',
        label: 'Synthesis',
        description: 'Keep search and revising results, re-run synthesis',
        warning: 'This will only clear synthesis results',
        clears: ['Synthesis'],
        preserves: ['Search', 'Revising results']
    }
} as const;


export default function Header({
                                   pipeline,
                                   isLoading,
                                   onContinue,
                                   continueLoading = false,
                                   onRestart
                               }: HeaderProps) {
    const router = useRouter();
    const [selectedStage, setSelectedStage] = useState<'search' | 'revising' | 'synthesis'>('search');
    const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const stageLabels = {
        search: 'Searching',
        search_complete: 'Search Complete',
        revising: 'Revising Papers',
        revising_complete: 'Revising Complete',
        synthesis: 'Synthesizing Answer',
        completed: 'Completed',
        error: 'Error'
    };

    const getAvailableRestartStages = (): Array<'search' | 'revising' | 'synthesis'> => {
        if (!pipeline) return [];

        const currentStage = pipeline.stage;

        if (currentStage === 'search_complete') {
            return ['search'];
        }

        if (currentStage === 'revising_complete') {
            return ['search', 'revising'];
        }

        if (currentStage === 'completed') {
            return ['search', 'revising', 'synthesis'];
        }

        return [];
    };

    const availableStages = getAvailableRestartStages();
    const canRestart = availableStages.length > 0 && onRestart;

    const handleRestart = async () => {
        if (!onRestart) return;

        try {
            setIsRestarting(true);
            await onRestart(selectedStage);
            setIsRestartDialogOpen(false);
        } catch (error) {
            console.error('Restart failed:', error);
            alert('Failed to restart pipeline. Please try again.');
        } finally {
            setIsRestarting(false);
        }
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

    const stageInfo = STAGE_INFO[selectedStage];

    return (
        <>
            <header className="bg-white border-b border-gray-300 px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Left Section: Back Button + Title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all group"
                            title="Back to home"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back</span>
                        </button>

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

                    {/* Right Section: Status + Restart + Continue Button */}
                    <div className="flex items-center gap-4">
                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-600">Processing...</span>
                            </div>
                        )}

                        {/* Restart controls */}
                        {canRestart && (
                            <div className="flex items-center gap-2">
                                {/* Custom Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center justify-between w-[160px] h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{STAGE_INFO[selectedStage].emoji}</span>
                                            <span className="text-sm">{STAGE_INFO[selectedStage].label}</span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown menu */}
                                    {isDropdownOpen && (
                                        <>
                                            {/* Backdrop */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsDropdownOpen(false)}
                                            />

                                            {/* Menu */}
                                            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                                                {availableStages.map((stage) => (
                                                    <button
                                                        key={stage}
                                                        onClick={() => {
                                                            setSelectedStage(stage);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                                            selectedStage === stage ? 'bg-gray-100' : ''
                                                        }`}
                                                    >
                                                        <span>{STAGE_INFO[stage].emoji}</span>
                                                        <span>{STAGE_INFO[stage].label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsRestartDialogOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                                    title="Restart pipeline from selected stage"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Restart</span>
                                </button>
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
                        {pipeline && pipeline.stage === 'completed' && (
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

            {/* Restart Confirmation Dialog */}
            {isRestartDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => !isRestarting && setIsRestartDialogOpen(false)}
                    />

                    {/* Dialog */}
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    {stageInfo.emoji} Restart from {stageInfo.label} Stage?
                                </h2>
                                <p className="text-gray-600 mt-1">{stageInfo.description}</p>
                            </div>
                            <button
                                onClick={() => !isRestarting && setIsRestartDialogOpen(false)}
                                disabled={isRestarting}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* Warning Box */}
                            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 space-y-3">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <p className="font-semibold text-yellow-800">
                                        {stageInfo.warning}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pl-7">
                                    {/* Will be cleared */}
                                    <div className="space-y-2">
                                        <p className="font-medium text-red-700 text-sm">Will be cleared:</p>
                                        <ul className="space-y-1">
                                            {stageInfo.clears.map(item => (
                                                <li key={item} className="flex items-center gap-2 text-sm text-red-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Will be preserved */}
                                    {stageInfo.preserves && stageInfo.preserves.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="font-medium text-green-700 text-sm">Will be preserved:</p>
                                            <ul className="space-y-1">
                                                {stageInfo.preserves.map(item => (
                                                    <li key={item} className="flex items-center gap-2 text-sm text-green-600">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 italic flex items-start gap-2">
                                <span>This action cannot be undone. The pipeline will re-execute from the selected stage.</span>
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setIsRestartDialogOpen(false)}
                                disabled={isRestarting}
                                className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRestart}
                                disabled={isRestarting}
                                className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isRestarting ? (
                                    <>
                                        <RotateCcw className="w-4 h-4 animate-spin" />
                                        <span>Restarting...</span>
                                    </>
                                ) : (
                                    <>
                                        <RotateCcw className="w-4 h-4" />
                                        <span>Confirm Restart</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
