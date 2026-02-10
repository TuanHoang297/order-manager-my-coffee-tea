import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart,
  ClipboardList,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  Search,
  ChevronRight,
  Coffee,
  Sparkles,
  Milk,
  Leaf,
  ChevronDown,
  X,
  User,
  PartyPopper,
  Store,
  Flame,
  ReceiptText,
  MessageSquare,
  Edit3,
  ChevronLeft,
  CalendarDays
} from 'lucide-react';
import { MenuItem, Category, Order, OrderItem } from './types';
import { MENU_ITEMS } from './constants';
import { saveOrder, subscribeToOrders, updateOrderStatus as updateOrderStatusFirebase } from './services/firebaseService';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'Tất cả'>('Tất cả');
  const [showCartDetails, setShowCartDetails] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [customerNameInput, setCustomerNameInput] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const [adminTab, setAdminTab] = useState<'active' | 'completed' | 'revenue'>('active');
  const [addingToOrderId, setAddingToOrderId] = useState<string | null>(null);
  const [additionalCart, setAdditionalCart] = useState<OrderItem[]>([]);
  const [, setTimeUpdate] = useState(0);
  const [editingAdditionalNoteId, setEditingAdditionalNoteId] = useState<string | null>(null);
  const [additionalNoteInput, setAdditionalNoteInput] = useState('');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [revenueDate, setRevenueDate] = useState(new Date());

  // Auto-refresh time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // --- TOAST NOTIFICATIONS ---
  interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
  }
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };
  // ---------------------------

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      // Try HTML5 Audio first (works better on iOS)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwPUKXh8LdjHAU2kdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2Bxdmue3mnEoMDU+j4O+2YhwENo/T8tB+MAUfcsXv4pVDCxFbr+frrVkVB0Ga3PLDcCUFLIHO8tiJNQcXZrjt5ZtJCw1Po+Dvt2McBDaP0/LQfjAFH3LF7+KVQwsRW6/n661ZFQdBmtzyxHElBSuBzvLYiTUHF2a47eWbSQsNT6Pg77djHAQ2j9Py0H4wBR9yxe/ilUMLEVuv5+utWRUHQZrc8sRxJQUrgc7y2Ik1BxdmuO3lm0kLDU+j4O+3YxwENo/T8tB+MAUfcsXv4pVDCxFbr+frrVkVB0Ga3PLEcSUFK4HO8tiJNQcXZrjt5ZtJCw1Po+Dvt2McBDaP0/LQfjAFH3LF7+KVQwsRW6/n661ZFQdBmtzyxHElBSuBzvLYiTUHF2a47eWbSQsNT6Pg77djHAQ2j9Py0H4wBR9yxe/ilUMLEVuv5+utWRUHQZrc8sRxJQUrgc7y2Ik1BxdmuO3lm0kLDU+j4O+3YxwENo/T8tB+MAUfcsXv4pVDCxFbr+frrVkVB0Ga3PLEcSUFK4HO8tiJNQcXZrjt5ZtJCw1Po+Dvt2McBDaP0/LQfjAFH3LF7+KVQwsRW6/n661ZFQdBmtzyxHElBSuBzvLYiTUHF2a47eWbSQsNT6Pg77djHAQ2j9Py0H4wBR9yxe/ilUMLEVuv5+utWRUHQZrc8sRxJQUrgc7y2Ik1BxdmuO3lm0kLDU+j4O+3YxwENo/T8tB+MAUfcsXv4pVDCxFbr+frrVkVB0Ga3PLEcSUFK4HO8tiJNQcXZrjt5ZtJCw1Po+Dvt2McBDaP0/LQfjAFH3LF7+KVQwsRW6/n661ZFQdBmtzyxHElBSuBzvLYiTUHF2a47eWbSQsNT6Pg77djHAQ2j9Py0H4wBR9yxe/ilUMLEVuv5+utWRUHQZrc8sRxJQU=');
      audio.volume = 1.0;
      audio.play().catch(() => {
        // Fallback to Web Audio API if HTML5 Audio fails
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        const playBeep = (frequency: number, startTime: number, duration: number) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';

          gainNode.gain.setValueAtTime(0.8, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

          oscillator.start(startTime);
          oscillator.stop(startTime + duration);
        };

        const now = audioContext.currentTime;
        playBeep(800, now, 0.2);
        playBeep(1000, now + 0.25, 0.2);
        playBeep(1200, now + 0.5, 0.25);
      });

      console.log('🔔 Notification sound played!');
    } catch (error) {
      console.error('Could not play notification sound:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToOrders((firebaseOrders) => {
      // Check if there's a new order that needs processing (only in admin view)
      if (view === 'admin' && adminTab === 'active') {
        const activeOrders = firebaseOrders.filter(o => o.status !== 'completed');
        const previousActiveCount = orders.filter(o => o.status !== 'completed').length;

        if (activeOrders.length > previousActiveCount) {
          playNotificationSound();

          // Show browser notification if permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Đơn hàng mới! 🔔', {
              body: 'Có đơn hàng mới cần pha chế',
              icon: '/logo.png',
              badge: '/logo.png'
            });
          }
        }
      }

      setPreviousOrderCount(firebaseOrders.length);
      setOrders(firebaseOrders);
    });
    return () => unsubscribe();
  }, [view, adminTab, orders]);

  // Request notification permission when entering admin view
  useEffect(() => {
    if (view === 'admin' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [view]);

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Tất cả' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, note: '' }];
    });
    if (window.navigator.vibrate) window.navigator.vibrate(12);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const newCart = prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(i => i.quantity > 0);

      if (newCart.length === 0) setShowCartDetails(false);
      return newCart;
    });
    if (window.navigator.vibrate) window.navigator.vibrate(8);
  };

  const updateNote = (id: string, note: string) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, note } : item
    ));
  };

  const startEditingNote = (id: string, currentNote: string) => {
    setEditingNoteId(id);
    setNoteInput(currentNote || '');
  };

  const saveNote = (id: string) => {
    updateNote(id, noteInput);
    setEditingNoteId(null);
    setNoteInput('');
  };

  const handleNoteBlur = (id: string) => {
    saveNote(id);
  };

  const handleNoteKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      saveNote(id);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);

    try {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 4).toUpperCase(),
        items: [...cart],
        status: 'pending',
        timestamp: new Date(),
        customerName: customerNameInput.trim() || 'Khách vãng lai',
        total: cartTotal
      };

      await saveOrder(newOrder);

      setCart([]);
      setCustomerNameInput('');
      setIsOrdering(false);
      setOrderSuccess(true);

      if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);

      setTimeout(() => {
        setOrderSuccess(false);
        setShowCartDetails(false);
      }, 3000);
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
      setIsOrdering(false);
      setIsOrdering(false);
      showToast('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!', 'error');
    }
  };

  const openAddToOrder = (orderId: string) => {
    setAddingToOrderId(orderId);
    setAdditionalCart([]);
  };

  const addToAdditionalCart = (item: MenuItem) => {
    setAdditionalCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, note: '' }];
    });
  };

  const updateAdditionalQuantity = (id: string, delta: number) => {
    setAdditionalCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(i => i.quantity > 0);
    });
  };

  const updateAdditionalNote = (id: string, note: string) => {
    setAdditionalCart(prev => prev.map(item =>
      item.id === id ? { ...item, note } : item
    ));
  };

  const startEditingAdditionalNote = (id: string, currentNote: string) => {
    setEditingAdditionalNoteId(id);
    setAdditionalNoteInput(currentNote || '');
  };

  const saveAdditionalNote = (id: string) => {
    updateAdditionalNote(id, additionalNoteInput);
    setEditingAdditionalNoteId(null);
    setAdditionalNoteInput('');
  };

  const handleAdditionalNoteBlur = (id: string) => {
    saveAdditionalNote(id);
  };

  const handleAdditionalNoteKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      saveAdditionalNote(id);
    }
  };

  const handleAddToExistingOrder = async () => {
    if (additionalCart.length === 0 || !addingToOrderId) return;
    setIsOrdering(true);

    try {
      const originalOrder = orders.find(o => o.id === addingToOrderId);
      if (!originalOrder) return;

      // Create a NEW order with only the additional items, linked to parent
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 4).toUpperCase(),
        items: [...additionalCart],
        status: 'pending',
        timestamp: new Date(),
        customerName: `${originalOrder.customerName} (Thêm)`,
        total: additionalCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        parentOrderId: originalOrder.firebaseId // Link to parent order
      };

      await saveOrder(newOrder);

      setAdditionalCart([]);
      setAddingToOrderId(null);
      setIsOrdering(false);
      setAdminTab('active'); // Switch to active tab to see new order

      if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
    } catch (error) {
      console.error('Lỗi khi thêm món:', error);
      setIsOrdering(false);
      showToast('Có lỗi xảy ra khi thêm món!', 'error');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (order?.firebaseId) {
        // If completing an order that has a parent, merge it back
        if (status === 'completed' && order.parentOrderId) {
          const parentOrder = orders.find(o => o.firebaseId === order.parentOrderId);

          if (parentOrder && parentOrder.firebaseId) {
            // Merge items into parent order
            const mergedItems = [...parentOrder.items];

            order.items.forEach(newItem => {
              const existingItem = mergedItems.find(i => i.id === newItem.id && i.note === newItem.note);
              if (existingItem) {
                existingItem.quantity += newItem.quantity;
              } else {
                mergedItems.push(newItem);
              }
            });

            const newTotal = mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Update parent order with merged items
            await updateOrderStatusFirebase(parentOrder.firebaseId, 'completed', mergedItems, newTotal);

            // Delete the child order (it's been merged)
            const { deleteOrder } = await import('./services/firebaseService');
            await deleteOrder(order.firebaseId);

            if (window.navigator.vibrate) window.navigator.vibrate(20);
            return;
          }
        }

        // Normal status update
        await updateOrderStatusFirebase(order.firebaseId, status);
        if (window.navigator.vibrate) window.navigator.vibrate(20);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      showToast('Có lỗi xảy ra khi cập nhật trạng thái!', 'error');
    }
  };

  const updateOrderItems = async (orderId: string, newItems: OrderItem[]) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (order?.firebaseId) {
        const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        await updateOrderStatusFirebase(order.firebaseId, order.status, newItems, newTotal);
        if (window.navigator.vibrate) window.navigator.vibrate(20);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật items:', error);
      showToast('Có lỗi xảy ra khi cập nhật món!', 'error');
    }
  };

  const updateOrderItemQuantity = (orderId: string, itemId: string, delta: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newItems = order.items.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0);

    updateOrderItems(orderId, newItems);
  };

  const updateOrderItemNote = (orderId: string, itemId: string, note: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newItems = order.items.map(item => {
      if (item.id === itemId) {
        return { ...item, note };
      }
      return item;
    });

    updateOrderItems(orderId, newItems);
  };

  const removeOrderItem = (orderId: string, itemId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newItems = order.items.filter(i => i.id !== itemId);
    if (newItems.length === 0) {
      showToast('Không thể xóa hết món! Phải có ít nhất 1 món.', 'error');
      return;
    }

    updateOrderItems(orderId, newItems);
  };

  const addItemToOrder = (orderId: string, menuItem: MenuItem) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const existingItem = order.items.find(i => i.id === menuItem.id && !i.note);
    if (existingItem) {
      // Increase quantity if item already exists
      const newItems = order.items.map(i =>
        i === existingItem ? { ...i, quantity: i.quantity + 1 } : i
      );
      updateOrderItems(orderId, newItems);
    } else {
      // Add new item
      const newItems = [...order.items, { ...menuItem, quantity: 1, note: '' }];
      updateOrderItems(orderId, newItems);
    }

    if (window.navigator.vibrate) window.navigator.vibrate(12);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case Category.COFFEE: return <Coffee size={14} />;
      case Category.SPECIALTY: return <Sparkles size={14} />;
      case Category.MILK_TEA: return <Milk size={14} />;
      case Category.HEALTHY: return <Leaf size={14} />;
      default: return null;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  };

  const getRevenueStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const completedOrders = orders.filter(o => o.status === 'completed');

    const todayOrders = completedOrders.filter(o => o.timestamp >= today);
    const weekOrders = completedOrders.filter(o => o.timestamp >= thisWeekStart);
    const monthOrders = completedOrders.filter(o => o.timestamp >= thisMonthStart);

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const weekRevenue = weekOrders.reduce((sum, o) => sum + o.total, 0);
    const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    // Top selling items
    const itemCounts: { [key: string]: { name: string; count: number; revenue: number } } = {};
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCounts[item.id]) {
          itemCounts[item.id] = { name: item.name, count: 0, revenue: 0 };
        }
        itemCounts[item.id].count += item.quantity;
        itemCounts[item.id].revenue += item.price * item.quantity;
      });
    });

    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count);

    return {
      today: { orders: todayOrders.length, revenue: todayRevenue },
      week: { orders: weekOrders.length, revenue: weekRevenue },
      month: { orders: monthOrders.length, revenue: monthRevenue },
      total: { orders: completedOrders.length, revenue: totalRevenue },
      topItems
    };
  };

  const isOrderDelayed = (timestamp: Date, status: Order['status']) => {
    if (status === 'completed') return false;

    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    return diffMins > 15;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Clean Header */}
      <header className="sticky top-0 z-[100] bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center overflow-hidden shadow-md">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mỳ Sữa Hạt - Coffee & Tea</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Store size={11} />
                207 Ngô Quyền • Bình Long
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-700">Đang mở cửa</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-32">
          {view === 'customer' ? (
            <div className="space-y-6">
              {/* Clean Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm đồ uống..."
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Simple Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['Tất cả', ...Object.values(Category)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold transition-all ${activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                  >
                    {cat !== 'Tất cả' && getCategoryIcon(cat)}
                    {cat}
                  </button>
                ))}
              </div>

              {/* Clean Menu Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Thực đơn</h2>
                  <span className="text-sm text-gray-500">{filteredMenu.length} món</span>
                </div>

                <div className="space-y-8">
                  {Object.entries(filteredMenu.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, MenuItem[]>)).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 sticky top-[73px] bg-gray-50/95 backdrop-blur-sm py-2 z-10">
                        {getCategoryIcon(category)}
                        {category}
                        <span className="text-sm font-normal text-gray-500">({(items as MenuItem[]).length})</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {(items as MenuItem[]).map(item => {
                          const itemInCart = cart.find(c => c.id === item.id);
                          return (
                            <div
                              key={item.id}
                              className={`bg-white border rounded-xl overflow-hidden transition-all ${itemInCart ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200 hover:shadow-md'
                                }`}
                            >
                              {/* Main row: info + add/quantity */}
                              <div
                                className="p-4 flex items-center justify-between cursor-pointer"
                                onClick={() => addToCart(item)}
                              >
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                  <p className="text-lg font-bold text-gray-900">{item.price.toLocaleString()}đ</p>
                                </div>

                                {itemInCart ? (
                                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => updateQuantity(item.id, -1)}
                                      className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center border border-red-200 hover:bg-red-100 active:scale-95 transition-all"
                                    >
                                      <Minus size={16} strokeWidth={2.5} />
                                    </button>
                                    <span className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black">
                                      {itemInCart.quantity}x
                                    </span>
                                    <button
                                      onClick={() => addToCart(item)}
                                      className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition-all"
                                    >
                                      <Plus size={16} strokeWidth={2.5} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 text-gray-400">
                                    <Plus size={20} strokeWidth={2.5} />
                                  </div>
                                )}
                              </div>

                              {/* Inline note section - only when in cart */}
                              {itemInCart && (
                                <div className="px-4 pb-3" onClick={(e) => e.stopPropagation()}>
                                  {editingNoteId === item.id ? (
                                    <input
                                      type="text"
                                      value={noteInput}
                                      onChange={(e) => setNoteInput(e.target.value)}
                                      onBlur={() => handleNoteBlur(item.id)}
                                      onKeyDown={(e) => handleNoteKeyDown(e, item.id)}
                                      placeholder="Ghi chú: ít đường, nhiều đá..."
                                      className="w-full bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                                      autoFocus
                                    />
                                  ) : (
                                    <button
                                      onClick={() => startEditingNote(item.id, itemInCart.note || '')}
                                      className="w-full flex items-center gap-2 text-left text-sm transition-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                                    >
                                      {itemInCart.note ? (
                                        <>
                                          <MessageSquare size={14} className="text-indigo-500 shrink-0" />
                                          <span className="flex-1 text-indigo-700 italic font-medium truncate">{itemInCart.note}</span>
                                          <Edit3 size={14} className="text-gray-400 shrink-0" />
                                        </>
                                      ) : (
                                        <>
                                          <MessageSquare size={14} className="text-gray-400" />
                                          <span className="text-gray-400 font-medium">Thêm ghi chú...</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 rounded-xl text-white">
                  <ReceiptText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
                  <p className="text-sm text-gray-500">Theo dõi và xử lý đơn</p>
                </div>
              </div>

              {/* Simple Tabs */}
              <div className="bg-white border border-gray-200 rounded-xl p-1 flex gap-1 shadow-sm">
                <button
                  onClick={() => setAdminTab('active')}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${adminTab === 'active'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Đơn mới ({orders.filter(o => o.status !== 'completed').length})
                </button>
                <button
                  onClick={() => setAdminTab('completed')}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${adminTab === 'completed'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Đã xong ({orders.filter(o => o.status === 'completed').length})
                </button>
                <button
                  onClick={() => setAdminTab('revenue')}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${adminTab === 'revenue'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Doanh thu
                </button>
              </div>

              <div>
                {adminTab === 'revenue' ? (
                  <div className="space-y-4">
                    {(() => {
                      const stats = getRevenueStats();

                      const selectedDayStart = new Date(revenueDate.getFullYear(), revenueDate.getMonth(), revenueDate.getDate());
                      const selectedDayEnd = new Date(selectedDayStart);
                      selectedDayEnd.setDate(selectedDayEnd.getDate() + 1);

                      const dayOrders = orders.filter(o =>
                        o.status === 'completed' && o.timestamp >= selectedDayStart && o.timestamp < selectedDayEnd
                      ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

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

                      const isToday = selectedDayStart.getTime() === new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
                      const isFuture = selectedDayStart > new Date();

                      const formatDate = (d: Date) => {
                        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                        return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                      };

                      const changeDate = (delta: number) => {
                        const newDate = new Date(revenueDate);
                        newDate.setDate(newDate.getDate() + delta);
                        if (newDate <= new Date()) setRevenueDate(newDate);
                      };

                      return (
                        <>
                          {/* Date Navigator */}
                          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
                            <button onClick={() => changeDate(-1)} className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all">
                              <ChevronLeft size={20} strokeWidth={2.5} />
                            </button>
                            <button onClick={() => setRevenueDate(new Date())} className="text-center">
                              <p className="text-sm font-bold text-gray-900">{isToday ? 'Hôm nay' : formatDate(revenueDate)}</p>
                              {isToday && <p className="text-xs text-gray-500">{formatDate(revenueDate)}</p>}
                              {!isToday && <p className="text-xs text-indigo-600 font-medium">Nhấn để về hôm nay</p>}
                            </button>
                            <button onClick={() => changeDate(1)} disabled={isToday || isFuture} className={`w-10 h-10 rounded-lg flex items-center justify-center active:scale-95 transition-all ${isToday || isFuture ? 'bg-gray-50 text-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                              <ChevronRight size={20} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Summary Cards */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
                              <p className="text-indigo-800 text-xs font-semibold mb-1">{isToday ? 'Hôm nay' : 'Ngày này'}</p>
                              <p className="text-xl font-black text-indigo-700">{(dayRevenue / 1000).toFixed(0)}K</p>
                              <p className="text-xs text-indigo-600 mt-0.5">{dayOrders.length} đơn</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                              <p className="text-gray-600 text-xs font-semibold mb-1">Tháng này</p>
                              <p className="text-xl font-bold text-gray-900">{(stats.month.revenue / 1000).toFixed(0)}K</p>
                              <p className="text-xs text-gray-500 mt-0.5">{stats.month.orders} đơn</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                              <p className="text-gray-600 text-xs font-semibold mb-1">Tổng</p>
                              <p className="text-xl font-bold text-gray-900">{(stats.total.revenue / 1000).toFixed(0)}K</p>
                              <p className="text-xs text-gray-500 mt-0.5">{stats.total.orders} đơn</p>
                            </div>
                          </div>

                          {/* Day Average */}
                          {dayOrders.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                  <CalendarDays size={18} className="text-emerald-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">TB / đơn</p>
                                  <p className="text-xs text-gray-500">{dayOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)} ly tổng</p>
                                </div>
                              </div>
                              <p className="text-lg font-black text-emerald-600">{Math.round(dayRevenue / dayOrders.length).toLocaleString()}đ</p>
                            </div>
                          )}

                          {/* Top Items of the Day */}
                          {dayTopItems.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Flame className="text-indigo-500" size={16} />
                                Bán chạy {isToday ? 'hôm nay' : 'ngày này'}
                              </h3>
                              <div className="space-y-2">
                                {dayTopItems.slice(0, 5).map((item, index) => (
                                  <div key={item.name} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-indigo-500 text-white' : index === 1 ? 'bg-indigo-400 text-white' : index === 2 ? 'bg-indigo-300 text-indigo-800' : 'bg-gray-200 text-gray-600'}`}>
                                      {index + 1}
                                    </div>
                                    <p className="flex-1 text-gray-900 font-semibold text-sm">{item.name}</p>
                                    <div className="text-right">
                                      <p className="text-sm font-bold text-gray-900">{item.count} ly</p>
                                      <p className="text-xs text-gray-500">{item.revenue.toLocaleString()}đ</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
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
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">#{order.id}</span>
                                        <span className="text-sm font-semibold text-gray-900">{order.customerName}</span>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">{order.total.toLocaleString()}đ</p>
                                        <p className="text-xs text-gray-400">{order.timestamp.getHours().toString().padStart(2, '0')}:{order.timestamp.getMinutes().toString().padStart(2, '0')}</p>
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

                          {/* All-time Top 5 */}
                          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <Flame className="text-gray-600" size={16} />
                              Tổng hợp các món
                            </h3>
                            <div className="space-y-2">
                              {stats.topItems.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                  <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-gray-900 text-white' : index === 1 ? 'bg-gray-700 text-white' : index === 2 ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                    {index + 1}
                                  </div>
                                  <p className="flex-1 text-gray-900 font-semibold text-sm">{item.name}</p>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{item.count} ly</p>
                                    <p className="text-xs text-gray-500">{item.revenue.toLocaleString()}đ</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <>
                    {(() => {
                      const filteredOrders = orders.filter(o =>
                        adminTab === 'active' ? o.status !== 'completed' : o.status === 'completed'
                      );

                      if (filteredOrders.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                            <Clock size={48} className="text-gray-300 mb-3" />
                            <p className="font-semibold text-gray-900">
                              {adminTab === 'active' ? 'Chưa có đơn hàng nào' : 'Chưa có đơn đã giao'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {adminTab === 'active' ? 'Đơn hàng mới sẽ xuất hiện ở đây' : 'Lịch sử đơn hàng sẽ hiển thị tại đây'}
                            </p>
                          </div>
                        );
                      }

                      const sortedOrders = [...filteredOrders].sort((a, b) => {
                        if (adminTab === 'active') {
                          // Active orders: preparing first (oldest first), then pending (oldest first)
                          const statusOrder = { preparing: 0, pending: 1 };
                          const statusDiff = statusOrder[a.status as 'preparing' | 'pending'] - statusOrder[b.status as 'preparing' | 'pending'];
                          if (statusDiff !== 0) return statusDiff;
                          return a.timestamp.getTime() - b.timestamp.getTime();
                        } else {
                          // Completed orders: newest first
                          return b.timestamp.getTime() - a.timestamp.getTime();
                        }
                      });

                      const firstOrderId = sortedOrders.length > 0 ? sortedOrders[0].id : null;

                      return sortedOrders.map(order => (
                        <div key={order.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${order.id === firstOrderId && adminTab === 'active'
                            ? 'border-blue-500 ring-4 ring-blue-100 shadow-md scale-[1.01] z-10'
                            : isOrderDelayed(order.timestamp, order.status)
                              ? 'border-red-300 ring-2 ring-red-100' :
                              order.status === 'completed' ? 'border-green-200' :
                                order.status === 'preparing' ? 'border-indigo-300 ring-2 ring-indigo-100' :
                                  'border-gray-200'
                          }`}>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-lg text-gray-900">{order.customerName}</h4>
                                  {order.id === firstOrderId && adminTab === 'active' && (
                                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold animate-pulse">
                                      ƯU TIÊN
                                    </span>
                                  )}
                                  {order.status === 'preparing' && (
                                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                                      🔥 Đang pha
                                    </span>
                                  )}
                                  {isOrderDelayed(order.timestamp, order.status) && (
                                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                                      ⚠️ Chờ lâu
                                    </span>
                                  )}
                                </div>
                                <p className={`text-xs font-medium flex items-center gap-1 ${isOrderDelayed(order.timestamp, order.status)
                                  ? 'text-red-600'
                                  : 'text-gray-500'
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
                              {order.items.map((i, idx) => (
                                <div key={`${i.id}-${idx}`} className="space-y-2">
                                  <div className="flex justify-between items-center gap-3">
                                    <span className="text-gray-800 font-bold flex items-center gap-2.5 flex-1">
                                      {editingOrderId === order.id && order.status !== 'completed' ? (
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => updateOrderItemQuantity(order.id, i.id, -1)}
                                            className="w-7 h-7 bg-red-100 text-red-500 rounded-lg flex items-center justify-center border border-red-200 hover:bg-red-200 active:scale-95 transition-all"
                                          >
                                            <Minus size={14} strokeWidth={2.5} />
                                          </button>
                                          <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black">
                                            {i.quantity}x
                                          </span>
                                          <button
                                            onClick={() => updateOrderItemQuantity(order.id, i.id, 1)}
                                            className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-200 hover:bg-emerald-200 active:scale-95 transition-all"
                                          >
                                            <Plus size={14} strokeWidth={2.5} />
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black">
                                          {i.quantity}x
                                        </span>
                                      )}
                                      <span className="text-base">{i.name}</span>
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-indigo-700 font-bold text-sm">{(i.price * i.quantity).toLocaleString()}đ</span>
                                      {editingOrderId === order.id && order.status !== 'completed' && (
                                        <button
                                          onClick={() => removeOrderItem(order.id, i.id)}
                                          className="w-7 h-7 bg-red-100 text-red-500 rounded-lg flex items-center justify-center border border-red-200 hover:bg-red-200 active:scale-95 transition-all"
                                        >
                                          <X size={14} strokeWidth={2.5} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {editingOrderId === order.id && order.status !== 'completed' ? (
                                    <div className="ml-9 mt-2">
                                      <input
                                        type="text"
                                        defaultValue={i.note || ''}
                                        placeholder="Thêm ghi chú..."
                                        onBlur={(e) => {
                                          if (e.target.value !== (i.note || '')) {
                                            updateOrderItemNote(order.id, i.id, e.target.value);
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
                                    i.note && (
                                      <div className="flex items-start gap-2.5 ml-9 text-sm text-indigo-700 bg-indigo-100 px-4 py-2.5 rounded-xl border border-indigo-200">
                                        <MessageSquare size={16} className="mt-0.5 flex-shrink-0 text-indigo-500" />
                                        <span className="italic font-medium">{i.note}</span>
                                      </div>
                                    )
                                  )}
                                </div>
                              ))}

                              {/* Add new item section when editing */}
                              {editingOrderId === order.id && order.status !== 'completed' && (
                                <div className="pt-3 mt-3 border-t border-indigo-200">
                                  <p className="text-xs text-gray-500 font-bold mb-2 flex items-center gap-1.5">
                                    <Plus size={12} /> Thêm món mới
                                  </p>
                                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                    {MENU_ITEMS.map(menuItem => (
                                      <button
                                        key={menuItem.id}
                                        onClick={() => addItemToOrder(order.id, menuItem)}
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
                                <button
                                  onClick={() => setEditingOrderId(editingOrderId === order.id ? null : order.id)}
                                  className={`px-5 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all ${editingOrderId === order.id
                                    ? 'bg-indigo-100 border border-indigo-300 text-indigo-600'
                                    : 'bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                  {editingOrderId === order.id ? '✓ Xong' : <Edit3 size={18} />}
                                </button>
                              )}
                              {order.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
                                  >
                                    <CheckCircle size={18} />
                                    <span>Hoàn tất đơn</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('Bạn có chắc muốn hủy đơn này không?')) {
                                        import('./services/firebaseService').then(({ deleteOrder }) => {
                                          deleteOrder(order.firebaseId!)
                                            .then(() => showToast('Đã hủy đơn hàng', 'success'))
                                            .catch(() => showToast('Lỗi khi hủy đơn', 'error'));
                                        });
                                      }
                                    }}
                                    className="px-5 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                              {order.status === 'preparing' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'completed')}
                                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-md"
                                >
                                  ✓ Đã pha xong
                                </button>
                              )}
                              {order.status === 'completed' && (
                                <>
                                  <div className="flex-1 text-emerald-600 font-bold text-sm text-center py-3 rounded-xl border border-emerald-200 flex items-center justify-center gap-2 bg-emerald-50">
                                    <CheckCircle size={18} /> Đã giao
                                  </div>
                                  <button
                                    onClick={() => openAddToOrder(order.id)}
                                    className="px-5 py-3 bg-indigo-50 border border-indigo-300 rounded-xl text-indigo-700 font-bold text-sm hover:bg-indigo-100 active:scale-95 transition-all"
                                  >
                                    + Thêm món
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cart Overlay */}
      {showCartDetails && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isOrdering && setShowCartDetails(false)}></div>
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
                    <p className="text-sm text-gray-500 mt-1 font-semibold">{cart.length} món • {cart.reduce((a, b) => a + b.quantity, 0)} ly</p>
                  </div>
                  <button
                    onClick={() => setShowCartDetails(false)}
                    className="p-3 bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-base text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500 font-semibold mt-0.5">{item.price.toLocaleString()}đ / ly</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-red-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Minus size={18} strokeWidth={2.5} />
                          </button>
                          <span className="font-black text-indigo-600 text-lg min-w-[28px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-emerald-500 hover:text-emerald-400 transition-colors p-1"
                          >
                            <Plus size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>

                      {/* Note Section */}
                      {editingNoteId === item.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            onBlur={() => handleNoteBlur(item.id)}
                            onKeyDown={(e) => handleNoteKeyDown(e, item.id)}
                            placeholder="Ví dụ: ít đường, nhiều đá..."
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingNote(item.id, item.note || '')}
                          className="w-full flex items-center gap-3 text-left text-sm text-gray-400 hover:text-indigo-600 transition-all bg-white px-4 py-3 rounded-xl border border-gray-200 hover:border-indigo-300"
                        >
                          {item.note ? (
                            <>
                              <MessageSquare size={16} className="text-indigo-500" />
                              <span className="flex-1 text-indigo-700 italic font-medium">{item.note}</span>
                              <Edit3 size={16} className="text-gray-400" />
                            </>
                          ) : (
                            <>
                              <Plus size={16} />
                              <span className="font-semibold">Thêm ghi chú</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="Tên hoặc số bàn..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                      value={customerNameInput}
                      onChange={(e) => setCustomerNameInput(e.target.value)}
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
                    disabled={isOrdering}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${isOrdering
                      ? 'bg-gray-200 text-gray-400'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95'
                      }`}
                  >
                    {isOrdering ? (
                      <div className="w-6 h-6 border-3 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                    ) : (
                      <span className="flex items-center gap-2">
                        Xác nhận đặt hàng <ChevronRight size={22} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {view === 'customer' && cart.length > 0 && !showCartDetails && (
        <div className="fixed bottom-20 left-5 right-5 z-[150] animate-in slide-in-from-bottom duration-300">
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-2xl p-4 shadow-lg shadow-indigo-600/30 flex items-center justify-between active:scale-95 transition-all"
            onClick={() => setShowCartDetails(true)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl text-white">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-base">Xem giỏ hàng</p>
                <p className="text-white/70 text-xs font-medium">Nhấn để thanh toán</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-white font-black text-xl">{(cartTotal / 1000).toFixed(0)}K</p>
                <p className="text-white/70 text-xs font-medium">{cart.length} món</p>
              </div>
              <ChevronDown size={20} className="text-white/80" strokeWidth={2.5} />
            </div>
          </button>
        </div>
      )}

      {/* Add to Order Modal */}
      {addingToOrderId && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAddingToOrderId(null)}></div>
          <div className="relative bg-white rounded-t-3xl p-6 max-h-[90vh] flex flex-col shadow-2xl border-t border-gray-100 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Thêm món</h2>
                  <p className="text-sm text-gray-500 mt-0.5 font-bold">
                    {orders.find(o => o.id === addingToOrderId)?.customerName}
                  </p>
                </div>
                <button
                  onClick={() => setAddingToOrderId(null)}
                  className="p-2 bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Grid */}
              <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar mb-6">
                {Object.entries(MENU_ITEMS.reduce((acc, item) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item);
                  return acc;
                }, {} as Record<string, typeof MENU_ITEMS>)).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2 sticky top-0 bg-white py-2 z-10 border-b border-gray-100">
                      {getCategoryIcon(category)}
                      {category}
                      <span className="text-sm font-normal text-gray-500">({items.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {(items as MenuItem[]).map(item => {
                        const itemInCart = additionalCart.find(c => c.id === item.id);
                        return (
                          <div
                            key={item.id}
                            className={`bg-gray-50 border rounded-xl overflow-hidden transition-all ${itemInCart ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200 hover:shadow-md'
                              }`}
                          >
                            <div
                              className="p-4 flex items-center justify-between cursor-pointer"
                              onClick={() => addToAdditionalCart(item)}
                            >
                              <div className="flex-1">
                                <h3 className="font-bold text-base text-gray-900 mt-0.5">{item.name}</h3>
                                <p className="text-indigo-600 font-black text-lg mt-1">{item.price.toLocaleString()}đ</p>
                              </div>

                              {itemInCart ? (
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => updateAdditionalQuantity(item.id, -1)}
                                    className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center border border-red-200 hover:bg-red-100 active:scale-95 transition-all"
                                  >
                                    <Minus size={16} strokeWidth={2.5} />
                                  </button>
                                  <span className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black">
                                    {itemInCart.quantity}x
                                  </span>
                                  <button
                                    onClick={() => addToAdditionalCart(item)}
                                    className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition-all"
                                  >
                                    <Plus size={16} strokeWidth={2.5} />
                                  </button>
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-200 text-gray-400">
                                  <Plus size={20} strokeWidth={3} />
                                </div>
                              )}
                            </div>

                            {/* Inline note for modal */}
                            {itemInCart && (
                              <div className="px-4 pb-3" onClick={(e) => e.stopPropagation()}>
                                {editingAdditionalNoteId === item.id ? (
                                  <input
                                    type="text"
                                    value={additionalNoteInput}
                                    onChange={(e) => setAdditionalNoteInput(e.target.value)}
                                    onBlur={() => handleAdditionalNoteBlur(item.id)}
                                    onKeyDown={(e) => handleAdditionalNoteKeyDown(e, item.id)}
                                    placeholder="Ghi chú thêm..."
                                    className="w-full bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                                    autoFocus
                                  />
                                ) : (
                                  <button
                                    onClick={() => startEditingAdditionalNote(item.id, itemInCart.note || '')}
                                    className="w-full flex items-center gap-2 text-left text-sm transition-all bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                                  >
                                    {itemInCart.note ? (
                                      <>
                                        <MessageSquare size={14} className="text-indigo-500 shrink-0" />
                                        <span className="flex-1 text-indigo-700 italic font-medium truncate">{itemInCart.note}</span>
                                        <Edit3 size={14} className="text-gray-400 shrink-0" />
                                      </>
                                    ) : (
                                      <>
                                        <MessageSquare size={14} className="text-gray-400" />
                                        <span className="text-gray-400 font-medium">Thêm ghi chú...</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              {additionalCart.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                    {additionalCart.map(item => (
                      <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-indigo-600 font-bold mt-0.5">{item.price.toLocaleString()}đ / ly</p>
                          </div>
                          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-gray-200">
                            <button
                              onClick={() => updateAdditionalQuantity(item.id, -1)}
                              className="text-red-500 hover:text-red-400 transition-colors"
                            >
                              <Minus size={18} strokeWidth={2.5} />
                            </button>
                            <span className="font-black text-indigo-600 text-lg min-w-[24px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateAdditionalQuantity(item.id, 1)}
                              className="text-emerald-500 hover:text-emerald-400 transition-colors"
                            >
                              <Plus size={18} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>

                        {/* Note Section */}
                        {editingAdditionalNoteId === item.id ? (
                          <input
                            type="text"
                            value={additionalNoteInput}
                            onChange={(e) => setAdditionalNoteInput(e.target.value)}
                            onBlur={() => handleAdditionalNoteBlur(item.id)}
                            onKeyDown={(e) => handleAdditionalNoteKeyDown(e, item.id)}
                            placeholder="Ví dụ: ít đường, nhiều đá..."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => startEditingAdditionalNote(item.id, item.note || '')}
                            className="w-full flex items-center gap-2 text-left text-sm text-gray-400 hover:text-indigo-600 transition-colors bg-white px-3 py-2 rounded-xl border border-gray-200 hover:border-indigo-300"
                          >
                            {item.note ? (
                              <>
                                <MessageSquare size={14} />
                                <span className="flex-1 text-indigo-700 italic font-medium">{item.note}</span>
                                <Edit3 size={14} />
                              </>
                            ) : (
                              <>
                                <Plus size={14} />
                                <span className="font-bold">Thêm ghi chú</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAddToExistingOrder}
                    disabled={isOrdering}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${isOrdering
                      ? 'bg-gray-200 text-gray-400'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95'
                      }`}
                  >
                    {isOrdering ? (
                      <div className="w-6 h-6 border-3 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                    ) : (
                      <>Xác nhận thêm món <ChevronRight size={24} strokeWidth={3} /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[180] bg-white/90 backdrop-blur-xl border-t border-indigo-100 px-10 py-4 flex justify-around items-center shadow-lg shadow-indigo-900/5">
        <button
          onClick={() => setView('customer')}
          className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${view === 'customer' ? 'text-indigo-700' : 'text-gray-400 hover:text-gray-600'
            }`}
        >
          {view === 'customer' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full"></div>
          )}
          <ShoppingCart size={24} strokeWidth={view === 'customer' ? 2.5 : 2} />
          <span className="text-xs font-bold">Thực đơn</span>
        </button>

        <div className="w-px h-8 bg-gray-200"></div>

        <button
          onClick={() => setView('admin')}
          className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${view === 'admin' ? 'text-indigo-700' : 'text-gray-400 hover:text-gray-600'
            }`}
        >
          {view === 'admin' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full"></div>
          )}
          <ClipboardList size={24} strokeWidth={view === 'admin' ? 2.5 : 2} />
          <span className="text-xs font-bold">Quản lý</span>
        </button>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        body { 
          touch-action: pan-y;
          overscroll-behavior-y: contain;
        }
      `}</style>
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-lg border flex items-center gap-3 animate-in slide-in-from-right duration-300 ${toast.type === 'success' ? 'bg-white border-emerald-200 text-emerald-800' :
              toast.type === 'error' ? 'bg-white border-red-200 text-red-800' :
                'bg-white border-indigo-200 text-indigo-800'
              }`}
          >
            {toast.type === 'success' && <CheckCircle className="text-emerald-500 shrink-0" size={20} />}
            {toast.type === 'error' && <X className="text-red-500 shrink-0" size={20} />}
            {toast.type === 'info' && <MessageSquare className="text-indigo-500 shrink-0" size={20} />}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
