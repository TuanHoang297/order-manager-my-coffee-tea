import React from 'react';

interface RevenueStatsProps {
  dayRevenue: number;
  dayOrders: number;
  monthRevenue: number;
  monthOrders: number;
  totalRevenue: number;
  totalOrders: number;
  isToday: boolean;
}

export const RevenueStats: React.FC<RevenueStatsProps> = ({
  dayRevenue,
  dayOrders,
  monthRevenue,
  monthOrders,
  totalRevenue,
  totalOrders,
  isToday
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-indigo-600 rounded-xl p-3 text-center text-white shadow-lg shadow-indigo-600/20">
        <p className="text-indigo-100 text-xs font-semibold mb-1">{isToday ? 'Hôm nay' : 'Ngày này'}</p>
        <p className="text-xl font-black">{(dayRevenue / 1000).toFixed(0)}K</p>
        <p className="text-xs text-indigo-100 mt-0.5">{dayOrders} đơn</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
        <p className="text-gray-500 text-xs font-semibold mb-1">Tháng này</p>
        <p className="text-xl font-bold text-gray-900">{(monthRevenue / 1000).toFixed(0)}K</p>
        <p className="text-xs text-gray-400 mt-0.5">{monthOrders} đơn</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
        <p className="text-gray-500 text-xs font-semibold mb-1">Tổng</p>
        <p className="text-xl font-bold text-gray-900">{(totalRevenue / 1000).toFixed(0)}K</p>
        <p className="text-xs text-gray-400 mt-0.5">{totalOrders} đơn</p>
      </div>
    </div>
  );
};
