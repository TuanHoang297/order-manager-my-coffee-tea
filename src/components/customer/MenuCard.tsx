import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem, OrderItem } from '../../types';
import { QuantitySelector } from '../common/QuantitySelector';
import { NoteInput } from '../common/NoteInput';

interface MenuCardProps {
  item: MenuItem;
  cartItem?: OrderItem;
  onAdd: (item: MenuItem) => void;
  onRemove: () => void;
  onUpdateQuantity: (delta: number) => void;
  onUpdateNote: (note: string) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  cartItem,
  onAdd,
  onRemove,
  onUpdateQuantity,
  onUpdateNote
}) => {
  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden transition-all active:scale-[0.98] ${
        cartItem ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200 hover:shadow-md'
      }`}
    >
      <div
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => {
          if (cartItem) {
            onRemove();
          } else {
            onAdd(item);
          }
        }}
      >
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
          <p className="text-sm font-semibold text-gray-600">{item.price.toLocaleString()}đ</p>
        </div>

        {cartItem ? (
          <div onClick={(e) => e.stopPropagation()}>
            <QuantitySelector
              quantity={cartItem.quantity}
              onIncrease={() => onAdd(item)}
              onDecrease={() => onUpdateQuantity(-1)}
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 text-gray-400">
            <Plus size={20} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {cartItem && (
        <div className="px-4 pb-3" onClick={(e) => e.stopPropagation()}>
          <NoteInput
            value={cartItem.note || ''}
            onSave={(note) => onUpdateNote(note)}
            placeholder="Ghi chú: ít đường, nhiều đá..."
          />
        </div>
      )}
    </div>
  );
};
