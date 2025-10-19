'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils/cn';

interface KeywordNodeProps {
    data: {
        keyword: string;
        importance: number;
        is_custom: boolean;
        papers_count: number;
        status: string;
        papers?: any[];
        onNodeClick?: (id: string, type: string) => void;
    };
    selected?: boolean;
    id: string;
}

export default function KeywordNode({ data, selected, id }: KeywordNodeProps) {
    const statusColors = {
        pending: 'bg-gray-100 border-gray-300',
        running: 'bg-yellow-100 border-yellow-400',
        completed: 'bg-blue-100 border-blue-400',
        error: 'bg-red-100 border-red-400',
    };

    return (
        <div
            className={cn(
                'px-3 py-2 rounded-lg border-2 shadow-md min-w-[160px]',
                statusColors[data.status as keyof typeof statusColors] || statusColors.pending,
                selected && 'ring-2 ring-blue-300'
            )}
        >
            <div className="font-bold text-sm truncate">{data.keyword}</div>
            <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-600">{data.papers_count} 📄</span>
                <span className="text-xs bg-white px-1 rounded">{(data.importance * 100).toFixed(0)}%</span>
            </div>
            {data.is_custom && (
                <div className="text-xs text-purple-600 font-semibold mt-1">Custom</div>
            )}

            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </div>
    );
}
