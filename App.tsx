
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProcedureForm } from './components/ProcedureForm';
import { HistoryTable } from './components/HistoryTable';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { ProcedureEntry, View } from './types';

const STORAGE_KEY = 'avera_nicu_v3_entries';

const App: React.FC = () => {
  const [entries, setEntries] = useState<ProcedureEntry[]>([]);
  const [activeView, setActiveView] = useState<View>('dashboard');

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Save data to localStorage when entries change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: ProcedureEntry) => {
    setEntries(prev => [entry, ...prev]);
    setActiveView('dashboard');
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'dashboard' && (
        <Dashboard 
          entries={entries} 
          onAddClick={() => setActiveView('form')} 
          onSettingsClick={() => setActiveView('settings')}
        />
      )}
      {activeView === 'form' && (
        <ProcedureForm onSubmit={addEntry} onCancel={() => setActiveView('dashboard')} />
      )}
      {activeView === 'history' && (
        <HistoryTable entries={entries} onDelete={deleteEntry} />
      )}
      {activeView === 'analytics' && (
        <AnalyticsView entries={entries} />
      )}
      {activeView === 'settings' && (
        <SettingsView />
      )}
    </Layout>
  );
};

export default App;
