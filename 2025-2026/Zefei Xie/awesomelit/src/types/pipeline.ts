export interface Keyword {
    keyword: string;
    importance: number;
    is_custom: boolean;
}

export interface Paper {
    id: string;
    title: string;
    abstract: string;
    authors: string[];
    url: string;
    published_date: string;
    source: string;
    relevance_score: number;
    found_by_keywords: string[];
    human_tag: "accepted" | "rejected" | "neutral";
    found_by_query: string;
}

export interface KeywordSearchResult {
    keyword: Keyword;
    papers: Paper[];
    papers_count: number;
    search_timestamp: string;
}

export interface SearchAgentOutput {
    keywords: Keyword[];
    keyword_results: KeywordSearchResult[];
    papers: Paper[];
    papers_by_keyword: Record<string, string[]>;
    reasoning: string;
    total_papers_before_dedup: number;
}

export interface PaperReviewDecision {
    paper_id: string;
    paper: Paper;
    decision: 'accept' | 'reject';
    reason: string;
    is_overridden: boolean;
    human_note?: string;
}

export interface RevisingAgentOutput {
    accepted_papers: Paper[];
    rejected_papers: PaperReviewDecision[];
    rejection_summary: Record<string, number>;
}

export interface Citation {
    paper_id: string;
    paper_title: string;
    excerpt: string;
    confidence: number;
}

export interface SynthesisAgentOutput {
    answer: string;
    citations: Citation[];
    confidence_score: number;
    structure: Record<string, any>;
}

export interface PipelineState {
    pipeline_id: string;
    stage: 'search' | 'search_complete' | 'revising' | 'revising_complete' | 'synthesis' | 'completed' | 'error';
    historyPapers: Paper[];
    needs_viz_refresh: boolean;
    search_output?: SearchAgentOutput;
    revising_output?: RevisingAgentOutput;
    synthesis_output?: SynthesisAgentOutput;
    human_interventions: any[];
    created_at: string;
    updated_at: string;
}

