'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils/cn';

interface QueryNodeProps {
    data: {
        query: string;
        query_preview?: string;
        timestamp: string;
    };
    selected?: boolean;
}

export default function QueryNode({ data, selected }: QueryNodeProps) {
    const displayQuery = data.query_preview || data.query;

    return (
        <div
            className={cn(
                'px-3 py-2 rounded-lg border-2 bg-white shadow-md',
                'w-[150px]',
                selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
            )}
            title={data.query}
        >
            <div className="font-bold text-xs text-gray-700 mb-1">User Query</div>
            <div className="text-[10px] text-gray-600 break-words whitespace-normal">
                {displayQuery}
            </div>
            <div className="text-[9px] text-gray-400 mt-1">
                {new Date(data.timestamp).toLocaleTimeString()}
            </div>
            <Handle type="source" position={Position.Right} />
        </div>
    );
}

