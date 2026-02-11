import { useState, useMemo } from 'react';
import { MenuItem, OrderItem } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<OrderItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, note: '' }];
    });
    if (window.navigator.vibrate) window.navigator.vibrate(12);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(i => i.quantity > 0);
    });
    if (window.navigator.vibrate) window.navigator.vibrate(8);
  };

  const updateNote = (id: string, note: string) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, note } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    updateQuantity,
    updateNote,
    clearCart,
    cartTotal
  };
};
