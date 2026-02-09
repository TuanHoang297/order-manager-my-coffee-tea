# Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị Git Repository

1. Đảm bảo code đã được commit lên Git:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Push code lên GitHub/GitLab/Bitbucket:
```bash
git remote add origin <URL_REPOSITORY_CỦA_BẠN>
git branch -M main
git push -u origin main
```

## Bước 2: Deploy trên Vercel

### Cách 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng tài khoản GitHub/GitLab/Bitbucket
3. Click **"Add New Project"**
4. Chọn repository của bạn
5. Vercel sẽ tự động phát hiện cấu hình Vite
6. **QUAN TRỌNG**: Thêm Environment Variables trước khi deploy

### Cách 2: Deploy qua Vercel CLI

1. Cài đặt Vercel CLI:
```bash
npm install -g vercel
```

2. Login vào Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Deploy production:
```bash
vercel --prod
```

## Bước 3: Cấu hình Environment Variables

Trong Vercel Dashboard:

1. Vào **Project Settings** > **Environment Variables**
2. Thêm các biến sau (lấy từ file `.env.local` của bạn):

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_api_key (nếu có)
```

3. Chọn môi trường: **Production**, **Preview**, và **Development**
4. Click **Save**

## Bước 4: Redeploy

Sau khi thêm environment variables:
- Click **"Redeploy"** trong Deployments tab
- Hoặc push code mới lên repository (auto deploy)

## Bước 5: Cấu hình Firebase (Quan trọng!)

Sau khi deploy, bạn cần thêm domain Vercel vào Firebase:

1. Vào [Firebase Console](https://console.firebase.google.com)
2. Chọn project của bạn
3. Vào **Authentication** > **Settings** > **Authorized domains**
4. Thêm domain Vercel của bạn (ví dụ: `your-app.vercel.app`)

## Auto Deploy

Vercel sẽ tự động deploy khi:
- Push code lên branch `main` (production)
- Push lên branch khác (preview deployment)
- Tạo Pull Request (preview deployment)

## Kiểm tra Build Local

Trước khi deploy, test build local:

```bash
npm run build
npm run preview
```

## Troubleshooting

### Lỗi build:
- Kiểm tra `npm run build` chạy thành công local
- Xem build logs trong Vercel Dashboard

### Lỗi 404:
- File `vercel.json` đã được tạo để xử lý routing

### Lỗi Firebase:
- Kiểm tra environment variables đã được thêm đúng
- Kiểm tra domain đã được authorize trong Firebase

## Custom Domain (Tùy chọn)

1. Vào **Project Settings** > **Domains**
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn của Vercel

## Useful Commands

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# Xem logs
vercel logs

# Xem danh sách deployments
vercel ls
```

---

**Lưu ý**: Đừng commit file `.env.local` lên Git! File này đã được thêm vào `.gitignore`.
