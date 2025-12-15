import React from 'react';
import { InventoryAnalysisResult } from '../types';
import { CheckCircle2, AlertTriangle, HelpCircle, TrendingUp, Box } from 'lucide-react';

interface RecommendationCardProps {
  result: InventoryAnalysisResult | null;
  isLoading: boolean;
  hasSearched: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ result, isLoading, hasSearched }) => {
  if (isLoading) {
    return (
      <div className="bg-app-panel border border-input-border rounded-xl p-8 h-full flex flex-col items-center justify-center text-center animate-pulse">
        <div className="w-16 h-16 bg-input-bg rounded-full mb-4 opacity-50"></div>
        <div className="h-6 w-1/2 bg-input-bg rounded mb-3 opacity-50"></div>
        <div className="h-4 w-3/4 bg-input-bg rounded opacity-30"></div>
        <p className="mt-6 text-text-muted text-sm">AI Agent is calculating optimum stock levels...</p>
      </div>
    );
  }

  if (!result || !hasSearched) {
    return (
      <div className="bg-app-panel border border-input-border rounded-xl p-8 h-full flex flex-col items-center justify-center text-center opacity-80">
        <div className="bg-input-bg p-4 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 text-text-muted" />
        </div>
        <h3 className="text-text-primary text-lg font-medium mb-2">Ready to Analyze</h3>
        <p className="text-text-secondary max-w-xs">
          Fill in the inventory details on the left and click "Analyze Inventory" to get an instant AI recommendation.
        </p>
      </div>
    );
  }

  const isReorderRequired = result.decision === "Reorder Required";
  
  return (
    <div className="bg-app-panel border border-input-border rounded-xl p-6 h-full flex flex-col shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-start justify-between border-b border-input-border pb-4">
        <div>
            <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            AI Recommendation
            </h2>
            <p className="text-sm text-brand-primary font-medium mt-1">
                For: {result.productName}
            </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border 
            ${isReorderRequired 
                ? 'bg-status-danger/10 text-status-danger border-status-danger/20' 
                : 'bg-status-success/10 text-status-success border-status-success/20'
            }`}>
            {result.decision}
        </div>
      </div>

      <div className="space-y-6 flex-grow">
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* ROP Card */}
          <div className="bg-input-bg border border-input-border rounded-lg p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
               <Box className="w-12 h-12 text-text-primary" />
            </div>
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">Reorder Point (ROP)</p>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text-primary">{result.reorderPoint}</span>
                <span className="text-xs text-text-secondary">units</span>
            </div>
            <div className="mt-2 text-xs text-text-muted bg-app-bg/50 px-2 py-1 rounded inline-block">
                {result.reorderPointCalculation}
            </div>
          </div>

          {/* Current Stock Card */}
          <div className="bg-input-bg border border-input-border rounded-lg p-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10">
               <Box className="w-12 h-12 text-text-primary" />
            </div>
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">Current Stock</p>
            <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${isReorderRequired ? 'text-status-danger' : 'text-status-success'}`}>
                    {result.currentStock}
                </span>
                <span className="text-xs text-text-secondary">units</span>
            </div>
             <div className="mt-2 text-xs text-text-muted">
                Available in warehouse
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className={`border rounded-lg p-5 ${
            isReorderRequired 
            ? 'bg-status-danger/5 border-status-danger/20' 
            : 'bg-status-success/5 border-status-success/20'
        }`}>
            <div className="flex items-center gap-3 mb-2">
                {isReorderRequired ? (
                    <AlertTriangle className="w-5 h-5 text-status-danger" />
                ) : (
                    <CheckCircle2 className="w-5 h-5 text-status-success" />
                )}
                <span className="font-semibold text-text-primary">Recommended Order Quantity</span>
            </div>
            <div className="text-3xl font-bold text-text-primary ml-8">
                {typeof result.recommendedOrderQuantity === 'number' 
                    ? <>{result.recommendedOrderQuantity} <span className="text-sm font-normal text-text-secondary">units</span></>
                    : "Not Required"
                }
            </div>
        </div>

        {/* Explanation */}
        <div className="space-y-2">
            <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Analysis</h4>
            <p className="text-text-primary leading-relaxed text-sm bg-input-bg/30 p-3 rounded-lg border border-input-border/50">
                {result.explanation}
            </p>
        </div>
        
        {/* Follow Up */}
        {result.followUpQuestion && result.followUpQuestion !== "None" && (
             <div className="flex gap-3 items-start bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-4">
                <HelpCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-semibold text-brand-primary mb-1">Follow-up Consideration</h4>
                    <p className="text-sm text-text-primary italic">
                        "{result.followUpQuestion}"
                    </p>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
