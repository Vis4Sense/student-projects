'use client';

import { useEffect, useState } from 'react';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { pipelineApi } from '@/lib/api/client';
import type { PipelineState, QueryRecord } from '@/types/pipeline';
import ScatterPlot from "@/components/visualization/ScatterPlot";

interface PaperVisualizationModalProps {
    pipeline: PipelineState;
    onClose: () => void;
}

interface QueryTreeNode {
    query: QueryRecord;
    children: QueryTreeNode[];
    isExpanded: boolean;
    isSelected: boolean;
}

export default function PaperVisualizationModal({
    pipeline,
    onClose
}: PaperVisualizationModalProps) {
    const [vizData, setVizData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date>(new Date());

    const [queryTree, setQueryTree] = useState<QueryTreeNode[]>([]);
    const [selectedQueries, setSelectedQueries] = useState<Set<string>>(new Set());

    const buildQueryTree = (queryHistory: QueryRecord[]): QueryTreeNode[] => {
        const queryMap = new Map<string, QueryTreeNode>();

        queryHistory.forEach(query => {
            queryMap.set(query.query_text, {
                query,
                children: [],
                isExpanded: true,
                isSelected: true
            });
        });

        const rootNodes: QueryTreeNode[] = [];
        queryHistory.forEach(query => {
            const node = queryMap.get(query.query_text)!;
            if (query.parent_query && queryMap.has(query.parent_query)) {
                queryMap.get(query.parent_query)!.children.push(node);
            } else {
                rootNodes.push(node);
            }
        });

        return rootNodes;
    };

    useEffect(() => {
        if (pipeline.query_history && pipeline.query_history.length > 0) {
            const tree = buildQueryTree(pipeline.query_history);
            setQueryTree(tree);

            const allQueries = new Set(
                pipeline.query_history.map(q => q.query_text)
            );
            setSelectedQueries(allQueries);
        }
    }, [pipeline.query_history]);

    const toggleExpand = (queryText: string) => {
        const updateNode = (nodes: QueryTreeNode[]): QueryTreeNode[] => {
            return nodes.map(node => {
                if (node.query.query_text === queryText) {
                    return { ...node, isExpanded: !node.isExpanded };
                }
                if (node.children.length > 0) {
                    return { ...node, children: updateNode(node.children) };
                }
                return node;
            });
        };
        setQueryTree(updateNode(queryTree));
    };

    const toggleQuerySelection = (queryText: string, node: QueryTreeNode) => {
        const newSelected = new Set(selectedQueries);

        const toggleNodeAndChildren = (n: QueryTreeNode, select: boolean) => {
            if (select) {
                newSelected.add(n.query.query_text);
            } else {
                newSelected.delete(n.query.query_text);
            }
            n.children.forEach(child => toggleNodeAndChildren(child, select));
        };

        const shouldSelect = !selectedQueries.has(queryText);
        toggleNodeAndChildren(node, shouldSelect);

        setSelectedQueries(newSelected);
    };

    const getFilteredVizData = () => {
        if (!vizData || selectedQueries.size === 0) return null;

        const filteredPapers = vizData.papers.filter((paper: any) =>
            selectedQueries.has(paper.found_by_query)
        );

        const filteredQueriesData = vizData.queries_data.filter((q: any) =>
            selectedQueries.has(q.query)
        );

        return {
            ...vizData,
            papers: filteredPapers,
            queries_data: filteredQueriesData
        };
    };

    const renderQueryNode = (node: QueryTreeNode, level: number = 0) => {
        const isSelected = selectedQueries.has(node.query.query_text);
        const hasChildren = node.children.length > 0;
        const queryColor = vizData?.query_colors?.[node.query.query_text] || '#999';

        return (
            <div key={node.query.query_text} className="select-none">
                <div
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50' : ''
                    }`}
                    style={{ marginLeft: `${level * 24}px` }}
                >
                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(node.query.query_text);
                            }}
                            className="p-0.5 hover:bg-gray-200 rounded"
                        >
                            {node.isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>
                    )}
                    {!hasChildren && <div className="w-5" />}

                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleQuerySelection(node.query.query_text, node)}
                        className="w-4 h-4 rounded"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div
                        className="w-5 h-5 rounded-full border-4 bg-white flex-shrink-0"
                        style={{ borderColor: queryColor }}
                    />

                    <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                        <span className={`text-sm truncate ${
                            isSelected ? 'font-medium text-gray-900' : 'text-gray-600'
                        }`}>
                            {node.query.query_text}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                            node.query.status === 'completed' 
                                ? 'bg-green-100 text-green-700' 
                                : node.query.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600'
                        }`}>
                            {node.query.status}
                        </span>
                    </div>
                </div>

                {hasChildren && node.isExpanded && (
                    <div>
                        {node.children.map(child => renderQueryNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

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

    const filteredVizData = getFilteredVizData();

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
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>

                        {/* Regenerate Button */}
                        <button
                            onClick={handleForceRegenerate}
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors"
                        >
                            Regenerate
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
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="animate-spin w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-600 font-medium">Generating visualization...</p>
                                    <p className="text-sm text-gray-500 mt-2">This may take a moment for the first time</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
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
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
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

                            {/* Query Tree Selector Query Legend */}
                            <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold">Query Hierarchy</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const allQueries = new Set(
                                                    pipeline.query_history.map(q => q.query_text)
                                                );
                                                setSelectedQueries(allQueries);
                                            }}
                                            className="text-sm px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={() => setSelectedQueries(new Set())}
                                            className="text-sm px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto p-2">
                                    {queryTree.length > 0 ? (
                                        queryTree.map(node => renderQueryNode(node))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            No queries available
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {selectedQueries.size} of {pipeline.query_history.length} queries selected
                                </p>
                            </div>

                            {/* Scatter Plot */}
                            <div className="border border-gray-200 rounded-lg bg-white p-6">
                                <div className="w-full h-[700px]">
                                    {filteredVizData?.queries_data && filteredVizData?.papers && filteredVizData.papers.length > 0 ? (
                                        <ScatterPlot data={filteredVizData.papers} queries={filteredVizData.queries_data} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <p>
                                                {selectedQueries.size === 0
                                                    ? 'Please select at least one query to visualize'
                                                    : 'No papers to visualize'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
