'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils/cn';

interface QueryNodeProps {
    data: {
        query: string;
        timestamp: string;
        onNodeClick?: (id: string, type: string) => void;
    };
    selected?: boolean;
}

export default function QueryNode({ data, selected }: QueryNodeProps) {
    return (
        <div
            className={cn(
                'px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[250px]',
                selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
            )}
        >
            <div className="font-bold text-sm text-gray-700">User Query</div>
            <div className="text-xs text-gray-600 mt-2 line-clamp-3">{data.query}</div>
            <div className="text-xs text-gray-400 mt-2">{new Date(data.timestamp).toLocaleTimeString()}</div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
