'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils/cn';

interface PaperPoolNodeProps {
    data: {
        total_papers: number;
        duplicates_removed: number;
        status: string;
    };
    selected?: boolean;
}

export default function PaperPoolNode({ data, selected }: PaperPoolNodeProps) {
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
                'w-[110px]',
                statusColors[data.status as keyof typeof statusColors],
                selected && 'ring-2 ring-blue-300'
            )}
        >
            <div className="font-bold text-xs mb-1">Papers Pool</div>
            <div className="text-xs text-gray-600">
                {data.total_papers} total
            </div>
            {data.duplicates_removed > 0 && (
                <div className="text-[10px] text-red-600 mt-1">
                    -{data.duplicates_removed}
                </div>
            )}

            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    );
}
