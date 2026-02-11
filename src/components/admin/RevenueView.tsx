import React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, ReceiptText, Coffee, Store, ShoppingBag } from 'lucide-react';
import { Order } from '../../types';
import { formatDate } from '../../utils/dateTime';
import { calculateRevenueStats, filterOrdersByDate } from '../../utils/revenue';
import { RevenueStats } from './RevenueStats';
import { TopItems } from './TopItems';
import { HourlyBreakdown } from './HourlyBreakdown';
import { OrderTypeBreakdown } from './OrderTypeBreakdown';

interface RevenueViewProps {
  orders: Order[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const RevenueView: React.FC<RevenueViewProps> = ({
  orders,
  selectedDate,
  onDateChange
}) => {
  const stats = calculateRevenueStats(orders);

  const selectedDayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  const selectedDayEnd = new Date(selectedDayStart);
  selectedDayEnd.setDate(selectedDayEnd.getDate() + 1);

  const dayOrders = filterOrdersByDate(orders.filter(o => o.status === 'completed'), selectedDayStart, selectedDayEnd)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const dayRevenue = dayOrders.reduce((sum, o) => sum + o.total, 0);

  const dayItemCounts: { [key: string]: { name: string; count: number; revenue: number } } = {};
  dayOrders.forEach(order => {
    order.items.forEach(item => {
      if (!dayItemCounts[item.id]) {
        dayItemCounts[item.id] = { name: item.name, count: 0, revenue: 0 };
      }
      dayItemCounts[item.id].count += item.quantity;
      dayItemCounts[item.id].revenue += item.price * item.quantity;
    });
  });
  const dayTopItems = Object.values(dayItemCounts).sort((a, b) => b.count - a.count);

  const today = new Date();
  const isToday = selectedDayStart.getTime() === new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const isFuture = selectedDayStart > today;

  const changeDate = (delta: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + delta);
    if (newDate <= today) onDateChange(newDate);
  };

  return (
    <div className="space-y-4">
      {/* Date Navigator */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
        <button
          onClick={() => changeDate(-1)}
          className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <button onClick={() => onDateChange(new Date())} className="text-center">
          <p className="text-sm font-bold text-gray-900">{isToday ? 'Hôm nay' : formatDate(selectedDate)}</p>
          {isToday && <p className="text-xs text-gray-500">{formatDate(selectedDate)}</p>}
          {!isToday && <p className="text-xs text-indigo-600 font-medium">Nhấn để về hôm nay</p>}
        </button>
        <button
          onClick={() => changeDate(1)}
          disabled={isToday || isFuture}
          className={`w-10 h-10 rounded-lg flex items-center justify-center active:scale-95 transition-all ${
            isToday || isFuture ? 'bg-gray-50 text-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Summary Cards */}
      <RevenueStats
        dayRevenue={dayRevenue}
        dayOrders={dayOrders.length}
        monthRevenue={stats.month.revenue}
        monthOrders={stats.month.orders}
        totalRevenue={stats.total.revenue}
        totalOrders={stats.total.orders}
        isToday={isToday}
      />

      {/* Day Average */}
      {dayOrders.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <CalendarDays size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Trung bình / đơn</p>
              <p className="text-xs text-gray-500">
                {dayOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)} ly tổng
              </p>
            </div>
          </div>
          <p className="text-lg font-black text-indigo-600">{Math.round(dayRevenue / dayOrders.length).toLocaleString()}đ</p>
        </div>
      )}

      {/* Top Items of the Day */}
      <TopItems
        items={dayTopItems}
        title={`Bán chạy ${isToday ? 'hôm nay' : 'ngày này'}`}
        variant="day"
      />

      {/* Order Type Breakdown for the day */}
      {dayOrders.length > 0 && (
        <OrderTypeBreakdown orders={dayOrders} />
      )}

      {/* Hourly Breakdown for the day */}
      {dayOrders.length > 0 && (
        <HourlyBreakdown orders={dayOrders} />
      )}

      {/* Daily Order List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <ReceiptText size={16} className="text-gray-600" />
            Chi tiết đơn ({dayOrders.length})
          </h3>
        </div>
        {dayOrders.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Coffee size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có đơn hàng</h3>
            <p className="text-gray-500 max-w-xs">
              Chưa có doanh thu trong ngày {isToday ? 'hôm nay' : 'này'}.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {dayOrders.map(order => (
              <div key={order.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">#{order.id}</span>
                    <span className="text-sm font-semibold text-gray-900">{order.customerName}</span>
                    {/* Order Type Badge */}
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                      order.orderType === 'dine-in' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {order.orderType === 'dine-in' ? (
                        <>
                          <Store size={10} />
                          <span>Tại chỗ</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={10} />
                          <span>Mang đi</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{order.total.toLocaleString()}đ</p>
                    <p className="text-xs text-gray-400">
                      {order.timestamp.getHours().toString().padStart(2, '0')}:{order.timestamp.getMinutes().toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {order.items.map((item, idx) => (
                    <span key={`${item.id}-${idx}`} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All-time Top Items - Show ALL */}
      <TopItems
        items={stats.topItems}
        title="Tổng hợp các món"
        variant="alltime"
        limit={stats.topItems.length}
      />
    </div>
  );
};
