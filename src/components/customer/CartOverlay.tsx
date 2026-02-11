import React, { useState } from 'react';
import { X, User, ChevronRight, PartyPopper, Store, ShoppingBag, Trash2 } from 'lucide-react';
import { OrderItem, OrderType } from '../../types';
import { CartItem } from './CartItem';

interface CartOverlayProps {
  cart: OrderItem[];
  isOpen: boolean;
  onClose: () => void;
  onPlaceOrder: (customerName: string, orderType: OrderType) => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onUpdateNote: (index: number, note: string) => void;
  onClearCart: () => void;
  isOrdering: boolean;
  orderSuccess: boolean;
}

export const CartOverlay: React.FC<CartOverlayProps> = ({
  cart,
  isOpen,
  onClose,
  onPlaceOrder,
  onUpdateQuantity,
  onUpdateNote,
  onClearCart,
  isOrdering,
  orderSuccess
}) => {
  const [customerNameInput, setCustomerNameInput] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((a, b) => a + b.quantity, 0);

  // ESC key to close overlay
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isOrdering && !orderSuccess) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, isOrdering, orderSuccess, onClose]);

  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    onPlaceOrder(customerNameInput, orderType);
    setCustomerNameInput('');
    setOrderType('dine-in'); // Reset to default
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isOrdering && cart.length > 0) {
      handlePlaceOrder();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={() => !isOrdering && !orderSuccess && onClose()}
      ></div>
      <div className="relative bg-white rounded-t-[2rem] p-6 max-h-[90vh] flex flex-col shadow-2xl border-t border-gray-100 animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

        {orderSuccess ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-8">
              <div className="bg-indigo-500 text-white p-8 rounded-3xl shadow-lg">
                <PartyPopper size={56} strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-indigo-600 mb-3">Đặt hàng thành công!</h2>
            <p className="text-gray-500 font-semibold text-lg">Đơn hàng đã được gửi đến quầy</p>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Giỏ hàng</h2>
                <p className="text-sm text-gray-500 mt-1 font-semibold">{cart.length} món • {totalItems} ly</p>
              </div>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Xóa toàn bộ giỏ hàng?')) {
                        onClearCart();
                      }
                    }}
                    className="p-3 bg-red-50 rounded-xl text-red-500 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-3 bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar mb-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <X size={40} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-semibold">Giỏ hàng trống</p>
                  <p className="text-sm text-gray-400 mt-1">Thêm món để bắt đầu đặt hàng</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <CartItem
                    key={`${item.id}-${index}`}
                    item={item}
                    onUpdateQuantity={(delta) => onUpdateQuantity(index, delta)}
                    onUpdateNote={(note) => onUpdateNote(index, note)}
                  />
                ))
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Order Type Selector */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Loại đơn hàng</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine-in')}
                    disabled={isOrdering || cart.length === 0}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                      orderType === 'dine-in'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${(isOrdering || cart.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Store size={18} />
                    <span>Tại chỗ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    disabled={isOrdering || cart.length === 0}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                      orderType === 'takeaway'
                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${(isOrdering || cart.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <ShoppingBag size={18} />
                    <span>Mang đi</span>
                  </button>
                </div>
              </div>

              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder={orderType === 'dine-in' ? 'Tên hoặc số bàn...' : 'Tên khách hàng...'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  value={customerNameInput}
                  onChange={(e) => setCustomerNameInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isOrdering || cart.length === 0}
                />
              </div>

              <div className="flex justify-between items-center px-1">
                <span className="text-gray-500 text-base font-semibold">Tổng cộng</span>
                <div className="text-right">
                  <p className="text-3xl font-black text-indigo-600">{cartTotal.toLocaleString()}</p>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5">đồng</p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isOrdering || cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  isOrdering || cart.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95'
                }`}
              >
                {isOrdering ? (
                  <div className="w-6 h-6 border-3 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center gap-2">
                    {cart.length === 0 ? 'Giỏ hàng trống' : 'Xác nhận đặt hàng'} <ChevronRight size={22} strokeWidth={3} />
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
