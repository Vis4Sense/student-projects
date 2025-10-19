'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { pipelineApi } from '@/lib/api/client';
import { Search, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const createPipelineMutation = useMutation({
    mutationFn: (query: string) => pipelineApi.start(query),
    onSuccess: (data) => {
      router.push(`/pipeline/${data.pipeline_id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      createPipelineMutation.mutate(query);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Research Agent System
            </h1>
            <p className="text-xl text-gray-600">
              AI-powered research assistant with human-in-the-loop
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to research?
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <textarea
                      id="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g., What are the latest techniques in large language model interpretability?"
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <button
                  type="submit"
                  disabled={!query.trim() || createPipelineMutation.isPending}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {createPipelineMutation.isPending ? (
                    <span>Starting pipeline...</span>
                ) : (
                    <>
                      <span>Start Research</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                )}
              </button>
            </form>

            {createPipelineMutation.isError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                  Error: {(createPipelineMutation.error as Error).message}
                </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>The system will guide you through the research process with AI agents</p>
            <p className="mt-1">You can intervene at any stage to refine the results</p>
          </div>
        </div>
      </div>
  );
}

