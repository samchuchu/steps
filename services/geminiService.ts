import { GoogleGenAI, Type } from "@google/genai";
import { InstructionStep } from "../types";

// Initialize Gemini Client
// Safely check for process.env to avoid crashing in browser environments where 'process' is undefined
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey });

export const generateNextStep = async (
  currentSteps: InstructionStep[],
  context: string = "General daily routine"
): Promise<{ title: string; description: string }> => {
  
  const stepHistory = currentSteps.map(s => s.title).join(" -> ");

  const prompt = `
    You are a workflow assistant. The user is following a sequence of instructions.
    Context/Goal: "${context}".
    Current History: ${stepHistory}.
    
    Generate the single next logical step.
    - The title must be an action verb, very concise (max 5 words).
    - The description should be one short sentence explaining the 'how' or 'why'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nextStepTitle: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["nextStepTitle", "description"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text);
    return {
      title: data.nextStepTitle,
      description: data.description
    };

  } catch (error) {
    console.error("Error generating step:", error);
    // Fallback if AI fails
    return {
      title: "Continue...",
      description: "Move on to the next logical task."
    };
  }
};