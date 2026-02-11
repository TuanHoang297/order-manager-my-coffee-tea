import React from 'react';
import { Clock } from 'lucide-react';
import { Order } from '../../types';

interface HourlyBreakdownProps {
  orders: Order[];
}

export const HourlyBreakdown: React.FC<HourlyBreakdownProps> = ({ orders }) => {
  if (orders.length === 0) return null;

  // Group orders by hour
  const hourlyData: { [hour: number]: { orders: number; revenue: number } } = {};
  
  orders.forEach(order => {
    const hour = order.timestamp.getHours();
    if (!hourlyData[hour]) {
      hourlyData[hour] = { orders: 0, revenue: 0 };
    }
    hourlyData[hour].orders += 1;
    hourlyData[hour].revenue += order.total;
  });

  // Find max revenue for scaling
  const maxRevenue = Math.max(...Object.values(hourlyData).map(d => d.revenue));

  // Get hours with data, sorted
  const hoursWithData = Object.keys(hourlyData)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Clock size={16} className="text-indigo-600" />
        Doanh thu theo giờ
      </h3>

      <div className="space-y-2">
        {hoursWithData.map(hour => {
          const data = hourlyData[hour];
          const percentage = (data.revenue / maxRevenue) * 100;
          
          return (
            <div key={hour} className="flex items-center gap-3">
              <div className="w-16 text-xs font-semibold text-gray-600">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1">
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(percentage, 10)}%` }}
                  >
                    {percentage > 20 && (
                      <span className="text-xs font-bold text-white">
                        {data.revenue.toLocaleString()}đ
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-16 text-right">
                <p className="text-xs font-semibold text-gray-900">{data.orders} đơn</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Peak hour */}
      {hoursWithData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="bg-indigo-50 rounded-lg p-3">
            <p className="text-xs text-indigo-600 font-semibold mb-1">Giờ cao điểm</p>
            <p className="text-lg font-black text-indigo-700">
              {hoursWithData.reduce((peak, hour) => 
                hourlyData[hour].revenue > hourlyData[peak].revenue ? hour : peak
              , hoursWithData[0]).toString().padStart(2, '0')}:00 - {' '}
              {Math.max(...Object.values(hourlyData).map(d => d.revenue)).toLocaleString()}đ
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
