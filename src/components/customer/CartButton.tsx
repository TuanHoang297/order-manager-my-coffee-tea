import React from 'react';
import { ChevronDown } from 'lucide-react';
import { OrderItem } from '../../types';

interface CartButtonProps {
  cart: OrderItem[];
  total: number;
  onClick: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ cart, total, onClick }) => {
  const totalItems = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="fixed bottom-20 left-5 right-5 z-[150] animate-in slide-in-from-bottom duration-300">
      <button
        className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-2xl p-4 shadow-lg shadow-indigo-600/30 flex items-center justify-between active:scale-95 transition-all"
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl text-white">
            {totalItems}
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-base">Xem giỏ hàng</p>
            <p className="text-white/70 text-xs font-medium">Nhấn để thanh toán</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-white font-black text-xl">{(total / 1000).toFixed(0)}K</p>
            <p className="text-white/70 text-xs font-medium">{cart.length} món</p>
          </div>
          <ChevronDown size={20} className="text-white/80" strokeWidth={2.5} />
        </div>
      </button>
    </div>
  );
};
