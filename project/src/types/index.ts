export interface Symptom {
  id: string;
  description: string;
  severity: number;
  durationHours: number;
  location: string;
  category: string;
}

export interface PatientData {
  age: number;
  gender: string;
  symptoms: Symptom[];
}

export interface AnalysisResult {
  type: "urgent" | "monitor" | "routine";
  message: string;
  recommendations: string[];
  possibleConditions?: string[];
  urgencyLevel: "low" | "medium" | "high";
  disclaimer: string;
}

export interface SymptomTemplate {
  id: string;
  name: string;
  category: string;
  commonLocations: string[];
  description: string;
}

export interface OpenAIResponse {
  analysis: AnalysisResult;
}

// Add these new types to your existing types.ts file

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: "once" | "twice" | "thrice" | "four-times" | "as-needed";
  times: string[]; // Array of times like ["08:00", "20:00"]
  startDate: string;
  endDate?: string;
  notes?: string;
  isActive: boolean;
  reminderEnabled: boolean;
  lastTaken?: string;
}

export interface MedicalHistory {
  id: string;
  condition: string;
  description: string;
  // diagnosedDate: string;
  diagnosisDate: string;
  // year?: string;
  status: "current" | "resolved" | "chronic";
  severity: "mild" | "moderate" | "severe";
  treatment?: string;
  notes?: string;
  relatedSymptoms?: string[];
}

export interface NotificationReminder {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  isCompleted: boolean;
  createdAt: string;
}

// Extend existing PatientData type
export interface ExtendedPatientData extends PatientData {
  medications: Medication[];
  medicalHistory: MedicalHistory[];
  notifications: NotificationReminder[];
}

export interface AnalysisResult {
  type: "urgent" | "monitor" | "routine";
  message: string;
  recommendations: string[];
  possibleConditions?: string[];
  urgencyLevel: "low" | "medium" | "high";
  medicationAlerts?: string[];
  historyInsights?: string[];
  disclaimer: string;
}
