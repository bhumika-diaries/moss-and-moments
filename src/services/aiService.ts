import { AIPlanOutput } from '../types';

export interface GeneratePlanParams {
  eventName: string;
  eventType: string;
  eventDate?: string;
  location?: string;
  guestCount: number;
  budget: number;
  theme: string;
  preferences?: string;
}

export async function generateEventPlan(params: GeneratePlanParams): Promise<AIPlanOutput> {
  const response = await fetch('/api/generate-event-plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to generate plan';
    try {
      const errorData = await response.json();
      if (errorData?.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }

  const data: AIPlanOutput = await response.json();
  return data;
}
