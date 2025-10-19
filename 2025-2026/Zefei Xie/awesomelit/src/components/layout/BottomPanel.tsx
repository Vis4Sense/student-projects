'use client';

import InterventionLog from '@/components/history/InterventionLog';

interface BottomPanelProps {
    interventionHistory: any;
    isLoading: boolean;
}

export default function BottomPanel({ interventionHistory, isLoading }: BottomPanelProps) {
    return (
        <div className="w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
            <InterventionLog
                interventions={interventionHistory?.interventions}
                isLoading={isLoading}
            />
        </div>
    );
}
