# 🧪 Hướng Dẫn Test Ứng Dụng

## ✅ Dev Server Đang Chạy

Server đã khởi động thành công tại:
- **Local:** http://localhost:3000/
- **Network:** http://192.168.0.100:3000/

---

## Test Cases - Customer Flow

### 1. Test Search & Filter
- [ ] Mở http://localhost:3000/
- [ ] Gõ "cà phê" vào search bar → Chỉ hiện món cà phê
- [ ] Click category "Cà Phê" → Filter đúng
- [ ] Click "Tất cả" → Hiện tất cả món

### 2. Test Add to Cart
- [ ] Click vào món bất kỳ → Hiện quantity selector
- [ ] Click + để tăng số lượng → Số lượng tăng
- [ ] Click - để giảm số lượng → Số lượng giảm
- [ ] Số lượng về 0 → Món biến khỏi giỏ hàng

### 3. Test Note Input
- [ ] Click "Thêm ghi chú" → Hiện input field
- [ ] Nhập "ít đường" → Blur hoặc Enter
- [ ] Ghi chú được lưu và hiển thị
- [ ] Click lại ghi chú → Edit được

### 4. Test Cart Button
- [ ] Thêm món vào giỏ → Floating button xuất hiện
- [ ] Button hiển thị đúng số lượng và tổng tiền
- [ ] Click button → Mở CartOverlay

### 5. Test Place Order
- [ ] Trong CartOverlay, nhập tên khách "Test User"
- [ ] Click "Xác nhận đặt hàng"
- [ ] Hiện animation success
- [ ] Sau 3s overlay đóng, giỏ hàng reset

---

## Test Cases - Admin Flow (Quản Lý)

### 1. Test Order List
- [ ] Click tab "Quản lý" ở bottom nav
- [ ] Đơn vừa tạo xuất hiện trong tab "Đơn mới"
- [ ] Đơn đầu tiên có badge "ƯU TIÊN"
- [ ] Hiển thị thời gian "Vừa xong" hoặc "X phút trước"

### 2. Test Edit Order
- [ ] Click nút Edit (icon bút) trên đơn hàng
- [ ] Hiện controls +/- cho từng món
- [ ] Tăng/giảm số lượng → Total update realtime
- [ ] Thêm ghi chú cho món → Lưu thành công
- [ ] Click "✓ Xong" → Thoát edit mode

### 3. Test Add Item to Order
- [ ] Trong edit mode, scroll xuống "Thêm món mới"
- [ ] Click món từ grid → Món được thêm vào đơn
- [ ] Total update đúng
- [ ] Click "✓ Xong" để lưu

### 4. Test Complete Order
- [ ] Click "Hoàn tất đơn" → Đơn chuyển sang tab "Đã xong"
- [ ] Switch sang tab "Đã xong" → Đơn hiển thị
- [ ] Đơn có badge "Đã giao" màu xanh

### 5. Test Add to Completed Order
- [ ] Trong tab "Đã xong", click "Thêm món" trên đơn
- [ ] Modal mở với menu đầy đủ
- [ ] Chọn món, thêm ghi chú
- [ ] Click "Xác nhận thêm món"
- [ ] Đơn mới được tạo trong tab "Đơn mới"
- [ ] Hoàn tất đơn mới → Merge vào đơn gốc

### 6. Test Delete Order
- [ ] Click nút X đỏ trên đơn pending
- [ ] Confirm dialog xuất hiện
- [ ] Click OK → Đơn bị xóa

---

## Test Cases - Admin Flow (Doanh Thu)

### 1. Test Revenue Stats
- [ ] Click tab "Doanh thu" ở bottom nav
- [ ] Hiển thị 3 cards: Hôm nay, Tháng này, Tổng
- [ ] Số liệu chính xác với đơn đã hoàn thành

### 2. Test Date Navigation
- [ ] Click nút "<" → Xem ngày hôm trước
- [ ] Click nút ">" → Về ngày sau (disabled nếu hôm nay)
- [ ] Click text "Hôm nay" → Jump về hôm nay

### 3. Test Day Details
- [ ] Xem "Trung bình / đơn" → Tính toán đúng
- [ ] "Bán chạy hôm nay" → Top 5 món
- [ ] "Chi tiết đơn" → List đơn trong ngày
- [ ] "Tổng hợp các món" → All-time top items

---

## Test Cases - Realtime & Notifications

### 1. Test Realtime Sync
- [ ] Mở 2 browser tabs
- [ ] Tab 1: Customer view, đặt đơn
- [ ] Tab 2: Admin view → Đơn xuất hiện realtime
- [ ] Tab 2: Hoàn tất đơn
- [ ] Tab 1 & 2: Đơn chuyển tab "Đã xong" ở cả 2 tabs

### 2. Test Notifications
- [ ] Ở admin view, grant notification permission
- [ ] Đặt đơn mới từ customer view
- [ ] Admin view: Nghe thấy âm thanh thông báo
- [ ] Browser notification hiện lên (nếu đã grant)

### 3. Test Vibration (Mobile)
- [ ] Mở trên mobile device
- [ ] Thêm món vào giỏ → Cảm nhận vibration
- [ ] Đặt hàng thành công → Vibration pattern

---

## Test Cases - Mobile Responsive

### 1. Test Layout
- [ ] Mở DevTools → Toggle Device Toolbar
- [ ] Chọn iPhone 12 Pro
- [ ] Header responsive, không bị vỡ
- [ ] Bottom nav hiển thị đúng
- [ ] Menu cards responsive

### 2. Test Touch Interactions
- [ ] Scroll menu → Smooth scrolling
- [ ] Tap món → Add to cart
- [ ] Swipe categories → Horizontal scroll
- [ ] Cart overlay → Full screen trên mobile

### 3. Test Overlays
- [ ] CartOverlay full screen
- [ ] AddToOrderModal full screen
- [ ] Drag handle ở top overlay
- [ ] Backdrop click → Close overlay

---

## Performance Checks

### 1. Build Size
```bash
npm run build
```
- [ ] Build thành công
- [ ] Bundle size < 500KB (gzipped < 150KB)
- [ ] No warnings

### 2. Load Time
- [ ] First load < 2s
- [ ] Subsequent loads < 1s (cached)
- [ ] Smooth animations

### 3. Memory Usage
- [ ] Mở DevTools → Performance tab
- [ ] Record 30s usage
- [ ] No memory leaks
- [ ] Smooth 60fps

---

## Firebase Integration

### 1. Test Connection
- [ ] Check console → No Firebase errors
- [ ] Orders sync realtime
- [ ] Create order → Saved to Firebase
- [ ] Update order → Synced to Firebase

### 2. Test Offline
- [ ] Disconnect internet
- [ ] Try đặt hàng → Error toast
- [ ] Reconnect → Orders sync lại

---

## Browser Compatibility

Test trên các browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Known Issues to Check

### Potential Issues
1. **Firebase connection**: Check .env.local có đầy đủ keys
2. **Notification permission**: Cần grant trên HTTPS
3. **Vibration**: Chỉ hoạt động trên mobile
4. **Sound**: Có thể bị block bởi browser autoplay policy

### Quick Fixes
```bash
# Nếu có lỗi dependencies
npm install

# Nếu có lỗi build
npm run build

# Clear cache
rm -rf node_modules/.vite
npm run dev
```

---

## Test Results Template

```
✅ Customer Flow: PASS
✅ Admin - Quản lý: PASS
✅ Admin - Doanh thu: PASS
✅ Realtime Sync: PASS
✅ Notifications: PASS
✅ Mobile Responsive: PASS
✅ Performance: PASS
✅ Firebase: PASS

Issues Found: None
```

---

## Next Steps After Testing

1. ✅ All tests pass → Deploy to production
2. ⚠️ Minor issues → Fix and retest
3. ❌ Major issues → Debug and fix

---

## Support

Nếu gặp vấn đề:
1. Check browser console logs
2. Check network tab (Firebase requests)
3. Check .env.local configuration
4. Restart dev server

Happy testing! 🧪
