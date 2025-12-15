import React from 'react';
import { InventoryInputs } from '../types';
import { BarChart3, Package, Calendar, Activity, ArrowRight } from 'lucide-react';

interface InventoryFormProps {
  inputs: InventoryInputs;
  setInputs: React.Dispatch<React.SetStateAction<InventoryInputs>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ inputs, setInputs, onSubmit, isLoading }) => {
  const handleChange = (field: keyof InventoryInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = inputs.productName.trim() !== '' && 
                      inputs.currentStock >= 0 && 
                      inputs.dailyDemand > 0 && 
                      inputs.leadTime > 0;

  return (
    <div className="bg-app-panel border border-input-border rounded-xl p-6 shadow-lg h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
          <Package className="w-5 h-5 text-brand-primary" />
          Inventory Inputs
        </h2>
        <p className="text-text-secondary text-sm mt-1">
          Enter current product metrics to generate a reorder plan.
        </p>
      </div>

      <div className="space-y-5 flex-grow">
        {/* Product Name */}
        <div className="space-y-1.5">
          <label htmlFor="productName" className="text-sm font-medium text-text-muted">
            Product Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="productName"
              value={inputs.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              className="w-full bg-input-bg border border-input-border text-text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-input-focus transition-colors placeholder-gray-600"
              placeholder="e.g. Dove Shampoo 500ml"
            />
          </div>
        </div>

        {/* Current Stock */}
        <div className="space-y-1.5">
          <label htmlFor="currentStock" className="text-sm font-medium text-text-muted">
            Current Stock (Units)
          </label>
          <div className="relative group">
            <Package className="absolute left-3 top-3 w-4 h-4 text-text-secondary group-focus-within:text-brand-primary transition-colors" />
            <input
              type="number"
              id="currentStock"
              min="0"
              value={inputs.currentStock}
              onChange={(e) => handleChange('currentStock', parseInt(e.target.value) || 0)}
              className="w-full bg-input-bg border border-input-border text-text-primary rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-input-focus transition-colors"
            />
          </div>
        </div>

        {/* Daily Demand */}
        <div className="space-y-1.5">
          <label htmlFor="dailyDemand" className="text-sm font-medium text-text-muted">
            Average Daily Demand (Units/Day)
          </label>
          <div className="relative group">
            <Activity className="absolute left-3 top-3 w-4 h-4 text-text-secondary group-focus-within:text-brand-primary transition-colors" />
            <input
              type="number"
              id="dailyDemand"
              min="0"
              value={inputs.dailyDemand}
              onChange={(e) => handleChange('dailyDemand', parseFloat(e.target.value) || 0)}
              className="w-full bg-input-bg border border-input-border text-text-primary rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-input-focus transition-colors"
            />
          </div>
        </div>

        {/* Lead Time */}
        <div className="space-y-1.5">
          <label htmlFor="leadTime" className="text-sm font-medium text-text-muted">
            Lead Time (Days)
          </label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-text-secondary group-focus-within:text-brand-primary transition-colors" />
            <input
              type="number"
              id="leadTime"
              min="0"
              value={inputs.leadTime}
              onChange={(e) => handleChange('leadTime', parseInt(e.target.value) || 0)}
              className="w-full bg-input-bg border border-input-border text-text-primary rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-input-focus transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-input-border">
        <button
          onClick={onSubmit}
          disabled={!isFormValid || isLoading}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all duration-200
            ${!isFormValid || isLoading 
              ? 'bg-input-border text-text-muted cursor-not-allowed' 
              : 'bg-brand-primary hover:bg-brand-hover text-app-bg shadow-lg hover:shadow-orange-500/20 active:transform active:scale-[0.98]'
            }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-app-bg"></div>
              Analyzing...
            </>
          ) : (
            <>
              Analyze Inventory
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InventoryForm;
