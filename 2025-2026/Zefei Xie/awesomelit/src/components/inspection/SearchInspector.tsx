'use client';

import { useState } from 'react';
import type { SearchAgentOutput, KeywordSearchResult } from '@/types/pipeline';
import KeywordEditor from './components/KeywordEditor';
import PaperList from './components/PaperList';

interface SearchInspectorProps {
    nodeId: string;
    nodeType: string;
    searchOutput: SearchAgentOutput | undefined;
    onApplyIntervention: (intervention: any) => void;
    isLoading: boolean;
}

export default function SearchInspector({
                                            nodeId,
                                            nodeType,
                                            searchOutput,
                                            onApplyIntervention,
                                            isLoading,
                                        }: SearchInspectorProps) {
    const [activeTab, setActiveTab] = useState<'keywords' | 'papers'>('keywords');

    if (!searchOutput) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>No search data available</p>
            </div>
        );
    }

    // 如果是关键词节点
    if (nodeType === 'keyword') {
        const keywordResult = searchOutput.keyword_results.find(
            (r) => r.keyword.keyword === nodeId.replace('keyword_', '')
        );

        if (!keywordResult) {
            return <div className="p-4 text-gray-500">Keyword not found</div>;
        }

        return (
            <div className="flex flex-col h-full">
                <div className="border-b border-gray-200 p-4">
                    <h3 className="font-semibold text-lg">{keywordResult.keyword.keyword}</h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>Importance: {(keywordResult.keyword.importance * 100).toFixed(0)}%</p>
                        <p>Papers found: {keywordResult.papers_count}</p>
                        {keywordResult.keyword.is_custom && (
                            <p className="text-purple-600 font-semibold">Custom keyword</p>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <PaperList papers={keywordResult.papers} />
                </div>
            </div>
        );
    }

    // 搜索总结视图
    return (
        <div className="flex flex-col h-full">
            <div className="border-b border-gray-200">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('keywords')}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition ${
                            activeTab === 'keywords'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Keywords ({searchOutput.keywords.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('papers')}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition ${
                            activeTab === 'papers'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Papers ({searchOutput.papers.length})
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'keywords' && (
                    <KeywordEditor
                        keywords={searchOutput.keywords}
                        onApplyIntervention={onApplyIntervention}
                        isLoading={isLoading}
                    />
                )}

                {activeTab === 'papers' && <PaperList papers={searchOutput.papers} />}
            </div>

            <div className="border-t border-gray-200 bg-gray-50 p-3">
                <div className="text-xs text-gray-600 space-y-1">
                    <p>Before dedup: {searchOutput.total_papers_before_dedup} papers</p>
                    <p>After dedup: {searchOutput.papers.length} unique papers</p>
                    <p>
                        Duplicates: {searchOutput.total_papers_before_dedup - searchOutput.papers.length}
                    </p>
                </div>
            </div>
        </div>
    );
}
