
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export interface TravelSuggestions {
  activities: string[];
  safetyTips: string[];
  localCustoms: string[];
  transportationTips: string[];
}

export interface WaterSafetyInfo {
  safe: boolean;
  tips: string[];
  description: string;
}

export async function getWaterSafetyInfo(country: string): Promise<WaterSafetyInfo> {
  const prompt = `As a travel expert, provide information about water safety in ${country}. Include whether tap water is generally safe to drink and specific tips for water safety. Format your response as JSON with these keys: safe (boolean), tips (array of strings), description (string explaining the general water situation). Be specific and accurate about the current water safety situation in ${country}.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const safetyInfo = JSON.parse(response.text());
    return safetyInfo as WaterSafetyInfo;
  } catch (error) {
    console.error('Error getting water safety info:', error);
    return {
      safe: false,
      tips: ["Use bottled water", "Avoid tap water", "Be cautious with ice"],
      description: "Water safety information is currently unavailable. Please exercise caution."
    };
  }
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
