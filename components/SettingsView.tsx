
import React, { useState, useEffect } from 'react';
import { APPS_SCRIPT_TEMPLATE } from '../services/googleSheetsService';

export const SettingsView: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem('google_sheets_webhook');
    if (savedUrl) setWebhookUrl(savedUrl);
  }, []);

  const handleSave = () => {
    localStorage.setItem('google_sheets_webhook', webhookUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    alert("Apps Script code copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2zM12 18H8v-2h4v2zm5-4H8v-2h9v2zm0-4H8V8h9v2zm-2-2.5V3.5L18.5 7H15z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Google Sheets Integration</h2>
            <p className="text-slate-500">Automatically sync your research data to a shared spreadsheet.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Apps Script Web App URL</label>
            <div className="flex gap-2">
              <input 
                type="url" 
                placeholder="https://script.google.com/macros/s/.../exec"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono text-sm"
              />
              <button 
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl font-bold transition-all active:scale-95"
              >
                {saved ? 'Saved!' : 'Save URL'}
              </button>
            </div>
            <p className="text-xs text-slate-400">This URL connects your app to your private Google Sheet.</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Setup Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-slate-600 ml-2">
              <li>Create a new <a href="https://sheets.new" target="_blank" className="text-emerald-600 underline">Google Sheet</a>.</li>
              <li>Go to <b>Extensions &gt; Apps Script</b>.</li>
              <li>Delete existing code and paste the <b>Sync Template</b> provided below.</li>
              <li>Click <b>Deploy &gt; New Deployment</b>.</li>
              <li>Select <b>Web App</b>. Access: <b>Anyone</b>.</li>
              <li>Copy the resulting Web App URL and paste it above.</li>
            </ol>
            
            <div className="mt-6">
              <button 
                onClick={() => setShowCode(!showCode)}
                className="text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-2"
              >
                {showCode ? 'HIDE CODE TEMPLATE' : 'SHOW CODE TEMPLATE'}
                <svg className={`w-4 h-4 transition-transform ${showCode ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {showCode && (
                <div className="mt-4 relative">
                  <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs overflow-x-auto h-64 border border-slate-800">
                    {APPS_SCRIPT_TEMPLATE}
                  </pre>
                  <button 
                    onClick={copyCode}
                    className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] px-2 py-1 rounded border border-slate-700"
                  >
                    COPY CODE
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
