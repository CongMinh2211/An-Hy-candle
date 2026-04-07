# 📖 Hướng Dẫn Hệ Thống Đăng Nhập An Hy Candle

Tài liệu này ghi lại toàn bộ các tính năng và cách thiết lập hệ thống đăng nhập nhanh (Social Login) đã được triển khai cho trang web nến thơm An Hy.

## 🌟 Các tính năng đã hoàn thành

### 1. Đăng nhập đa nền tảng
- **Google Login**: Khách hàng đăng nhập bằng tài khoản Google. Tự động lấy Tên và Email.
- **Facebook Login**: Khách hàng đăng nhập bằng tài khoản Facebook. Tự động lấy Tên và Email.
- **Email Login**: Hệ thống truyền thống vẫn hoạt động song song.

### 2. Trải nghiệm người dùng cao cấp (UX) & Bảo mật
- **Nhận diện khách hàng**: Tên của khách hàng được hiển thị ngay trên thanh Menu (Navbar) sau khi đăng nhập.
- **Điều hướng thông minh**: Bấm vào biểu tượng người dùng trên Menu sẽ tự động cuộn đến phần "Thông tin cá nhân" (nếu là khách) hoặc vào Dashboard (nếu là Admin).
- **Trang cá nhân tự động**: Tự động ẩn các form đăng nhập rườm rà khi đã vào tài khoản, chỉ tập trung vào thông tin cá nhân và nút Đăng xuất.
- **Bảo mật trang Admin**: Sử dụng `ProtectedRoute` để ngăn chặn các tài khoản không có quyền Admin truy cập vào trang quản trị (`/admin`). Nếu cố tình truy cập, hệ thống sẽ tự động chuyển hướng về trang đăng nhập.

---

## 🔑 Cấu hình kỹ thuật (Dành cho chủ web)

Mọi thông tin kết nối đều nằm trong file `BE/.env`. Bạn đã điền đầy đủ các mã sau:

- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_APP_ID` & `FACEBOOK_APP_SECRET`

### 🚀 Khi đưa web lên mạng (Deploy)
Khi bạn có tên miền thật (ví dụ: `https://anhycandle.com`), hãy nhớ thực hiện các bước sau:

#### 1. Cập nhật Google Cloud:
- Vào [Google Cloud Console](https://console.cloud.google.com/).
- Thêm địa chỉ: `https://anhycandle.com/api/users/oauth/google/callback` vào mục **Authorized redirect URIs**.

#### 2. Cập nhật Facebook Developers:
- Vào [Facebook Developers](https://developers.facebook.com/).
- Thêm địa chỉ: `https://anhycandle.com/api/users/oauth/facebook/callback` vào mục **Valid OAuth Redirect URIs**.

#### 3. Cập nhật file .env trên Server:
- Đổi `FRONTEND_URL` thành địa chỉ web thật của bạn.
- Đổi `GOOGLE_CALLBACK_URL` và `FACEBOOK_CALLBACK_URL` tương ứng.

---

## 🛠️ Cấu trúc file liên quan
- `FE/src/components/Navbar.jsx`: Xử lý hiển thị tên và logo trên menu, điều hướng dựa trên vai trò (Admin/User).
- `FE/src/pages/Auth.jsx`: Xử lý giao diện trang cá nhân và logic đăng nhập tập trung.
- `FE/src/components/ProtectedRoute.jsx`: Chốt chặn bảo mật cho trang Quản trị.
- `BE/routes/userRoutes.js`: Xử lý logic kết nối với Google/Facebook ở phía máy chủ.

**An Hy Candle - Luôn mang lại ánh sáng và hương thơm dịu dàng cho bạn!** 🕯️✨🤝
