// src/components/AIChatPanel.tsx
'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Bot, User, Loader2, Trash2, Settings } from 'lucide-react';
import { ChatMessage } from '@/types/chat';
import { chatApi } from "@/lib/api/client";

interface AIChatPanelProps {
    systemPrompt?: string;
    className?: string;
}

export interface AIChatPanelRef {
    sendMessage: (content: string) => void;
    clearChat: () => void;
}

const AIChatPanel = forwardRef<AIChatPanelRef, AIChatPanelProps>(({
                                                                      systemPrompt = "You are a helpful research assistant.",
                                                                      className = ""
                                                                  }, ref) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'system', content: systemPrompt }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const [useStreaming, setUseStreaming] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
        sendMessage: (content: string) => {
            handleSendMessage(content);
        },
        clearChat: () => {
            clearChat();
        }
    }));

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingContent]);

    // Auto-focus input
    useEffect(() => {
        inputRef.current?.focus();
    }, [isLoading]);

    const handleSendMessage = async (messageContent: string) => {
        if (!messageContent.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: messageContent.trim(),
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setStreamingContent('');

        try {
            if (useStreaming) {
                let fullResponse = '';

                await chatApi.chatStream(
                    newMessages,
                    (chunk) => {
                        fullResponse += chunk;
                        setStreamingContent(fullResponse);
                    },
                    (error) => {
                        console.error('Stream error:', error);
                        setMessages([
                            ...newMessages,
                            {
                                role: 'assistant',
                                content: `Error: ${error}`,
                            },
                        ]);
                        setIsLoading(false);
                        setStreamingContent('');
                    },
                    () => {
                        setMessages([
                            ...newMessages,
                            {
                                role: 'assistant',
                                content: fullResponse,
                            },
                        ]);
                        setIsLoading(false);
                        setStreamingContent('');
                    }
                );
            } else {
                const response = await chatApi.chat(newMessages);
                setMessages([
                    ...newMessages,
                    {
                        role: 'assistant',
                        content: response,
                    },
                ]);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                },
            ]);
            setIsLoading(false);
            setStreamingContent('');
        }
    };

    const handleSend = () => {
        handleSendMessage(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'system', content: systemPrompt }]);
        setStreamingContent('');
    };

    const displayMessages = messages.filter((msg) => msg.role !== 'system');

    return (
        <div className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            AI Assistant
                        </h2>
                        <p className="text-sm text-gray-500">
                            {useStreaming ? 'Streaming mode' : 'Standard mode'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setUseStreaming(!useStreaming)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={useStreaming ? 'Switch to standard mode' : 'Switch to streaming mode'}
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={clearChat}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Clear chat"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                {displayMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Bot className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Start a conversation
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Ask me anything about research, papers, or get help with your queries.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {displayMessages.map((message, index) => (
                            <MessageBubble key={index} message={message} />
                        ))}

                        {isLoading && streamingContent && (
                            <MessageBubble
                                message={{
                                    role: 'assistant',
                                    content: streamingContent,
                                }}
                                isStreaming
                            />
                        )}

                        {isLoading && !streamingContent && (
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                                        <span className="text-sm text-gray-600">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={1}
                            style={{
                                minHeight: '48px',
                                maxHeight: '200px',
                            }}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="flex-shrink-0 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
});

AIChatPanel.displayName = 'AIChatPanel';

export default AIChatPanel;

function MessageBubble({
                           message,
                           isStreaming = false,
                       }: {
    message: ChatMessage;
    isStreaming?: boolean;
}) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isUser ? 'bg-green-100' : 'bg-blue-100'
                }`}
            >
                {isUser ? (
                    <User className="w-5 h-5 text-green-600" />
                ) : (
                    <Bot className="w-5 h-5 text-blue-600" />
                )}
            </div>
            <div
                className={`flex-1 max-w-[80%] ${
                    isUser ? 'text-left' : 'text-left'
                }`}
            >
                <div
                    className={`inline-block px-4 py-3 rounded-lg ${
                        isUser
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                    }`}
                >
                    <div className="whitespace-pre-wrap break-words">
                        {message.content}
                        {isStreaming && (
                            <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
