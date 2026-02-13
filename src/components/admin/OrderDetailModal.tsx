import React from 'react';
import { X, CheckCircle, Store, ShoppingBag } from 'lucide-react';
import { Order } from '../../types';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onTogglePayment?: (orderId: string, isPaid: boolean) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onTogglePayment
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={24} strokeWidth={2.5} />
            <div>
              <h2 className="text-lg font-black">Đơn hoàn tất</h2>
              <p className="text-emerald-100 text-xs font-semibold">#{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-emerald-100 text-xs font-semibold">Khách hàng</p>
            <p className="text-xl font-black">{order.customerName}</p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-xs ${
            order.orderType === 'dine-in' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-emerald-500 text-white'
          }`}>
            {order.orderType === 'dine-in' ? (
              <>
                <Store size={14} />
                <span>Tại chỗ</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Mang đi</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {order.items.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-base font-black">
                    {item.quantity}x
                  </span>
                  <h3 className="text-lg font-black text-gray-900 leading-tight">{item.name}</h3>
                </div>
                {item.note && (
                  <div className="ml-10 bg-indigo-100 text-indigo-700 px-2 py-1.5 rounded-lg border border-indigo-200">
                    <p className="text-xs font-bold italic">📝 {item.note}</p>
                  </div>
                )}
              </div>
              <div className="text-right ml-2">
                <p className="text-xs text-gray-500 font-semibold">{item.price.toLocaleString()}đ</p>
                <p className="text-lg font-black text-indigo-600">{(item.price * item.quantity).toLocaleString()}đ</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Total */}
      <div className="bg-gray-50 border-t border-gray-200 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-bold text-gray-700">Tổng cộng</span>
          <div className="text-right">
            <p className="text-2xl font-black text-indigo-600">{order.total.toLocaleString()}</p>
            <p className="text-xs font-bold text-gray-500">đồng</p>
          </div>
        </div>

        {/* Payment Status for Dine-in */}
        {order.orderType === 'dine-in' && onTogglePayment && (
          <button
            onClick={() => {
              const newStatus = !order.isPaid;
              const message = newStatus 
                ? 'Xác nhận đã thanh toán?' 
                : 'Đánh dấu chưa thanh toán?';
              if (confirm(message)) {
                onTogglePayment(order.id, newStatus);
              }
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm mb-2 active:scale-95 transition-all ${
              order.isPaid 
                ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200' 
                : 'bg-amber-100 text-amber-700 border-2 border-amber-300 hover:bg-amber-200'
            }`}
          >
            {order.isPaid ? '✓ Đã thanh toán' : '💰 Chưa thanh toán'}
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold text-sm active:scale-95 transition-all"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
