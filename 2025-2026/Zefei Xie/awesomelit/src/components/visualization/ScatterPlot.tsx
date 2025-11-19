// components/visualization/ScatterPlot.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
// @ts-ignore
import type Plotly from 'plotly.js';

// @ts-ignore
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PaperData {
    paper_id: string;
    title: string;
    authors: string[];
    abstract: string;
    url: string;
    published_date: string;
    found_by_query: string;
    status: string;
    relevance_score: number;
    found_by_keywords: string[];
    x: number;
    y: number;
    display: {
        color: string;
        border_color: string;
        size: number;
        opacity: number;
    };
}

interface QueryData {
    query: string;
    x: number;
    y: number;
}

interface ScatterPlotProps {
    data: PaperData[];
    queries: QueryData[];
}

export default function ScatterPlot({ data, queries }: ScatterPlotProps) {
    const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null);
    const [selectedQuery, setSelectedQuery] = useState<QueryData | null>(null);

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
                <p>No data available</p>
            </div>
        );
    }

    const papersByStatus = {
        accepted: data.filter(p => p.status === 'accepted'),
        rejected: data.filter(p => p.status === 'rejected'),
        neutral: data.filter(p => p.status === 'neutral')
    };

    const createPaperHoverText = (paper: PaperData) => {
        const authorList = paper.authors.slice(0, 3).join(', ') +
            (paper.authors.length > 3 ? ` +${paper.authors.length - 3} more` : '');

        const keywords = paper.found_by_keywords && paper.found_by_keywords.length > 0
            ? paper.found_by_keywords.slice(0, 5).join(', ')
            : 'None';

        const publishDate = paper.published_date
            ? new Date(paper.published_date).toLocaleDateString()
            : 'Unknown';

        return `<b style="font-size: 14px;">${paper.title}</b><br>` +
               `<br><b>Status:</b> ${paper.status.toUpperCase()}` +
               `<br><b>Relevance:</b> ${paper.relevance_score.toFixed(3)}` +
               `<br><b>Authors:</b> ${authorList}` +
               `<br><b>Published:</b> ${publishDate}` +
               `<br><b>Query:</b> ${paper.found_by_query}` +
               `<br><b>Keywords:</b> ${keywords}` +
               `<br><b>Position:</b> (${paper.x.toFixed(2)}, ${paper.y.toFixed(2)})` +
               `<br><br><i>Click to view details</i>`;  // ✅ 提示可以点击
    };

    const createQueryHoverText = (query: QueryData) => {
        return `<b style="font-size: 15px;">⭐ QUERY POINT</b><br>` +
               `<br><b>Query:</b> ${query.query}` +
               `<br><b>Position:</b> (${query.x.toFixed(2)}, ${query.y.toFixed(2)})` +
               `<br><br><i>Semantic center of the query.<br>` +
               `Papers cluster nearby.</i>` +
               `<br><br><i>Click to view details</i>`;  // ✅ 提示可以点击
    };

    const traces: any[] = [
        {
            x: papersByStatus.accepted.map(p => p.x),
            y: papersByStatus.accepted.map(p => p.y),
            mode: 'markers',
            type: 'scatter',
            name: 'Accepted',
            marker: {
                size: papersByStatus.accepted.map(p => p.display.size),
                color: papersByStatus.accepted.map(p => p.display.color),
                line: {
                    color: papersByStatus.accepted.map(p => p.display.border_color),
                    width: 2
                }
            },
            text: papersByStatus.accepted.map(p => createPaperHoverText(p)),
            customdata: papersByStatus.accepted.map((p, idx) => ({ type: 'paper', index: idx, status: 'accepted' })),
            hovertemplate: '%{text}<extra></extra>'
        },
        {
            x: papersByStatus.rejected.map(p => p.x),
            y: papersByStatus.rejected.map(p => p.y),
            mode: 'markers',
            type: 'scatter',
            name: 'Rejected',
            marker: {
                size: papersByStatus.rejected.map(p => p.display.size),
                color: papersByStatus.rejected.map(p => p.display.color),
                line: {
                    color: papersByStatus.rejected.map(p => p.display.border_color),
                    width: 2
                }
            },
            text: papersByStatus.rejected.map(p => createPaperHoverText(p)),
            customdata: papersByStatus.rejected.map((p, idx) => ({ type: 'paper', index: idx, status: 'rejected' })),
            hovertemplate: '%{text}<extra></extra>'
        },
        {
            x: papersByStatus.neutral.map(p => p.x),
            y: papersByStatus.neutral.map(p => p.y),
            mode: 'markers',
            type: 'scatter',
            name: 'Neutral',
            marker: {
                size: papersByStatus.neutral.map(p => p.display.size),
                color: papersByStatus.neutral.map(p => p.display.color),
                line: {
                    color: papersByStatus.neutral.map(p => p.display.border_color),
                    width: 2
                }
            },
            text: papersByStatus.neutral.map(p => createPaperHoverText(p)),
            customdata: papersByStatus.neutral.map((p, idx) => ({ type: 'paper', index: idx, status: 'neutral' })),
            hovertemplate: '%{text}<extra></extra>'
        },
        ...(queries && queries.length > 0 ? [{
            x: queries.map(q => q.x),
            y: queries.map(q => q.y),
            mode: 'markers',
            type: 'scatter',
            name: 'Queries',
            marker: {
                size: 20,
                color: '#9333ea',
                symbol: 'star',
                line: { color: '#ffffff', width: 2 }
            },
            text: queries.map(q => createQueryHoverText(q)),
            customdata: queries.map((q, idx) => ({ type: 'query', index: idx })),
            hovertemplate: '%{text}<extra></extra>'
        }] : [])
    ];

    const handlePlotClick = (event: Readonly<Plotly.PlotMouseEvent>) => {
        console.log('🎯 Plot clicked!', event);

        if (!event.points || event.points.length === 0) {
            console.log('❌ No points');
            return;
        }

        const point = event.points[0];
        const customData = point.customdata as any;

        console.log('📍 Point data:', {
            traceName: point.data.name,
            customData,
            pointIndex: point.pointIndex
        });

        if (customData?.type === 'query') {
            const query = queries[customData.index];
            console.log('✅ Selected query:', query);
            setSelectedQuery(query);
            setSelectedPaper(null);
        } else if (customData?.type === 'paper') {
            let paper: PaperData | undefined;

            if (customData.status === 'accepted') {
                paper = papersByStatus.accepted[customData.index];
            } else if (customData.status === 'rejected') {
                paper = papersByStatus.rejected[customData.index];
            } else if (customData.status === 'neutral') {
                paper = papersByStatus.neutral[customData.index];
            }

            if (paper) {
                console.log('✅ Selected paper:', paper.title);
                setSelectedPaper(paper);
                setSelectedQuery(null);
            }
        }
    };

    // @ts-ignore
    const PlotComponent = Plot as any;

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1">
                <PlotComponent
                    data={traces}
                    layout={{
                        autosize: true,
                        hovermode: 'closest',
                        showlegend: true,
                        xaxis: {
                            title: 'Dimension 1',
                            gridcolor: '#e5e7eb'
                        },
                        yaxis: {
                            title: 'Dimension 2',
                            gridcolor: '#e5e7eb'
                        },
                        margin: { l: 60, r: 60, t: 40, b: 60 },
                        plot_bgcolor: '#ffffff',
                        paper_bgcolor: '#ffffff',
                        hoverlabel: {
                            bgcolor: '#1f2937',
                            bordercolor: '#000000',
                            font: {
                                size: 14,
                                family: 'Inter, system-ui, sans-serif',
                                color: '#ffffff'
                            },
                            align: 'left',
                            namelength: -1
                        }
                    }}
                    style={{ width: '100%', height: '100%' }}
                    config={{
                        responsive: true,
                        displayModeBar: true,
                        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                        displaylogo: false
                    }}
                    onClick={handlePlotClick}
                    onInitialized={(figure: any, graphDiv: any) => {
                        console.log('📊 Plotly initialized');
                    }}
                />
            </div>

            {selectedPaper && (
                <div className="border-t border-gray-200 p-4 bg-gray-50 max-h-60 overflow-y-auto">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
                            {selectedPaper.title}
                        </h3>
                        <button onClick={() => setSelectedPaper(null)} className="text-gray-400 hover:text-gray-600 ml-2">
                            ✕
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Authors:</span> {selectedPaper.authors.join(', ')}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Query:</span> {selectedPaper.found_by_query}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                                selectedPaper.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                selectedPaper.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                                {selectedPaper.status}
                            </span>
                        </p>
                        <div>
                            <p className="text-sm text-gray-600 font-medium mb-1">Abstract:</p>
                            <p className="text-sm text-gray-700 line-clamp-3">{selectedPaper.abstract}</p>
                        </div>
                        <a href={selectedPaper.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            View Paper →
                        </a>
                    </div>
                </div>
            )}

            {selectedQuery && (
                <div className="border-t-2 border-purple-200 p-4 bg-purple-50 max-h-40 overflow-y-auto">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">⭐</span>
                            <h3 className="text-lg font-bold text-purple-900">Query Point</h3>
                        </div>
                        <button onClick={() => setSelectedQuery(null)} className="text-purple-400 hover:text-purple-600 ml-2">
                            ✕
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-semibold text-purple-800">
                            "{selectedQuery.query}"
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Position:</span> ({selectedQuery.x.toFixed(2)}, {selectedQuery.y.toFixed(2)})
                        </p>
                        <p className="text-sm text-purple-700 italic">
                            Semantic center of the query in embedding space
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
