'use client';

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto mb-8">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
        <div className="relative flex items-center bg-slate-900 rounded-lg p-1">
          <div className="flex-1 flex items-center pl-4">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-3 text-base"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url}
            className={`px-6 py-3 rounded-md font-medium text-white transition-all duration-200 flex items-center gap-2
              ${isLoading || !url 
                ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30'
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Fetching...</span>
              </>
            ) : (
              <span>Get Image</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InputForm;