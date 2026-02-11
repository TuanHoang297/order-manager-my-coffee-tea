import { Order } from '../types';

export interface RevenueStats {
  today: { orders: number; revenue: number };
  week: { orders: number; revenue: number };
  month: { orders: number; revenue: number };
  total: { orders: number; revenue: number };
  topItems: Array<{ name: string; count: number; revenue: number }>;
}

export const calculateRevenueStats = (orders: Order[]): RevenueStats => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const completedOrders = orders.filter(o => o.status === 'completed');

  const todayOrders = completedOrders.filter(o => o.timestamp >= today);
  const weekOrders = completedOrders.filter(o => o.timestamp >= thisWeekStart);
  const monthOrders = completedOrders.filter(o => o.timestamp >= thisMonthStart);

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const weekRevenue = weekOrders.reduce((sum, o) => sum + o.total, 0);
  const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

  const itemCounts: { [key: string]: { name: string; count: number; revenue: number } } = {};
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      if (!itemCounts[item.id]) {
        itemCounts[item.id] = { name: item.name, count: 0, revenue: 0 };
      }
      itemCounts[item.id].count += item.quantity;
      itemCounts[item.id].revenue += item.price * item.quantity;
    });
  });

  const topItems = Object.values(itemCounts).sort((a, b) => b.count - a.count);

  return {
    today: { orders: todayOrders.length, revenue: todayRevenue },
    week: { orders: weekOrders.length, revenue: weekRevenue },
    month: { orders: monthOrders.length, revenue: monthRevenue },
    total: { orders: completedOrders.length, revenue: totalRevenue },
    topItems
  };
};

export const filterOrdersByDate = (orders: Order[], startDate: Date, endDate?: Date): Order[] => {
  return orders.filter(o => {
    const orderTime = o.timestamp.getTime();
    const start = startDate.getTime();
    const end = endDate ? endDate.getTime() : Date.now();
    return orderTime >= start && orderTime < end;
  });
};
