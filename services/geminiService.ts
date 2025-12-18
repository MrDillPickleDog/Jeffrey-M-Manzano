
import { GoogleGenAI } from "@google/genai";
import { ProcedureEntry } from "../types";

export const getAIInsights = async (data: ProcedureEntry[]) => {
  // Use process.env.API_KEY directly in initialization as required by guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const summary = data.map(p => ({
    provider: p.providerName,
    type: p.vascularAccessType,
    pocus: p.pocusUsed,
    attempts: p.totalAttempts,
    outcome: p.finalOutcome,
    weight: p.currentWeightGrams
  }));

  const prompt = `
    As a clinical research assistant specializing in NICU vascular access, analyze the following procedure data and provide 3-5 actionable insights or observations to improve success rates and reduce skin punctures.
    
    Data Summary:
    ${JSON.stringify(summary)}

    Please focus on:
    1. The correlation between POCUS usage and success rates.
    2. High attempt counts and potential training needs.
    3. Performance across different procedure types.
    
    Format the response as clear, professional bullet points.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Property text returns the extracted string output; do not call it as a method.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate AI insights at this time. Please ensure the API key is valid.";
  }
};
