import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        className={`${sizeClasses} bg-red-50 text-red-500 rounded-lg flex items-center justify-center border border-red-200 hover:bg-red-100 active:scale-95 transition-all`}
      >
        <Minus size={iconSize} strokeWidth={2.5} />
      </button>
      <span className={`${sizeClasses} bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black`}>
        {quantity}x
      </span>
      <button
        onClick={onIncrease}
        className={`${sizeClasses} bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition-all`}
      >
        <Plus size={iconSize} strokeWidth={2.5} />
      </button>
    </div>
  );
};
