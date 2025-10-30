'use client';

import { useState, useEffect } from 'react';
import InterventionItem from './InterventionItem';
import type { InterventionRecord } from '@/types/intervention';
import { Clock, Filter } from 'lucide-react';

interface InterventionLogProps {
    interventions: InterventionRecord[] | undefined;
    isLoading: boolean;
}

export default function InterventionLog({ interventions, isLoading }: InterventionLogProps) {
    const [filter, setFilter] = useState<string>('all');
    const [filteredInterventions, setFilteredInterventions] = useState<InterventionRecord[]>([]);

    useEffect(() => {
        if (!interventions) {
            setFilteredInterventions([]);
            return;
        }

        if (filter === 'all') {
            setFilteredInterventions(interventions);
        } else {
            setFilteredInterventions(
                interventions.filter((i) => i.action_type === filter)
            );
        }
    }, [interventions, filter]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>Loading interventions...</p>
            </div>
        );
    }

    if (!interventions || interventions.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                    <Clock className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>No interventions yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Intervention History ({filteredInterventions.length})
                </h3>

                {/* Filter */}
                <div className="flex items-center space-x-2 gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="text-xs border border-gray-300 rounded px-6 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="edit_keywords">Edit Keywords</option>
                        <option value="select_papers">Select Papers</option>
                        <option value="override_paper">Override Paper</option>
                        <option value="edit_answer">Edit Answer</option>
                    </select>
                </div>
            </div>

            {/* Intervention List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {filteredInterventions
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((intervention) => (
                        <div key={intervention.intervention_id} className="p-1">
                            <InterventionItem intervention={intervention} />
                        </div>
                    ))}
            </div>
        </div>
    );
}
