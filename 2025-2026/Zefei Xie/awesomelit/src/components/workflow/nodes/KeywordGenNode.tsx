'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils/cn';

interface KeywordGenNodeProps {
    data: {
        keywords_count: number;
        reasoning: string;
        status: string;
        onNodeClick?: (id: string, type: string) => void;
    };
    selected?: boolean;
    id: string;
}

export default function KeywordGenNode({ data, selected, id }: KeywordGenNodeProps) {
    const statusColors = {
        pending: 'bg-gray-100 border-gray-300',
        running: 'bg-yellow-100 border-yellow-400',
        completed: 'bg-green-100 border-green-400',
        error: 'bg-red-100 border-red-400',
    };

    return (
        <div
            className={cn(
                'px-4 py-3 rounded-lg border-2 shadow-md min-w-[200px]',
                statusColors[data.status as keyof typeof statusColors] || statusColors.pending,
                selected && 'ring-2 ring-blue-200'
            )}
        >
            <div className="font-bold text-sm">Generate Keywords</div>
            <div className="text-xs text-gray-600 mt-2">Found: {data.keywords_count} keywords</div>
            <div className="text-xs text-gray-500 mt-1">Status: {data.status}</div>

            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </div>
    );
}
