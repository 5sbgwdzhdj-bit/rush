import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateErrandDescription = async (keywords: string): Promise<string> => {
  const client = getClient();
  if (!client) return "请手动输入描述 (API Key Missing)";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User wants to send an item via courier. Keywords: "${keywords}". 
      Write a concise, professional delivery remark in Chinese describing the item and handling instructions (e.g. fragile, keep upright). 
      Max 30 words.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "描述生成失败，请手动输入";
  }
};