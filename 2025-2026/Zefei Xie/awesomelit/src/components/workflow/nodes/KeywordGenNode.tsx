'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils/cn';

interface KeywordGenNodeProps {
    data: {
        keywords_count: number;
        reasoning: string;
        status: string;
    };
    selected?: boolean;
}

export default function KeywordGenNode({ data, selected }: KeywordGenNodeProps) {
    const statusColors = {
        pending: 'bg-gray-100 border-gray-300',
        running: 'bg-yellow-100 border-yellow-400',
        completed: 'bg-green-100 border-green-400',
        error: 'bg-red-100 border-red-400',
    };

    return (
        <div
            className={cn(
                'px-3 py-2 rounded-lg border-2 shadow-md',
                'w-[130px]',
                statusColors[data.status as keyof typeof statusColors],
                selected && 'ring-2 ring-blue-200'
            )}
        >
            <div className="font-bold text-xs mb-1">Keywords</div>
            <div className="text-xs text-gray-600">
                {data.keywords_count} found
            </div>

            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    );
}
