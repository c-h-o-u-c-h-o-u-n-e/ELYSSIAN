import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResponse, ReferenceImages } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
  }

  private async getRandomLine(filename: string): Promise<string> {
    try {
      const response = await fetch(`/${filename}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length === 0) return "A professional model";
      return lines[Math.floor(Math.random() * lines.length)];
    } catch (e) {
      console.error(`Failed to load ${filename}, using default`, e);
      return filename === 'Girls.txt' 
        ? "A stunning woman with radiant skin and a confident smile" 
        : "Long, voluminous cascading waves";
    }
  }

  async analyzeLingerie(images: ReferenceImages, sizeInfo: string): Promise<AnalysisResponse> {
    const selectedGirl = await this.getRandomLine('Girls.txt');
    const selectedHair = await this.getRandomLine('Haircuts.txt');

    const prompt = `
      Act as a world-class lingerie design expert and creative director for high-end marketplaces.
      Analyze the provided lingerie images (Front, Back, and Side views) and the size info: "${sizeInfo}".

      Your goal is to:
      1. Extract detailed "Bra DNA" metadata from the images
      2. Provide 3 image generation prompts

      BRA DNA EXTRACTION (REQUIRED):
      You MUST analyze the bra and extract the following information:
      - Brand: The brand name if visible (e.g., "La Senza", "Victoria's Secret", "Unknown")
      - Model: The model/collection name if identifiable (e.g., "Beyond Sexy", "Dream Angels", "Classic")
      - Size: Use "${sizeInfo}" as the size
      - Condition: Assess the condition (e.g., "Very Good", "Excellent", "Good", "Fair")
      - Colors: Primary color(s) of the bra (e.g., "Hot Pink / Fuschia", "Black", "White / Nude")
      - Padding: Type of padding (e.g., "Lightly Padded", "Heavily Padded", "Unpadded", "Push-Up")
      - Underwire: Presence of underwire (e.g., "Yes", "No")
      - Closure: Type of closure (e.g., "Front-Closure", "Back Hook-and-Eye", "No Closure")
      - Straps: Strap type (e.g., "Convertible", "Standard", "Adjustable", "Halter", "Strapless")
      - J-Hook: Presence of J-Hook/racerback converter (e.g., "Yes", "No")

      FIXED MODEL IDENTITY (MANDATORY):
      For ALL model shots (Prompt 2 and 3), you MUST use this exact identity and hairstyle.
      - Model Identity: ${selectedGirl}
      - Hairstyle: ${selectedHair}

      Consistency is CRITICAL. Prompt 2 and Prompt 3 must describe the SAME woman in the SAME setting (a modern, realistic bedroom).

      ANATOMICAL REALISM (CUP SIZE):
      The size is "${sizeInfo}". You MUST ensure the model's breast volume in prompts 2 and 3 follows these rules:
      - Cup A: petite breasts.
      - Cup B: medium-small breasts.
      - Cup C: medium to full breasts.
      - Cup D: large, prominent breasts.
      - Cup DD: very large, voluptuous breasts.
      - Cup DDD+: extremely large, exceptionally voluptuous breasts.

      Generate 3 prompts:
      1. Product Shot: The bra alone on black satin. Entire garment visible, technical focus. High resolution 1K style.
      2. Front Profile Selfie: Mirror selfie or self-timer of the FIXED MODEL in her bedroom (not the room in reference image). Realistic bust volume for "${sizeInfo}". The model is not wearing any piece of clothing from the reference image other than the bra.
      3. Back/Side View: THE SAME FIXED MODEL as Prompt 2 in the same room. Focus on back construction, straps, and side profile volume for "${sizeInfo}". The model is not wearing any piece of clothing from the reference image other than the bra.

      Return as JSON.
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: images.front } },
            { inlineData: { mimeType: 'image/jpeg', data: images.back } },
            { inlineData: { mimeType: 'image/jpeg', data: images.side } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.OBJECT,
              properties: {
                fabric: { type: Type.STRING },
                colors: { type: Type.STRING },
                construction: { type: Type.STRING },
                embellishments: { type: Type.STRING },
                fit: { type: Type.STRING },
                uniqueFeatures: { type: Type.STRING }
              },
              required: ['fabric', 'colors', 'construction', 'embellishments', 'fit', 'uniqueFeatures']
            },
            braDNA: {
              type: Type.OBJECT,
              properties: {
                brand: { type: Type.STRING },
                model: { type: Type.STRING },
                size: { type: Type.STRING },
                condition: { type: Type.STRING },
                colors: { type: Type.STRING },
                padding: { type: Type.STRING },
                underwire: { type: Type.STRING },
                closure: { type: Type.STRING },
                straps: { type: Type.STRING },
                jHook: { type: Type.STRING }
              },
              required: ['brand', 'model', 'size', 'condition', 'colors', 'padding', 'underwire', 'closure', 'straps', 'jHook']
            },
            prompts: {
              type: Type.OBJECT,
              properties: {
                productShot: { type: Type.STRING },
                frontModelShot: { type: Type.STRING },
                backModelShot: { type: Type.STRING }
              },
              required: ['productShot', 'frontModelShot', 'backModelShot']
            }
          },
          required: ['analysis', 'braDNA', 'prompts']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AnalysisResponse;
  }

  async generateVisual(type: 'product' | 'front' | 'back', prompt: string, referenceImageBase64?: string): Promise<string> {
    if (type === 'product') {
      // First image: NanoBanana 2.5 (gemini-2.5-flash-image) at 1K
      const parts: any[] = [];
      if (referenceImageBase64) {
        parts.push({ inlineData: { data: referenceImageBase64, mimeType: 'image/jpeg' } });
      }
      parts.push({ text: prompt });

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: { 
          imageConfig: { 
            aspectRatio: "1:1"
            // Note: NanoBanana 2.5 doesn't take imageSize "1K" but generates high quality by default
          } 
        }
      });

      const candidate = response.candidates?.[0];
      const contentParts = candidate?.content?.parts || [];

      for (const part of contentParts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    } else {
      // Images 2 and 3: Seedream 4.5 via OpenRouter at 1K (1024x1024)
      try {
        const requestBody: any = {
          model: "seedream-4.5",
          prompt: prompt,
          size: "1024x1024",
          response_format: "b64_json"
        };

        if (referenceImageBase64) {
          requestBody.image = `data:image/jpeg;base64,${referenceImageBase64}`;
        }

        const response = await fetch("https://openrouter.ai/api/v1/images/generations", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data?.[0]?.b64_json) {
            return `data:image/png;base64,${data.data[0].b64_json}`;
          }
        }
      } catch (e) {
        console.error("Seedream 4.5 generation failed, falling back to Gemini:", e);
      }
      
      // Fallback
      const parts: any[] = [];
      if (referenceImageBase64) {
        parts.push({ inlineData: { data: referenceImageBase64, mimeType: 'image/jpeg' } });
      }
      parts.push({ text: prompt });
      const fallbackResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      const fallbackCandidate = fallbackResponse.candidates?.[0];
      const fallbackContentParts = fallbackCandidate?.content?.parts || [];

      for (const part of fallbackContentParts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Failed to generate image");
  }
}

export const geminiService = new GeminiService();
