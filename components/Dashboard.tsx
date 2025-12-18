
import React, { useState } from 'react';
import { ProcedureEntry } from '../types';
import { AIInsights } from './AIInsights';
import { exportToCSV } from '../services/exportService';
import { syncToGoogleSheets } from '../services/googleSheetsService';

interface DashboardProps {
  entries: ProcedureEntry[];
  onAddClick: () => void;
  onSettingsClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ entries, onAddClick, onSettingsClick }) => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const totalProcedures = entries.length;
  const successRate = totalProcedures > 0 
    ? Math.round((entries.filter(e => e.finalOutcome === 'Success').length / totalProcedures) * 100) 
    : 0;
  const avgAttempts = totalProcedures > 0
    ? (entries.reduce((acc, curr) => acc + curr.totalAttempts, 0) / totalProcedures).toFixed(1)
    : 0;
  const pocusUsage = totalProcedures > 0
    ? Math.round((entries.filter(e => e.pocusUsed).length / totalProcedures) * 100)
    : 0;

  const handleSync = async () => {
    const webhookUrl = localStorage.getItem('google_sheets_webhook');
    if (!webhookUrl) {
      onSettingsClick();
      return;
    }

    setSyncStatus('syncing');
    try {
      await syncToGoogleSheets(webhookUrl, entries);
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err: any) {
      setSyncStatus('error');
      setErrorMessage(err.message || 'Sync failed');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  // Calculate Top Performers dynamically
  const providerStats = entries.reduce((acc, curr) => {
    const provider = curr.providerName;
    if (!acc[provider]) {
      acc[provider] = { total: 0, success: 0 };
    }
    acc[provider].total += 1;
    if (curr.finalOutcome === 'Success') {
      acc[provider].success += 1;
    }
    return acc;
  }, {} as Record<string, { total: number, success: number }>);

  const topPerformers = Object.entries(providerStats)
    .map(([name, stats]: [string, { total: number; success: number }]) => ({
      name,
      rate: Math.round((stats.success / stats.total) * 100),
      total: stats.total
    }))
    .sort((a, b) => b.rate - a.rate || b.total - a.total)
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Clinical Overview</h2>
          <p className="text-slate-500">Real-time stats for the Avera McKennan NICU</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button 
            onClick={handleSync}
            disabled={syncStatus === 'syncing' || entries.length === 0}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold border-2 transition-all
              ${syncStatus === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 
                syncStatus === 'error' ? 'bg-red-50 border-red-500 text-red-600' :
                'border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95'}`}
          >
            <svg className={`w-5 h-5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'success' ? 'Synced!' : syncStatus === 'error' ? 'Failed' : 'Sync Sheets'}
          </button>
          
          <button 
            onClick={() => exportToCSV(entries)}
            disabled={entries.length === 0}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold border-2 transition-all
              ${entries.length > 0 
                ? 'border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:scale-95' 
                : 'border-slate-200 text-slate-300 cursor-not-allowed'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>

          <button 
            onClick={onAddClick}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            New Entry
          </button>
        </div>
      </div>

      {syncStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-xs font-medium">
          Error: {errorMessage}. Please check your Webhook URL in Settings.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Procedures" value={totalProcedures} icon="clipboard-list" color="bg-blue-500" />
        <StatCard title="Overall Success" value={`${successRate}%`} icon="trending-up" color="bg-emerald-500" />
        <StatCard title="Avg. Attempts" value={avgAttempts} icon="fingerprint" color="bg-orange-500" />
        <StatCard title="POCUS Usage" value={`${pocusUsage}%`} icon="status-online" color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AIInsights entries={entries} />
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Recent Procedures</h3>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">Live Log</span>
            </div>
            <div className="divide-y divide-slate-100">
              {entries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-700">{entry.vascularAccessType}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${entry.finalOutcome === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {entry.finalOutcome.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {entry.providerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {new Date(entry.procedureDateTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <div className="px-6 py-12 text-center text-slate-400">
                  No procedure records found. Start by adding a new entry.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-800 rounded-2xl p-6 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-2">Research Phase 2</h3>
               <p className="text-emerald-100 text-sm mb-4 leading-relaxed">We are currently evaluating the impact of Ultrasound guidance in neonates under 1000g.</p>
               <div className="bg-emerald-700/50 rounded-lg p-3 text-xs flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                 Active Data Collection Mode
               </div>
             </div>
             <svg className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10" fill="currentColor" viewBox="0 0 24 24">
               <path d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Top Performers</h3>
            <div className="space-y-4">
              {topPerformers.length > 0 ? (
                topPerformers.map((performer) => (
                  <div key={performer.name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{performer.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">({performer.total} cases)</span>
                      <span className="font-semibold text-emerald-600">{performer.rate}% Succ.</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-400 italic">
                  Data pending clinical entries...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    <div className="text-slate-500 text-sm font-medium mb-1">{title}</div>
    <div className="text-2xl font-bold text-slate-900">{value}</div>
  </div>
);
