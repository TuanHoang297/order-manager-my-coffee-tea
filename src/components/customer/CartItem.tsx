import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { OrderItem } from '../../types';
import { NoteInput } from '../common/NoteInput';

interface CartItemProps {
  item: OrderItem;
  onUpdateQuantity: (delta: number) => void;
  onUpdateNote: (note: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onUpdateNote
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-bold text-base text-gray-900">{item.name}</h4>
          <p className="text-sm text-gray-500 font-semibold mt-0.5">{item.price.toLocaleString()}đ / ly</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-gray-200">
          <button
            onClick={() => onUpdateQuantity(-1)}
            className="text-red-500 hover:text-red-400 transition-colors p-1"
          >
            <Minus size={18} strokeWidth={2.5} />
          </button>
          <span className="font-black text-indigo-600 text-lg min-w-[28px] text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(1)}
            className="text-emerald-500 hover:text-emerald-400 transition-colors p-1"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <NoteInput
        value={item.note || ''}
        onSave={(note) => onUpdateNote(note)}
        placeholder="Ví dụ: ít đường, nhiều đá..."
      />
    </div>
  );
};
