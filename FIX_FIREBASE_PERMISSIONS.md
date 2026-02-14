# Fix Firebase Permission Error - Menu Management

## Vấn đề

Firebase Realtime Database hiện tại CHỈ cho phép read/write vào collection `orders`, KHÔNG có rules cho `menu`.

Error: `PERMISSION_DENIED: Permission denied` khi thêm/sửa/xóa menu items.

## Giải pháp

Bạn cần cập nhật **Firebase Database Rules** để cho phép read/write vào `/menu`.

### Bước 1: Vào Firebase Console

1. Mở https://console.firebase.google.com/
2. Chọn project: **order-management-d6371**
3. Vào **Build** > **Realtime Database**
4. Click tab **Rules**

### Bước 2: Update Rules

Thay thế rules hiện tại bằng:

```json
{
  "rules": {
    "orders": {
      ".read": true,
      ".write": true,
      "$orderId": {
        ".validate": "newData.hasChildren(['id', 'items', 'status', 'timestamp', 'total'])"
      }
    },
    "menu": {
      ".read": true,
      ".write": true,
      "$itemId": {
        ".validate": "newData.hasChildren(['id', 'name', 'price', 'category'])"
      }
    }
  }
}
```

### Bước 3: Publish

Click **Publish** để lưu rules mới.

## Kết quả

Sau khi publish rules:
- ✅ Thêm món mới: HOẠT ĐỘNG
- ✅ Sửa món: HOẠT ĐỘNG  
- ✅ Xóa món: HOẠT ĐỘNG
- ✅ Realtime sync: HOẠT ĐỘNG

## Lưu ý bảo mật

⚠️ Rules trên cho phép **TẤT CẢ MỌI NGƯỜI** đọc/ghi menu và orders.

**Trong production** nên:
1. Thêm Firebase Authentication
2. Chỉ cho phép admin sửa menu
3. Giới hạn quyền truy cập

Example production rules:
```json
{
  "rules": {
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "menu": {
      ".read": true,
      ".write": "auth.uid === 'YOUR_ADMIN_UID'"
    }
  }
}
```
