'use client';

import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils/cn';

interface AgentNodeProps {
    data: {
        agent_type: 'revising' | 'synthesis';
        status: string;
        output?: any;
        onNodeClick?: (id: string, type: string) => void;
    };
    selected?: boolean;
    id: string;
}

export default function AgentNode({ data, selected, id }: AgentNodeProps) {
    const statusColors = {
        pending: 'bg-gray-100 border-gray-300',
        running: 'bg-yellow-100 border-yellow-400',
        completed: 'bg-indigo-100 border-indigo-400',
        error: 'bg-red-100 border-red-400',
        awaiting_review: 'bg-orange-100 border-orange-400',
    };

    const agentLabels = {
        revising: 'Revising Agent',
        synthesis: 'Synthesis Agent',
    };

    return (
        <div
            className={cn(
                'px-4 py-3 rounded-lg border-2 shadow-md min-w-[200px]',
                statusColors[data.status as keyof typeof statusColors] || statusColors.pending,
                selected && 'ring-2 ring-blue-300'
            )}
        >
            <div className="font-bold text-sm">{agentLabels[data.agent_type]}</div>
            <div className="text-xs text-gray-600 mt-2">Status: {data.status}</div>
            {data.agent_type === 'revising' && data.output && (
                <div className="text-xs text-gray-600 mt-1">
                    ✓ {data.output.accepted_count} accepted
                </div>
            )}

            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </div>
    );
}
