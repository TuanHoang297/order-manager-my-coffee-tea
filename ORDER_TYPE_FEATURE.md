# 🛍️ Order Type Feature - Mang Đi / Tại Chỗ

## Tổng Quan

Đã thêm tính năng phân loại đơn hàng **"Mang đi"** và **"Tại chỗ"** để quản lý đơn hàng hiệu quả hơn, đặc biệt phù hợp cho quán cà phê có cả khách ngồi tại chỗ và mang về.

---

## ✨ Tính Năng Mới

### 1. Order Type Selector (Customer View)
**Vị trí:** CartOverlay - Trước khi đặt hàng

**UI:**
```
┌─────────────────────────────────┐
│  Loại đơn hàng                  │
│  ┌──────────┐  ┌──────────┐    │
│  │ 🏪 Tại chỗ│  │ 🛍️ Mang đi│    │
│  └──────────┘  └──────────┘    │
└─────────────────────────────────┘
```

**Behavior:**
- 2 buttons: "Tại chỗ" (Store icon) và "Mang đi" (ShoppingBag icon)
- Default: "Tại chỗ" được chọn
- Active state: 
  - Tại chỗ: Indigo background
  - Mang đi: Emerald background
- Disabled khi giỏ hàng rỗng hoặc đang ordering
- Placeholder input thay đổi:
  - Tại chỗ: "Tên hoặc số bàn..."
  - Mang đi: "Tên khách hàng..."

### 2. Order Type Badge (Admin View)
**Vị trí:** OrderCard - Hiển thị trên mỗi đơn hàng

**UI:**
```
┌─────────────────────────────────┐
│ Nguyễn Văn A  [🏪 Tại chỗ]     │
│ 5 phút trước                    │
└─────────────────────────────────┘
```

**Styles:**
- Tại chỗ: `bg-indigo-100 text-indigo-700`
- Mang đi: `bg-emerald-100 text-emerald-700`
- Icon + text trong badge
- Responsive, wrap xuống dòng nếu cần

### 3. Order Type Filter (Admin View)
**Vị trí:** OrderList - Trên danh sách đơn hàng

**UI:**
```
┌─────────────────────────────────────────┐
│ [Tất cả (12)] [🏪 Tại chỗ (8)] [🛍️ Mang đi (4)] │
└─────────────────────────────────────────┘
```

**Behavior:**
- 3 filter buttons với count realtime
- Filter hoạt động cho cả tab "Đơn mới" và "Đã xong"
- Horizontal scroll trên mobile
- Active state tương ứng với màu order type
- Empty state message thay đổi theo filter

---

## 🔧 Technical Implementation

### Type Definition
```typescript
// src/types/index.ts
export type OrderType = 'dine-in' | 'takeaway';

export interface Order {
  // ... existing fields
  orderType: OrderType;
}
```

### Component Updates

#### 1. CartOverlay.tsx
```typescript
const [orderType, setOrderType] = useState<OrderType>('dine-in');

// Order Type Selector UI
<div className="grid grid-cols-2 gap-3">
  <button onClick={() => setOrderType('dine-in')}>
    <Store size={18} />
    Tại chỗ
  </button>
  <button onClick={() => setOrderType('takeaway')}>
    <ShoppingBag size={18} />
    Mang đi
  </button>
</div>

// Pass to parent
onPlaceOrder(customerNameInput, orderType);
```

#### 2. OrderCard.tsx
```typescript
// Display badge
<span className={order.orderType === 'dine-in' 
  ? 'bg-indigo-100 text-indigo-700' 
  : 'bg-emerald-100 text-emerald-700'
}>
  {order.orderType === 'dine-in' ? (
    <><Store size={12} /> Tại chỗ</>
  ) : (
    <><ShoppingBag size={12} /> Mang đi</>
  )}
</span>
```

#### 3. OrderList.tsx
```typescript
const [orderTypeFilter, setOrderTypeFilter] = useState<OrderType | 'all'>('all');

const filteredOrders = orders.filter(o => {
  const statusMatch = activeTab === 'active' 
    ? o.status !== 'completed' 
    : o.status === 'completed';
  const typeMatch = orderTypeFilter === 'all' 
    || o.orderType === orderTypeFilter;
  return statusMatch && typeMatch;
});
```

#### 4. App.tsx
```typescript
const handlePlaceOrder = async (customerName: string, orderType: OrderType) => {
  const newOrder: Order = {
    // ... existing fields
    orderType
  };
  await placeOrder(newOrder);
};
```

---

## 📱 Mobile Optimization

### Touch-Friendly
- Button size: `py-3 px-4` (48px+ height)
- Gap between buttons: `gap-3` (12px)
- Active state: Scale + shadow
- Disabled state: Opacity 50%

### Responsive
- Filter buttons: Horizontal scroll on mobile
- Badge: Wrap to new line if needed
- Icons: 12-18px size for clarity

### Visual Feedback
- Active button: Bold shadow + ring
- Hover state: Background change
- Disabled state: Cursor not-allowed

---

## 🎨 Color Scheme

### Tại Chỗ (Dine-in)
- **Primary:** Indigo
- **Button Active:** `bg-indigo-600 text-white`
- **Badge:** `bg-indigo-100 text-indigo-700`
- **Filter Active:** `bg-indigo-600 text-white`

### Mang Đi (Takeaway)
- **Primary:** Emerald
- **Button Active:** `bg-emerald-600 text-white`
- **Badge:** `bg-emerald-100 text-emerald-700`
- **Filter Active:** `bg-emerald-600 text-white`

### Neutral (All)
- **Filter Active:** `bg-indigo-600 text-white`
- **Inactive:** `bg-white text-gray-600 border-gray-200`

---

## 🧪 Test Cases

### Customer Flow
- [ ] Mở CartOverlay → Default "Tại chỗ" được chọn
- [ ] Click "Mang đi" → Button active, placeholder thay đổi
- [ ] Click "Tại chỗ" → Switch back, placeholder thay đổi
- [ ] Giỏ rỗng → Buttons disabled
- [ ] Đang ordering → Buttons disabled
- [ ] Đặt hàng thành công → Reset về "Tại chỗ"
- [ ] Enter key → Submit với order type đã chọn

### Admin Flow - Order Display
- [ ] Đơn "Tại chỗ" → Badge màu indigo
- [ ] Đơn "Mang đi" → Badge màu emerald
- [ ] Badge hiển thị icon + text
- [ ] Badge responsive, wrap nếu cần
- [ ] Badge hiển thị đúng trên mobile

### Admin Flow - Filter
- [ ] Click "Tất cả" → Hiện tất cả đơn
- [ ] Click "Tại chỗ" → Chỉ hiện đơn tại chỗ
- [ ] Click "Mang đi" → Chỉ hiện đơn mang đi
- [ ] Count realtime update khi có đơn mới
- [ ] Filter hoạt động cho cả "Đơn mới" và "Đã xong"
- [ ] Empty state message đúng theo filter
- [ ] Horizontal scroll trên mobile

### Edge Cases
- [ ] Thêm món vào đơn đã hoàn thành → Giữ nguyên orderType
- [ ] Firebase sync → orderType được lưu và load đúng
- [ ] Đơn cũ không có orderType → Handle gracefully

---

## 📊 Business Benefits

### Quản Lý Tốt Hơn
- ✅ Phân biệt rõ đơn tại chỗ vs mang đi
- ✅ Ưu tiên xử lý theo loại đơn
- ✅ Thống kê riêng cho từng loại

### Trải Nghiệm Khách Hàng
- ✅ Rõ ràng hơn khi đặt hàng
- ✅ Placeholder phù hợp với loại đơn
- ✅ Visual feedback tốt

### Hiệu Quả Vận Hành
- ✅ Filter nhanh theo loại đơn
- ✅ Dễ dàng tracking
- ✅ Giảm nhầm lẫn

---

## 🚀 Future Enhancements

### Potential Features
1. **Thống kê riêng** cho từng loại đơn trong Revenue view
2. **Notification khác nhau** cho tại chỗ vs mang đi
3. **Thời gian ước tính** khác nhau cho mỗi loại
4. **Discount/Promotion** riêng cho mang đi
5. **Table management** cho đơn tại chỗ
6. **Delivery integration** cho mang đi

### Analytics
- Tỷ lệ tại chỗ / mang đi
- Revenue breakdown by type
- Peak hours by type
- Popular items by type

---

## ✅ Checklist

### Implementation
- [x] Update types (OrderType)
- [x] CartOverlay - Add selector
- [x] OrderCard - Display badge
- [x] OrderList - Add filter
- [x] App.tsx - Handle orderType
- [x] Firebase - Save/load orderType
- [x] Build successful
- [x] No TypeScript errors

### Testing
- [ ] Manual test all flows
- [ ] Test on mobile device
- [ ] Test Firebase sync
- [ ] Test edge cases
- [ ] Performance check

### Documentation
- [x] Feature documentation
- [x] Code comments
- [x] Test cases
- [x] Business benefits

---

## 🎉 Summary

Feature "Mang đi / Tại chỗ" đã được implement thành công với:
- ✅ UI/UX tối ưu cho mobile
- ✅ Filter và badge rõ ràng
- ✅ Color scheme nhất quán
- ✅ Build thành công
- ✅ Ready for testing

Tính năng này giúp quán cà phê quản lý đơn hàng hiệu quả hơn, phân biệt rõ khách tại chỗ và mang đi, từ đó tối ưu quy trình phục vụ!
