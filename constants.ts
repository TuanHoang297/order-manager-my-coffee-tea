
import { MenuItem, Category } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // Cà Phê
  { id: '1', name: 'Cà Phê Đen', price: 18000, category: Category.COFFEE },
  { id: '2', name: 'Cà Phê Sữa', price: 20000, category: Category.COFFEE },
  { id: '3', name: 'Bạc Xỉu', price: 25000, category: Category.COFFEE },
  
  // Specialty
  { id: '4', name: 'Matcha Latte', price: 30000, category: Category.SPECIALTY },
  { id: '5', name: 'Cacao Latte', price: 30000, category: Category.SPECIALTY },
  { id: '6', name: 'Cacao Cà Phê', price: 30000, category: Category.SPECIALTY },
  { id: '7', name: 'Khoai Môn Latte', price: 30000, category: Category.SPECIALTY },
  
  // Trà Sữa
  { id: '8', name: 'Trà Sữa Ô Long Lài', price: 30000, category: Category.MILK_TEA },
  { id: '9', name: 'Trà Sữa Gạo Rang', price: 30000, category: Category.MILK_TEA },
  
  // Healthy
  { id: '10', name: 'Đậu Nành Mè Đen', price: 20000, category: Category.HEALTHY },
  { id: '11', name: 'Sữa Bắp', price: 20000, category: Category.HEALTHY },
  { id: '12', name: 'Đậu Nành Hạt Điều', price: 20000, category: Category.HEALTHY },
  { id: '13', name: 'Đậu Xanh Hạt Sen', price: 20000, category: Category.HEALTHY }
];
