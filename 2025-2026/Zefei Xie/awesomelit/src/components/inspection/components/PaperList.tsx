'use client';

import type { Paper } from '@/types/pipeline';
import PaperCard from './PaperCard';

interface PaperListProps {
    papers: Paper[];
}

export default function PaperList({ papers }: PaperListProps) {
    if (papers.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>No papers found</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-3">
            {papers.map((paper) => (
                <PaperCard
                    key={paper.id}
                    paper={paper}
                    status="neutral"
                />
            ))}
        </div>
    );
}
