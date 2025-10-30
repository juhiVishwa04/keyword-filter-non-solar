import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT_TEMPLATE = `
You are an expert keyword filter AI.

Your task: From the given list of search terms, extract ONLY the keywords that are NOT related to solar energy in any way.

Solar-related keywords include:
- solar, solar energy, solar system, solar panel, solar power
- solar pv, solar quotes, solar rebates, solar offers, solar installers
- solar battery, battery storage, battery company, battery system
- solar inverter, inverter company, inverter brand
- solar company, solar panel company, solar battery company, solar inverter company
- and all solar-related technologies, products, or services

Also exclude any brand names related to solar like:
Sunboost, Captain Green, Fortune Solar, Grand Solar, Solahart, SunPower, Trina, Jinko, LONGi, Canadian Solar, LG Solar, Fronius, Enphase, GoodWe, Growatt, Sungrow, Huawei, BYD, Tesla Powerwall, Alpha ESS, Fox ESS, Sonnen, Solaredge, REC, Risen, JA Solar, SolarMax, and similar.

Rules:
1. If a keyword even slightly refers to solar, energy, battery, inverter, or any brand above → EXCLUDE it.
2. If you’re unsure → treat it as solar-related and exclude it.
3. Keep only unrelated keywords (completely non-solar).
4. Analyze the following list of keywords.
5. Return ONLY a JSON object with a single key "non_solar_keywords" which contains an array of the filtered strings.

Input: 
{{keywords_from_excel}}
`;

const schema = {
  type: Type.OBJECT,
  properties: {
    non_solar_keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "An array of keywords that are completely unrelated to solar energy."
    },
  },
  required: ['non_solar_keywords'],
};


export const filterKeywords = async (keywords: string): Promise<string> => {
  const prompt = PROMPT_TEMPLATE.replace('{{keywords_from_excel}}', keywords);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.0,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};
