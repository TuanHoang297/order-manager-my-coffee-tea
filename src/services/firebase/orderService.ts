import { ref, push, set, onValue, update, remove, get } from 'firebase/database';
import { database } from './config';
import { Order } from '../../types';

export const saveOrder = async (order: Order): Promise<string> => {
  const ordersRef = ref(database, 'orders');
  const newOrderRef = push(ordersRef);
  
  await set(newOrderRef, {
    ...order,
    timestamp: order.timestamp.toISOString()
  });
  
  return newOrderRef.key || '';
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const ordersRef = ref(database, 'orders');
  
  return onValue(ordersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const ordersArray: Order[] = Object.entries(data).map(([key, value]: [string, any]) => ({
        ...value,
        firebaseId: key,
        timestamp: new Date(value.timestamp)
      }));
      
      ordersArray.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      callback(ordersArray);
    } else {
      callback([]);
    }
  });
};

export const updateOrderStatus = async (
  firebaseId: string, 
  status: Order['status'],
  items?: Order['items'],
  total?: number,
  isPaid?: boolean,
  customerName?: string
): Promise<void> => {
  const orderRef = ref(database, `orders/${firebaseId}`);
  const updates: any = { status };
  
  if (items) updates.items = items;
  if (total !== undefined) updates.total = total;
  if (isPaid !== undefined) updates.isPaid = isPaid;
  if (customerName !== undefined) updates.customerName = customerName;
  
  await update(orderRef, updates);
};

export const deleteOrder = async (firebaseId: string): Promise<void> => {
  const orderRef = ref(database, `orders/${firebaseId}`);
  await remove(orderRef);
};

export const getAllOrders = async (): Promise<Order[]> => {
  const ordersRef = ref(database, 'orders');
  const snapshot = await get(ordersRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    const ordersArray: Order[] = Object.entries(data).map(([key, value]: [string, any]) => ({
      ...value,
      firebaseId: key,
      timestamp: new Date(value.timestamp)
    }));
    
    return ordersArray.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  return [];
};
