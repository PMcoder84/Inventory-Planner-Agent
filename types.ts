export interface InventoryInputs {
  productName: string;
  currentStock: number;
  dailyDemand: number;
  leadTime: number;
}

export interface InventoryAnalysisResult {
  productName: string;
  reorderPoint: number;
  reorderPointCalculation: string;
  currentStock: number;
  decision: "Reorder Required" | "No Reorder Required";
  recommendedOrderQuantity: number | "Not Required";
  explanation: string;
  followUpQuestion: string | "None";
}

export interface InventoryState {
  inputs: InventoryInputs;
  result: InventoryAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}
