'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { pipelineApi } from '@/lib/api/client';
import type { PipelineState } from '@/types/pipeline';
import ScatterPlot from "@/components/visualization/ScatterPlot";

interface PaperVisualizationModalProps {
    pipeline: PipelineState;
    onClose: () => void;
}

export default function PaperVisualizationModal({
    pipeline,
    onClose
}: PaperVisualizationModalProps) {
    const [vizData, setVizData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date>(new Date());

    useEffect(() => {
        const canVisualize = [
            'search_complete',
            'revising',
            'revising_complete',
            'synthesis',
            'completed'
        ].includes(pipeline.stage);

        if (!canVisualize) {
            return;
        }

        checkAndRefresh();
    }, [pipeline.stage, pipeline.pipeline_id]);

    const checkAndRefresh = async () => {
        if (!pipeline?.pipeline_id) {
            return;
        }

        try {
            const status = await pipelineApi.checkVizRefresh(pipeline.pipeline_id);

            if (status.needs_refresh || !vizData) {
                console.log('✅ Loading visualization...');
                await loadVisualization();
            } else {
                console.log('📊 Visualization is up-to-date');
            }

        } catch (error) {
            console.error('Failed to check refresh status:', error);
        }
    };

    const loadVisualization = async (forceRegenerate: boolean = false) => {
        if (!pipeline?.pipeline_id) {
            return;
        }

        setLoading(true);

        try {
            const data = await pipelineApi.getPaperVisualization(
                pipeline.pipeline_id,
            );

            if (data.can_visualize) {
                setVizData(data);
                setLastChecked(new Date());

                console.log(`✅ Loaded visualization: ${data.papers.length} papers`);
                if (data.metadata?.cache_info) {
                    console.log(`📊 Cache: ${data.metadata.cache_info.cached} cached, ${data.metadata.cache_info.new} new`);
                }
            } else {
                console.warn('Visualization not available:', data.message);
            }
        } catch (error) {
            console.error('Failed to load visualization:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManualRefresh = () => {
        loadVisualization(false);
    };

    const handleForceRegenerate = () => {
        loadVisualization(true);
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex flex-1 relative bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Paper Evolution Visualization</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Interactive scatter plot of papers across iterations
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Cache Info */}
                        {vizData?.metadata?.cache_info && (
                            <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
                                📊 {vizData.metadata.cache_info.cached} cached, {vizData.metadata.cache_info.new} new
                            </div>
                        )}

                        {/* Last Updated */}
                        <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
                            🕐 {lastChecked.toLocaleTimeString()}
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={handleManualRefresh}
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                        >
                            {loading ? '⏳ Refreshing...' : '🔄 Refresh'}
                        </button>

                        {/* Regenerate Button */}
                        <button
                            onClick={handleForceRegenerate}
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors"
                        >
                            ♻️ Regenerate
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Close (ESC)"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
                    {!vizData ? (
                        <div className="flex items-center justify-center h-full p-12">
                            {loading ? (
                                <div className="text-center">
                                    <div className="animate-spin w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-600 font-medium">Generating visualization...</p>
                                    <p className="text-sm text-gray-500 mt-2">This may take a moment for the first time</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-gray-600 mb-2">Visualization will appear after search completes.</p>
                                    <p className="text-sm text-gray-500">Current stage: {pipeline.stage}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 p-6">
                            {/* Statistics Cards */}
                            {vizData.statistics && (
                                <div className="mb-6 grid grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-lg border">
                                        <p className="text-sm text-gray-600">Total Papers</p>
                                        <p className="text-2xl font-bold">{vizData.statistics.total_papers}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <p className="text-sm text-gray-600">Accepted</p>
                                        <p className="text-2xl font-bold text-green-600">{vizData.statistics.total_accepted}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <p className="text-sm text-gray-600">Rejected</p>
                                        <p className="text-2xl font-bold text-red-600">{vizData.statistics.total_rejected}</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <p className="text-sm text-gray-600">Queries</p>
                                        <p className="text-2xl font-bold text-blue-600">{vizData.statistics.total_queries}</p>
                                    </div>
                                </div>
                            )}

                            {/* Query Legend */}
                            {vizData.queries && vizData.query_colors && (
                                <div className="flex-1 mb-6 bg-white p-4 rounded-lg border">
                                    <h3 className="text-lg font-semibold mb-3">Query Legend (Border Colors)</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {vizData.queries.map((query: string) => (
                                            <div key={query} className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded-full border-4 bg-white"
                                                    style={{ borderColor: vizData.query_colors[query] }}
                                                ></div>
                                                <span className="text-sm">{query}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Status Legend */}
                            <div className="flex-1 mb-6 bg-white p-4 rounded-lg border">
                                <h3 className="text-lg font-semibold mb-3">Status Legend (Fill Colors)</h3>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-green-500"></div>
                                        <span className="text-sm">Accepted</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-red-500"></div>
                                        <span className="text-sm">Rejected</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                                        <span className="text-sm">Neutral</span>
                                    </div>
                                </div>
                            </div>

                            {/* Scatter Plot Placeholder */}
                            <div className="border rounded-lg bg-white p-6">
                                <div className="text-center text-gray-600">
                                    <p className="mb-2 text-lg font-semibold">📊 Scatter Plot Visualization</p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {vizData.papers?.length || 0} papers loaded
                                    </p>



                                    <div className="border rounded-lg bg-white p-6">
                                        <div className="w-full h-[700px]">
                                            {vizData?.papers && vizData.papers.length > 0 ? (
                                                <ScatterPlot data={vizData.papers} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <p>No papers to visualize</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
