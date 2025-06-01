export interface FormData {
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: string;
  timeline: string;
  files: File[];
}

export interface AISuggestions {
  suggestions?: string[];
  estimatedBudget?: { min: string; max: string };
  estimatedDuration?: string;
}

export interface StepConfig {
  id: number;
  title: string;
  icon: any;
  description: string;
}

export interface PostTaskProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  currentStep: number;
  isSubmitting: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
} 