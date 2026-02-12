import React, { useState } from 'react';
import { Clock, CheckCircle, MessageSquare, Edit3, Plus, Minus, X, Store, ShoppingBag } from 'lucide-react';
import { Order, MenuItem } from '../../types';
import { getTimeAgo } from '../../utils/dateTime';
import { isOrderDelayed } from '../../utils/order';
import { MENU_ITEMS } from '../../constants';

interface OrderCardProps {
  order: Order;
  isFirstOrder: boolean;
  onStatusChange: (orderId: string, status: Order['status']) => void;
  onUpdateItems: (orderId: string, items: Order['items']) => void;
  onDelete: (orderId: string) => void;
  onAddToOrder?: (orderId: string) => void;
  onTogglePayment?: (orderId: string, isPaid: boolean) => void;
  onViewDetail?: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isFirstOrder,
  onStatusChange,
  onUpdateItems,
  onDelete,
  onAddToOrder,
  onTogglePayment,
  onViewDetail
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // ESC key to cancel edit mode
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditing) {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isEditing]);

  const updateItemQuantity = (itemId: string, delta: number) => {
    const newItems = order.items.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0);

    onUpdateItems(order.id, newItems);
  };

  const updateItemNote = (itemId: string, note: string) => {
    const newItems = order.items.map(item => {
      if (item.id === itemId) {
        return { ...item, note };
      }
      return item;
    });

    onUpdateItems(order.id, newItems);
  };

  const removeItem = (itemId: string) => {
    const newItems = order.items.filter(i => i.id !== itemId);
    if (newItems.length === 0) {
      return; // Không cho xóa món cuối cùng
    }

    if (confirm('Xóa món này khỏi đơn hàng?')) {
      onUpdateItems(order.id, newItems);
    }
  };

  const addMenuItem = (menuItem: MenuItem) => {
    const existingItem = order.items.find(i => i.id === menuItem.id && !i.note);
    if (existingItem) {
      const newItems = order.items.map(i =>
        i === existingItem ? { ...i, quantity: i.quantity + 1 } : i
      );
      onUpdateItems(order.id, newItems);
    } else {
      const newItems = [...order.items, { ...menuItem, quantity: 1, note: '' }];
      onUpdateItems(order.id, newItems);
    }

    if (window.navigator.vibrate) window.navigator.vibrate(12);
  };

  const isDelayed = isOrderDelayed(order.timestamp, order.status);

  return (
    <div 
      className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${
        isFirstOrder && order.status !== 'completed'
          ? 'border-blue-500 ring-4 ring-blue-100 shadow-md scale-[1.01] z-10'
          : isDelayed
            ? 'border-red-300 ring-2 ring-red-100'
            : order.status === 'completed'
              ? 'border-green-200 cursor-pointer hover:shadow-md active:scale-[0.99]'
              : order.status === 'preparing'
                ? 'border-indigo-300 ring-2 ring-indigo-100'
                : 'border-gray-200'
      }`}
      onClick={() => {
        if (order.status === 'completed' && onViewDetail) {
          onViewDetail(order);
        }
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-bold text-lg text-gray-900">{order.customerName}</h4>
              
              {/* Order Type Badge */}
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                order.orderType === 'dine-in' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {order.orderType === 'dine-in' ? (
                  <>
                    <Store size={12} />
                    <span>Tại chỗ</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={12} />
                    <span>Mang đi</span>
                  </>
                )}
              </span>

              {/* Payment Status Badge - Only for completed dine-in orders */}
              {order.orderType === 'dine-in' && order.status === 'completed' && (
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  order.isPaid 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {order.isPaid ? '✓ Đã TT' : '⏳ Chưa TT'}
                </span>
              )}

              {isFirstOrder && order.status !== 'completed' && (
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold animate-pulse">
                  ƯU TIÊN
                </span>
              )}
              {order.status === 'preparing' && (
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                  🔥 Đang pha
                </span>
              )}
              {isDelayed && (
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                  ⚠️ Chờ lâu
                </span>
              )}
            </div>
            <p className={`text-xs font-medium flex items-center gap-1 ${
              isDelayed ? 'text-red-600' : 'text-gray-500'
            }`}>
              <Clock size={11} />
              {getTimeAgo(order.timestamp)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">{order.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500">đồng</p>
          </div>
        </div>

        <div className="space-y-2.5 mb-5 bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
          {order.items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="space-y-2">
              <div className="flex justify-between items-center gap-3">
                <span className="text-gray-800 font-bold flex items-center gap-2.5 flex-1">
                  {isEditing && order.status !== 'completed' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, -1)}
                        className="w-7 h-7 bg-red-100 text-red-500 rounded-lg flex items-center justify-center border border-red-200 hover:bg-red-200 active:scale-95 transition-all"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black">
                        {item.quantity}x
                      </span>
                      <button
                        onClick={() => updateItemQuantity(item.id, 1)}
                        className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-200 hover:bg-emerald-200 active:scale-95 transition-all"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  ) : (
                    <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black">
                      {item.quantity}x
                    </span>
                  )}
                  <span className="text-base">{item.name}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-700 font-bold text-sm">{(item.price * item.quantity).toLocaleString()}đ</span>
                  {isEditing && order.status !== 'completed' && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 bg-red-100 text-red-500 rounded-lg flex items-center justify-center border border-red-200 hover:bg-red-200 active:scale-95 transition-all"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </div>
              {isEditing && order.status !== 'completed' ? (
                <div className="ml-9 mt-2">
                  <input
                    type="text"
                    defaultValue={item.note || ''}
                    placeholder="Thêm ghi chú..."
                    onBlur={(e) => {
                      if (e.target.value !== (item.note || '')) {
                        updateItemNote(item.id, e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur();
                      }
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              ) : (
                item.note && (
                  <div className="flex items-start gap-2.5 ml-9 text-sm text-indigo-700 bg-indigo-100 px-4 py-2.5 rounded-xl border border-indigo-200">
                    <MessageSquare size={16} className="mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span className="italic font-medium">{item.note}</span>
                  </div>
                )
              )}
            </div>
          ))}

          {isEditing && order.status !== 'completed' && (
            <div className="pt-3 mt-3 border-t border-indigo-200">
              <p className="text-xs text-gray-500 font-bold mb-2 flex items-center gap-1.5">
                <Plus size={12} /> Thêm món mới
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {MENU_ITEMS.map(menuItem => (
                  <button
                    key={menuItem.id}
                    onClick={() => addMenuItem(menuItem)}
                    className="bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-xl p-2.5 text-left transition-all active:scale-95"
                  >
                    <p className="text-gray-800 font-bold text-xs mb-0.5">{menuItem.name}</p>
                    <p className="text-indigo-600 font-black text-xs">{menuItem.price.toLocaleString()}đ</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {order.status !== 'completed' && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-5 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all ${
                  isEditing
                    ? 'bg-indigo-100 border border-indigo-300 text-indigo-600'
                    : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {isEditing ? '✓ Xong' : <Edit3 size={18} />}
              </button>
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-100 active:scale-95 transition-all"
                >
                  Hủy
                </button>
              )}
            </>
          )}
          {order.status === 'pending' && !isEditing && (
            <>
              <button
                onClick={() => {
                  if (confirm('Xác nhận hoàn tất đơn hàng này?')) {
                    onStatusChange(order.id, 'completed');
                  }
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                <span>Hoàn tất đơn</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc muốn hủy đơn này không?')) {
                    onDelete(order.id);
                  }
                }}
                className="px-5 py-3 bg-red-50 border border-red-300 rounded-xl text-red-600 font-bold text-sm hover:bg-red-100 active:scale-95 transition-all"
              >
                <X size={18} />
              </button>
            </>
          )}
          {order.status === 'preparing' && !isEditing && (
            <button
              onClick={() => {
                if (confirm('Xác nhận đã pha xong?')) {
                  onStatusChange(order.id, 'completed');
                }
              }}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md"
            >
              ✓ Đã pha xong
            </button>
          )}
          {order.status === 'completed' && (
            <>
              <div className="flex-1 text-emerald-600 font-bold text-sm text-center py-3 rounded-xl border border-emerald-200 flex items-center justify-center gap-2 bg-emerald-50">
                <CheckCircle size={18} /> Đã giao • Nhấn để xem
              </div>
              {/* Payment Toggle - Only for dine-in orders */}
              {order.orderType === 'dine-in' && onTogglePayment && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePayment(order.id, !order.isPaid);
                  }}
                  className={`px-5 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all ${
                    order.isPaid
                      ? 'bg-green-50 border border-green-300 text-green-700 hover:bg-green-100'
                      : 'bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  {order.isPaid ? '✓ Đã TT' : '💰 Chưa TT'}
                </button>
              )}
              {onAddToOrder && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToOrder(order.id);
                  }}
                  className="px-5 py-3 bg-indigo-50 border border-indigo-300 rounded-xl text-indigo-700 font-bold text-sm hover:bg-indigo-100 active:scale-95 transition-all"
                >
                  + Thêm món
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
