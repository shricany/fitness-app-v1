// FIX: Refactored to align with @google/genai coding guidelines.
// This assumes `process.env.API_KEY` is always available.
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const model = 'gemini-2.5-flash';
const systemInstruction = `You are SyncFit AI, a friendly, encouraging, and knowledgeable fitness coach. 
Your goal is to provide safe, effective, and motivating fitness advice. 
Do not give medical advice. If a user asks about injuries or health conditions, 
advise them to consult a doctor. Keep your responses concise and easy to understand.`;

export const getAICoachResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
};
