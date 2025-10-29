'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { pipelineApi } from '@/lib/api/client';
import AIChatPanel from "@/components/layout/AIChatPanel";

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

  const exampleQueries = [
    "How to visualize the conversation flow of multi-step LLM agents to diagnose and optimize the root causes of task failures?",
    "What are the latest techniques in large language model interpretability?",
  ];

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Search",
      description: "Smart agents automatically find the most relevant papers"
    },
    {
      icon: "👁️",
      title: "Visual Workflow",
      description: "See how decisions are made in real-time"
    },
    {
      icon: "⚡",
      title: "Human Control",
      description: "Intervene and guide the process at any stage"
    }
  ];

  return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <div className=" mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AL</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">AwesomeLit</span>
            </div>
            <div className="flex">
              <a href='https://github.com/Vis4Sense/student-projects/tree/main/2025-2026/Zefei%20Xie' target='_blank'>
                <img src='https://cdnjs.cloudflare.com/ajax/libs/simple-icons/9.16.0/github.svg' alt='GitHub' className='w-10 h-10'/>
              </a>
            </div>
          </div>

          <br/>
          <br/>

          {/* Hero Section */}
          <div className="grid gap-2 text-center">

            <div className="flex justify-center">
              <h1 className="text-7xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-typewriter">
                AwesomeLit
              </h1>
            </div>

            <p className="text-xl text-gray-600 mb-4">
              AI-powered research assistant with{' '}
              <span className="text-gray-900 font-semibold">human-in-the-loop</span>
            </p>

            <p className="text-gray-500 text-sm">
              Let AI handle the heavy lifting while you maintain full control
            </p>
          </div>

          <br/>
          <br/>

          {/* Search Box */}
          <div className=" mb-16">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="query" className="block text-lg font-medium text-gray-700 mb-3">
                    What would you like to research?
                  </label>
                  <div className="relative">
                  <textarea
                      id="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g., What are the latest techniques in large language model interpretability?"
                      rows={1}
                      className="w-full px-4 py-3 border-2 text-xl border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-none text-gray-900 placeholder:text-gray-400"
                  />
                  </div>
                </div>
                <br/>
                <button
                    type="submit"
                    disabled={!query.trim() || createPipelineMutation.isPending}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                >
                  {createPipelineMutation.isPending ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <span>Starting pipeline...</span>
                      </>
                  ) : (
                      <>
                        <span>Start Research</span>
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </>
                  )}
                </button>
                <br/>

                {createPipelineMutation.isError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      <strong>Error:</strong> {(createPipelineMutation.error as Error).message}
                    </div>
                )}
              </form>

              <br/>

              {/* Quick Examples */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((example, idx) => (
                      <button
                          key={idx}
                          onClick={() => setQuery(example)}
                          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition"
                      >
                        {example}
                      </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <br/>
          <br/>
          <br/>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Use AwesomeLit?</h2>
            <br/>
            <br/>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                  <div
                      key={idx}
                      className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-all group"
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
              ))}
            </div>
          </div>

          <br/>

          {/* How It Works */}
          <div className="grid rounded-3xl p-12 mb-16 gap-3">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <br/>
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                { number: "01", title: "Search & Discover", desc: "AI agents find relevant papers from multiple databases" },
                { number: "02", title: "Review & Filter", desc: "You review AI selections and add your expertise" },
                { number: "03", title: "Synthesize Answer", desc: "Get comprehensive answers with full citations" }
              ].map((step, idx) => (
                  <div key={idx} className="flex gap-10 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">
                        {step.desc}
                      </p>
                      <br/>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <br/>
          <br/>
          <br/>

          {/* Footer */}
          <footer className="text-center pt-6 border-t border-gray-200">

            <div className="flex items-center justify-center gap-3">
            <p className="text-gray-600 text-sm">
              © AwesomeLit
            </p>

            <a href="https://github.com/Vis4Sense/student-projects/tree/main/2025-2026/Zefei%20Xie" className="text-gray-500 hover:text-gray-900 text-sm transition">
                GitHub
            </a>
            </div>

          </footer>
        </div>
      </div>
  );
}


