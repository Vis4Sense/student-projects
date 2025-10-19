'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils/cn';

interface PaperPoolNodeProps {
    data: {
        total_papers: number;
        duplicates_removed: number;
        papers_by_keyword: Record<string, string[]>;
        status: string;
        onNodeClick?: (id: string, type: string) => void;
    };
    selected?: boolean;
    id: string;
}

export default function PaperPoolNode({ data, selected, id }: PaperPoolNodeProps) {
    const statusColors = {
        pending: 'bg-gray-100 border-gray-300',
        running: 'bg-yellow-100 border-yellow-400',
        completed: 'bg-green-100 border-green-400',
        error: 'bg-red-100 border-red-400',
    };

    return (
        <div
            className={cn(
                'px-4 py-3 rounded-lg border-2 shadow-md min-w-[220px]',
                statusColors[data.status as keyof typeof statusColors] || statusColors.pending,
                selected && 'ring-2 ring-blue-300'
            )}
        >
            <div className="font-bold text-sm">Paper Pool</div>
            <div className="text-xs text-gray-600 mt-2">
                Total: {data.total_papers} papers
            </div>
            <div className="text-xs text-red-600 mt-1">
                Duplicates removed: {data.duplicates_removed}
            </div>

            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </div>
    );
}
