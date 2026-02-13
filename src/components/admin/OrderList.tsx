import React, { useState } from 'react';
import { Clock, Store, ShoppingBag } from 'lucide-react';
import { Order, OrderType } from '../../types';
import { OrderCard } from './OrderCard';
import { sortOrders } from '../../utils/order';

interface OrderListProps {
  orders: Order[];
  activeTab: 'active' | 'completed';
  onStatusChange: (orderId: string, status: Order['status']) => void;
  onUpdateItems: (orderId: string, items: Order['items']) => void;
  onDelete: (orderId: string) => void;
  onAddToOrder?: (orderId: string) => void;
  onTogglePayment?: (orderId: string, isPaid: boolean) => void;
  onViewDetail?: (order: Order) => void;
  onUpdateCustomerName?: (orderId: string, name: string) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  activeTab,
  onStatusChange,
  onUpdateItems,
  onDelete,
  onAddToOrder,
  onTogglePayment,
  onViewDetail,
  onUpdateCustomerName
}) => {
  const [orderTypeFilter, setOrderTypeFilter] = useState<OrderType | 'all'>('all');

  const filteredOrders = orders.filter(o => {
    const statusMatch = activeTab === 'active' ? o.status !== 'completed' : o.status === 'completed';
    const typeMatch = orderTypeFilter === 'all' || o.orderType === orderTypeFilter;
    return statusMatch && typeMatch;
  });

  const sortedOrders = sortOrders(filteredOrders, activeTab);
  const firstOrderId = sortedOrders.length > 0 ? sortedOrders[0].id : null;

  // Count orders by type
  const allCount = orders.filter(o => 
    activeTab === 'active' ? o.status !== 'completed' : o.status === 'completed'
  ).length;
  
  const dineInCount = orders.filter(o => {
    const statusMatch = activeTab === 'active' ? o.status !== 'completed' : o.status === 'completed';
    return statusMatch && o.orderType === 'dine-in';
  }).length;
  
  const takeawayCount = orders.filter(o => {
    const statusMatch = activeTab === 'active' ? o.status !== 'completed' : o.status === 'completed';
    return statusMatch && o.orderType === 'takeaway';
  }).length;

  return (
    <>
      {/* Order Type Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setOrderTypeFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            orderTypeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Tất cả ({allCount})
        </button>
        <button
          onClick={() => setOrderTypeFilter('dine-in')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            orderTypeFilter === 'dine-in'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Store size={14} />
          Tại chỗ ({dineInCount})
        </button>
        <button
          onClick={() => setOrderTypeFilter('takeaway')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
            orderTypeFilter === 'takeaway'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <ShoppingBag size={14} />
          Mang đi ({takeawayCount})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
          <Clock size={48} className="text-gray-300 mb-3" />
          <p className="font-semibold text-gray-900">
            {activeTab === 'active' ? 'Chưa có đơn hàng nào' : 'Chưa có đơn đã giao'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {orderTypeFilter === 'all' 
              ? (activeTab === 'active' ? 'Đơn hàng mới sẽ xuất hiện ở đây' : 'Lịch sử đơn hàng sẽ hiển thị tại đây')
              : `Chưa có đơn ${orderTypeFilter === 'dine-in' ? 'tại chỗ' : 'mang đi'}`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              isFirstOrder={order.id === firstOrderId && activeTab === 'active'}
              onStatusChange={onStatusChange}
              onUpdateItems={onUpdateItems}
              onDelete={onDelete}
              onAddToOrder={onAddToOrder}
              onTogglePayment={onTogglePayment}
              onViewDetail={onViewDetail}
              onUpdateCustomerName={onUpdateCustomerName}
            />
          ))}
        </div>
      )}
    </>
  );
};
