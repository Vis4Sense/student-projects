'use client';

import { useState, RefObject } from 'react';
import type { Keyword } from '@/types/pipeline';
import { X, Plus, Sparkles } from 'lucide-react';
import { AIChatPanelRef } from '@/components/layout/AIChatPanel';

interface KeywordEditorProps {
    keywords: Keyword[];
    onApplyIntervention: (intervention: any) => void;
    isLoading: boolean;
    chatPanelRef: RefObject<AIChatPanelRef | null>;
}

export default function KeywordEditor({
                                          keywords,
                                          onApplyIntervention,
                                          isLoading,
                                          chatPanelRef,
                                      }: KeywordEditorProps) {
    const [editedKeywords, setEditedKeywords] = useState<Keyword[]>(keywords);
    const [newKeyword, setNewKeyword] = useState('');

    const handleExplainKeyword = (keyword: string) => {
        if (chatPanelRef.current) {
            const message = `Please explain the concept of "${keyword}" in the context of academic research briefly and concisely. Include its definition, key characteristics, and relevance to literature review.`;
            chatPanelRef.current.sendMessage(message);
        } else {
            console.warn('AI Chat panel not available');
        }
    };

    const handleAddKeyword = () => {
        if (newKeyword.trim()) {
            setEditedKeywords([
                ...editedKeywords,
                {
                    keyword: newKeyword,
                    importance: 0.8,
                    is_custom: true,
                },
            ]);
            setNewKeyword('');
        }
    };

    const handleRemoveKeyword = (index: number) => {
        setEditedKeywords(editedKeywords.filter((_, i) => i !== index));
    };

    const handleUpdateImportance = (index: number, importance: number) => {
        const updated = [...editedKeywords];
        updated[index].importance = importance;
        setEditedKeywords(updated);
    };

    const handleSave = () => {
        const addedKeywords = editedKeywords.filter(
            (kw) => !keywords.find((k) => k.keyword === kw.keyword)
        );
        const removedKeywords = keywords
            .filter((kw) => !editedKeywords.find((k) => k.keyword === kw.keyword))
            .map((kw) => kw.keyword);

        const adjustments = editedKeywords
            .filter((kw) => {
                const original = keywords.find((k) => k.keyword === kw.keyword);
                return original && original.importance !== kw.importance;
            })
            .reduce(
                (acc, kw) => {
                    acc[kw.keyword] = kw.importance;
                    return acc;
                },
                {} as Record<string, number>
            );

        onApplyIntervention({
            stage: 'search',
            action_type: 'edit_keywords',
            details: {
                add_keywords: addedKeywords.map((kw) => ({
                    keyword: kw.keyword,
                    importance: kw.importance,
                })),
                remove_keywords: removedKeywords,
                adjust_importance: adjustments,
            },
        });
    };

    return (
        <div className="p-4 space-y-4">
            <div>
                <h4 className="font-semibold text-sm mb-3">Current Keywords</h4>
                <div className="space-y-2">
                    {editedKeywords.map((kw, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-gray-50 p-2 rounded gap-2">
                            <div className="flex-1 text-sm font-medium min-w-0">
                                {kw.keyword}
                                {kw.is_custom && (
                                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                                        Custom
                                    </span>
                                )}
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={kw.importance * 100}
                                onChange={(e) => handleUpdateImportance(idx, parseInt(e.target.value) / 100)}
                                className="w-32 flex-shrink-0"
                            />
                            <span className="text-xs text-gray-600 w-10 text-right flex-shrink-0">
                                {(kw.importance * 100).toFixed(0)}%
                            </span>

                            <button
                                onClick={() => handleExplainKeyword(kw.keyword)}
                                className="p-1.5 hover:bg-blue-100 rounded text-blue-600 transition-colors flex-shrink-0"
                                title="Explain this keyword"
                            >
                                <Sparkles size={16} />
                            </button>

                            <button
                                onClick={() => handleRemoveKeyword(idx)}
                                className="p-1.5 hover:bg-red-100 rounded text-red-500 transition-colors flex-shrink-0"
                                title="Remove keyword"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <br/>

            <div>
                <h4 className="font-semibold text-sm mb-2">Add New Keyword</h4>
                <div className="flex space-x-2 gap-4">
                    <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                        placeholder="Enter new keyword..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddKeyword}
                        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            <br/>

            <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 disabled:opacity-50"
            >
                Apply Changes
            </button>
        </div>
    );
}
