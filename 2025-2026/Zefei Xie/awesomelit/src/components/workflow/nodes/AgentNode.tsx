'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils/cn';

interface AgentNodeProps {
    data: {
        agent_type: 'revising' | 'synthesis';
        status: string;
        output?: any;
    };
    selected?: boolean;
}

export default function AgentNode({ data, selected }: AgentNodeProps) {
    const statusColors = {
        pending: 'bg-gray-100 border-gray-300',
        running: 'bg-yellow-100 border-yellow-400',
        completed: 'bg-indigo-100 border-indigo-400',
        error: 'bg-red-100 border-red-400',
        awaiting_review: 'bg-orange-100 border-orange-400',
    };

    const agentLabels = {
        revising: 'Review Agent',
        synthesis: 'Synthesis',
    };

    return (
        <div
            className={cn(
                'px-3 py-2 rounded-lg border-2 shadow-md',
                'w-[110px]',  // 👈 固定宽度
                statusColors[data.status as keyof typeof statusColors],
                selected && 'ring-2 ring-blue-300'
            )}
        >
            <div className="font-bold text-xs mb-1">
                {agentLabels[data.agent_type]}
            </div>
            <div className="text-[10px] text-gray-600">
                {data.status}
            </div>
            {data.agent_type === 'revising' && data.output && (
                <div className="text-xs text-green-600 mt-1">
                    ✓ {data.output.accepted_count}
                </div>
            )}

            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    );
}
