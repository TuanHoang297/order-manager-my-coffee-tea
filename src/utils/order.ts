import { Order } from '../types';

export const isOrderDelayed = (timestamp: Date, status: Order['status'], threshold: number = 15): boolean => {
  if (status === 'completed') return false;

  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  return diffMins > threshold;
};

export const sortOrders = (orders: Order[], type: 'active' | 'completed'): Order[] => {
  return [...orders].sort((a, b) => {
    if (type === 'active') {
      const statusOrder = { preparing: 0, pending: 1 };
      const statusDiff = statusOrder[a.status as 'preparing' | 'pending'] - statusOrder[b.status as 'preparing' | 'pending'];
      if (statusDiff !== 0) return statusDiff;
      return a.timestamp.getTime() - b.timestamp.getTime();
    } else {
      return b.timestamp.getTime() - a.timestamp.getTime();
    }
  });
};

export const generateOrderId = (): string => {
  return Math.random().toString(36).substr(2, 4).toUpperCase();
};
