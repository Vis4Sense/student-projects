'use client';

import { useState } from 'react';
import type { RevisingAgentOutput } from '@/types/pipeline';
import PaperCard from './components/PaperCard';
import { ExternalLink, Check, X } from 'lucide-react';


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
                                onReject={() => {
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
                            const paper = decision.paper

                            return (
                                <div key={decision.paper_id} className="p-1">
                                    <div className="space-y-0">
                                        {/* Rejection Reason - attached to bottom of card */}
                                        <div className="mx-1 mt-2 bg-white border border-red-200 rounded-lg p-3 shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                    <X className="w-4 h-4 text-red-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-xs font-semibold text-gray-900 mb-1">
                                                        Why was this rejected?
                                                    </h5>
                                                    <p className="text-xs text-gray-700 leading-relaxed">
                                                        {decision.reason}
                                                    </p>
                                                    {decision.is_overridden && (
                                                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 border border-purple-300 text-purple-700 rounded-md text-xs font-medium">
                                                            <span>🔄</span>
                                                            <span>Overridden by user</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <PaperCard
                                            paper={paper}
                                            status="rejected"
                                            onAccept={() => {
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
                                            isLoading={isLoading}
                                        />

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

            {/*<div className="border-t border-gray-200 bg-gray-50 p-3">*/}
            {/*    <div className="text-xs text-gray-600 space-y-1">*/}
            {/*        <p className="font-semibold">Rejection Summary</p>*/}
            {/*        {Object.entries(revisingOutput.rejection_summary).map(([reason, count]) => (*/}
            {/*            <p key={reason}>*/}
            {/*                {reason}: <span className="font-semibold">{count}</span>*/}
            {/*            </p>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}
