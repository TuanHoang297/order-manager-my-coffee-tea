import React from 'react';
import { Store, ShoppingBag, TrendingUp } from 'lucide-react';
import { Order } from '../../types';

interface OrderTypeBreakdownProps {
  orders: Order[];
}

export const OrderTypeBreakdown: React.FC<OrderTypeBreakdownProps> = ({ orders }) => {
  const dineInOrders = orders.filter(o => o.orderType === 'dine-in');
  const takeawayOrders = orders.filter(o => o.orderType === 'takeaway');

  const dineInRevenue = dineInOrders.reduce((sum, o) => sum + o.total, 0);
  const takeawayRevenue = takeawayOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRevenue = dineInRevenue + takeawayRevenue;

  const dineInPercentage = totalRevenue > 0 ? (dineInRevenue / totalRevenue) * 100 : 0;
  const takeawayPercentage = totalRevenue > 0 ? (takeawayRevenue / totalRevenue) * 100 : 0;

  if (orders.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp size={16} className="text-indigo-600" />
        Phân tích theo loại đơn
      </h3>

      <div className="space-y-4">
        {/* Dine-in */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Store size={16} className="text-indigo-600" />
              <span className="text-sm font-semibold text-gray-900">Tại chỗ</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{dineInRevenue.toLocaleString()}đ</p>
              <p className="text-xs text-gray-500">{dineInOrders.length} đơn</p>
            </div>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${dineInPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{dineInPercentage.toFixed(1)}% tổng doanh thu</p>
        </div>

        {/* Takeaway */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-emerald-600" />
              <span className="text-sm font-semibold text-gray-900">Mang đi</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{takeawayRevenue.toLocaleString()}đ</p>
              <p className="text-xs text-gray-500">{takeawayOrders.length} đơn</p>
            </div>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${takeawayPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{takeawayPercentage.toFixed(1)}% tổng doanh thu</p>
        </div>

        {/* Average comparison */}
        <div className="pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-xs text-indigo-600 font-semibold mb-1">TB / đơn tại chỗ</p>
              <p className="text-lg font-black text-indigo-700">
                {dineInOrders.length > 0 ? Math.round(dineInRevenue / dineInOrders.length).toLocaleString() : '0'}đ
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-xs text-emerald-600 font-semibold mb-1">TB / đơn mang đi</p>
              <p className="text-lg font-black text-emerald-700">
                {takeawayOrders.length > 0 ? Math.round(takeawayRevenue / takeawayOrders.length).toLocaleString() : '0'}đ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
