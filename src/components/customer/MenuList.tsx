import React from 'react';
import { Coffee, Sparkles, Milk, Leaf } from 'lucide-react';
import { MenuItem, OrderItem, Category } from '../../types';
import { MenuCard } from './MenuCard';

interface MenuListProps {
  menuItems: MenuItem[];
  cart: OrderItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onUpdateNote: (index: number, note: string) => void;
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

export const MenuList: React.FC<MenuListProps> = ({
  menuItems,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onUpdateNote
}) => {
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Thực đơn</h2>
        <span className="text-sm text-gray-500">{menuItems.length} món</span>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 sticky top-[73px] bg-gray-50/95 backdrop-blur-sm py-2 z-10">
              {getCategoryIcon(category)}
              {category}
              <span className="text-sm font-normal text-gray-500">({items.length})</span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {items.map(item => {
                // Find the first cart item without note for this menu item
                const cartItemIndex = cart.findIndex(c => c.id === item.id && !c.note);
                const cartItem = cartItemIndex >= 0 ? cart[cartItemIndex] : undefined;
                
                return (
                  <MenuCard
                    key={item.id}
                    item={item}
                    cartItem={cartItem}
                    onAdd={onAddToCart}
                    onRemove={() => {
                      if (cartItemIndex >= 0) {
                        onUpdateQuantity(cartItemIndex, -cartItem!.quantity);
                      }
                    }}
                    onUpdateQuantity={(delta) => {
                      if (cartItemIndex >= 0) {
                        onUpdateQuantity(cartItemIndex, delta);
                      }
                    }}
                    onUpdateNote={(note) => {
                      if (cartItemIndex >= 0) {
                        onUpdateNote(cartItemIndex, note);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
