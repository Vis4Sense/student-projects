'use client';

import { useState } from 'react';
import type { SynthesisAgentOutput } from '@/types/pipeline';

interface SynthesisInspectorProps {
    synthesisOutput: SynthesisAgentOutput | undefined;
    onApplyIntervention: (intervention: any) => void;
    isLoading: boolean;
}

export default function SynthesisInspector({
                                               synthesisOutput,
                                               onApplyIntervention,
                                               isLoading,
                                           }: SynthesisInspectorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedAnswer, setEditedAnswer] = useState('');

    if (!synthesisOutput) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>No synthesis data available</p>
            </div>
        );
    }

    const handleSave = () => {
        onApplyIntervention({
            stage: 'synthesis',
            action_type: 'edit_answer',
            details: {
                edited_answer: editedAnswer,
            },
        });
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Answer */}
            <div className="flex-1 min-h-1/2 overflow-y-auto p-4 border-b border-gray-200">
                {isEditing ? (
                    <textarea
                        value={editedAnswer}
                        onChange={(e) => setEditedAnswer(e.target.value)}
                        className="w-full h-full p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{synthesisOutput.answer}</p>
                    </div>
                )}
            </div>

            {/* Edit/Cancel Button */}
            <div className="border-t border-gray-200 bg-gray-50 p-3 flex space-x-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex-1 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 disabled:opacity-50"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => {
                            setEditedAnswer(synthesisOutput.answer);
                            setIsEditing(true);
                        }}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600"
                    >
                        Edit Answer
                    </button>
                )}
            </div>

            {/* 引用区域 */}
            <div className="border-t border-gray-200 bg-white p-4 max-h-64 overflow-y-auto">
                <h4 className="font-semibold text-sm mb-3">Citations ({synthesisOutput.citations.length})</h4>
                <div className="space-y-2">
                    {synthesisOutput.citations.map((citation, idx) => (
                        <div key={idx} className="text-xs bg-gray-50 p-2 rounded border border-gray-200">
                            <div className="font-semibold text-gray-900">[{idx + 1}] {citation.paper_title}</div>
                            <div className="text-gray-600 mt-1 line-clamp-2">{citation.excerpt}</div>
                            <div className="text-gray-500 mt-1">Confidence: {(citation.confidence * 100).toFixed(0)}%</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
