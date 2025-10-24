'use client';

import { useState, useMemo } from 'react';
import type { Paper } from '@/types/pipeline';
import PaperCard from './PaperCard';
import { Filter, X } from 'lucide-react';

interface PaperListProps {
    papers: Paper[];
}

export default function PaperList({ papers }: PaperListProps) {
    const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
    const [selectedSource, setSelectedSource] = useState<string>('all');
    const [startMonth, setStartMonth] = useState<string>('');
    const [endMonth, setEndMonth] = useState<string>('');

    // get unique authors
    const allAuthors = useMemo(() => {
        const authorsSet = new Set<string>();
        papers.forEach(paper => {
            paper.authors.forEach(author => authorsSet.add(author));
        });
        return Array.from(authorsSet).sort();
    }, [papers]);

    // get all unique sources
    const allSources = useMemo(() => {
        const sourcesSet = new Set<string>();
        papers.forEach(paper => {
            if (paper.source) sourcesSet.add(paper.source);
        });
        return Array.from(sourcesSet).sort();
    }, [papers]);

    // Filter papers based on selected filters
    const filteredPapers = useMemo(() => {
        return papers.filter(paper => {
            // Author
            if (selectedAuthor !== 'all' && !paper.authors.includes(selectedAuthor)) {
                return false;
            }

            // Source
            if (selectedSource !== 'all' && paper.source !== selectedSource) {
                return false;
            }

            // Datw
            const paperDate = new Date(paper.published_date);
            const paperYearMonth = `${paperDate.getFullYear()}-${String(paperDate.getMonth() + 1).padStart(2, '0')}`;

            if (startMonth && paperYearMonth < startMonth) {
                return false;
            }

            if (endMonth && paperYearMonth > endMonth) {
                return false;
            }

            return true;
        });
    }, [papers, selectedAuthor, selectedSource, startMonth, endMonth]);

    // 重置筛选
    const resetFilters = () => {
        setSelectedAuthor('all');
        setSelectedSource('all');
        setStartMonth('');
        setEndMonth('');
    };

    const hasActiveFilters = selectedAuthor !== 'all' || selectedSource !== 'all' || startMonth || endMonth;

    if (papers.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>No papers found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Filter Section */}
            <div className="border-b border-gray-200 px-4 py-3 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </h3>
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Reset
                        </button>
                    )}
                </div>

                <br/>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Author Filter */}
                    <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                            Author
                        </label>
                        <select
                            value={selectedAuthor}
                            onChange={(e) => setSelectedAuthor(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Authors ({allAuthors.length})</option>
                            {allAuthors.map(author => (
                                <option key={author} value={author}>
                                    {author}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Source Filter */}
                    <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                            Source
                        </label>
                        <select
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Sources ({allSources.length})</option>
                            {allSources.map(source => (
                                <option key={source} value={source}>
                                    {source}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Month Filter */}
                    <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                            From Month
                        </label>
                        <input
                            type="month"
                            value={startMonth}
                            onChange={(e) => setStartMonth(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* End Month Filter */}
                    <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                            To Month
                        </label>
                        <input
                            type="month"
                            value={endMonth}
                            onChange={(e) => setEndMonth(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <br/>
                {/* Results Count */}
                <div className="text-xs text-gray-600">
                    Showing {filteredPapers.length} of {papers.length} papers
                </div>
            </div>

            {/* Paper List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredPapers.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                            <Filter className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                            <p>No papers match the current filters</p>
                            <button
                                onClick={resetFilters}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                            >
                                Reset filters
                            </button>
                        </div>
                    </div>
                ) : (
                    filteredPapers.map((paper) => (
                        <PaperCard
                            key={paper.id}
                            paper={paper}
                            status="neutral"
                        />
                    ))
                )}
            </div>
        </div>
    );
}
