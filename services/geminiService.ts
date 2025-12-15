import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InventoryInputs, InventoryAnalysisResult } from "../types";

// Helper to validate API key
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("API_KEY not found in environment variables.");
    return "";
  }
  return key;
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING },
    reorderPoint: { type: Type.NUMBER, description: "Calculated ROP = Demand * Lead Time" },
    reorderPointCalculation: { type: Type.STRING, description: "String showing calculation, e.g., '10 x 4 = 40 units'" },
    currentStock: { type: Type.NUMBER },
    decision: { type: Type.STRING, enum: ["Reorder Required", "No Reorder Required"] },
    recommendedOrderQuantity: { 
      type: Type.STRING, 
      description: "The number of units to order, or 'Not Required' if decision is negative." 
    },
    explanation: { type: Type.STRING, description: "1-2 lines explaining the decision." },
    followUpQuestion: { type: Type.STRING, description: "A clarifying question if demand varies, or 'None'." },
  },
  required: [
    "productName",
    "reorderPoint",
    "reorderPointCalculation",
    "currentStock",
    "decision",
    "recommendedOrderQuantity",
    "explanation",
    "followUpQuestion"
  ],
};

export const analyzeInventory = async (inputs: InventoryInputs): Promise<InventoryAnalysisResult> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing API Key. Please configure process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an Inventory Planner Assistant Agent designed to help retail Store Managers make accurate inventory decisions.
    Your goal is to prevent stockouts while avoiding unnecessary overstock.

    LOGIC:
    1. Calculate Reorder Point (ROP) = Average Daily Demand * Lead Time.
    2. If Current Stock <= ROP, Decision is "Reorder Required".
       Order Quantity = ROP - Current Stock (ensure non-negative).
    3. If Current Stock > ROP, Decision is "No Reorder Required".
       Order Quantity = "Not Required".
    
    Do not invent data. Use strictly the provided inputs.
  `;

  const prompt = `
    Analyze the following inventory data:
    Product Name: ${inputs.productName}
    Current Stock: ${inputs.currentStock}
    Average Daily Demand: ${inputs.dailyDemand}
    Lead Time: ${inputs.leadTime}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1, // Low temperature for deterministic math/logic
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI.");
    }

    const data = JSON.parse(text);
    
    // Normalize the recommendedOrderQuantity to match our type if the AI returns a string number
    let qty: number | "Not Required" = "Not Required";
    if (data.recommendedOrderQuantity !== "Not Required") {
        const parsed = parseInt(data.recommendedOrderQuantity, 10);
        if (!isNaN(parsed)) {
            qty = parsed;
        }
    }

    return {
      ...data,
      recommendedOrderQuantity: qty
    } as InventoryAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze inventory. Please check your inputs and try again.");
  }
};
