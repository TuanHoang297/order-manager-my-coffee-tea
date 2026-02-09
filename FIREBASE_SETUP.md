# Hướng dẫn cấu hình Firebase Realtime Database

## Bước 1: Tạo dự án Firebase

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Nhấn "Add project" hoặc "Thêm dự án"
3. Đặt tên dự án (ví dụ: "my-coffee-shop")
4. Tắt Google Analytics nếu không cần
5. Nhấn "Create project"

## Bước 2: Tạo Realtime Database

1. Trong Firebase Console, chọn dự án vừa tạo
2. Vào menu bên trái, chọn "Build" > "Realtime Database"
3. Nhấn "Create Database"
4. Chọn vị trí server (khuyến nghị: `asia-southeast1` cho Việt Nam)
5. Chọn chế độ bảo mật:
   - **Test mode**: Cho phép đọc/ghi tự do (dùng cho development)
   - **Locked mode**: Chặn tất cả (cần cấu hình rules sau)

## Bước 3: Cấu hình Security Rules (Quan trọng!)

Vào tab "Rules" và thay thế bằng:

\`\`\`json
{
  "rules": {
    "orders": {
      ".read": true,
      ".write": true,
      "$orderId": {
        ".validate": "newData.hasChildren(['id', 'items', 'status', 'timestamp', 'total'])"
      }
    }
  }
}
\`\`\`

**Lưu ý**: Rules trên cho phép đọc/ghi tự do. Trong production, nên thêm authentication!

## Bước 4: Lấy thông tin cấu hình

1. Vào "Project Settings" (biểu tượng bánh răng bên cạnh "Project Overview")
2. Cuộn xuống phần "Your apps"
3. Nhấn biểu tượng Web `</>`
4. Đặt tên app (ví dụ: "Coffee Shop Web")
5. Copy thông tin từ `firebaseConfig`

## Bước 5: Cấu hình file .env.local

1. Copy file `.env.local.example` thành `.env.local`:
   \`\`\`bash
   copy .env.local.example .env.local
   \`\`\`

2. Mở file `.env.local` và điền thông tin từ Firebase:

\`\`\`env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=my-coffee-shop.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://my-coffee-shop-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=my-coffee-shop
VITE_FIREBASE_STORAGE_BUCKET=my-coffee-shop.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
\`\`\`

## Bước 6: Chạy ứng dụng

\`\`\`bash
npm run dev
\`\`\`

## Kiểm tra hoạt động

1. Mở ứng dụng trong trình duyệt
2. Thêm món vào giỏ hàng và đặt hàng
3. Vào Firebase Console > Realtime Database
4. Bạn sẽ thấy dữ liệu đơn hàng xuất hiện realtime!

## Tính năng đã tích hợp

✅ Lưu đơn hàng vào Firebase tự động
✅ Đồng bộ đơn hàng realtime giữa các thiết bị
✅ Cập nhật trạng thái đơn hàng realtime
✅ Xem đơn hàng từ nhiều thiết bị cùng lúc

## Lưu ý bảo mật

⚠️ File `.env.local` chứa thông tin nhạy cảm, đã được thêm vào `.gitignore`
⚠️ Không commit file `.env.local` lên Git
⚠️ Trong production, nên thêm Firebase Authentication để bảo mật

## Troubleshooting

### Lỗi: "Permission denied"
- Kiểm tra Security Rules trong Firebase Console
- Đảm bảo rules cho phép read/write

### Lỗi: "Firebase not initialized"
- Kiểm tra file `.env.local` đã được tạo chưa
- Đảm bảo tất cả biến môi trường đã được điền đúng
- Restart dev server sau khi thay đổi `.env.local`

### Đơn hàng không hiển thị
- Mở Console trong trình duyệt (F12) để xem lỗi
- Kiểm tra Network tab xem có kết nối Firebase không
- Kiểm tra Database URL có đúng không
