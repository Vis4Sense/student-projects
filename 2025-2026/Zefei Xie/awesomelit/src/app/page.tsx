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
      <div className="w-full min-h-screen flex">
        <div className="w-full">
          <div className="text-center mb-12">
            <p className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Research Agent System
            </p>
            <br/>
            <p className="text-xl text-gray-600">
              AI-powered research assistant with human-in-the-loop
            </p>
          </div>
          <br/>
          <br/>

          {/* Replace your whole card with this block */}
          <div className=" w-full bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-full space-y-5 p-5">
              <div className="w-full items-center">
                <p className="text-sm font-medium text-gray-700 mb-1">What would you like to research?</p>
                <br/>
                <div className="relative flex justify-center items-center p-2 mt-1">
                  <textarea
                      id="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder=" e.g., What are the latest techniques in large language model interpretability? "
                      rows={4}
                      className="placeholder:italic placeholder:text-slate-400 bg-white w-5/6 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm resize-none transition"
                  />
                </div>
              </div>
              <br/>
              {/* Action button */}
              <div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!query.trim() || createPipelineMutation.isPending}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {createPipelineMutation.isPending ? (
                      <>
                        <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span>Starting pipeline...</span>
                      </>
                  ) : (
                      <>
                        <span>Start Research</span>
                        {/* Inline arrow icon to avoid external deps */}
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </>
                  )}
                </button>

                {/* Error message */}
                {createPipelineMutation.isError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      Error: {(createPipelineMutation.error as Error).message}
                    </div>
                )}
              </div>
            </div>
          </div>


          <br/>
          <br/>
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>The system will guide you through the research process with AI agents</p>
            <p className="mt-1">You can intervene at any stage to refine the results</p>
          </div>
        </div>
      </div>
  );
}

