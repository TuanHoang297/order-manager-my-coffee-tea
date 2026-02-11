import { useState, useEffect } from 'react';
import { Order } from '../types';
import {
  saveOrder,
  subscribeToOrders,
  updateOrderStatus as updateOrderStatusFirebase,
  deleteOrder as deleteOrderFirebase
} from '../services/firebase/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToOrders((firebaseOrders) => {
      setOrders(firebaseOrders);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const placeOrder = async (order: Order) => {
    await saveOrder(order);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const order = orders.find(o => o.id === orderId);
    if (order?.firebaseId) {
      if (status === 'completed' && order.parentOrderId) {
        const parentOrder = orders.find(o => o.firebaseId === order.parentOrderId);

        if (parentOrder && parentOrder.firebaseId) {
          const mergedItems = [...parentOrder.items];

          order.items.forEach(newItem => {
            const existingItem = mergedItems.find(i => i.id === newItem.id && i.note === newItem.note);
            if (existingItem) {
              existingItem.quantity += newItem.quantity;
            } else {
              mergedItems.push(newItem);
            }
          });

          const newTotal = mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          await updateOrderStatusFirebase(parentOrder.firebaseId, 'completed', mergedItems, newTotal);
          await deleteOrderFirebase(order.firebaseId);

          if (window.navigator.vibrate) window.navigator.vibrate(20);
          return;
        }
      }

      await updateOrderStatusFirebase(order.firebaseId, status);
      if (window.navigator.vibrate) window.navigator.vibrate(20);
    }
  };

  const updateOrderItems = async (orderId: string, newItems: Order['items']) => {
    const order = orders.find(o => o.id === orderId);
    if (order?.firebaseId) {
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      await updateOrderStatusFirebase(order.firebaseId, order.status, newItems, newTotal);
      if (window.navigator.vibrate) window.navigator.vibrate(20);
    }
  };

  const deleteOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order?.firebaseId) {
      await deleteOrderFirebase(order.firebaseId);
    }
  };

  const togglePaymentStatus = async (orderId: string, isPaid: boolean) => {
    const order = orders.find(o => o.id === orderId);
    if (order?.firebaseId && order.orderType === 'dine-in') {
      await updateOrderStatusFirebase(order.firebaseId, order.status, undefined, undefined, isPaid);
      if (window.navigator.vibrate) window.navigator.vibrate(20);
    }
  };

  return {
    orders,
    placeOrder,
    updateOrderStatus,
    updateOrderItems,
    deleteOrder,
    togglePaymentStatus,
    isLoading
  };
};
