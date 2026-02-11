import { useState, useMemo } from 'react';
import { MenuItem, OrderItem } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<OrderItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      // Find existing item without note
      const existingWithoutNote = prev.find(i => i.id === item.id && !i.note);
      
      if (existingWithoutNote) {
        // Increase quantity of item without note
        return prev.map(i => 
          i === existingWithoutNote ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      // Add new item
      return [...prev, { ...item, quantity: 1, note: '' }];
    });
    if (window.navigator.vibrate) window.navigator.vibrate(12);
  };

  const updateQuantity = (itemIndex: number, delta: number) => {
    setCart(prev => {
      return prev.map((item, idx) => {
        if (idx === itemIndex) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(i => i.quantity > 0);
    });
    if (window.navigator.vibrate) window.navigator.vibrate(8);
  };

  const updateNote = (itemIndex: number, note: string) => {
    setCart(prev => prev.map((item, idx) =>
      idx === itemIndex ? { ...item, note } : item
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
