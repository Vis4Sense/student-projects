export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    messages: ChatMessage[];
}

export interface ChatResponse {
    message: string;
}