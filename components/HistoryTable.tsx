
import React, { useState } from 'react';
import { ProcedureEntry } from '../types';
import { exportToCSV } from '../services/exportService';

interface HistoryTableProps {
  entries: ProcedureEntry[];
  onDelete: (id: string) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ entries, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = entries.filter(e => 
    e.patientStudyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.vascularAccessType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Procedure Logs</h2>
          <p className="text-slate-500 text-sm">Reviewing {entries.length} historical records</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => exportToCSV(entries)}
            disabled={entries.length === 0}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2
              ${entries.length > 0 
                ? 'border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:scale-95' 
                : 'border-slate-200 text-slate-300 cursor-not-allowed'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by ID, provider, type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-full md:w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">POCUS</th>
              <th className="px-6 py-4">Attempts</th>
              <th className="px-6 py-4">Outcome</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                  {new Date(entry.procedureDateTime).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-800">{entry.patientStudyId}</td>
                <td className="px-6 py-4 text-slate-600">{entry.providerName}</td>
                <td className="px-6 py-4">
                  <span className="text-slate-600">{entry.vascularAccessType}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${entry.pocusUsed ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    {entry.pocusUsed ? 'YES' : 'NO'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{entry.totalAttempts}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${entry.finalOutcome === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {entry.finalOutcome}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-600 transition-all"
                    title="Delete Record"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-20 text-center text-slate-400">
                  No matching procedure records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
