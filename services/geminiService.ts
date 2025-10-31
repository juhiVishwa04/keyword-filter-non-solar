import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT_TEMPLATE = `You are an AI assistant with a single, critical task: to be an extremely strict and thorough keyword filter. Your previous performance was not strict enough, and solar-related keywords were incorrectly included. You must now adopt a zero-tolerance policy.

From the provided list of search terms, you must return ONLY the keywords that are **100% and completely unrelated** to solar energy, solar products, solar services, or associated brands.

Follow this multi-step validation process for EACH keyword:

1.  **Direct Match Check:** Is the keyword a direct match or partial match for common solar terms? (e.g., solar, pv, photovoltaic, renewable, green energy).
2.  **Component Check:** Does it relate to system components? (e.g., battery, storage, backup, inverter).
3.  **Commercial Check:** Does it relate to the solar business? (e.g., quotes, rebates, installers, company, provider).
4.  **Language Check:** Is it a solar-related term in another language? (e.g., "điện năng lượng mặt trời", "مولد كهرباء على الطاقة الشمسية", "energía solar", "太阳能").
5.  **Brand Name Analysis (CRITICAL STEP):** Many solar-related companies have ambiguous names. You must be extremely suspicious. If a keyword *could* be a brand name in the energy, tech, or industrial sector, you must investigate it with a "simulated web search". Ask yourself: "If I search for this keyword, what are the chances the results are about a solar/energy company?"
    -   For example, terms like "tesup", "scs power", "solarmtl", "mymidnite", and "solao" are ALL solar-related brands or companies and MUST be excluded.
    -   Other examples to exclude: Sunboost, Captain Green, Fortune Solar, Grand Solar, Solahart, SunPower, Trina, Jinko, LONGi, Canadian Solar, LG Solar, Fronius, Enphase, GoodWe, Growatt, Sungrow, Huawei, BYD, Tesla Powerwall, Alpha ESS, Fox ESS, Sonnen, Solaredge, REC, Risen, JA Solar, SolarMax, SMA, QCells, Seraphim.

**Your Golden Rule:** WHEN IN DOUBT, THROW IT OUT. If you have even a 0.1% doubt that a keyword might be related to solar, you MUST exclude it. It is better to wrongly exclude a non-solar keyword than to wrongly include a solar one.

### Output Format
Return only the validated non-solar keywords in a JSON object with a single key "non_solar_keywords". If no keywords pass the filter, return an empty array.

{
  "non_solar_keywords": [
    "keyword1",
    "keyword2"
  ]
}

### Example
Input:
điện năng lượng mặt trời, مولد كهرباء على الطاقة الشمسية, tesup atlas 10kw, scs power, solarmtl, airlec, express industries, mymidnite, solao

Output:
{
  "non_solar_keywords": [
    "airlec",
    "express industries"
  ]
}

Now, apply this extremely strict filtering process to the following list of keywords:
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
