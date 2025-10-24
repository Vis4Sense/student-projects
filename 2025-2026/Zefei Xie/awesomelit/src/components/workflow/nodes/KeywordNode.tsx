'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils/cn';

interface KeywordNodeProps {
    data: {
        keyword: string;
        keyword_full?: string;
        importance: number;
        is_custom: boolean;
        papers_count: number;
        status: string;
    };
    selected?: boolean;
    id: string;
}

export default function KeywordNode({ data, selected }: KeywordNodeProps) {
    const statusColors = {
        pending: 'bg-gray-100 border-gray-300',
        running: 'bg-yellow-100 border-yellow-400',
        completed: 'bg-blue-100 border-blue-400',
        error: 'bg-red-100 border-red-400',
    };

    // 强制截断（前端保险）
    const truncate = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const displayKeyword = truncate(data.keyword, 50);

    return (
        <div
            className={cn(
                'px-2 py-1.5 rounded-lg border-2 shadow-md',
                'w-[200px]',
                statusColors[data.status as keyof typeof statusColors],
                selected && 'ring-2 ring-blue-300'
            )}
            title={data.keyword_full || data.keyword}
        >
            <div
                className="font-semibold text-xs truncate"
                title={data.keyword_full || data.keyword}
            >
                {displayKeyword}
            </div>
            <div className="flex justify-between items-center mt-1 text-xs">
                <span className="text-gray-600">{data.papers_count}📄</span>
                <span className="bg-white px-1 rounded text-[10px]">
          {(data.importance * 100).toFixed(0)}%
        </span>
            </div>

            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    );
}
