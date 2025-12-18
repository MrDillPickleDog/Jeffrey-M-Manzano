
export type Provider = 'Dr. Barber' | 'Dr. Fish' | 'Dr. Hansen' | 'Dr. Lopez' | 'Dr. Manzano' | 'Dr. Wang';

export type VascularAccessType = 'PIV Insertion' | 'PICC Line Placement' | 'Peripheral Arterial Line';

export type Outcome = 'Success' | 'Failure';

export type Room = 'NICU 1' | 'NICU 2' | 'NICU 3' | 'Pod A' | 'Pod B' | 'Pod C';

export type Sex = 'Male' | 'Female' | 'Other';

export interface ProcedureEntry {
  id: string;
  providerName: Provider;
  procedureDateTime: string;
  patientStudyId: string;
  patientAgeDays?: number;
  patientSex?: Sex;
  medicalConditions?: string;
  roomNumber: Room;
  currentWeightGrams?: number;
  correctedGestationalAgeWeeks?: number;
  vascularAccessType: VascularAccessType;
  pocusUsed: boolean;
  totalAttempts: number;
  finalOutcome: Outcome;
  comments: string;
  timestamp: number;
}

export type View = 'dashboard' | 'form' | 'analytics' | 'history' | 'settings';
