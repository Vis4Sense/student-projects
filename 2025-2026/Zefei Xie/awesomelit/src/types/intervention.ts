export interface HumanInterventionRequest {
    pipeline_id: string;
    stage: 'search' | 'revising' | 'synthesis';
    action_type: 'edit_keywords' | 'select_papers' | 'override_paper' | 'edit_answer';
    details: Record<string, any>;
    user_note?: string;
}

export interface InterventionRecord {
    intervention_id: string;
    pipeline_id: string;
    stage: string;
    action_type: string;
    details: Record<string, any>;
    user_note?: string;
    timestamp: string;
    impact_summary?: string;
}
