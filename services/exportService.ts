
import { ProcedureEntry } from "../types";

export const exportToCSV = (entries: ProcedureEntry[]) => {
    if (entries.length === 0) return;

    const headers = [
      'ID', 'Date', 'Provider', 'Patient Study ID', 'Age (Days)', 'Sex', 
      'Medical Conditions', 'Room', 'Weight (g)', 'Gestational Age (wks)', 
      'Access Type', 'POCUS Used', 'Attempts', 'Outcome', 'Comments'
    ];

    const rows = entries.map(entry => [
      entry.id,
      entry.procedureDateTime,
      entry.providerName,
      `"${entry.patientStudyId}"`,
      entry.patientAgeDays || '',
      entry.patientSex || '',
      `"${(entry.medicalConditions || '').replace(/"/g, '""')}"`,
      entry.roomNumber,
      entry.currentWeightGrams || '',
      entry.correctedGestationalAgeWeeks || '',
      entry.vascularAccessType,
      entry.pocusUsed ? 'Yes' : 'No',
      entry.totalAttempts,
      entry.finalOutcome,
      `"${(entry.comments || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `nicu_iv_tracker_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
