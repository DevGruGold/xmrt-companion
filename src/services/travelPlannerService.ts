
import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure we have a valid API key
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.error('Missing Gemini API key. Please set VITE_GEMINI_API_KEY environment variable.');
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
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
  if (!country || country === "Loading...") {
    return {
      safe: false,
      tips: ["Waiting for location..."],
      description: "Please wait while we detect your location."
    };
  }

  const prompt = `As a travel expert, provide information about water safety in ${country}. Include whether tap water is generally safe to drink and specific tips for water safety. Format your response as JSON with these keys: safe (boolean), tips (array of strings), description (string explaining the general water situation). Be specific and accurate about the current water safety situation in ${country}.`;

  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const safetyInfo = JSON.parse(text);
      return safetyInfo as WaterSafetyInfo;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error getting water safety info:', error);
    return {
      safe: false,
      tips: ["Use bottled water", "Avoid tap water", "Be cautious with ice"],
      description: "Water safety information is currently unavailable. Please check your API key configuration and try again."
    };
  }
}

export async function analyzeItinerary(itineraryText: string): Promise<string> {
  const prompt = `As a travel expert, analyze this travel itinerary and provide suggestions for improvement, considering timing, logistics, and local attractions. Format your response in a clear, concise way:

${itineraryText}`;

  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing itinerary:', error);
    throw new Error('Failed to analyze itinerary. Please check your API key configuration.');
  }
}

export async function generateTravelPlan(location: string, duration: string, interests: string[]): Promise<TravelSuggestions> {
  const prompt = `As a travel expert, create a comprehensive travel plan for ${location} for ${duration}, focusing on these interests: ${interests.join(', ')}. Include activities, safety tips, local customs, and transportation advice. Format the response as JSON with these keys: activities (array), safetyTips (array), localCustoms (array), transportationTips (array).`;

  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text) as TravelSuggestions;
    } catch (parseError) {
      console.error('Error parsing travel plan response:', parseError);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error generating travel plan:', error);
    throw new Error('Failed to generate travel plan. Please check your API key configuration.');
  }
}
