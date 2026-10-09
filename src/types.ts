export type ToneType = 'soft' | 'assertive' | 'firm' | 'steel';

export type CategoryType = 'family' | 'work' | 'couples' | 'friends' | 'digital';

export interface ScriptToneVariant {
  label: string;
  badge: string;
  toneDescription: string;
  text: string;
  tipNote?: string;
  clinicalNote?: string;
}

export interface ScriptItem {
  id: string;
  title: string;
  category: CategoryType;
  scenarioTag: string;
  context: string;
  somaticCue: string; // Used as "Pre-response calm anchor" in UI
  tones: Record<ToneType, ScriptToneVariant>;
  isCustom?: boolean;
  createdAt?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  points: number;
  badge?: string;
}

export interface AssessmentQuestion {
  id: number;
  title: string;
  categoryLabel: string;
  prompt: string;
  options: QuestionOption[];
}

export interface SomaticSymptoms {
  jawTension: boolean;
  shoulderTightness: boolean;
  rumination: boolean;
  overApologizing: boolean;
  rescuingReflex: boolean;
}

export type ActiveTab = 'assessment' | 'diagnostic' | 'scripts' | 'kit';

export interface DiagnosticResult {
  score: number;
  maxScore: number;
  symptomCount: number;
  cortisolLoadPercent: number; // Rendered as Conversational Pressure Load
  autonomyIndexPercent: number; // Rendered as Clarity & Confidence Score
  tier: 1 | 2 | 3;
  tierTitle: string;
  tierSubtitle: string;
  summary: string;
  physicalManifestations: string[];
  emotionalDynamics: string[];
  recommendedTone: ToneType;
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'copy';
}
