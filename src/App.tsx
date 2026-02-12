import React, { useState, useMemo, useEffect } from 'react';
import { BarChart3, ReceiptText, UtensilsCrossed, X } from 'lucide-react';
import { Category, Order, OrderType } from './types';
import { MENU_ITEMS } from './constants';
import { generateOrderId } from './utils/order';
import { useCart } from './hooks/useCart';
import { useOrders } from './hooks/useOrders';
import { useToast } from './hooks/useToast';
import { useNotification } from './hooks/useNotification';
import { useAdminTabs } from './hooks/useAdminTabs';
import { useMenu } from './hooks/useMenu';
import { Header } from './components/layout/Header';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { Toast } from './components/layout/Toast';
import { SearchBar } from './components/customer/SearchBar';
import { CategoryFilter } from './components/customer/CategoryFilter';
import { MenuList } from './components/customer/MenuList';
import { CartButton } from './components/customer/CartButton';
import { CartOverlay } from './components/customer/CartOverlay';
import { OrderList } from './components/admin/OrderList';
import { AddToOrderModal } from './components/admin/AddToOrderModal';
import { RevenueView } from './components/admin/RevenueView';
import { MenuManagement } from './components/admin/MenuManagement';
import { OrderDetailModal } from './components/admin/OrderDetailModal';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'Tất cả'>('Tất cả');
  const [showCartDetails, setShowCartDetails] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [addingToOrderId, setAddingToOrderId] = useState<string | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [, setTimeUpdate] = useState(0);

  const { cart, addToCart, updateQuantity, updateNote, clearCart, cartTotal } = useCart();
  const { orders, placeOrder, updateOrderStatus, updateOrderItems, deleteOrder, togglePaymentStatus } = useOrders();
  const { toasts, showToast } = useToast();
  const { playNotification, requestPermission, showBrowserNotification } = useNotification();
  const { adminTab, setAdminTab, revenueDate, setRevenueDate } = useAdminTabs();
  const { menuItems, addMenuItem, updateItem, deleteItem } = useMenu();

  // Auto-refresh time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Monitor new orders for notifications
  useEffect(() => {
    const activeOrders = orders.filter(o => o.status !== 'completed');
    const previousActiveCount = orders.filter(o => o.status !== 'completed').length;

    if (view === 'admin' && adminTab === 'active' && activeOrders.length > previousActiveCount) {
      playNotification();
      showBrowserNotification('Đơn hàng mới! 🔔', 'Có đơn hàng mới cần pha chế');
    }
  }, [orders, view, adminTab]);

  // Request notification permission when entering admin view
  useEffect(() => {
    if (view === 'admin') {
      requestPermission();
    }
  }, [view]);

  const filteredMenu = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Tất cả' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, menuItems]);

  const handlePlaceOrder = async (customerName: string, orderType: OrderType) => {
    if (cart.length === 0) return;
    setIsOrdering(true);

    try {
      const newOrder: Order = {
        id: generateOrderId(),
        items: [...cart],
        status: 'pending',
        timestamp: new Date(),
        customerName: customerName.trim() || 'Khách vãng lai',
        total: cartTotal,
        orderType,
        isPaid: orderType === 'takeaway' ? true : false // Takeaway: paid by default, Dine-in: unpaid
      };

      await placeOrder(newOrder);

      clearCart();
      setIsOrdering(false);
      setOrderSuccess(true);

      if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);

      setTimeout(() => {
        setOrderSuccess(false);
        setShowCartDetails(false);
      }, 400);
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
      setIsOrdering(false);
      showToast('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!', 'error');
    }
  };

  const handleAddToExistingOrder = async (items: Order['items']) => {
    if (items.length === 0 || !addingToOrderId) return;
    setIsOrdering(true);

    try {
      const originalOrder = orders.find(o => o.id === addingToOrderId);
      if (!originalOrder) return;

      const newOrder: Order = {
        id: generateOrderId(),
        items: [...items],
        status: 'pending',
        timestamp: new Date(),
        customerName: `${originalOrder.customerName} (Thêm)`,
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        parentOrderId: originalOrder.firebaseId,
        orderType: originalOrder.orderType, // Giữ nguyên orderType của đơn gốc
        isPaid: originalOrder.orderType === 'takeaway' ? true : false // Takeaway: paid by default, Dine-in: unpaid
      };

      await placeOrder(newOrder);

      setAddingToOrderId(null);
      setIsOrdering(false);
      setAdminTab('active');

      if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
    } catch (error) {
      console.error('Lỗi khi thêm món:', error);
      setIsOrdering(false);
      showToast('Có lỗi xảy ra khi thêm món!', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      showToast('Có lỗi xảy ra khi cập nhật trạng thái!', 'error');
    }
  };

  const handleUpdateOrderItems = async (orderId: string, newItems: Order['items']) => {
    try {
      await updateOrderItems(orderId, newItems);
    } catch (error) {
      console.error('Lỗi khi cập nhật items:', error);
      showToast('Có lỗi xảy ra khi cập nhật món!', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      showToast('Đã hủy đơn hàng', 'success');
    } catch (error) {
      console.error('Lỗi khi xóa đơn:', error);
      showToast('Lỗi khi hủy đơn', 'error');
    }
  };

  const handleTogglePayment = async (orderId: string, isPaid: boolean) => {
    try {
      await togglePaymentStatus(orderId, isPaid);
      if (window.navigator.vibrate) window.navigator.vibrate(20);
    } catch (error) {
      console.error('Lỗi khi cập nhật thanh toán:', error);
      showToast('Lỗi khi cập nhật thanh toán', 'error');
    }
  };

  const categories: Array<Category | 'Tất cả'> = ['Tất cả', ...Object.values(Category)];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none overflow-x-hidden">
      <Header
        storeName="Mỳ Sữa Hạt - Coffee & Tea"
        address="207 Ngô Quyền • Bình Long"
        isOpen={true}
      />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-32">
          {view === 'customer' ? (
            <div className="space-y-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
              <MenuList
                menuItems={filteredMenu}
                cart={cart}
                onAddToCart={addToCart}
                onUpdateQuantity={updateQuantity}
                onUpdateNote={updateNote}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {adminTab === 'revenue' ? (
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 rounded-xl text-white">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Báo cáo doanh thu</h2>
                    <p className="text-sm text-gray-500">Tổng quan tình hình kinh doanh</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-600 rounded-xl text-white">
                        <ReceiptText size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
                        <p className="text-sm text-gray-500">Theo dõi và xử lý đơn</p>
                      </div>
                    </div>
                    {adminTab !== 'menu' && (
                      <button
                        onClick={() => setAdminTab('menu')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-300 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-100 active:scale-95 transition-all"
                      >
                        <UtensilsCrossed size={18} />
                        <span>Thực đơn</span>
                      </button>
                    )}
                    {adminTab === 'menu' && (
                      <button
                        onClick={() => setAdminTab('active')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition-all"
                      >
                        <X size={18} />
                        <span>Đóng</span>
                      </button>
                    )}
                  </div>

                  {adminTab !== 'menu' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-1 flex gap-1 shadow-sm">
                      <button
                        onClick={() => setAdminTab('active')}
                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          adminTab === 'active'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Đơn mới ({orders.filter(o => o.status !== 'completed').length})
                      </button>
                      <button
                        onClick={() => setAdminTab('completed')}
                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          adminTab === 'completed'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Đã xong ({orders.filter(o => o.status === 'completed').length})
                      </button>
                    </div>
                  )}
                </>
              )}

              <div>
                {adminTab === 'revenue' ? (
                  <RevenueView
                    orders={orders}
                    selectedDate={revenueDate}
                    onDateChange={setRevenueDate}
                  />
                ) : adminTab === 'menu' ? (
                  <MenuManagement
                    menuItems={menuItems}
                    onAddItem={addMenuItem}
                    onUpdateItem={updateItem}
                    onDeleteItem={deleteItem}
                  />
                ) : (
                  <OrderList
                    orders={orders}
                    activeTab={adminTab}
                    onStatusChange={handleUpdateOrderStatus}
                    onUpdateItems={handleUpdateOrderItems}
                    onDelete={handleDeleteOrder}
                    onAddToOrder={(orderId) => setAddingToOrderId(orderId)}
                    onTogglePayment={handleTogglePayment}
                    onViewDetail={(order) => setViewingOrder(order)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <CartOverlay
        cart={cart}
        isOpen={showCartDetails}
        onClose={() => setShowCartDetails(false)}
        onPlaceOrder={handlePlaceOrder}
        onUpdateQuantity={updateQuantity}
        onUpdateNote={updateNote}
        onClearCart={clearCart}
        isOrdering={isOrdering}
        orderSuccess={orderSuccess}
      />

      {view === 'customer' && cart.length > 0 && !showCartDetails && (
        <CartButton
          cart={cart}
          total={cartTotal}
          onClick={() => setShowCartDetails(true)}
        />
      )}

      <AddToOrderModal
        orderId={addingToOrderId || ''}
        customerName={orders.find(o => o.id === addingToOrderId)?.customerName || ''}
        isOpen={!!addingToOrderId}
        onClose={() => setAddingToOrderId(null)}
        onConfirm={handleAddToExistingOrder}
        isOrdering={isOrdering}
      />

      <OrderDetailModal
        order={viewingOrder}
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
      />

      <BottomNavigation
        activeView={view}
        adminTab={adminTab}
        onViewChange={setView}
        onAdminTabChange={setAdminTab}
      />

      <Toast toasts={toasts} />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        body { 
          touch-action: pan-y;
          overscroll-behavior-y: contain;
        }
      `}</style>
    </div>
  );
}
