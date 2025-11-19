// components/visualization/ScatterPlot.tsx

'use client';

import { useState, useMemo } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

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

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const queryItem = payload.find((item: any) =>
    item.name === 'Queries' ||
    (item.payload?.query && !item.payload?.paper_id && !item.payload?.title)
  );

  if (queryItem) {
    const data = queryItem.payload;
    return (
      <div className="bg-purple-50 p-3 rounded-lg shadow-lg border-2 border-purple-500 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🔍</span>
          <h4 className="font-bold text-purple-900 text-sm">Query Point</h4>
        </div>
        <p className="text-sm font-medium text-purple-800 mb-2">
          "{data.query}"
        </p>
        <div className="text-xs text-gray-600 mb-1">
          <span className="font-medium">Position:</span> ({data.x.toFixed(2)}, {data.y.toFixed(2)})
        </div>
        <p className="text-xs text-purple-600 italic mt-2">
          This represents the semantic center of the query
        </p>
      </div>
    );
  }

  const paperItem = payload.find((item: any) =>
    item.payload?.paper_id || item.payload?.title
  );

  if (paperItem) {
    const paper = paperItem.payload as PaperData;

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-sm">
        <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
          {paper.title}
        </h4>

        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            paper.status === 'accepted' ? 'bg-green-100 text-green-800' :
            paper.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {paper.status.toUpperCase()}
          </span>
          <span className="text-xs text-gray-600">
            Score: {paper.relevance_score.toFixed(2)}
          </span>
        </div>

        <div className="text-xs text-gray-600 mb-2">
          <span className="font-medium">Position:</span> ({paper.x.toFixed(2)}, {paper.y.toFixed(2)})
        </div>

        <p className="text-xs text-gray-700 mb-1">
          <span className="font-medium">Authors:</span> {paper.authors.slice(0, 3).join(', ')}
          {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
        </p>

        <p className="text-xs text-gray-700 mb-1">
          <span className="font-medium">Published:</span> {new Date(paper.published_date).toLocaleDateString()}
        </p>

        {paper.found_by_keywords && paper.found_by_keywords.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600 mb-1 font-medium">Keywords:</p>
            <div className="flex flex-wrap gap-1">
              {paper.found_by_keywords.slice(0, 3).map((keyword, idx) => (
                <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-2 italic">
          Click to view details
        </p>
      </div>
    );
  }

  // Fallback
  return null;
};



export default function ScatterPlot({ data, queries }: ScatterPlotProps) {
    const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null);
    const [selectedQuery, setSelectedQuery] = useState<QueryData | null>(null);
    const [hoveredPaperId, setHoveredPaperId] = useState<string | null>(null);
    const [hoveredQuery, setHoveredQuery] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [centerX, setCenterX] = useState<number | null>(null);
    const [centerY, setCenterY] = useState<number | null>(null);

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
                <p>No data available to visualize</p>
            </div>
        );
    }

    const papersByStatus = {
        accepted: data.filter(p => p.status === 'accepted'),
        rejected: data.filter(p => p.status === 'rejected'),
        neutral: data.filter(p => p.status === 'neutral')
    };

    const dataStats = useMemo(() => {
        // Include both papers and queries in range calculation
        const allPoints = [
            ...data.map(p => ({ x: p.x, y: p.y })),
            ...(queries || []).map(q => ({ x: q.x, y: q.y }))
        ];

        const xValues = allPoints.map(p => p.x);
        const yValues = allPoints.map(p => p.y);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);

        const xRange = maxX - minX;
        const yRange = maxY - minY;
        const xPadding = xRange * 0.1;
        const yPadding = yRange * 0.1;

        const paddedMinX = minX - xPadding;
        const paddedMaxX = maxX + xPadding;
        const paddedMinY = minY - yPadding;
        const paddedMaxY = maxY + yPadding;

        return {
            paddedMinX,
            paddedMaxX,
            paddedMinY,
            paddedMaxY,
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2,
            rangeX: paddedMaxX - paddedMinX,
            rangeY: paddedMaxY - paddedMinY
        };
    }, [data, queries]);

    const currentCenterX = centerX ?? dataStats.centerX;
    const currentCenterY = centerY ?? dataStats.centerY;

    const currentDomain = useMemo(() => {
        const displayRangeX = dataStats.rangeX / zoomLevel;
        const displayRangeY = dataStats.rangeY / zoomLevel;

        return {
            x: [
                currentCenterX - displayRangeX / 2,
                currentCenterX + displayRangeX / 2
            ] as [number, number],
            y: [
                currentCenterY - displayRangeY / 2,
                currentCenterY + displayRangeY / 2
            ] as [number, number]
        };
    }, [currentCenterX, currentCenterY, zoomLevel, dataStats.rangeX, dataStats.rangeY]);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.5, 10));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
    const handleReset = () => {
        setZoomLevel(1);
        setCenterX(null);
        setCenterY(null);
        setSelectedPaper(null);
        setSelectedQuery(null);
    };

    const handlePaperClick = (clickData: any) => {
        const clickedPaperId = clickData.paper_id || clickData.payload?.paper_id;
        const paper = data.find(p => p.paper_id === clickedPaperId);

        if (!paper) {
            console.error('❌ Paper not found:', clickedPaperId);
            return;
        }

        console.log('✅ Found paper:', paper.title);
        setSelectedPaper(paper);
        setSelectedQuery(null);
        setCenterX(paper.x);
        setCenterY(paper.y);
        setZoomLevel(1.25);
    };

    const handleQueryClick = (clickData: any) => {
        const query = clickData.query || clickData.payload?.query;
        const queryData = queries.find(q => q.query === query);

        if (!queryData) {
            console.error('❌ Query not found:', query);
            return;
        }

        console.log('✅ Found query:', queryData.query);
        setSelectedQuery(queryData);
        setSelectedPaper(null);
        setCenterX(queryData.x);
        setCenterY(queryData.y);
        setZoomLevel(1.25);
    };

    const renderPaperDot = (props: any) => {
        const { cx, cy, payload } = props;
        const isHovered = hoveredPaperId === payload.paper_id;
        const isSelected = selectedPaper?.paper_id === payload.paper_id;

        return (
            <circle
                cx={cx}
                cy={cy}
                r={payload.display.size}
                fill={payload.display.color}
                stroke={payload.display.border_color}
                strokeWidth={isSelected ? 4 : isHovered ? 3 : 2}
                opacity={hoveredPaperId === null || isHovered || isSelected ? payload.display.opacity : 0.3}
                style={{ cursor: 'pointer' }}
            />
        );
    };

    const renderQueryDot = (props: any) => {
        const { cx, cy, payload } = props;
        const isHovered = hoveredQuery === payload.query;
        const isSelected = selectedQuery?.query === payload.query;

        // Star shape for queries
        const size = 12;
        const outerRadius = isSelected ? size * 1.5 : isHovered ? size * 1.3 : size;
        const innerRadius = outerRadius * 0.5;
        const points = 5;

        let path = '';
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / points) * i - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
        }
        path += 'Z';

        return (
            <g>
                <path
                    d={path}
                    fill="#9333ea"
                    stroke="#7c3aed"
                    strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 2}
                    opacity={hoveredQuery === null || isHovered || isSelected ? 0.9 : 0.4}
                    style={{ cursor: 'pointer' }}
                />
                {/* Add a subtle glow effect */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={outerRadius * 1.5}
                    fill="none"
                    stroke="#9333ea"
                    strokeWidth={1}
                    opacity={isSelected ? 0.3 : isHovered ? 0.2 : 0}
                />
            </g>
        );
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center gap-3 mb-3 px-2">
                <div className="flex gap-2">
                    <button
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 10}
                        className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Zoom In
                    </button>
                    <button
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 0.5}
                        className="px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Zoom Out
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Reset
                    </button>
                </div>
                <span className="text-sm text-gray-600">
                    Zoom: {zoomLevel.toFixed(1)}x | Center: ({currentCenterX.toFixed(1)}, {currentCenterY.toFixed(1)})
                </span>
                <span className="text-sm text-purple-600 font-medium ml-auto">
                    ⭐ = Query Points
                </span>
            </div>

            <div
                className="flex-1 min-h-0"
                style={{ userSelect: 'none' }}
                onMouseDown={(e) => {
                    if ((e.target as HTMLElement).tagName === 'svg' ||
                        (e.target as HTMLElement).closest('.recharts-wrapper')) {
                        e.preventDefault();
                    }
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="x"
                            type="number"
                            domain={currentDomain.x}
                            allowDataOverflow
                            tick={{ fontSize: 12 }}
                            label={{ value: 'X Axis', position: 'insideBottom', offset: -10 }}
                        />
                        <YAxis
                            dataKey="y"
                            type="number"
                            domain={currentDomain.y}
                            allowDataOverflow
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Y Axis', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} height={36} />

                        {/* Paper Scatters */}
                        <Scatter
                            name="Accepted"
                            data={papersByStatus.accepted}
                            shape={renderPaperDot}
                            onClick={(data: any) => handlePaperClick(data)}
                            onMouseEnter={(data: any) => setHoveredPaperId(data.paper_id)}
                            onMouseLeave={() => setHoveredPaperId(null)}
                        />
                        <Scatter
                            name="Rejected"
                            data={papersByStatus.rejected}
                            shape={renderPaperDot}
                            onClick={(data: any) => handlePaperClick(data)}
                            onMouseEnter={(data: any) => setHoveredPaperId(data.paper_id)}
                            onMouseLeave={() => setHoveredPaperId(null)}
                        />
                        <Scatter
                            name="Neutral"
                            data={papersByStatus.neutral}
                            shape={renderPaperDot}
                            onClick={(data: any) => handlePaperClick(data)}
                            onMouseEnter={(data: any) => setHoveredPaperId(data.paper_id)}
                            onMouseLeave={() => setHoveredPaperId(null)}
                        />

                        {/* Query Scatter */}
                        {queries && queries.length > 0 && (
                            <Scatter
                                name="Queries"
                                data={queries}
                                shape={renderQueryDot}
                                onClick={(data: any) => handleQueryClick(data)}
                                onMouseEnter={(data: any) => setHoveredQuery(data.query)}
                                onMouseLeave={() => setHoveredQuery(null)}
                            />
                        )}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Selected Paper Details */}
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

            {/* Selected Query Details */}
            {selectedQuery && (
                <div className="border-t-2 border-purple-200 p-4 bg-purple-50 max-h-40 overflow-y-auto">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🔍</span>
                            <h3 className="text-lg font-bold text-purple-900">
                                Query Point
                            </h3>
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
                            This point represents the semantic center of the query in the embedding space.
                            Papers found by this query should cluster around this location.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
