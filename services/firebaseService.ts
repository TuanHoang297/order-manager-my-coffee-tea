import { ref, push, set, onValue, update, remove, get } from 'firebase/database';
import { database } from '../firebase.config';
import { Order } from '../types';

// Lưu đơn hàng mới
export const saveOrder = async (order: Order): Promise<string> => {
  const ordersRef = ref(database, 'orders');
  const newOrderRef = push(ordersRef);
  
  await set(newOrderRef, {
    ...order,
    timestamp: order.timestamp.toISOString()
  });
  
  return newOrderRef.key || '';
};

// Lắng nghe thay đổi đơn hàng realtime
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
      
      // Sắp xếp theo thời gian mới nhất
      ordersArray.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      callback(ordersArray);
    } else {
      callback([]);
    }
  });
};

// Cập nhật trạng thái đơn hàng (và items, total nếu có)
export const updateOrderStatus = async (
  firebaseId: string, 
  status: Order['status'],
  items?: Order['items'],
  total?: number
): Promise<void> => {
  const orderRef = ref(database, `orders/${firebaseId}`);
  const updates: any = { status };
  
  if (items) {
    updates.items = items;
  }
  
  if (total !== undefined) {
    updates.total = total;
  }
  
  await update(orderRef, updates);
};

// Xóa đơn hàng
export const deleteOrder = async (firebaseId: string): Promise<void> => {
  const orderRef = ref(database, `orders/${firebaseId}`);
  await remove(orderRef);
};

// Lấy tất cả đơn hàng (một lần)
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
