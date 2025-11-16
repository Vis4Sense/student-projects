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

interface ScatterPlotProps {
    data: PaperData[];
}

export default function ScatterPlot({ data }: ScatterPlotProps) {
    const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null);
    const [hoveredPaperId, setHoveredPaperId] = useState<string | null>(null);
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

    // 使用 useMemo 缓存数据范围计算
    const dataStats = useMemo(() => {
        const xValues = data.map(p => p.x);
        const yValues = data.map(p => p.y);
        const minX = Math.min(...xValues)*0.98;
        const maxX = Math.max(...xValues)*1.02;
        const minY = Math.min(...yValues)*0.98;
        const maxY = Math.max(...yValues)*1.02;

        return {
            minX,
            maxX,
            minY,
            maxY,
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2,
            rangeX: maxX - minX,
            rangeY: maxY - minY
        };
    }, [data]);

    // 当前视图中心
    const currentCenterX = centerX ?? dataStats.centerX;
    const currentCenterY = centerY ?? dataStats.centerY;

    // 当前显示范围（关键修复：确保范围计算正确）
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

    // 按钮操作
    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.5, 10));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
    const handleReset = () => {
        setZoomLevel(1);
        setCenterX(null);
        setCenterY(null);
        setSelectedPaper(null);
    };

    // 点击论文：聚焦到该点
    const handlePaperClick = (clickData: any) => {
        const clickedPaperId = clickData.paper_id || clickData.payload?.paper_id;

        // 从原始数据中找到这篇论文
        const paper = data.find(p => p.paper_id === clickedPaperId);

        if (!paper) {
            console.error('❌ Paper not found:', clickedPaperId);
            return;
        }

        console.log('✅ Found paper:', paper.title);
        console.log('📍 Coordinates:', { x: paper.x, y: paper.y });

        setSelectedPaper(paper);
        setCenterX(paper.x);
        setCenterY(paper.y);
        setZoomLevel(1.25);
    };


    // 自定义点渲染
    const renderCustomDot = (props: any) => {
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

    // 调试信息
    console.log('📊 Data range:', {
        x: [dataStats.minX, dataStats.maxX],
        y: [dataStats.minY, dataStats.maxY],
        centerX: currentCenterX,
        centerY: currentCenterY,
        zoom: zoomLevel,
        domain: currentDomain
    });

    return (
        <div className="w-full h-full flex flex-col">
            {/* 控制栏 */}
            <div className="flex items-center gap-3 mb-3 px-2">
                <div className="flex gap-2">
                    <button
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 10}
                        className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        ➕ Zoom In
                    </button>
                    <button
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 0.5}
                        className="px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        ➖ Zoom Out
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        🔄 Reset
                    </button>
                </div>
                <span className="text-sm text-gray-600">
                    Zoom: {zoomLevel.toFixed(1)}x | Center: ({currentCenterX.toFixed(1)}, {currentCenterY.toFixed(1)})
                </span>
            </div>

            {/* 图表 */}
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
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 } }
                    >
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
                        <Tooltip cursor={{ stroke: '#999', strokeWidth: 1 }} content={() => null} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} height={36} />

                        <Scatter
                            name="Accepted"
                            data={papersByStatus.accepted}
                            shape={renderCustomDot}
                            onClick={(data: any) => handlePaperClick(data)}
                            onMouseEnter={(data: any) => setHoveredPaperId(data.paper_id)}
                            onMouseLeave={() => setHoveredPaperId(null)}
                        />
                        <Scatter
                            name="Rejected"
                            data={papersByStatus.rejected}
                            shape={renderCustomDot}
                            onClick={(data: any) => handlePaperClick(data)}
                            onMouseEnter={(data: any) => setHoveredPaperId(data.paper_id)}
                            onMouseLeave={() => setHoveredPaperId(null)}
                        />
                        <Scatter
                            name="Neutral"
                            data={papersByStatus.neutral}
                            shape={renderCustomDot}
                            onClick={(data: any) => handlePaperClick(data)}
                            onMouseEnter={(data: any) => setHoveredPaperId(data.paper_id)}
                            onMouseLeave={() => setHoveredPaperId(null)}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* 详情面板 */}
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
        </div>
    );
}
