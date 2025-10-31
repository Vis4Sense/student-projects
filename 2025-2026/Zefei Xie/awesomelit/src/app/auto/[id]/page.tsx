'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { pipelineApi } from '@/lib/api/client';
import type { PipelineState } from '@/types/pipeline';

import { useMemo } from 'react';
import PaperCard from "@/components/inspection/components/PaperCard";

export default function AutoPipelinePage() {
    const params = useParams();
    const pipelineId = params.id as string;

    const { data: pipeline, isLoading } = useQuery({
        queryKey: ['pipeline', pipelineId],
        queryFn: () => pipelineApi.get(pipelineId),
        refetchInterval: (data) => {
            if (!data || typeof data !== 'object' || !('stage' in data)) {
                return 2000;
            }
            const stage = (data as unknown as PipelineState).stage;
            return stage === 'completed' || stage === 'error' ? false : 2000;
        },
    });

    const { data: summary } = useQuery({
        queryKey: ['summary', pipelineId],
        queryFn: () => pipelineApi.getSummary(pipelineId),
        enabled: pipeline?.stage === 'completed',
    });

    // Extract cited papers
    const citedPapers = useMemo(() => {
        console.log('🔍 Calculating cited papers...');

        if (!pipeline?.synthesis_output?.citations) {
            console.log('❌ No citations found');
            return [];
        }

        if (!pipeline?.revising_output?.accepted_papers) {
            console.log('❌ No accepted papers found');
            return [];
        }

        console.log('📊 Citations:', pipeline.synthesis_output.citations);
        console.log('📄 Accepted papers:', pipeline.revising_output.accepted_papers.length);

        if (pipeline.synthesis_output.citations.length === 0) {
            console.log('⚠️ No citations, returning all accepted papers');
            return pipeline.revising_output.accepted_papers;
        }

        const citedPaperIds = new Set(
            pipeline.synthesis_output.citations.map(citation => {
                console.log('📌 Citation paper_id:', citation.paper_id);
                return citation.paper_id;
            })
        );

        console.log('🎯 Cited paper IDs:', Array.from(citedPaperIds));

        const matched = pipeline.revising_output.accepted_papers.filter(paper => {
            const isMatch = citedPaperIds.has(paper.id);
            if (isMatch) {
                console.log('✅ Matched paper:', paper.id, paper.title.substring(0, 50));
            }
            return isMatch;
        });

        console.log('✨ Total cited papers found:', matched.length);
        return matched;
    }, [pipeline]);

    const getStageInfo = (stage: string) => {
        switch (stage) {
            case 'search':
                return { emoji: '🔍', text: 'Searching for papers...', color: 'blue' };
            case 'search_complete':
                return { emoji: '✅', text: 'Search complete', color: 'green' };
            case 'revising':
                return { emoji: '📝', text: 'Reviewing papers...', color: 'blue' };
            case 'revising_complete':
                return { emoji: '✅', text: 'Review complete', color: 'green' };
            case 'synthesis':
                return { emoji: '✍️', text: 'Synthesizing answer...', color: 'blue' };
            case 'completed':
                return { emoji: '🎉', text: 'Pipeline completed!', color: 'green' };
            case 'error':
                return { emoji: '❌', text: 'Error occurred', color: 'red' };
            default:
                return { emoji: '⏳', text: 'Initializing...', color: 'gray' };
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading pipeline...</p>
                </div>
            </div>
        );
    }

    if (!pipeline) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Pipeline not found</p>
                </div>
            </div>
        );
    }

    const stageInfo = getStageInfo(pipeline.stage);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Automated Research Pipeline
                    </h1>
                    <p className="text-gray-600">Pipeline ID: {pipelineId}</p>
                </div>

                <br/>

                {/* Progress Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-6xl">{stageInfo.emoji}</div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {stageInfo.text}
                            </h2>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 bg-${stageInfo.color}-600`}
                                    style={{
                                        width: pipeline.stage === 'completed' ? '100%' :
                                            pipeline.stage.includes('synthesis') ? '85%' :
                                                pipeline.stage.includes('revising') ? '60%' :
                                                    pipeline.stage.includes('search') ? '33%' : '10%'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <br/>

                    {/* Stage Timeline */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className={`p-4 rounded-lg border-2 ${
                            pipeline.stage.includes('search') || pipeline.stage === 'completed'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                        }`}>
                            <div className="text-2xl mb-2">🔍</div>
                            <div className="font-semibold">Search</div>
                            <div className="text-sm text-gray-600">Finding papers</div>
                        </div>

                        <div className={`p-4 rounded-lg border-2 ${
                            pipeline.stage.includes('revising') || pipeline.stage === 'completed'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                        }`}>
                            <div className="text-2xl mb-2">📝</div>
                            <div className="font-semibold">Review</div>
                            <div className="text-sm text-gray-600">Filtering papers</div>
                        </div>

                        <div className={`p-4 rounded-lg border-2 ${
                            pipeline.stage === 'completed'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200'
                        }`}>
                            <div className="text-2xl mb-2">✍️</div>
                            <div className="font-semibold">Synthesis</div>
                            <div className="text-sm text-gray-600">Generating answer</div>
                        </div>
                    </div>
                </div>

                <br/>

                {/* Results Section - Only show when completed */}
                {pipeline.stage === 'completed' && summary && (
                    <div className="space-y-6">
                        {/* Search Results */}
                        {summary.search && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span>🔍</span> Search Results
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {summary.search.keywords_count}
                                        </div>
                                        <div className="text-sm text-gray-600">Keywords</div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-green-600">
                                            {summary.search.unique_papers}
                                        </div>
                                        <div className="text-sm text-gray-600">Papers Found</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-purple-600">
                                            {summary.search.total_papers_found}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Results</div>
                                    </div>
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-orange-600">
                                            {summary.search.duplicates_removed}
                                        </div>
                                        <div className="text-sm text-gray-600">Duplicates Removed</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <br/>

                        {/* Review Results */}
                        {summary.revising && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span>📝</span> Review Results
                                </h3>
                                <br/>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-green-600">
                                            {summary.revising.accepted}
                                        </div>
                                        <div className="text-sm text-gray-600">Accepted</div>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-red-600">
                                            {summary.revising.rejected}
                                        </div>
                                        <div className="text-sm text-gray-600">Rejected</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {summary.revising.papers_reviewed}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Reviewed</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <br/>

                        {/* Final Answer */}
                        {pipeline.synthesis_output && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span>✍️</span> Final Answer
                                </h3>
                                <div className="prose max-w-none">
                                    <div className="bg-gray-50 rounded-lg p-6 mb-4 whitespace-pre-wrap">
                                        {pipeline.synthesis_output.answer}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>📚 {pipeline.synthesis_output.citations.length} citations</span>
                                        <span>⭐ Confidence: {(pipeline.synthesis_output.confidence_score * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <br/>

                        {/* Referenced Papers Section */}
                        {pipeline.revising_output?.accepted_papers && pipeline.revising_output.accepted_papers.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span>📚</span> Referenced Papers
                                    {citedPapers.length > 0 && (
                                        <span className="text-sm font-normal text-gray-600">
                                            ({citedPapers.length} cited)
                                        </span>
                                    )}
                                </h3>

                                {citedPapers.length > 0 ? (
                                    <>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Papers that were cited in the final answer
                                        </p>
                                        <br/>
                                        <div className="flex-1 space-y-4">
                                            {citedPapers.map((paper, index) => (
                                                <div key={paper.id} className="flex gap-3 items-start">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mt-1">
                                                        {index + 1}
                                                    </div>
                                                    {/* Paper Card */}
                                                    <div className="flex-1">
                                                        <PaperCard
                                                            paper={paper}
                                                            status="accepted"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600 mb-4">
                                            All accepted papers used in the research
                                        </p>
                                        <br/>
                                        <div className="flex-1 space-y-4">
                                            {pipeline.revising_output.accepted_papers.map((paper, index) => (
                                                <div key={paper.id} className="flex gap-3 items-start">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-sm mt-1">
                                                        {index + 1}
                                                    </div>
                                                    {/* Paper Card */}
                                                    <div className="flex-1">
                                                        <PaperCard
                                                            paper={paper}
                                                            status="accepted"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}


                        <br/>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.href = `/pipeline/${pipelineId}`}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                            >
                                View Detailed Results
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                            >
                                New Research
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
