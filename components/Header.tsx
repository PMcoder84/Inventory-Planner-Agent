import React from 'react';
import { ShoppingCart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-input-border bg-app-panel/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brand-primary p-2 rounded-lg shadow-lg shadow-orange-500/20">
            <ShoppingCart className="w-5 h-5 text-app-bg" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary leading-none">Inventory Planner</h1>
            <span className="text-xs text-text-secondary font-medium tracking-wide">ASSISTANT AGENT</span>
          </div>
        </div>
        <div className="text-xs text-text-muted border border-input-border px-3 py-1.5 rounded-full bg-input-bg">
          Powered by Gemini 2.5
        </div>
      </div>
    </header>
  );
};

export default Header;
