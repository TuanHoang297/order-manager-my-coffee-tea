# Hướng dẫn tạo GitHub Repository và Push Code

## Bước 1: Tạo GitHub Repository

### Cách 1: Tạo trên GitHub Website (Dễ nhất)

1. Truy cập [github.com](https://github.com)
2. Đăng nhập (hoặc đăng ký nếu chưa có tài khoản)
3. Click nút **"+"** ở góc trên bên phải > **"New repository"**
4. Điền thông tin:
   - **Repository name**: `my-coffee-tea-order-manager` (hoặc tên bạn muốn)
   - **Description**: "Ứng dụng quản lý đơn hàng Mỳ Coffee & Tea"
   - Chọn **Public** hoặc **Private**
   - **KHÔNG** tick "Add a README file" (vì project đã có rồi)
   - **KHÔNG** tick "Add .gitignore" (đã có rồi)
5. Click **"Create repository"**

### Cách 2: Tạo bằng GitHub CLI (Nhanh hơn)

```bash
# Cài đặt GitHub CLI (nếu chưa có)
# Windows: winget install GitHub.cli

# Đăng nhập
gh auth login

# Tạo repository
gh repo create my-coffee-tea-order-manager --public --source=. --remote=origin --push
```

## Bước 2: Khởi tạo Git Local (nếu chưa có)

Kiểm tra xem đã có Git chưa:
```bash
git status
```

Nếu chưa có, khởi tạo:
```bash
git init
```

## Bước 3: Commit Code

```bash
# Thêm tất cả file
git add .

# Commit
git commit -m "Initial commit: My Coffee & Tea Order Manager"
```

## Bước 4: Kết nối với GitHub Repository

Sau khi tạo repository trên GitHub, bạn sẽ thấy URL như:
`https://github.com/USERNAME/my-coffee-tea-order-manager.git`

Kết nối và push:

```bash
# Thêm remote origin
git remote add origin https://github.com/USERNAME/my-coffee-tea-order-manager.git

# Đổi tên branch thành main (nếu cần)
git branch -M main

# Push code lên GitHub
git push -u origin main
```

## Bước 5: Xác nhận

Refresh trang GitHub repository, bạn sẽ thấy code đã được push lên!

## Lưu ý quan trọng

### File .env.local KHÔNG được push lên GitHub
File `.env.local` đã được thêm vào `.gitignore` nên sẽ không bị push lên. Đây là điều tốt vì nó chứa thông tin nhạy cảm (API keys, Firebase config).

### Nếu gặp lỗi authentication:

**Cách 1: Dùng Personal Access Token**
1. Vào GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token (classic)
3. Chọn quyền: `repo` (full control)
4. Copy token
5. Khi push, dùng token thay cho password:
   - Username: `your_github_username`
   - Password: `paste_your_token_here`

**Cách 2: Dùng SSH**
```bash
# Tạo SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Thêm vào GitHub: Settings > SSH and GPG keys > New SSH key

# Đổi remote sang SSH
git remote set-url origin git@github.com:USERNAME/my-coffee-tea-order-manager.git
```

## Commands hữu ích

```bash
# Xem trạng thái
git status

# Xem remote
git remote -v

# Push code mới
git add .
git commit -m "Update: mô tả thay đổi"
git push

# Xem lịch sử commit
git log --oneline
```

## Sau khi push xong

Bạn có thể tiếp tục với bước deploy lên Vercel (xem file `DEPLOY_VERCEL.md`)!
