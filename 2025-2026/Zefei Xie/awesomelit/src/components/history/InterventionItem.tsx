'use client';

import type { InterventionRecord } from '@/types/intervention';
import { Edit, CheckCircle, XCircle, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface InterventionItemProps {
  intervention: InterventionRecord;
}

export default function InterventionItem({ intervention }: InterventionItemProps) {
  const actionIcons = {
    edit_keywords: <Edit className="w-4 h-4" />,
    select_papers: <CheckCircle className="w-4 h-4" />,
    override_paper: <XCircle className="w-4 h-4" />,
    edit_answer: <FileText className="w-4 h-4" />,
  };

  const actionColors = {
    edit_keywords: 'bg-blue-100 text-blue-700',
    select_papers: 'bg-green-100 text-green-700',
    override_paper: 'bg-orange-100 text-orange-700',
    edit_answer: 'bg-purple-100 text-purple-700',
  };

  const actionLabels = {
    edit_keywords: 'Keywords Modified',
    select_papers: 'Papers Selected',
    override_paper: 'Paper Override',
    edit_answer: 'Answer Edited',
  };

  const actionType = intervention.action_type as keyof typeof actionIcons;

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 gap-2">
          <div className={`p-1.5 rounded ${actionColors[actionType] || 'bg-gray-100'}`}>
            {actionIcons[actionType] || <Edit className="w-4 h-4" />}
          </div>

          <div className="flex-1">
            <div className="font-medium text-sm text-gray-900">
              {actionLabels[actionType] || intervention.action_type}
            </div>

            {intervention.impact_summary && (
              <p className="text-xs text-gray-600 mt-1">{intervention.impact_summary}</p>
            )}

            {intervention.user_note && (
              <p className="text-xs text-gray-500 mt-1 italic">"{intervention.user_note}"</p>
            )}

            <div className="flex items-center space-x-2 mt-2 gap-2">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(intervention.timestamp), { addSuffix: true })}
              </span>
              <span className="text-xs px-2 py-0.5 bg-white rounded border border-gray-200">
                {intervention.stage}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
