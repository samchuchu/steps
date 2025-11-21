export interface InstructionStep {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
}

export interface AIResponseSchema {
  nextStepTitle: string;
  description: string;
}
