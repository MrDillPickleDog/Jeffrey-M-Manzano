
import React, { useState, useEffect } from 'react';
import { getAIInsights } from '../services/geminiService';
import { ProcedureEntry } from '../types';

interface AIInsightsProps {
  entries: ProcedureEntry[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ entries }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generate = async () => {
    if (entries.length < 3) {
      setInsight("Collect at least 3 procedures to generate meaningful AI insights.");
      return;
    }
    setLoading(true);
    const result = await getAIInsights(entries);
    setInsight(result || 'No insights available.');
    setLoading(false);
  };

  useEffect(() => {
    if (entries.length >= 3 && !insight) {
      generate();
    }
  }, [entries.length]);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-bold">Research Intelligence</h3>
          {loading && (
            <div className="flex gap-1 ml-4">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        <div className="min-h-[120px] mb-6">
          {loading ? (
            <p className="text-slate-400 animate-pulse italic">Gemini is analyzing clinical patterns in your NICU data...</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-300">
                {insight || "No analysis generated yet."}
              </p>
            </div>
          )}
        </div>

        {!loading && (
          <button 
            onClick={generate}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 group"
          >
            <span>REGENERATE ANALYSIS</span>
            <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};
