'use client';

import type { Paper } from '@/types/pipeline';
import { ExternalLink, Check, X } from 'lucide-react';

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
        <div className={`border rounded-lg p-3 ${statusColors[status]}`}>
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {paper.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{paper.abstract}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>{paper.authors.slice(0, 2).join(', ')}</span>
                        <span>{paper.published_date}</span>
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
                            onClick={onAction}
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
    );
}
