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
  type: 'urgent' | 'monitor' | 'routine';
  message: string;
  recommendations: string[];
  possibleConditions?: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
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