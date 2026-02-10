import re

with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the useEffect block
old_pattern = r'(  useEffect\(\(\) => \{[\s\S]*?return \(\) => unsubscribe\(\);[\s\S]*?\}, \[view, adminTab\]\);)'

new_code = '''  useEffect(() => {
    const unsubscribe = subscribeToOrders((firebaseOrders) => {
      setOrders(firebaseOrders);
      setPreviousOrderCount(firebaseOrders.length);
      
      if (view === 'admin' && adminTab === 'active') {
        const activeOrders = firebaseOrders.filter(o => o.status !== 'completed');
        const now = Date.now();
        
        const newOrders = activeOrders.filter(order => {
          const orderId = order.firebaseId || order.id;
          const orderTime = order.timestamp.getTime();
          const isRecent = (now - orderTime) < 5000;
          const isUnknown = !knownOrderIdsRef.current.has(orderId);
          return isRecent && isUnknown;
        });
        
        if (newOrders.length > 0) {
          playNotificationSound();
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Đơn hàng mới! 🔔', {
              body: `Có ${newOrders.length} đơn hàng mới cần pha chế`,
              icon: '/logo.png',
              badge: '/logo.png',
              requireInteraction: true,
              tag: 'new-order'
            });
          }
        }
        
        activeOrders.forEach(order => {
          knownOrderIdsRef.current.add(order.firebaseId || order.id);
        });
      }
    });
    return () => unsubscribe();
  }, [view, adminTab]);'''

content = re.sub(old_pattern, new_code, content, count=1)

with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed!")
