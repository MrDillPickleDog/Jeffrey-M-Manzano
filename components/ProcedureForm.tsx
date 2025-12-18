
import React, { useState } from 'react';
import { ProcedureEntry, Provider, Room, VascularAccessType, Outcome, Sex } from '../types';

interface ProcedureFormProps {
  onSubmit: (entry: ProcedureEntry) => void;
  onCancel: () => void;
}

export const ProcedureForm: React.FC<ProcedureFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    providerName: '' as Provider | '',
    procedureDateTime: new Date().toISOString().slice(0, 16),
    patientStudyId: '',
    patientAgeDays: '',
    patientSex: '' as Sex | '',
    medicalConditions: '',
    roomNumber: '' as Room | '',
    currentWeightGrams: '',
    correctedGestationalAgeWeeks: '',
    vascularAccessType: 'PIV Insertion' as VascularAccessType,
    pocusUsed: 'no',
    totalAttempts: '1',
    finalOutcome: 'Success' as Outcome,
    comments: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entry: ProcedureEntry = {
      id: crypto.randomUUID(),
      providerName: formData.providerName as Provider,
      procedureDateTime: formData.procedureDateTime,
      patientStudyId: formData.patientStudyId,
      patientAgeDays: formData.patientAgeDays ? parseInt(formData.patientAgeDays) : undefined,
      patientSex: formData.patientSex as Sex || undefined,
      medicalConditions: formData.medicalConditions,
      roomNumber: formData.roomNumber as Room,
      currentWeightGrams: formData.currentWeightGrams ? parseFloat(formData.currentWeightGrams) : undefined,
      correctedGestationalAgeWeeks: formData.correctedGestationalAgeWeeks ? parseFloat(formData.correctedGestationalAgeWeeks) : undefined,
      vascularAccessType: formData.vascularAccessType,
      pocusUsed: formData.pocusUsed === 'yes',
      totalAttempts: parseInt(formData.totalAttempts),
      finalOutcome: formData.finalOutcome,
      comments: formData.comments,
      timestamp: Date.now(),
    };

    onSubmit(entry);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto animate-slideUp">
      <div className="bg-emerald-600 text-white p-8 rounded-t-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-2">New Procedure Record</h2>
        <p className="opacity-90">Enter detailed clinical data for research tracking.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-3xl shadow-xl border-x border-b border-slate-200 space-y-8">
        {/* Core Info */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">Administrative Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Provider Name *</label>
              <select 
                name="providerName" 
                required 
                value={formData.providerName}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Provider</option>
                {['Dr. Barber', 'Dr. Fish', 'Dr. Hansen', 'Dr. Lopez', 'Dr. Manzano', 'Dr. Wang'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Date & Time *</label>
              <input 
                type="datetime-local" 
                name="procedureDateTime"
                required 
                value={formData.procedureDateTime}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Patient Study ID *</label>
              <input 
                type="text" 
                name="patientStudyId"
                placeholder="E.g. Study-001"
                required 
                value={formData.patientStudyId}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Room Number *</label>
              <select 
                name="roomNumber" 
                required 
                value={formData.roomNumber}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Room</option>
                {['NICU 1', 'NICU 2', 'NICU 3', 'Pod A', 'Pod B', 'Pod C'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Patient Demographics */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">Patient Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Patient Age (days)</label>
              <input 
                type="number" 
                name="patientAgeDays"
                placeholder="e.g. 14"
                min="0"
                value={formData.patientAgeDays}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Patient Sex</label>
              <select 
                name="patientSex" 
                value={formData.patientSex}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Relevant Medical Conditions</label>
            <textarea 
              name="medicalConditions"
              placeholder="List any relevant comorbidities, skin conditions, etc."
              value={formData.medicalConditions}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all h-20"
            />
          </div>
        </section>

        {/* Patient Vitals */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">Patient Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Current Weight (grams)</label>
              <input 
                type="number" 
                name="currentWeightGrams"
                placeholder="e.g. 1250"
                value={formData.currentWeightGrams}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Gestational Age (weeks)</label>
              <input 
                type="number" 
                step="0.1"
                name="correctedGestationalAgeWeeks"
                placeholder="e.g. 28.5"
                value={formData.correctedGestationalAgeWeeks}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Procedure Specifics */}
        <section className="space-y-6">
          <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">Procedure Specifics</h3>
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Type of Vascular Access *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['PIV Insertion', 'PICC Line Placement', 'Peripheral Arterial Line'].map((type) => (
                <label key={type} className={`
                  cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center
                  ${formData.vascularAccessType === type 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'}
                `}>
                  <input 
                    type="radio" 
                    name="vascularAccessType" 
                    value={type} 
                    className="hidden" 
                    onChange={handleChange}
                    checked={formData.vascularAccessType === type}
                  />
                  <span className="text-sm font-medium">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">POCUS Used? *</label>
              <div className="flex gap-4">
                {['yes', 'no'].map(opt => (
                  <label key={opt} className={`
                    flex-1 cursor-pointer py-2.5 rounded-xl border-2 text-center capitalize text-sm font-bold transition-all
                    ${formData.pocusUsed === opt 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-400'}
                  `}>
                    <input type="radio" name="pocusUsed" value={opt} className="hidden" onChange={handleChange} checked={formData.pocusUsed === opt} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">Total Attempts (skin punctures) *</label>
              <input 
                type="number" 
                name="totalAttempts"
                min="1"
                required 
                value={formData.totalAttempts}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Final Outcome *</label>
            <div className="flex gap-4">
              {['Success', 'Failure'].map(out => (
                <label key={out} className={`
                  flex-1 cursor-pointer py-3 rounded-xl border-2 text-center font-bold transition-all
                  ${formData.finalOutcome === out 
                    ? (out === 'Success' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-red-500 bg-red-50 text-red-700')
                    : 'border-slate-100 hover:border-slate-200 text-slate-400'}
                `}>
                  <input type="radio" name="finalOutcome" value={out} className="hidden" onChange={handleChange} checked={formData.finalOutcome === out} />
                  {out}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Comments / Complications</label>
            <textarea 
              name="comments"
              placeholder="Notes on catheter size, site, or why it failed..."
              value={formData.comments}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all h-24"
            />
          </div>
        </section>

        <div className="flex gap-4 pt-6 border-t border-slate-100">
          <button 
            type="submit"
            className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
          >
            Submit Entry
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-xl font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
