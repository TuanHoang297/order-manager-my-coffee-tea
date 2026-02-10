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

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a pleasant notification sound (3 beeps)
      const playBeep = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.5, startTime); // Tăng volume lên
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      const now = audioContext.currentTime;
      playBeep(800, now, 0.2);
      playBeep(1000, now + 0.25, 0.2);
      playBeep(1200, now + 0.5, 0.25);
      
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
        
        if (activeOrders.length > previousActiveCount && previousActiveCount > 0) {
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
      
      // Switch back to customer view (order page) for staff to continue
      setView('customer');
      
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

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case Category.COFFEE: return <Coffee size={14} />;
      case Category.SPECIALTY: return <Sparkles size={14} />;
      case Category.MILK_TEA: return <Milk size={14} />;
      case Category.HEALTHY: return <Leaf size={14} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen text-slate-100 bg-[#0a0404] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none opacity-25">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-amber-900/50 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-red-900/40 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-orange-900/30 blur-[100px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[100] bg-[#0a0404]/95 backdrop-blur-xl border-b border-amber-900/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden bg-white/5">
              <img src="/logo.png" alt="Mỳ Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-black text-amber-500 tracking-tight">MỲ SỮA HẠT</h1>
              <p className="text-xs text-amber-600/60 font-bold">207 Ngô Quyền • Bình Long</p>
            </div>
          </div>
          <div className="bg-emerald-500/15 px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
            <span className="text-xs font-bold text-emerald-400">Đang mở cửa</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-40">
        {view === 'customer' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/40 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm đồ uống..."
                className="w-full bg-black/40 border border-amber-900/30 rounded-2xl py-4 pl-12 pr-5 text-sm text-white placeholder:text-amber-600/30 focus:outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all shadow-lg shadow-black/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {['Tất cả', ...Object.values(Category)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-black shadow-xl shadow-amber-500/40 scale-105' 
                      : 'bg-black/40 text-amber-600/60 hover:bg-black/60 border border-amber-900/20 hover:border-amber-900/40'
                  }`}
                >
                  {cat !== 'Tất cả' && getCategoryIcon(cat)}
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600/60">
                <Flame size={16} className="text-amber-500" />
                <span className="text-sm font-bold">Thực đơn ({filteredMenu.length} món)</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {filteredMenu.map(item => {
                  const itemInCart = cart.find(c => c.id === item.id);
                  return (
                    <div 
                      key={item.id} 
                      className={`group bg-black/40 backdrop-blur-sm border rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-black/60 active:scale-[0.98] shadow-lg ${
                        itemInCart ? 'border-amber-500/60 bg-black/60 shadow-amber-500/20' : 'border-amber-900/20 hover:border-amber-900/40'
                      }`}
                      onClick={() => addToCart(item)}
                    >
                      <div className="flex-1">
                        <span className="text-xs text-amber-500 font-bold">{item.category}</span>
                        <h3 className="font-bold text-base text-white mt-0.5">{item.name}</h3>
                        <p className="text-amber-500 font-black text-lg mt-1">{item.price.toLocaleString()}đ</p>
                      </div>
                      
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        itemInCart 
                          ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-black shadow-xl shadow-amber-500/40 scale-110' 
                          : 'bg-amber-900/20 text-amber-500 border border-amber-900/30'
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
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <div className="flex items-center gap-3">
              <ReceiptText className="text-amber-500" size={28} />
              <div>
                <h2 className="text-2xl font-black text-amber-500">Quản lý đơn hàng</h2>
                <p className="text-sm text-amber-600/60 font-bold">Theo dõi và xử lý đơn</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-amber-900/20">
              <button
                onClick={() => setAdminTab('active')}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                  adminTab === 'active'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-lg'
                    : 'text-amber-600/60 hover:text-amber-500'
                }`}
              >
                🔥 Cần pha chế ({orders.filter(o => o.status !== 'completed').length})
              </button>
              <button
                onClick={() => setAdminTab('completed')}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                  adminTab === 'completed'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-lg'
                    : 'text-amber-600/60 hover:text-amber-500'
                }`}
              >
                ✓ Lịch sử ({orders.filter(o => o.status === 'completed').length})
              </button>
            </div>

            <div className="space-y-3">
              {(() => {
                const filteredOrders = orders.filter(o => 
                  adminTab === 'active' ? o.status !== 'completed' : o.status === 'completed'
                );

                if (filteredOrders.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-32 text-amber-900/40">
                      <Clock size={64} className="mb-4" strokeWidth={1.5} />
                      <p className="font-bold">
                        {adminTab === 'active' ? 'Chưa có đơn hàng nào' : 'Chưa có đơn đã giao'}
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
                  <div key={order.id} className={`rounded-2xl border overflow-hidden transition-all shadow-xl ${
                    order.status === 'completed' ? 'bg-emerald-900/20 border-emerald-500/30 shadow-emerald-500/10' : 
                    order.status === 'preparing' ? 'bg-blue-900/20 border-blue-500/40 shadow-blue-500/20 ring-2 ring-blue-500/30' : 
                    'bg-black/40 border-amber-900/30 shadow-black/20'
                  }`}>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-black px-2 py-0.5 rounded-lg text-xs font-black shadow-lg shadow-amber-500/30">#{order.id}</span>
                            <h4 className="font-black text-lg text-white">{order.customerName}</h4>
                            {order.status === 'preparing' && (
                              <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg text-xs font-bold border border-blue-500/30 animate-pulse">
                                🔥 Đang pha
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-600/60 font-bold">{order.timestamp.toLocaleString('vi-VN')}</p>
                        </div>
                        <p className="text-xl font-black text-amber-500">{order.total.toLocaleString()}đ</p>
                      </div>
                      
                      <div className="space-y-2 mb-4 bg-black/40 p-3 rounded-xl border border-amber-900/20">
                        {order.items.map(i => (
                          <div key={i.id} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-white font-bold flex items-center gap-2">
                                <span className="w-6 h-6 bg-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center text-xs font-black border border-amber-500/30">
                                  {i.quantity}
                                </span>
                                {i.name}
                              </span>
                              <span className="text-amber-600/80 font-bold">{(i.price * i.quantity).toLocaleString()}đ</span>
                            </div>
                            {i.note && (
                              <div className="flex items-start gap-2 ml-8 text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
                                <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
                                <span className="italic font-medium">{i.note}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'preparing')} 
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-xl shadow-blue-500/30"
                          >
                            Bắt đầu pha chế
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'completed')} 
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-xl shadow-emerald-500/30"
                          >
                            ✓ Đã pha xong
                          </button>
                        )}
                        {order.status === 'completed' && (
                          <>
                            <div className="flex-1 text-emerald-400 font-bold text-sm text-center py-3 rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2 bg-emerald-500/10">
                              <CheckCircle size={16} /> Đã giao
                            </div>
                            <button
                              onClick={() => openAddToOrder(order.id)}
                              className="px-4 py-3 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-500 font-bold text-sm hover:bg-amber-500/30 active:scale-95 transition-all"
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

      {/* Cart Overlay */}
      {showCartDetails && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => !isOrdering && setShowCartDetails(false)}></div>
          <div className="relative bg-gradient-to-b from-[#1a0808] to-[#0a0404] rounded-t-3xl p-6 max-h-[90vh] flex flex-col shadow-2xl border-t border-amber-900/30 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-amber-900/40 rounded-full mx-auto mb-6"></div>
            
            {orderSuccess ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-black p-6 rounded-3xl shadow-2xl shadow-amber-500/40 mb-6 rotate-3">
                  <PartyPopper size={48} />
                </div>
                <h2 className="text-3xl font-black text-amber-500 mb-2">Đặt hàng thành công!</h2>
                <p className="text-amber-600/60 font-bold">Đơn hàng đã được gửi đến quầy</p>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-amber-500">Giỏ hàng</h2>
                    <p className="text-sm text-amber-600/60 mt-0.5 font-bold">{cart.length} món</p>
                  </div>
                  <button 
                    onClick={() => setShowCartDetails(false)} 
                    className="p-2 bg-black/60 rounded-xl text-amber-600/60 hover:text-amber-500 transition-colors border border-amber-900/20"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="bg-black/60 p-4 rounded-2xl border border-amber-900/30 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{item.name}</h4>
                          <p className="text-sm text-amber-500 font-bold mt-0.5">{item.price.toLocaleString()}đ / ly</p>
                        </div>
                        <div className="flex items-center gap-3 bg-black/60 px-3 py-2 rounded-xl border border-amber-900/30">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Minus size={18} strokeWidth={2.5} />
                          </button>
                          <span className="font-black text-amber-500 text-lg min-w-[24px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="text-emerald-400 hover:text-emerald-300 transition-colors"
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
                            className="flex-1 bg-black/60 border border-amber-900/30 rounded-xl px-3 py-2 text-sm text-white placeholder:text-amber-600/30 focus:outline-none focus:border-amber-500/50"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingNote(item.id, item.note || '')}
                          className="w-full flex items-center gap-2 text-left text-sm text-amber-600/60 hover:text-amber-500 transition-colors bg-black/40 px-3 py-2 rounded-xl border border-amber-900/20 hover:border-amber-500/30"
                        >
                          {item.note ? (
                            <>
                              <MessageSquare size={14} />
                              <span className="flex-1 text-amber-400 italic font-medium">{item.note}</span>
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

                <div className="space-y-4 pt-4 border-t border-amber-900/30">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/40 group-focus-within:text-amber-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tên hoặc số bàn..."
                      className="w-full bg-black/60 border border-amber-900/30 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-amber-600/30 focus:outline-none focus:border-amber-500/50"
                      value={customerNameInput}
                      onChange={(e) => setCustomerNameInput(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <span className="text-amber-600/60 text-sm font-bold">Tổng cộng</span>
                    <span className="text-3xl font-black text-amber-500">{cartTotal.toLocaleString()}đ</span>
                  </div>

                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isOrdering}
                    className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${
                      isOrdering 
                        ? 'bg-amber-900/40 text-amber-600/40' 
                        : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-black shadow-2xl shadow-amber-500/40 active:scale-[0.98]'
                    }`}
                  >
                    {isOrdering ? (
                      <div className="w-6 h-6 border-3 border-amber-900 border-t-amber-500 rounded-full animate-spin"></div>
                    ) : (
                      <>Xác nhận đặt hàng <ChevronRight size={24} strokeWidth={3} /></>
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
        <div className="fixed bottom-28 left-5 right-5 z-[150] animate-in slide-in-from-bottom duration-300">
          <button 
            className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-2xl p-4 shadow-2xl shadow-amber-500/40 flex items-center justify-between active:scale-95 transition-all border border-amber-400/30"
            onClick={() => setShowCartDetails(true)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-black/30 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </div>
              <div className="text-left">
                <p className="text-black font-black text-base">Xem giỏ hàng</p>
                <p className="text-black/60 text-xs font-bold">Nhấn để thanh toán</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black font-black text-xl">{(cartTotal / 1000).toFixed(0)}K</span>
              <ChevronDown size={20} className="text-black/60" />
            </div>
          </button>
        </div>
      )}

      {/* Add to Order Modal */}
      {addingToOrderId && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setAddingToOrderId(null)}></div>
          <div className="relative bg-gradient-to-b from-[#1a0808] to-[#0a0404] rounded-t-3xl p-6 max-h-[85vh] flex flex-col shadow-2xl border-t border-amber-900/30 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-amber-900/40 rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-amber-500">Thêm món</h2>
                <p className="text-sm text-amber-600/60 mt-0.5 font-bold">
                  Đơn #{orders.find(o => o.id === addingToOrderId)?.id} - {orders.find(o => o.id === addingToOrderId)?.customerName}
                </p>
              </div>
              <button 
                onClick={() => setAddingToOrderId(null)} 
                className="p-2 bg-black/60 rounded-xl text-amber-600/60 hover:text-amber-500 transition-colors border border-amber-900/20"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Grid */}
            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar mb-6">
              {MENU_ITEMS.map(item => {
                const itemInCart = additionalCart.find(c => c.id === item.id);
                return (
                  <div 
                    key={item.id} 
                    className={`group bg-black/40 backdrop-blur-sm border rounded-2xl p-4 flex items-center justify-between transition-all hover:bg-black/60 active:scale-[0.98] shadow-lg ${
                      itemInCart ? 'border-amber-500/60 bg-black/60 shadow-amber-500/20' : 'border-amber-900/20 hover:border-amber-900/40'
                    }`}
                    onClick={() => addToAdditionalCart(item)}
                  >
                    <div className="flex-1">
                      <span className="text-xs text-amber-500 font-bold">{item.category}</span>
                      <h3 className="font-bold text-base text-white mt-0.5">{item.name}</h3>
                      <p className="text-amber-500 font-black text-lg mt-1">{item.price.toLocaleString()}đ</p>
                    </div>
                    
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      itemInCart 
                        ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-black shadow-xl shadow-amber-500/40 scale-110' 
                        : 'bg-amber-900/20 text-amber-500 border border-amber-900/30'
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

            {/* Cart Summary */}
            {additionalCart.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-amber-900/30">
                <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                  {additionalCart.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm bg-black/40 px-3 py-2 rounded-xl">
                      <span className="text-white font-bold">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateAdditionalQuantity(item.id, -1)} className="text-red-400">
                          <Minus size={16} strokeWidth={2.5} />
                        </button>
                        <span className="text-amber-500 font-black min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => updateAdditionalQuantity(item.id, 1)} className="text-emerald-400">
                          <Plus size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleAddToExistingOrder}
                  disabled={isOrdering}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${
                    isOrdering 
                      ? 'bg-amber-900/40 text-amber-600/40' 
                      : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-black shadow-2xl shadow-amber-500/40 active:scale-[0.98]'
                  }`}
                >
                  {isOrdering ? (
                    <div className="w-6 h-6 border-3 border-amber-900 border-t-amber-500 rounded-full animate-spin"></div>
                  ) : (
                    <>Xác nhận thêm món <ChevronRight size={24} strokeWidth={3} /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 z-[180] bg-[#1a0808]/95 backdrop-blur-xl border border-amber-900/30 px-8 py-4 flex justify-around items-center rounded-2xl shadow-2xl">
        <button 
          onClick={() => setView('customer')}
          className={`flex flex-col items-center gap-1.5 transition-all ${
            view === 'customer' ? 'text-amber-500' : 'text-amber-600/40'
          }`}
        >
          <ShoppingCart size={24} strokeWidth={view === 'customer' ? 2.5 : 2} />
          <span className="text-xs font-bold">Thực đơn</span>
        </button>
        
        <div className="w-px h-8 bg-amber-900/30"></div>

        <button 
          onClick={() => setView('admin')}
          className={`flex flex-col items-center gap-1.5 transition-all ${
            view === 'admin' ? 'text-amber-500' : 'text-amber-600/40'
          }`}
        >
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
    </div>
  );
}
