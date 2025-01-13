import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function translateText(text: string, targetLanguage: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Translate the following text to ${targetLanguage}. If the text is already in ${targetLanguage}, respond with "NO_TRANSLATION_NEEDED". Only return the translation or "NO_TRANSLATION_NEEDED", nothing else:

${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translation = response.text();
    
    return translation === "NO_TRANSLATION_NEEDED" ? null : translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
}

export async function processImage(imageData: string, targetLanguage: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const prompt = `Analyze this image and extract any text you see. Then translate it to ${targetLanguage}. If the text is already in ${targetLanguage}, respond with "NO_TRANSLATION_NEEDED". Format the response as JSON with "originalText" and "translation" fields.`;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const translation = response.text();
    
    try {
      const parsedResponse = JSON.parse(translation);
      return parsedResponse;
    } catch {
      return {
        originalText: "",
        translation: translation === "NO_TRANSLATION_NEEDED" ? null : translation
      };
    }
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
}