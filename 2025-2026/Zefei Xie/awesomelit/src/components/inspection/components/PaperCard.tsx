'use client';

import type { Paper } from '@/types/pipeline';
import { ExternalLink, Check, X } from 'lucide-react';
import { useState } from 'react';

interface PaperCardProps {
    paper: Paper;
    status: 'accepted' | 'rejected' | 'neutral';
    onAction?: () => void;
    isLoading?: boolean;
}

export default function PaperCard({
                                      paper,
                                      status,
                                      onAction,
                                      isLoading = false,
                                  }: PaperCardProps) {
    const [showModal, setShowModal] = useState(false);

    const statusColors = {
        accepted: 'border-green-200 bg-green-50',
        rejected: 'border-red-200 bg-red-50',
        neutral: 'border-gray-200 bg-white',
    };

    const statusIcons = {
        accepted: <Check className="w-4 h-4 text-green-600" />,
        rejected: <X className="w-4 h-4 text-red-600" />,
        neutral: null,
    };

    return (
        <>
            <div className="p-1 relative group">
                <div
                    className={`border rounded-lg p-3 transition-all duration-200 ${statusColors[status]} hover:shadow-lg cursor-pointer`}
                    onClick={() => setShowModal(true)}
                >
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-1">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                                {paper.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{paper.abstract}</p>

                            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                <span className="font-semibold text-gray-900">{paper.authors.slice(0, 2).join(', ')}</span>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                        {paper.source}
                                    </span>
                                    <span className="font-semibold text-gray-900">{paper.published_date}</span>
                                </div>
                            </div>

                            {paper.found_by_keywords.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {paper.found_by_keywords.map((kw) => (
                                        <span
                                            key={kw}
                                            className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                                        >
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col space-y-1">
                            {statusIcons[status] && statusIcons[status]}
                            {onAction && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAction();
                                    }}
                                    disabled={isLoading}
                                    className="p-1 hover:bg-blue-200 rounded text-blue-600 disabled:opacity-50"
                                >
                                    <ExternalLink size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {paper.relevance_score > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                            Relevance: {(paper.relevance_score * 100).toFixed(0)}%
                        </div>
                    )}
                </div>

                {/* External Link Button */}
                <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 p-1.5 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-400 transition-all opacity-0 group-hover:opacity-100"
                    title="Open paper in new tab"
                >
                    <ExternalLink className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                </a>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start">
                            <h3 className="text-lg font-bold text-gray-900 pr-8">
                                {paper.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <a
                                    href={paper.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Open paper in new tab"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col px-6 py-4 space-y-4 gap-3">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Abstract</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {paper.abstract}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Authors</h4>
                                <p className="text-sm text-gray-600">
                                    {paper.authors.join(', ')}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Published Date</h4>
                                <p className="text-sm text-gray-600">{paper.published_date}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Source</h4>
                                <p className="text-sm text-gray-600">{paper.source}</p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">URL</h4>
                                <a
                                    href={paper.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                                >
                                    {paper.url}
                                </a>
                            </div>

                            {paper.relevance_score > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Relevance Score</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-blue-500 h-3 rounded-full transition-all"
                                                style={{ width: `${paper.relevance_score * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {(paper.relevance_score * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            )}

                            {paper.found_by_keywords.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Found by Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {paper.found_by_keywords.map((kw) => (
                                            <span
                                                key={kw}
                                                className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                                            >
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
