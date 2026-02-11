
export enum Category {
  COFFEE = 'Cà Phê',
  SPECIALTY = 'Món Đặc Biệt',
  MILK_TEA = 'Trà Sữa',
  HEALTHY = 'Sữa Hạt & Healthy'
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  image?: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  note?: string;
}

export type OrderType = 'dine-in' | 'takeaway';

export interface Order {
  id: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'completed';
  timestamp: Date;
  customerName?: string;
  total: number;
  firebaseId?: string;
  parentOrderId?: string;
  orderType: OrderType;
  isPaid?: boolean; // false for dine-in (unpaid by default), true for takeaway (paid by default)
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
