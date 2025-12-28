'use client';

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import InputForm from '../components/InputForm';
import PreviewCard from '../components/PreviewCard';
import { fetchOGData } from '../services/ogScraper';
import { OGData } from '../types';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OGData | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleUrlSubmit = async (url: string) => {
    setLoading(true);
    setError(undefined);
    setData(null);

    try {
      const result = await fetchOGData(url);
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to fetch data");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 w-full p-6 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">OG<span className="text-blue-400">Fetcher</span></span>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-20 relative z-0">
        <div className="text-center mb-10 space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight pb-2">
            Link Preview Generator
          </h1>
          <p className="text-slate-400 text-lg">
            Paste a URL to extract its Open Graph image and metadata instantly.
          </p>
        </div>

        <InputForm onSubmit={handleUrlSubmit} isLoading={loading} />
        
        <PreviewCard data={data} error={error} />

      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} OG Fetcher. Built with Next.js & Tailwind.</p>
      </footer>
    </div>
  );
}