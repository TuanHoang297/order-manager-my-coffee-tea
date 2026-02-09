
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
  History,
  User,
  PartyPopper,
  Zap,
  Store,
  MapPin,
  Flame,
  Star,
  ReceiptText
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

  // Lắng nghe thay đổi đơn hàng từ Firebase
  useEffect(() => {
    const unsubscribe = subscribeToOrders((firebaseOrders) => {
      setOrders(firebaseOrders);
    });

    // Cleanup khi component unmount
    return () => unsubscribe();
  }, []);

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
      return [...prev, { ...item, quantity: 1 }];
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
      
      // Lưu vào Firebase
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

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      // Tìm order để lấy firebaseId
      const order = orders.find(o => o.id === orderId);
      if (order?.firebaseId) {
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
    <div className="min-h-screen text-slate-100 bg-[#0f0707] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Subtle Ambient Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-amber-900/40 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-red-900/30 blur-[100px] rounded-full"></div>
      </div>

      {/* Modern Header - Cleaner & Aligned */}
      <header className="sticky top-0 z-[100] bg-[#0f0707]/90 backdrop-blur-md border-b border-white/[0.03] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-1">
            <Store className="text-black" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-serif font-black text-amber-500 italic leading-none tracking-tight">MỲ SỮA HẠT</h1>
            <p className="text-[9px] font-bold text-white/30 uppercase mt-1 tracking-widest leading-none">207 NGÔ QUYỀN • BÌNH LONG</p>
          </div>
        </div>
        <div className="bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">MỞ CỬA</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-40">
        {view === 'customer' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Search Input - More minimal */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Hôm nay bạn muốn dùng gì?"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-sm focus:outline-none focus:bg-white/[0.05] transition-all placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Section - Consistent pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-5 px-5">
              {['Tất cả', ...Object.values(Category)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl whitespace-nowrap text-[10px] font-black uppercase tracking-wider transition-all border ${
                    activeCategory === cat 
                      ? 'bg-amber-500 text-black border-amber-400' 
                      : 'bg-white/[0.03] text-white/40 border-white/5 hover:border-white/10'
                  }`}
                >
                  {cat !== 'Tất cả' && getCategoryIcon(cat)}
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid - Organized & Readable */}
            <div className="space-y-6">
              <div className="flex items-center justify-between opacity-50 px-1">
                <div className="flex items-center gap-2">
                  <Flame size={14} className="text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Danh sách đồ uống</span>
                </div>
                <span className="text-[9px] font-bold uppercase">{filteredMenu.length} Món có sẵn</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {filteredMenu.map(item => {
                  const itemInCart = cart.find(c => c.id === item.id);
                  return (
                    <div 
                      key={item.id} 
                      className={`group relative bg-white/[0.03] border border-white/5 p-5 rounded-3xl flex items-center justify-between active:scale-[0.98] transition-all duration-300 ${itemInCart ? 'border-amber-500/40 bg-white/[0.05]' : ''}`}
                      onClick={() => addToCart(item)}
                    >
                      <div className="flex-1 pr-4">
                        <span className="text-[8px] text-amber-600/80 font-black uppercase tracking-widest">{item.category}</span>
                        <h3 className="font-bold text-lg text-white mt-1 group-active:text-amber-500 transition-colors">{item.name}</h3>
                        <div className="flex items-baseline gap-1 mt-1.5">
                          <p className="text-amber-500 font-black text-xl italic tracking-tighter">{(item.price / 1000).toLocaleString()}K</p>
                          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">VNĐ</span>
                        </div>
                      </div>
                      
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${itemInCart ? 'bg-amber-500 text-black shadow-lg scale-105' : 'bg-white/[0.04] text-amber-500 border border-white/5'}`}>
                        {itemInCart ? <span className="text-lg font-black">{itemInCart.quantity}</span> : <Plus size={24} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-serif font-black text-amber-500 italic flex items-center gap-2 tracking-tight">
                  <ReceiptText className="text-amber-500" size={24} /> QUẢN LÝ ĐƠN
                </h2>
                <p className="text-[9px] text-white/30 font-black uppercase mt-1 tracking-widest">Theo dõi đơn hàng tại quầy</p>
              </div>
            </header>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 opacity-20">
                  <Clock size={80} className="mb-6 stroke-[1]" />
                  <p className="font-black uppercase tracking-[0.3em] text-xs">Đang chờ đơn hàng...</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className={`overflow-hidden rounded-3xl border border-white/5 transition-all ${
                    order.status === 'completed' ? 'bg-green-500/5' : 
                    order.status === 'preparing' ? 'bg-blue-500/5' : 'bg-white/[0.03]'
                  }`}>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded text-[9px] font-mono font-black">#{order.id}</span>
                            <h4 className="font-black text-lg text-white leading-none">{order.customerName}</h4>
                          </div>
                          <p className="text-[10px] text-white/30 font-bold uppercase mt-2 tracking-widest">{order.timestamp.toLocaleTimeString()}</p>
                        </div>
                        <p className="text-xl font-black text-amber-500 italic tracking-tighter">{(order.total / 1000).toLocaleString()}K</p>
                      </div>
                      
                      <div className="space-y-2 mb-6 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                        {order.items.map(i => (
                          <div key={i.id} className="flex justify-between items-center text-xs">
                            <span className="text-white/80 font-medium flex items-center gap-2">
                              <span className="w-5 h-5 bg-amber-500/20 text-amber-500 rounded-md flex items-center justify-center text-[9px] font-black">{i.quantity}x</span> 
                              {i.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="flex-1 bg-amber-500 text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">BẮT ĐẦU PHA CHẾ</button>
                        )}
                        {order.status === 'preparing' && (
                          <button onClick={() => updateOrderStatus(order.id, 'completed')} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">HOÀN TẤT</button>
                        )}
                        {order.status === 'completed' && (
                          <div className="flex-1 text-green-500 font-black text-[10px] uppercase text-center py-4 rounded-2xl border border-green-500/20 flex items-center justify-center gap-2">
                            <CheckCircle size={14} /> ĐÃ GIAO ĐƠN
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modern Cart Overlay - More Minimal */}
      {showCartDetails && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => !isOrdering && setShowCartDetails(false)}></div>
          <div className="relative bg-[#140a0a] rounded-t-[3rem] p-8 max-h-[92vh] flex flex-col shadow-2xl border-t border-white/5 animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8"></div>
            
            {orderSuccess ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
                <div className="bg-amber-500 text-black p-6 rounded-3xl shadow-xl shadow-amber-500/20 mb-6 rotate-3">
                  <PartyPopper size={48} />
                </div>
                <h2 className="text-3xl font-serif font-black text-amber-500 italic mb-2 tracking-tighter">XÁC NHẬN!</h2>
                <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">Đơn đã được Mỳ tiếp nhận rồi nhé</p>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-serif font-black text-amber-500 italic tracking-tighter leading-none">GIỎ HÀNG</h2>
                    <p className="text-[10px] text-white/30 font-black uppercase mt-2 tracking-widest leading-none">Vị ngon từ tâm huyết</p>
                  </div>
                  <button onClick={() => setShowCartDetails(false)} className="p-3 bg-white/5 rounded-full text-white/40 active:scale-90 transition-all border border-white/5">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar mb-8">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                      <div className="flex-1 pr-4">
                        <h4 className="font-bold text-base text-white">{item.name}</h4>
                        <p className="text-[10px] text-amber-600 font-black mt-1">{(item.price / 1000).toLocaleString()}K / Ly</p>
                      </div>
                      <div className="flex items-center gap-4 bg-black/20 px-3 py-2 rounded-xl border border-white/10">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-red-400 p-1 active:scale-125"><Minus size={18} strokeWidth={3} /></button>
                        <span className="font-black text-amber-500 text-lg min-w-[20px] text-center italic">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-green-400 p-1 active:scale-125"><Plus size={18} strokeWidth={3} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 pt-4 border-t border-white/10 pb-6">
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="Mỳ xin tên hoặc số bàn nhé..."
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm focus:outline-none focus:border-amber-500/40 transition-all text-white placeholder:text-white/10 font-bold"
                      value={customerNameInput}
                      onChange={(e) => setCustomerNameInput(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between items-end px-1">
                    <span className="text-white/20 font-black uppercase text-[9px] tracking-[0.3em]">Thanh Toán</span>
                    <div className="text-right">
                      <span className="text-5xl font-black text-amber-500 italic tracking-tighter">{(cartTotal / 1000).toLocaleString()}K</span>
                      <span className="text-[10px] text-amber-500/60 ml-1 font-black uppercase tracking-widest">VNĐ</span>
                    </div>
                  </div>

                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isOrdering}
                    className={`w-full ${isOrdering ? 'bg-amber-900' : 'bg-amber-500 active:scale-[0.98] shadow-[0_15px_40px_-10px_rgba(217,119,6,0.5)]'} text-black py-5 rounded-[1.5rem] font-black text-xl shadow-2xl transition-all uppercase tracking-tighter flex items-center justify-center gap-3 relative z-[70]`}
                  >
                    {isOrdering ? (
                      <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                    ) : (
                      <>XÁC NHẬN GỬI ĐƠN <ChevronRight size={24} strokeWidth={4} /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slim Floating Cart Button */}
      {view === 'customer' && cart.length > 0 && !showCartDetails && (
        <div className="fixed bottom-32 left-6 right-6 z-[150] animate-in slide-in-from-bottom duration-500">
          <button 
            className="w-full bg-amber-500 rounded-3xl p-5 shadow-2xl flex items-center justify-between cursor-pointer active:scale-95 transition-all border border-amber-400/30"
            onClick={() => setShowCartDetails(true)}
          >
            <div className="flex items-center gap-4">
              <div className="bg-black text-amber-500 w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-lg">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </div>
              <div className="text-left">
                <p className="text-black font-black text-base tracking-tighter leading-none italic uppercase">XEM GIỎ HÀNG</p>
                <p className="text-black/40 text-[9px] font-bold uppercase mt-1 tracking-widest leading-none">Chạm để thanh toán ngay</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pr-1">
              <span className="text-black font-black text-2xl italic tracking-tighter">{(cartTotal / 1000).toLocaleString()}K</span>
              <ChevronDown size={20} className="text-black/30 animate-bounce" />
            </div>
          </button>
        </div>
      )}

      {/* Floating Bottom Navigation - Elegant & Minimal */}
      <nav className="fixed bottom-10 left-12 right-12 z-[180] bg-[#1a0d0d]/90 backdrop-blur-2xl border border-white/[0.05] px-10 py-5 flex justify-around items-center rounded-full shadow-2xl">
        <button 
          onClick={() => setView('customer')}
          className={`flex flex-col items-center gap-2 transition-all ${view === 'customer' ? 'text-amber-500' : 'text-white/20 hover:text-white/40'}`}
        >
          <ShoppingCart size={24} strokeWidth={view === 'customer' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none">Thực Đơn</span>
        </button>
        
        <div className="w-px h-6 bg-white/5"></div>

        <button 
          onClick={() => setView('admin')}
          className={`flex flex-col items-center gap-2 transition-all ${view === 'admin' ? 'text-amber-500' : 'text-white/20 hover:text-white/40'}`}
        >
          <ClipboardList size={24} strokeWidth={view === 'admin' ? 3 : 2} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none">Quản Lý</span>
        </button>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        body { 
          background-color: #0f0707;
          touch-action: pan-y;
          overscroll-behavior-y: contain;
        }
        
        button:active { transform: scale(0.96); }
        input { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}
