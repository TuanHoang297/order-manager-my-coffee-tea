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
  Edit3
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
  const [adminTab, setAdminTab] = useState<'active' | 'completed'>('active');
  const [addingToOrderId, setAddingToOrderId] = useState<string | null>(null);
  const [additionalCart, setAdditionalCart] = useState<OrderItem[]>([]);
  const [, setTimeUpdate] = useState(0);
  const [editingAdditionalNoteId, setEditingAdditionalNoteId] = useState<string | null>(null);
  const [additionalNoteInput, setAdditionalNoteInput] = useState('');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Auto-refresh time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

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
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
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
      alert('Có lỗi xảy ra khi thêm món!');
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
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
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
      alert('Có lỗi xảy ra khi cập nhật món!');
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

  const removeOrderItem = (orderId: string, itemId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newItems = order.items.filter(i => i.id !== itemId);
    if (newItems.length === 0) {
      alert('Không thể xóa hết món! Phải có ít nhất 1 món.');
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

  const isOrderDelayed = (timestamp: Date, status: Order['status']) => {
    if (status === 'completed') return false;
    
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    return diffMins > 15;
  };

  return (
    <div className="min-h-screen text-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Enhanced Ambient Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-cyan-500/30 to-blue-600/20 blur-[140px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-emerald-500/30 to-teal-600/20 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Enhanced Header */}
      <header className="sticky top-0 z-[100] bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 shadow-xl shadow-black/20">
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/30 ring-2 ring-white/10">
                <img src="/logo.png" alt="Mỳ Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">MỲ SỮA HẠT</h1>
              <p className="text-xs text-slate-400 font-semibold mt-0.5 flex items-center gap-1.5">
                <Store size={12} className="text-emerald-400" />
                207 Ngô Quyền • Bình Long
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md"></div>
            <div className="relative bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-4 py-2 rounded-full border border-emerald-400/30 flex items-center gap-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="text-xs font-bold text-emerald-400">Đang mở cửa</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-40">
        {view === 'customer' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Enhanced Search */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-all duration-300" size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm đồ uống yêu thích..."
                className="relative w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:bg-slate-900/80 focus:shadow-xl focus:shadow-cyan-500/20 transition-all backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Enhanced Categories */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {['Tất cả', ...Object.values(Category)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap text-sm font-bold transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-2xl shadow-cyan-400/50 scale-105 ring-2 ring-white/20' 
                      : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800/80 hover:text-white border border-white/10 hover:border-white/20 hover:scale-105'
                  }`}
                >
                  {activeCategory === cat && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-2xl blur-lg opacity-50"></div>
                  )}
                  <span className="relative flex items-center gap-2">
                    {cat !== 'Tất cả' && getCategoryIcon(cat)}
                    {cat}
                  </span>
                </button>
              ))}
            </div>

            {/* Enhanced Menu Grid */}
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 px-1">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/30">
                  <Flame size={18} className="text-orange-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Thực đơn</h2>
                  <p className="text-xs text-slate-400 font-semibold">{filteredMenu.length} món có sẵn</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {filteredMenu.map(item => {
                  const itemInCart = cart.find(c => c.id === item.id);
                  return (
                    <div 
                      key={item.id} 
                      className={`group relative bg-slate-900/60 backdrop-blur-sm border rounded-3xl p-5 flex items-center justify-between transition-all duration-300 hover:bg-slate-800/80 active:scale-[0.97] cursor-pointer ${
                        itemInCart ? 'border-cyan-400/50 bg-slate-800/80 shadow-2xl shadow-cyan-400/20 ring-2 ring-cyan-400/20' : 'border-white/10 hover:border-white/20 hover:shadow-xl'
                      }`}
                      onClick={() => addToCart(item)}
                    >
                      {itemInCart && (
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-3xl"></div>
                      )}
                      
                      <div className="relative flex-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-lg border border-cyan-400/30 mb-2">
                          {getCategoryIcon(item.category)}
                          <span className="text-xs text-cyan-400 font-bold">{item.category}</span>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1.5">{item.name}</h3>
                        <div className="flex items-baseline gap-1.5">
                          <p className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">{item.price.toLocaleString()}</p>
                          <span className="text-sm font-bold text-slate-400">đ</span>
                        </div>
                      </div>
                      
                      <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        itemInCart 
                          ? 'bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-2xl shadow-cyan-400/50 scale-110 ring-2 ring-white/20' 
                          : 'bg-slate-800/60 text-cyan-400 border border-white/10 group-hover:border-cyan-400/50 group-hover:bg-slate-700/60'
                      }`}>
                        {itemInCart && (
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-2xl blur-lg opacity-50"></div>
                        )}
                        {itemInCart ? (
                          <span className="relative text-xl font-black">{itemInCart.quantity}</span>
                        ) : (
                          <Plus size={22} strokeWidth={2.5} className="relative" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <div className="flex items-center gap-4 px-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 rounded-2xl blur-lg"></div>
                <div className="relative p-3 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-2xl border border-cyan-400/30">
                  <ReceiptText className="text-cyan-400" size={28} />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Quản lý đơn hàng</h2>
                <p className="text-sm text-slate-400 font-semibold mt-0.5">Theo dõi và xử lý đơn</p>
              </div>
            </div>

            {/* Enhanced Tabs */}
            <div className="relative bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => setAdminTab('active')}
                  className={`relative flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    adminTab === 'active'
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {adminTab === 'active' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl shadow-xl shadow-cyan-500/30"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl blur-lg opacity-50"></div>
                    </>
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    🔥 Cần pha chế
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                      adminTab === 'active' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-800/60 text-slate-400'
                    }`}>
                      {orders.filter(o => o.status !== 'completed').length}
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => setAdminTab('completed')}
                  className={`relative flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    adminTab === 'completed'
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {adminTab === 'completed' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl shadow-xl shadow-cyan-500/30"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl blur-lg opacity-50"></div>
                    </>
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    ✓ Lịch sử
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                      adminTab === 'completed' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-800/60 text-slate-400'
                    }`}>
                      {orders.filter(o => o.status === 'completed').length}
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {(() => {
                const filteredOrders = orders.filter(o => 
                  adminTab === 'active' ? o.status !== 'completed' : o.status === 'completed'
                );

                if (filteredOrders.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-32">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-full blur-2xl"></div>
                        <div className="relative p-8 bg-slate-900/60 rounded-full border border-white/10">
                          <Clock size={64} className="text-slate-600" strokeWidth={1.5} />
                        </div>
                      </div>
                      <p className="font-bold text-lg text-slate-500">
                        {adminTab === 'active' ? 'Chưa có đơn hàng nào' : 'Chưa có đơn đã giao'}
                      </p>
                      <p className="text-sm text-slate-600 mt-2">
                        {adminTab === 'active' ? 'Đơn hàng mới sẽ xuất hiện ở đây' : 'Lịch sử đơn hàng sẽ hiển thị tại đây'}
                      </p>
                    </div>
                  );
                }

                return filteredOrders
                  .sort((a, b) => {
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
                  })
                  .map(order => (
                  <div key={order.id} className={`relative rounded-3xl border overflow-hidden transition-all duration-300 shadow-2xl ${
                    isOrderDelayed(order.timestamp, order.status) 
                      ? 'bg-gradient-to-br from-red-900/30 to-red-950/30 border-red-500/50 shadow-red-500/30 ring-2 ring-red-500/40' :
                    order.status === 'completed' ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 border-emerald-500/40 shadow-emerald-500/20' : 
                    order.status === 'preparing' ? 'bg-gradient-to-br from-blue-900/30 to-blue-950/30 border-blue-500/50 shadow-blue-500/30 ring-2 ring-blue-500/40' : 
                    'bg-slate-900/60 border-white/10 shadow-black/30 hover:border-white/20'
                  }`}>
                    {/* Glow effect for active orders */}
                    {order.status === 'preparing' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 animate-pulse"></div>
                    )}
                    {isOrderDelayed(order.timestamp, order.status) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-pulse"></div>
                    )}
                    
                    <div className="relative p-6">
                      <div className="flex justify-between items-start mb-5">
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <h4 className="font-black text-xl text-white">{order.customerName}</h4>
                            {order.status === 'preparing' && (
                              <span className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 px-3 py-1 rounded-xl text-xs font-bold border border-blue-400/40 animate-pulse shadow-lg shadow-blue-500/30">
                                🔥 Đang pha
                              </span>
                            )}
                            {isOrderDelayed(order.timestamp, order.status) && (
                              <span className="bg-gradient-to-r from-red-500/30 to-orange-500/30 text-red-300 px-3 py-1 rounded-xl text-xs font-bold border border-red-400/40 animate-pulse shadow-lg shadow-red-500/30">
                                ⚠️ Chờ lâu
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-semibold flex items-center gap-1.5 ${
                            isOrderDelayed(order.timestamp, order.status) 
                              ? 'text-red-400' 
                              : 'text-slate-400'
                          }`}>
                            <Clock size={12} />
                            {getTimeAgo(order.timestamp)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">{order.total.toLocaleString()}</p>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">đồng</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2.5 mb-5 bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                        {order.items.map((i, idx) => (
                          <div key={`${i.id}-${idx}`} className="space-y-2">
                            <div className="flex justify-between items-center gap-3">
                              <span className="text-white font-bold flex items-center gap-2.5 flex-1">
                                {editingOrderId === order.id && order.status !== 'completed' ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateOrderItemQuantity(order.id, i.id, -1)}
                                      className="w-7 h-7 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center border border-red-400/40 hover:bg-red-500/30 active:scale-95 transition-all"
                                    >
                                      <Minus size={14} strokeWidth={2.5} />
                                    </button>
                                    <span className="w-7 h-7 bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 text-cyan-300 rounded-xl flex items-center justify-center text-sm font-black border border-cyan-400/40 shadow-lg">
                                      {i.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateOrderItemQuantity(order.id, i.id, 1)}
                                      className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-400/40 hover:bg-emerald-500/30 active:scale-95 transition-all"
                                    >
                                      <Plus size={14} strokeWidth={2.5} />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="w-7 h-7 bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 text-cyan-300 rounded-xl flex items-center justify-center text-sm font-black border border-cyan-400/40 shadow-lg">
                                    {i.quantity}
                                  </span>
                                )}
                                <span className="text-base">{i.name}</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-300 font-bold text-sm">{(i.price * i.quantity).toLocaleString()}đ</span>
                                {editingOrderId === order.id && order.status !== 'completed' && (
                                  <button
                                    onClick={() => removeOrderItem(order.id, i.id)}
                                    className="w-7 h-7 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center border border-red-400/40 hover:bg-red-500/30 active:scale-95 transition-all"
                                  >
                                    <X size={14} strokeWidth={2.5} />
                                  </button>
                                )}
                              </div>
                            </div>
                            {i.note && (
                              <div className="flex items-start gap-2.5 ml-9 text-sm text-cyan-300 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 px-4 py-2.5 rounded-xl border border-cyan-400/30 backdrop-blur-sm">
                                <MessageSquare size={16} className="mt-0.5 flex-shrink-0 text-cyan-400" />
                                <span className="italic font-medium">{i.note}</span>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* Add new item section when editing */}
                        {editingOrderId === order.id && order.status !== 'completed' && (
                          <div className="pt-3 mt-3 border-t border-white/10">
                            <p className="text-xs text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                              <Plus size={12} /> Thêm món mới
                            </p>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                              {MENU_ITEMS.map(menuItem => (
                                <button
                                  key={menuItem.id}
                                  onClick={() => addItemToOrder(order.id, menuItem)}
                                  className="bg-slate-800/60 hover:bg-slate-700/60 border border-white/10 hover:border-cyan-400/40 rounded-xl p-2.5 text-left transition-all active:scale-95"
                                >
                                  <p className="text-white font-bold text-xs mb-0.5">{menuItem.name}</p>
                                  <p className="text-cyan-400 font-black text-xs">{menuItem.price.toLocaleString()}đ</p>
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
                            className={`px-5 py-4 rounded-2xl font-bold text-base active:scale-95 transition-all backdrop-blur-sm shadow-lg ${
                              editingOrderId === order.id
                                ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 border border-orange-400/40 text-orange-300'
                                : 'bg-gradient-to-r from-slate-500/20 to-slate-600/20 border border-slate-400/40 text-slate-300 hover:from-slate-500/30 hover:to-slate-600/30'
                            }`}
                          >
                            {editingOrderId === order.id ? '✓ Xong' : <Edit3 size={18} />}
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'preparing')} 
                            className="relative flex-1 group overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-base active:scale-95 transition-all shadow-xl shadow-blue-500/40 ring-2 ring-white/10">
                              Bắt đầu pha chế
                            </div>
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'completed')} 
                            className="relative flex-1 group overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-bold text-base active:scale-95 transition-all shadow-xl shadow-emerald-500/40 ring-2 ring-white/10">
                              ✓ Đã pha xong
                            </div>
                          </button>
                        )}
                        {order.status === 'completed' && (
                          <>
                            <div className="flex-1 text-emerald-400 font-bold text-base text-center py-4 rounded-2xl border border-emerald-500/40 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm">
                              <CheckCircle size={18} /> Đã giao
                            </div>
                            <button
                              onClick={() => openAddToOrder(order.id)}
                              className="px-5 py-4 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-400/40 rounded-2xl text-cyan-400 font-bold text-base hover:from-cyan-500/30 hover:to-emerald-500/30 active:scale-95 transition-all backdrop-blur-sm shadow-lg"
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
            </div>
          </div>
        )}
      </main>

      {/* Enhanced Cart Overlay */}
      {showCartDetails && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => !isOrdering && setShowCartDetails(false)}></div>
          <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-t-[2rem] p-6 max-h-[90vh] flex flex-col shadow-2xl border-t border-white/10 animate-in slide-in-from-bottom duration-300">
            <div className="w-16 h-1.5 bg-slate-700/60 rounded-full mx-auto mb-6"></div>
            
            {orderSuccess ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 text-white p-8 rounded-3xl shadow-2xl shadow-cyan-400/50 rotate-3 ring-4 ring-white/20">
                    <PartyPopper size={56} strokeWidth={2} />
                  </div>
                </div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3">Đặt hàng thành công!</h2>
                <p className="text-slate-400 font-semibold text-lg">Đơn hàng đã được gửi đến quầy</p>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Giỏ hàng</h2>
                    <p className="text-sm text-slate-400 mt-1 font-semibold">{cart.length} món • {cart.reduce((a, b) => a + b.quantity, 0)} ly</p>
                  </div>
                  <button 
                    onClick={() => setShowCartDetails(false)} 
                    className="p-3 bg-slate-800/60 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all border border-white/10"
                  >
                    <X size={22} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="bg-slate-900/60 p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl backdrop-blur-sm hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-white">{item.name}</h4>
                          <p className="text-sm text-slate-400 font-semibold mt-1">{item.price.toLocaleString()}đ / ly</p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-800/60 px-4 py-2.5 rounded-2xl border border-white/10">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                          >
                            <Minus size={18} strokeWidth={2.5} />
                          </button>
                          <span className="font-black text-cyan-400 text-xl min-w-[28px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="text-emerald-400 hover:text-emerald-300 transition-colors p-1"
                          >
                            <Plus size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>

                      {/* Enhanced Note Section */}
                      {editingNoteId === item.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            onBlur={() => handleNoteBlur(item.id)}
                            onKeyDown={(e) => handleNoteKeyDown(e, item.id)}
                            placeholder="Ví dụ: ít đường, nhiều đá..."
                            className="flex-1 bg-slate-800/60 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:shadow-lg focus:shadow-cyan-500/20 transition-all"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingNote(item.id, item.note || '')}
                          className="w-full flex items-center gap-3 text-left text-sm text-slate-400 hover:text-cyan-400 transition-all bg-slate-800/40 px-4 py-3 rounded-2xl border border-white/10 hover:border-cyan-400/40 hover:bg-slate-800/60"
                        >
                          {item.note ? (
                            <>
                              <MessageSquare size={16} className="text-cyan-400" />
                              <span className="flex-1 text-cyan-300 italic font-medium">{item.note}</span>
                              <Edit3 size={16} className="text-slate-500" />
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

                <div className="space-y-5 pt-5 border-t border-white/10">
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Tên hoặc số bàn..."
                      className="w-full bg-slate-800/60 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:shadow-lg focus:shadow-cyan-500/20 transition-all"
                      value={customerNameInput}
                      onChange={(e) => setCustomerNameInput(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between items-center px-2">
                    <span className="text-slate-400 text-base font-semibold">Tổng cộng</span>
                    <div className="text-right">
                      <p className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">{cartTotal.toLocaleString()}</p>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">đồng</p>
                    </div>
                  </div>

                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isOrdering}
                    className={`relative w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 overflow-hidden ${
                      isOrdering 
                        ? 'bg-slate-800/60 text-slate-500' 
                        : 'group'
                    }`}
                  >
                    {!isOrdering && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 group-hover:scale-105 transition-transform"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      </>
                    )}
                    {isOrdering ? (
                      <div className="w-7 h-7 border-3 border-slate-700 border-t-cyan-400 rounded-full animate-spin"></div>
                    ) : (
                      <span className="relative flex items-center gap-3">
                        Xác nhận đặt hàng <ChevronRight size={26} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Floating Cart Button */}
      {view === 'customer' && cart.length > 0 && !showCartDetails && (
        <div className="fixed bottom-28 left-5 right-5 z-[150] animate-in slide-in-from-bottom duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>
            <button 
              className="relative w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 rounded-3xl p-5 shadow-2xl shadow-cyan-400/50 flex items-center justify-between active:scale-95 transition-all duration-300 ring-2 ring-white/20"
              onClick={() => setShowCartDetails(true)}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md"></div>
                  <div className="relative bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg ring-2 ring-white/30">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-white font-black text-lg">Xem giỏ hàng</p>
                  <p className="text-white/70 text-sm font-semibold">Nhấn để thanh toán</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white font-black text-2xl">{(cartTotal / 1000).toFixed(0)}K</p>
                  <p className="text-white/70 text-xs font-semibold">{cart.length} món</p>
                </div>
                <ChevronDown size={24} className="text-white/80" strokeWidth={2.5} />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Add to Order Modal */}
      {addingToOrderId && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setAddingToOrderId(null)}></div>
          <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-t-3xl p-6 max-h-[90vh] flex flex-col shadow-2xl border-t border-slate-700/30 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-slate-700/40 rounded-full mx-auto mb-6"></div>
            
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-cyan-400">Thêm món</h2>
                  <p className="text-sm text-teal-500/60 mt-0.5 font-bold">
                    {orders.find(o => o.id === addingToOrderId)?.customerName}
                  </p>
                </div>
                <button 
                  onClick={() => setAddingToOrderId(null)} 
                  className="p-2 bg-black/60 rounded-xl text-teal-500/60 hover:text-cyan-400 transition-colors border border-slate-700/20"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Grid - Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar mb-6">
                {MENU_ITEMS.map(item => {
                  const itemInCart = additionalCart.find(c => c.id === item.id);
                  return (
                    <div 
                      key={item.id} 
                      className={`group bg-black/40 backdrop-blur-sm border rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-black/60 active:scale-[0.98] shadow-lg ${
                        itemInCart ? 'border-cyan-400/60 bg-black/60 shadow-cyan-400/20' : 'border-slate-700/20 hover:border-slate-700/40'
                      }`}
                      onClick={() => addToAdditionalCart(item)}
                    >
                      <div className="flex-1">
                        <span className="text-xs text-cyan-400 font-bold">{item.category}</span>
                        <h3 className="font-bold text-base text-white mt-0.5">{item.name}</h3>
                        <p className="text-cyan-400 font-black text-lg mt-1">{item.price.toLocaleString()}đ</p>
                      </div>
                      
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        itemInCart 
                          ? 'bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-xl shadow-cyan-400/40 scale-110' 
                          : 'bg-slate-700/20 text-cyan-400 border border-slate-700/30'
                      }`}>
                        {itemInCart ? (
                          <span className="text-lg font-black">{itemInCart.quantity}</span>
                        ) : (
                          <Plus size={20} strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary - Same as main cart */}
              {additionalCart.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-700/30">
                  <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                    {additionalCart.map(item => (
                      <div key={item.id} className="bg-black/60 p-4 rounded-2xl border border-slate-700/30 space-y-3 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-white">{item.name}</h4>
                            <p className="text-sm text-cyan-400 font-bold mt-0.5">{item.price.toLocaleString()}đ / ly</p>
                          </div>
                          <div className="flex items-center gap-3 bg-black/60 px-3 py-2 rounded-xl border border-slate-700/30">
                            <button 
                              onClick={() => updateAdditionalQuantity(item.id, -1)} 
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Minus size={18} strokeWidth={2.5} />
                            </button>
                            <span className="font-black text-cyan-400 text-lg min-w-[24px] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateAdditionalQuantity(item.id, 1)} 
                              className="text-emerald-400 hover:text-emerald-300 transition-colors"
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
                            className="w-full bg-black/60 border border-slate-700/30 rounded-xl px-3 py-2 text-sm text-white placeholder:text-teal-500/30 focus:outline-none focus:border-cyan-400/50"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => startEditingAdditionalNote(item.id, item.note || '')}
                            className="w-full flex items-center gap-2 text-left text-sm text-teal-500/60 hover:text-cyan-400 transition-colors bg-black/40 px-3 py-2 rounded-xl border border-slate-700/20 hover:border-cyan-400/30"
                          >
                            {item.note ? (
                              <>
                                <MessageSquare size={14} />
                                <span className="flex-1 text-cyan-300 italic font-medium">{item.note}</span>
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
                    className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${
                      isOrdering 
                        ? 'bg-slate-700/40 text-teal-500/40' 
                        : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-2xl shadow-cyan-400/40 active:scale-[0.98]'
                    }`}
                  >
                    {isOrdering ? (
                      <div className="w-6 h-6 border-3 border-slate-700 border-t-cyan-400 rounded-full animate-spin"></div>
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
      <nav className="fixed bottom-6 left-6 right-6 z-[180] bg-slate-900/80 backdrop-blur-2xl border border-white/10 px-10 py-5 flex justify-around items-center rounded-3xl shadow-2xl shadow-black/40">
        <button 
          onClick={() => setView('customer')}
          className={`relative flex flex-col items-center gap-2 transition-all duration-300 ${
            view === 'customer' ? 'text-cyan-400 scale-110' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {view === 'customer' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl blur-xl"></div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"></div>
            </>
          )}
          <ShoppingCart size={26} strokeWidth={view === 'customer' ? 2.5 : 2} className="relative" />
          <span className="relative text-xs font-bold">Thực đơn</span>
        </button>
        
        <div className="w-px h-10 bg-white/10"></div>

        <button 
          onClick={() => setView('admin')}
          className={`relative flex flex-col items-center gap-2 transition-all duration-300 ${
            view === 'admin' ? 'text-cyan-400 scale-110' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {view === 'admin' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl blur-xl"></div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"></div>
            </>
          )}
          <ClipboardList size={26} strokeWidth={view === 'admin' ? 2.5 : 2} className="relative" />
          <span className="relative text-xs font-bold">Quản lý</span>
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
    </div>
  );
}
