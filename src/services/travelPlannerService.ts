
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "@/hooks/use-toast";

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
    throw error;
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
    throw error;
  }
}

export async function generateTravelPlan(location: string, duration: string, interests: string[]): Promise<TravelSuggestions> {
  if (!location || location === "Loading...") {
    throw new Error('Please wait for location detection to complete');
  }

  const prompt = `As a travel expert, create a comprehensive travel plan for ${location} for ${duration}, focusing on these interests: ${interests.join(', ')}. Include activities, safety tips, local customs, and transportation advice. Format the response as JSON with these keys: activities (array), safetyTips (array), localCustoms (array), transportationTips (array).`;

  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const data = JSON.parse(text);
      return {
        activities: data.activities || [],
        safetyTips: data.safetyTips || [],
        localCustoms: data.localCustoms || [],
        transportationTips: data.transportationTips || []
      };
    } catch (parseError) {
      console.error('Error parsing travel plan response:', parseError);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error generating travel plan:', error);
    throw error;
  }
}

export async function translateText(text: string, targetLanguage: string) {
  const prompt = `Translate the following text to ${targetLanguage}. If the text is already in ${targetLanguage}, respond with "NO_TRANSLATION_NEEDED":

${text}`;

  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translation = response.text();
    
    return translation === "NO_TRANSLATION_NEEDED" ? null : translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

export async function processImage(imageData: string, targetLanguage: string) {
  const prompt = `Analyze this image and extract any text you see. Then translate it to ${targetLanguage}. If the text is already in ${targetLanguage}, respond with "NO_TRANSLATION_NEEDED". Format the response as JSON with "originalText" and "translation" fields.`;

  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const translation = response.text();
    
    try {
      return JSON.parse(translation);
    } catch {
      return {
        originalText: "",
        translation: translation === "NO_TRANSLATION_NEEDED" ? null : translation
      };
    }
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
}
