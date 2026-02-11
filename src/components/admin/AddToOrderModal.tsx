import React, { useState } from 'react';
import { X, ChevronRight, Coffee, Sparkles, Milk, Leaf, Plus, Minus, MessageSquare } from 'lucide-react';
import { MenuItem, OrderItem, Category } from '../../types';
import { MENU_ITEMS } from '../../constants';
import { NoteInput } from '../common/NoteInput';

interface AddToOrderModalProps {
  orderId: string;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: OrderItem[]) => void;
  isOrdering: boolean;
}

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case Category.COFFEE: return <Coffee size={14} />;
    case Category.SPECIALTY: return <Sparkles size={14} />;
    case Category.MILK_TEA: return <Milk size={14} />;
    case Category.HEALTHY: return <Leaf size={14} />;
    default: return null;
  }
};

export const AddToOrderModal: React.FC<AddToOrderModalProps> = ({
  customerName,
  isOpen,
  onClose,
  onConfirm,
  isOrdering
}) => {
  const [additionalCart, setAdditionalCart] = useState<OrderItem[]>([]);

  // ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isOrdering) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, isOrdering, onClose]);

  // Reset cart when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setAdditionalCart([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addToCart = (item: MenuItem) => {
    setAdditionalCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, note: '' }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setAdditionalCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(i => i.quantity > 0);
    });
  };

  const updateNote = (id: string, note: string) => {
    setAdditionalCart(prev => prev.map(item =>
      item.id === id ? { ...item, note } : item
    ));
  };

  const handleConfirm = () => {
    if (additionalCart.length === 0) return;
    onConfirm(additionalCart);
    setAdditionalCart([]);
  };

  const groupedItems = MENU_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={() => !isOrdering && onClose()}
      ></div>
      <div className="relative bg-white rounded-t-3xl p-6 max-h-[90vh] flex flex-col shadow-2xl border-t border-gray-100 animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Thêm món</h2>
              <p className="text-sm text-gray-500 mt-0.5 font-bold">{customerName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar mb-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 sticky top-0 bg-white py-2 z-10 border-b border-gray-100">
                  {getCategoryIcon(category)}
                  {category}
                  <span className="text-sm font-normal text-gray-500">({items.length})</span>
                </h3>
                <div className="space-y-3">
                  {items.map(item => {
                    const itemInCart = additionalCart.find(c => c.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className={`bg-gray-50 border rounded-xl overflow-hidden transition-all ${
                          itemInCart ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200 hover:shadow-md'
                        }`}
                      >
                        <div
                          className="p-4 flex items-center justify-between cursor-pointer"
                          onClick={() => addToCart(item)}
                        >
                          <div className="flex-1">
                            <h3 className="font-bold text-base text-gray-900 mt-0.5">{item.name}</h3>
                            <p className="text-indigo-600 font-black text-lg mt-1">{item.price.toLocaleString()}đ</p>
                          </div>

                          {itemInCart ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center border border-red-200 hover:bg-red-100 active:scale-95 transition-all"
                              >
                                <Minus size={16} strokeWidth={2.5} />
                              </button>
                              <span className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black">
                                {itemInCart.quantity}x
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition-all"
                              >
                                <Plus size={16} strokeWidth={2.5} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-200 text-gray-400">
                              <Plus size={20} strokeWidth={3} />
                            </div>
                          )}
                        </div>

                        {itemInCart && (
                          <div className="px-4 pb-3" onClick={(e) => e.stopPropagation()}>
                            <NoteInput
                              value={itemInCart.note || ''}
                              onSave={(note) => updateNote(item.id, note)}
                              placeholder="Ghi chú thêm..."
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {additionalCart.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-200">
                <p className="text-sm text-indigo-700 font-semibold">
                  {additionalCart.length} món • {additionalCart.reduce((sum, i) => sum + i.quantity, 0)} ly • {additionalCart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()}đ
                </p>
              </div>
              <button
                onClick={handleConfirm}
                disabled={isOrdering}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isOrdering
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95'
                }`}
              >
                {isOrdering ? (
                  <div className="w-6 h-6 border-3 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                ) : (
                  <>Xác nhận thêm món <ChevronRight size={24} strokeWidth={3} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
