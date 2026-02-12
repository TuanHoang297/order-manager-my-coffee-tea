import React from 'react';
import { X, CheckCircle, Store, ShoppingBag } from 'lucide-react';
import { Order } from '../../types';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle size={32} strokeWidth={2.5} />
            <div>
              <h2 className="text-2xl font-black">Đơn đã hoàn tất</h2>
              <p className="text-emerald-100 text-sm font-semibold">#{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-emerald-100 text-sm font-semibold mb-1">Khách hàng</p>
            <p className="text-2xl font-black">{order.customerName}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${
            order.orderType === 'dine-in' 
              ? 'bg-indigo-500 text-white' 
              : 'bg-emerald-500 text-white'
          }`}>
            {order.orderType === 'dine-in' ? (
              <>
                <Store size={20} />
                <span>Tại chỗ</span>
              </>
            ) : (
              <>
                <ShoppingBag size={20} />
                <span>Mang đi</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {order.items.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-black">
                    {item.quantity}x
                  </span>
                  <h3 className="text-2xl font-black text-gray-900">{item.name}</h3>
                </div>
                {item.note && (
                  <div className="ml-15 bg-indigo-100 text-indigo-700 px-4 py-3 rounded-xl border-2 border-indigo-200">
                    <p className="text-lg font-bold italic">📝 {item.note}</p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-semibold">{item.price.toLocaleString()}đ / ly</p>
                <p className="text-2xl font-black text-indigo-600">{(item.price * item.quantity).toLocaleString()}đ</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Total */}
      <div className="bg-gray-50 border-t-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-gray-700">Tổng cộng</span>
          <div className="text-right">
            <p className="text-4xl font-black text-indigo-600">{order.total.toLocaleString()}</p>
            <p className="text-lg font-bold text-gray-500">đồng</p>
          </div>
        </div>

        {/* Payment Status for Dine-in */}
        {order.orderType === 'dine-in' && (
          <div className={`flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg ${
            order.isPaid 
              ? 'bg-green-100 text-green-700 border-2 border-green-300' 
              : 'bg-amber-100 text-amber-700 border-2 border-amber-300'
          }`}>
            {order.isPaid ? '✓ Đã thanh toán' : '⏳ Chưa thanh toán'}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg active:scale-95 transition-all"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
