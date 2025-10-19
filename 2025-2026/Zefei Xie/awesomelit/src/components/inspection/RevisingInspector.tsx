'use client';

import { useState } from 'react';
import type { RevisingAgentOutput } from '@/types/pipeline';
import PaperCard from './components/PaperCard';

interface RevisingInspectorProps {
    revisingOutput: RevisingAgentOutput | undefined;
    onApplyIntervention: (intervention: any) => void;
    isLoading: boolean;
}

export default function RevisingInspector({
                                              revisingOutput,
                                              onApplyIntervention,
                                              isLoading,
                                          }: RevisingInspectorProps) {
    const [activeTab, setActiveTab] = useState<'accepted' | 'rejected'>('accepted');

    if (!revisingOutput) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>No revising data available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="border-b border-gray-200">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('accepted')}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition ${
                            activeTab === 'accepted'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Accepted ({revisingOutput.accepted_papers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('rejected')}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition ${
                            activeTab === 'rejected'
                                ? 'border-red-500 text-red-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Rejected ({revisingOutput.rejected_papers.length})
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeTab === 'accepted' && (
                    <div className="space-y-3">
                        {revisingOutput.accepted_papers.map((paper) => (
                            <PaperCard
                                key={paper.id}
                                paper={paper}
                                status="accepted"
                                onAction={() => {
                                    onApplyIntervention({
                                        stage: 'revising',
                                        action_type: 'override_paper',
                                        details: {
                                            paper_id: paper.id,
                                            action: 'reject',
                                            reason: 'Manually rejected by user',
                                        },
                                    });
                                }}
                                isLoading={isLoading}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'rejected' && (
                    <div className="space-y-3">
                        {revisingOutput.rejected_papers.map((decision) => {
                            const paper = revisingOutput.accepted_papers.find(
                                (p) => p.id === decision.paper_id
                            );
                            return (
                                <div
                                    key={decision.paper_id}
                                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                                >
                                    <div className="text-sm font-semibold text-red-900">
                                        Rejected Paper
                                    </div>
                                    <div className="text-xs text-red-700 mt-1">{decision.reason}</div>
                                    {decision.is_overridden && (
                                        <div className="text-xs text-purple-600 mt-1">
                                            🔄 User override
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            onApplyIntervention({
                                                stage: 'revising',
                                                action_type: 'override_paper',
                                                details: {
                                                    paper_id: decision.paper_id,
                                                    action: 'accept',
                                                    reason: 'User accepted this paper',
                                                },
                                            });
                                        }}
                                        disabled={isLoading}
                                        className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        Accept Paper
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 bg-gray-50 p-3">
                <div className="text-xs text-gray-600 space-y-1">
                    <p className="font-semibold">Rejection Summary</p>
                    {Object.entries(revisingOutput.rejection_summary).map(([reason, count]) => (
                        <p key={reason}>
                            {reason}: <span className="font-semibold">{count}</span>
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
