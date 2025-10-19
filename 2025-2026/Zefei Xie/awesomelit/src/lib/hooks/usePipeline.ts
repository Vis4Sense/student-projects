'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pipelineApi } from '@/lib/api/client';
import type { PipelineState} from '@/types/pipeline';
import type { HumanInterventionRequest } from '@/types/intervention';

export function usePipeline(pipelineId: string | null) {
    const queryClient = useQueryClient();

    const { data: pipeline, isLoading, error, refetch } = useQuery({
        queryKey: ['pipeline', pipelineId],
        queryFn: () => pipelineApi.get(pipelineId!),
        enabled: !!pipelineId,
        refetchInterval: 2000,
        staleTime: 0,
    });

    const { data: visualization } = useQuery({
        queryKey: ['visualization', pipelineId],
        queryFn: () => pipelineApi.getVisualization(pipelineId!),
        enabled: !!pipelineId,
        refetchInterval: 2000,
        staleTime: 0,
    });

    const { data: stats } = useQuery({
        queryKey: ['stats', pipelineId],
        queryFn: () => pipelineApi.getStats(pipelineId!),
        enabled: !!pipelineId,
        refetchInterval: 2000,
    });

    const { data: interventionHistory } = useQuery({
        queryKey: ['interventions', pipelineId],
        queryFn: () => pipelineApi.getInterventionHistory(pipelineId!),
        enabled: !!pipelineId,
        refetchInterval: 2000,
    });

    const applyInterventionMutation = useMutation({
        mutationFn: (intervention: HumanInterventionRequest) =>
            pipelineApi.applyIntervention(pipelineId!, intervention),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pipeline', pipelineId] });
            queryClient.invalidateQueries({ queryKey: ['visualization', pipelineId] });
            queryClient.invalidateQueries({ queryKey: ['interventions', pipelineId] });
        },
    });

    const continueMutation = useMutation({
        mutationFn: () => pipelineApi.continue(pipelineId!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pipeline', pipelineId] });
            queryClient.invalidateQueries({ queryKey: ['visualization', pipelineId] });
        },
    });

    return {
        pipeline,
        visualization,
        stats,
        interventionHistory,
        isLoading,
        error,
        refetch,
        applyIntervention: applyInterventionMutation.mutate,
        applyInterventionLoading: applyInterventionMutation.isPending,
        continue: continueMutation.mutate,
        continueLoading: continueMutation.isPending,
    };
}
