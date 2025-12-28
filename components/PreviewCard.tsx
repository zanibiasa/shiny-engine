import React from 'react';
import { ExternalLink, ImageOff, ImageIcon } from 'lucide-react';
import { OGData } from '../types';

interface PreviewCardProps {
  data: OGData | null;
  error?: string;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ data, error }) => {
  if (error) {
    return (
      <div className="w-full max-w-xl mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
        <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
        <p>Enter a URL above to preview its Open Graph image.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      {/* Image Section */}
      <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
        {data.image ? (
          <img
            src={data.image}
            alt="Open Graph Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://picsum.photos/seed/error/800/400?grayscale&blur=2'; // Fallback
            }}
          />
        ) : (
          <div className="flex flex-col items-center text-slate-500">
            <ImageOff className="w-12 h-12 mb-2" />
            <span>No Image Found</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {data.title || 'Untitled Page'}
        </h2>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3">
          {data.description || 'No description available for this page.'}
        </p>
        
        <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-mono truncate max-w-[200px]">
            {new URL(data.url).hostname}
          </span>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Visit Website
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
