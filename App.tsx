import React, { useState } from 'react';
import Header from './components/Header';
import InventoryForm from './components/InventoryForm';
import RecommendationCard from './components/RecommendationCard';
import { InventoryInputs, InventoryState } from './types';
import { analyzeInventory } from './services/geminiService';

const App: React.FC = () => {
  // Demo default values
  const [inputs, setInputs] = useState<InventoryInputs>({
    productName: "Dove Shampoo 500ml",
    currentStock: 30,
    dailyDemand: 10,
    leadTime: 4
  });

  const [state, setState] = useState<Omit<InventoryState, 'inputs'>>({
    result: null,
    isLoading: false,
    error: null
  });

  const [hasSearched, setHasSearched] = useState(false);

  const handleAnalyze = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    setHasSearched(true);
    
    try {
      const result = await analyzeInventory(inputs);
      setState({
        result,
        isLoading: false,
        error: null
      });
    } catch (err: any) {
      setState({
        result: null,
        isLoading: false,
        error: err.message || "An unexpected error occurred"
      });
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col font-sans selection:bg-brand-primary selection:text-white">
      <Header />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
          
          {/* Left Panel - Inputs */}
          <div className="lg:col-span-5 h-full">
            <InventoryForm 
              inputs={inputs} 
              setInputs={setInputs} 
              onSubmit={handleAnalyze}
              isLoading={state.isLoading}
            />
          </div>

          {/* Right Panel - Recommendation */}
          <div className="lg:col-span-7 h-full">
             {state.error ? (
                <div className="bg-status-danger/10 border border-status-danger/30 p-6 rounded-xl text-center">
                    <p className="text-status-danger font-semibold mb-1">Analysis Failed</p>
                    <p className="text-text-secondary text-sm">{state.error}</p>
                    <button 
                        onClick={() => setState(s => ({...s, error: null}))}
                        className="mt-4 text-sm text-text-primary underline hover:text-brand-primary"
                    >
                        Dismiss
                    </button>
                </div>
             ) : (
                <RecommendationCard 
                  result={state.result} 
                  isLoading={state.isLoading} 
                  hasSearched={hasSearched}
                />
             )}
          </div>
          
        </div>
      </main>

      {/* Optional Footer or Status bar */}
      <footer className="text-center py-6 text-text-muted text-xs border-t border-input-border mt-auto">
        Inventory Assistant &copy; {new Date().getFullYear()} &bull; Optimized for Store Managers
      </footer>
    </div>
  );
};

export default App;
