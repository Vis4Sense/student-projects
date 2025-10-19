'use client';

import { useState } from 'react';
import WorkflowCanvas from '@/components/workflow/WorkflowCanvas';
import type { VisualizationData } from '@/types/workflow';

interface LeftPanelProps {
    visualization: VisualizationData | undefined;
    onNodeSelect: (nodeId: string, nodeType: string) => void;
    isLoading: boolean;
}

export default function LeftPanel({ visualization, onNodeSelect, isLoading }: LeftPanelProps) {
    return (
        <div className="w-full h-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <WorkflowCanvas
                visualizationData={visualization}
                onNodeClick={onNodeSelect}
                isLoading={isLoading}
            />
        </div>
    );
}
