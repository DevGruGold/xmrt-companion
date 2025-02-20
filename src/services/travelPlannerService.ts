
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export interface TravelSuggestions {
  activities: string[];
  safetyTips: string[];
  localCustoms: string[];
  transportationTips: string[];
}

export async function analyzeItinerary(itineraryText: string): Promise<string> {
  const prompt = `As a travel expert, analyze this travel itinerary and provide suggestions for improvement, considering timing, logistics, and local attractions. Format your response in a clear, concise way:

${itineraryText}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generateTravelPlan(location: string, duration: string, interests: string[]): Promise<TravelSuggestions> {
  const prompt = `As a travel expert, create a comprehensive travel plan for ${location} for ${duration}, focusing on these interests: ${interests.join(', ')}. Include activities, safety tips, local customs, and transportation advice. Format the response as JSON with these keys: activities (array), safetyTips (array), localCustoms (array), transportationTips (array).`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const suggestions = JSON.parse(response.text());
  
  return suggestions as TravelSuggestions;
}
