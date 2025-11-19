'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {ArrowLeft, RotateCcw, X, AlertTriangle, Sparkles, ChevronRight, Edit3, Search} from 'lucide-react';
import type { PipelineState } from '@/types/pipeline';
import {pipelineApi} from "@/lib/api/client";
import PaperVisualizationModal from '../visualization/PaperVisualizationModal';
import QueryTreeModal from "@/components/visualization/QueryTreeModal";


interface HeaderProps {
    pipeline: PipelineState | undefined;
    isLoading: boolean;
    onContinue?: () => void;
    continueLoading?: boolean;
    onRestart?: (stage: 'search' | 'revising' | 'synthesis') => Promise<void>;
}

interface RefinedQuery {
    query: string;
    focus_area: string;
    rationale: string;
}

interface CachedQueriesData {
    pipelineId: string;
    originalQuery: string;
    refinedQueries: RefinedQuery[];
    timestamp: string;
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
    const [isVisualizationOpen, setIsVisualizationOpen] = useState(false);
    const [treeVisible, setTreeVisible] = useState(false);

    // Next Iteration states
    const [isNextIterationOpen, setIsNextIterationOpen] = useState(false);
    const [refinedQueries, setRefinedQueries] = useState<RefinedQuery[]>([]);
    const [isLoadingQueries, setIsLoadingQueries] = useState(false);
    const [isStartingIteration, setIsStartingIteration] = useState(false);
    const [originalQuery, setOriginalQuery] = useState('');

    // Custom query input
    const [customQuery, setCustomQuery] = useState('');
    const [isCustomMode, setIsCustomMode] = useState(false);

    const stageLabels = {
        search: 'Searching',
        search_complete: 'Search Complete',
        revising: 'Revising Papers',
        revising_complete: 'Revising Complete',
        synthesis: 'Synthesizing Answer',
        completed: 'Completed',
        error: 'Error'
    };

    // Cache management functions
    const getCacheKey = (pipelineId: string) => `queries_${pipelineId}`;

    const saveCachedQueries = (pipelineId: string, data: Omit<CachedQueriesData, 'pipelineId'>) => {
        try {
            const cacheKey = getCacheKey(pipelineId);
            const cacheData = {
                ...data,
                pipelineId,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            console.log(`💾 Saved queries for pipeline ${pipelineId}`);
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    };

    const loadCachedQueries = (pipelineId: string): CachedQueriesData | null => {
        try {
            const cacheKey = getCacheKey(pipelineId);
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
        }
        return null;
    };

    const clearCachedQueries = (pipelineId: string) => {
        try {
            const cacheKey = getCacheKey(pipelineId);
            localStorage.removeItem(cacheKey);
            console.log(`🗑️ Cleared queries cache for pipeline ${pipelineId}`);
        } catch (error) {
            console.error('Failed to clear cache:', error);
        }
    };

    // Load cached queries on mount
    useEffect(() => {
        if (pipeline && pipeline.stage === 'completed') {
            const cached = loadCachedQueries(pipeline.pipeline_id);
            if (cached) {
                setRefinedQueries(cached.refinedQueries);
                setOriginalQuery(cached.originalQuery);
                console.log(`✅ Loaded cached queries for pipeline ${pipeline.pipeline_id}`);
            }
        }
    }, [pipeline?.pipeline_id, pipeline?.stage]);

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

    const handleNextIteration = async () => {
        if (!pipeline) return;

        // Check cache first
        const cached = loadCachedQueries(pipeline.pipeline_id);
        if (cached && cached.refinedQueries.length > 0) {
            console.log(`✅ Using cached queries for pipeline ${pipeline.pipeline_id}`);
            setRefinedQueries(cached.refinedQueries);
            setOriginalQuery(cached.originalQuery);
            setIsNextIterationOpen(true);
            return;
        }

        // No cache, generate new queries
        setIsNextIterationOpen(true);
        setIsLoadingQueries(true);

        try {
            const result = await pipelineApi.extractAndRefineQueries(pipeline.pipeline_id);
            setRefinedQueries(result.refined_queries);
            setOriginalQuery(result.original_query);

            // Save to cache
            saveCachedQueries(pipeline.pipeline_id, {
                originalQuery: result.original_query,
                refinedQueries: result.refined_queries,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to extract queries:', error);
            alert('Failed to generate refined queries. Please try again.');
            setIsNextIterationOpen(false);
        } finally {
            setIsLoadingQueries(false);
        }
    };

    const handleForceRegenerate = async () => {
        if (!pipeline) return;

        clearCachedQueries(pipeline.pipeline_id);
        setRefinedQueries([]);
        setOriginalQuery('');
        setIsLoadingQueries(true);

        try {
            const result = await pipelineApi.extractAndRefineQueries(pipeline.pipeline_id);
            setRefinedQueries(result.refined_queries);
            setOriginalQuery(result.original_query);

            saveCachedQueries(pipeline.pipeline_id, {
                originalQuery: result.original_query,
                refinedQueries: result.refined_queries,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to regenerate queries:', error);
            alert('Failed to regenerate queries. Please try again.');
        } finally {
            setIsLoadingQueries(false);
        }
    };

    const handleSelectQuery = async (selectedQuery: string) => {
        if (!pipeline) return;

        setIsStartingIteration(true);

        try {
            // Clear cache before starting new iteration
            clearCachedQueries(pipeline.pipeline_id);

            await pipelineApi.restartWithQuery(pipeline.pipeline_id, selectedQuery);

            setIsNextIterationOpen(false);
            setTreeVisible(false);
            setRefinedQueries([]);
            setOriginalQuery('');

            window.location.reload();
        } catch (error) {
            console.error('Failed to start new iteration:', error);
            alert('Failed to start new iteration. Please try again.');
        } finally {
            setIsStartingIteration(false);
        }
    };

    const handleCustomQuerySubmit = async () => {
        if (!pipeline || !customQuery.trim()) {
            alert('Please enter a custom query');
            return;
        }

        await handleSelectQuery(customQuery.trim());
    };

    const handleToggleVisualization = () => {
        setIsVisualizationOpen(!isVisualizationOpen);
    };

    const handleShowQueryTree = () => {
        setTreeVisible(true);
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
        router.push(`/`);
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

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {isLoading && (
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-600">Processing...</span>
                            </div>
                        )}

                        {pipeline && (
                            <button
                                onClick={handleToggleVisualization}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors shadow-md"
                                title="Open Paper Visualization"
                            >
                                <Search className="w-4 h-4" />
                                <span>Visualization</span>
                            </button>
                        )}

                        {pipeline && (
                            <button
                                onClick={handleShowQueryTree}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-md"
                                title="Open Query Tree"
                            >
                                <Search className="w-4 h-4" />
                                <span>Query Tree</span>
                            </button>
                        )}

                        {/* Next Iteration Button */}
                        {pipeline && pipeline.stage === 'completed' && (
                            <button
                                onClick={handleNextIteration}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors shadow-md"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Next Iteration</span>
                            </button>
                        )}

                        {/* Restart controls */}
                        {canRestart && (
                            <div className="flex items-center gap-2">
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

                                    {isDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsDropdownOpen(false)}
                                            />
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

                        {canContinue && onContinue && (
                            <button
                                onClick={onContinue}
                                disabled={continueLoading}
                                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                            >
                                {getButtonText()}
                            </button>
                        )}

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
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => !isRestarting && setIsRestartDialogOpen(false)}
                    />

                    <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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

                        <div className="p-6 space-y-4">
                            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 space-y-3">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <p className="font-semibold text-yellow-800">
                                        {stageInfo.warning}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pl-7">
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

            {/* Next Iteration Modal */}
            {isNextIterationOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => !isStartingIteration && setIsNextIterationOpen(false)}
                    />

                    <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-gray-200">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-purple-500" />
                                    Choose Direction for Next Iteration
                                </h2>
                                <p className="text-gray-600 mt-2">
                                    Based on the future work identified, select a refined research question to explore next.
                                </p>
                                {originalQuery && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Current query:</span> {originalQuery}
                                        </p>
                                    </div>
                                )}

                                {/* Regenerate button */}
                                {refinedQueries.length > 0 && !isLoadingQueries && (
                                    <button
                                        onClick={handleForceRegenerate}
                                        className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Regenerate queries
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => !isStartingIteration && setIsNextIterationOpen(false)}
                                disabled={isStartingIteration}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isLoadingQueries ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-600">Generating refined queries from future work...</p>
                                </div>
                            ) : refinedQueries.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600">No refined queries available.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Tab switcher */}
                                    <div className="flex gap-2 mb-4">
                                        <button
                                            onClick={() => setIsCustomMode(false)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                !isCustomMode
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            Recommended Queries
                                        </button>
                                        <button
                                            onClick={() => setIsCustomMode(true)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                                isCustomMode
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Custom Query
                                        </button>
                                    </div>

                                    <br/>

                                    {!isCustomMode ? (
                                        // Recommended queries
                                        refinedQueries.map((query, index) => (
                                            <div key={index} className="p-1">
                                            <div
                                                className="group relative border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer "
                                                onClick={() => !isStartingIteration && handleSelectQuery(query.query)}
                                            >
                                                <div className="absolute top-4 right-4 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                                                    {index + 1}
                                                </div>

                                                <h3 className="text-lg font-semibold text-gray-900 pr-12 mb-3 group-hover:text-purple-600 transition-colors">
                                                    {query.query}
                                                </h3>

                                                <div className="mb-3">
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                        {query.focus_area}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                                    {query.rationale}
                                                </p>

                                                <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors"
                                                        disabled={isStartingIteration}
                                                    >
                                                        <span>Start with this query</span>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Custom query input
                                        <div className="border-2 border-gray-200 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Edit3 className="w-5 h-5 text-purple-500" />
                                                Enter Your Custom Research Question
                                            </h3>

                                            <textarea
                                                value={customQuery}
                                                onChange={(e) => setCustomQuery(e.target.value)}
                                                placeholder="Type your specific research question here..."
                                                className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none resize-none text-gray-900"
                                                disabled={isStartingIteration}
                                            />

                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    onClick={handleCustomQuerySubmit}
                                                    disabled={isStartingIteration || !customQuery.trim()}
                                                    className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <span>Start with custom query</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Loading Overlay */}
                        {isStartingIteration && (
                            <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-900 font-semibold">Starting new iteration...</p>
                                    <p className="text-gray-600 text-sm mt-1">This may take a moment</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isVisualizationOpen && pipeline && (
                            <PaperVisualizationModal
                                pipeline={pipeline}
                                onClose={() => setIsVisualizationOpen(false)}
                            />
            )}

            {pipeline && handleSelectQuery && (
                <QueryTreeModal
                    visible={treeVisible}
                    onClose={() => setTreeVisible(false)}
                    pipelineState={pipeline}
                    onSelectQuery={handleSelectQuery}
                />
            )}
        </>
    );
}
