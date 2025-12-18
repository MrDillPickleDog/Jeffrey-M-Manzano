
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { ProcedureEntry } from '../types';

interface AnalyticsViewProps {
  entries: ProcedureEntry[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200">
        <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
        <p className="text-slate-500 font-medium">Insufficient data to generate analytics.</p>
      </div>
    );
  }

  // Prep Success by Provider
  const providers = Array.from(new Set(entries.map(e => e.providerName)));
  const providerData = providers.map(p => {
    const pEntries = entries.filter(e => e.providerName === p);
    const successCount = pEntries.filter(e => e.finalOutcome === 'Success').length;
    return {
      name: p,
      successRate: Math.round((successCount / pEntries.length) * 100),
      count: pEntries.length
    };
  });

  // Prep POCUS vs Non-POCUS success
  const pocusEntries = entries.filter(e => e.pocusUsed);
  const nonPocusEntries = entries.filter(e => !e.pocusUsed);
  const pocusSuccess = pocusEntries.length > 0 ? (pocusEntries.filter(e => e.finalOutcome === 'Success').length / pocusEntries.length) * 100 : 0;
  const nonPocusSuccess = nonPocusEntries.length > 0 ? (nonPocusEntries.filter(e => e.finalOutcome === 'Success').length / nonPocusEntries.length) * 100 : 0;

  const comparisonData = [
    { name: 'POCUS Guidance', success: Math.round(pocusSuccess), attempts: pocusEntries.reduce((a, b) => a + b.totalAttempts, 0) / (pocusEntries.length || 1) },
    { name: 'Standard Landmark', success: Math.round(nonPocusSuccess), attempts: nonPocusEntries.reduce((a, b) => a + b.totalAttempts, 0) / (nonPocusEntries.length || 1) }
  ];

  // Outcome distribution
  const outcomeData = [
    { name: 'Success', value: entries.filter(e => e.finalOutcome === 'Success').length, color: '#10b981' },
    { name: 'Failure', value: entries.filter(e => e.finalOutcome === 'Failure').length, color: '#ef4444' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Advanced Analytics</h2>
          <p className="text-slate-500 text-sm">Clinical performance & trend analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Provider Success Rate */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Success Rate by Provider (%)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={providerData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="successRate" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* POCUS Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">POCUS vs. Landmark Success</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} width={120} />
                <Tooltip />
                <Bar dataKey="success" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={40} name="Success Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome Pie */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Total Outcome Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attempts Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Avg Attempts (Last 10)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={entries.slice(0, 10).reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="patientStudyId" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip />
                <Line type="monotone" dataKey="totalAttempts" stroke="#f59e0b" strokeWidth={3} dot={{r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
