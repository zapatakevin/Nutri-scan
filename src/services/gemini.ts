import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface NutriAnalysis {
  productName: string;
  nutrients: {
    calories: string;
    fat: string;
    saturatedFat: string;
    sugar: string;
    sodium: string;
  };
  evaluation: "saludable" | "moderado" | "no saludable";
  reason: string;
  recommendation: string;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    productName: {
      type: Type.STRING,
      description: "Nombre del producto (infiere si es posible por el empaque, o 'Desconocido')",
    },
    nutrients: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.STRING, description: "Calorías (ej. 150 kcal)" },
        fat: { type: Type.STRING, description: "Grasas Totales (ej. 5g)" },
        saturatedFat: { type: Type.STRING, description: "Grasas Saturadas (ej. 2g)" },
        sugar: { type: Type.STRING, description: "Azúcares (ej. 10g)" },
        sodium: { type: Type.STRING, description: "Sodio (ej. 200mg)" },
      },
      required: ["calories", "fat", "saturatedFat", "sugar", "sodium"],
    },
    evaluation: {
      type: Type.STRING,
      enum: ["saludable", "moderado", "no saludable"],
      description: "Evaluación general del producto",
    },
    reason: {
      type: Type.STRING,
      description: "Breve explicación de la evaluación (máx 2 oraciones)",
    },
    recommendation: {
      type: Type.STRING,
      description: "Breve consejo o recomendación de alternativa más saludable",
    },
  },
  required: ["productName", "nutrients", "evaluation", "reason", "recommendation"],
};

export async function analyzeNutritionLabel(
  base64Image: string,
  userGoals: string
): Promise<NutriAnalysis> {
  const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  const prompt = `Analiza esta etiqueta nutricional. Extrae la siguiente información: Calorías, Grasas Totales, Grasas Saturadas, Azúcares y Sodio.
Evalúa si el producto es saludable basándote en las pautas generales y considerando los siguientes objetivos o restricciones del usuario: "${userGoals}".
Si no puedes leer un valor, pon "No disponible".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr) as NutriAnalysis;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error?.status === "RESOURCE_EXHAUSTED" || error?.message?.includes("429") || error?.message?.includes("quota")) {
      throw new Error("Límite de uso alcanzado. La IA está recibiendo demasiadas solicitudes. Por favor, espera un minuto y vuelve a intentarlo.");
    }
    throw error;
  }
}

export async function evaluateNutrients(
  productName: string,
  nutrients: any,
  userGoals: string
): Promise<NutriAnalysis> {
  const prompt = `Evalúa el siguiente producto alimenticio llamado "${productName}".
Valores nutricionales reportados (por 100g o porción):
- Calorías: ${nutrients.energy_kcal !== undefined ? nutrients.energy_kcal + ' kcal' : 'No disponible'}
- Grasas Totales: ${nutrients.fat !== undefined ? nutrients.fat + 'g' : 'No disponible'}
- Grasas Saturadas: ${nutrients['saturated-fat'] !== undefined ? nutrients['saturated-fat'] + 'g' : 'No disponible'}
- Azúcares: ${nutrients.sugars !== undefined ? nutrients.sugars + 'g' : 'No disponible'}
- Sodio: ${nutrients.sodium !== undefined ? (nutrients.sodium * 1000).toFixed(0) + 'mg' : 'No disponible'}

Evalúa si el producto es saludable basándote en las pautas generales y considerando los siguientes objetivos o restricciones del usuario: "${userGoals}".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr) as NutriAnalysis;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error?.status === "RESOURCE_EXHAUSTED" || error?.message?.includes("429") || error?.message?.includes("quota")) {
      throw new Error("Límite de uso alcanzado. La IA está recibiendo demasiadas solicitudes. Por favor, espera un minuto y vuelve a intentarlo.");
    }
    throw error;
  }
}
