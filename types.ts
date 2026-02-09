
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
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'completed';
  timestamp: Date;
  customerName?: string;
  total: number;
  firebaseId?: string; // ID từ Firebase Realtime Database
}
