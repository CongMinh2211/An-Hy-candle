# An Hy Candle - Premium Scented Candle Store 🕯️

Dự án website thương mại điện tử nến thơm cao cấp với phong cách **Pastel** (lấy cảm hứng từ mẫu "Kindled" của Etsy).

## 🎨 Phong cách thiết kế (Aesthetics)
- **Palette**: Hồng kem (#FFF6F1), hồng đào (#FFD8D0), cocoa mềm (#5A332F), coral nút bấm (#DF8B63).
- **Typography**: Heading Serif thanh lịch, Body Sans-serif hiện đại.
- **Vibe**: Sang trọng, tối giản, ấm cúng.

---

## 🚀 Danh sách cần làm (To-Do List)

### 1. Frontend (FE) - React + Vite
- [x] **Giao diện cốt lõi**: Thiết kế hệ thống màu sắc và Typography chuẩn Pastel.
- [x] **Trang chủ**: Hero/banner, giới thiệu tinh thần thương hiệu, nến bán chạy.
- [x] **Cửa hàng**: Bộ lọc mùi hương/giá, sắp xếp mới nhất/giá thấp-cao, lưới sản phẩm responsive.
- [x] **Trang chi tiết**: Slideshow ảnh, accordion thông tin bảo quản, chọn số lượng, review/sao, thêm vào giỏ.
- [x] **Giỏ hàng & Thanh toán**: Sidebar giỏ hàng, form thanh toán COD & QR Pay, tổng tiền VND.
- [x] **Dịch vụ khách hàng**: Trang liên hệ, Google Maps embed, Blog hướng dẫn.
- [x] **Liên hệ nhanh**: Đã thay chatbox bằng nút Zalo nổi `0946081027`.
- [x] **Wishlist**: Lưu sản phẩm yêu thích bằng localStorage.
- [x] **Người dùng**: Một trang đăng ký/đăng nhập chung, tự phân luồng admin/client, có Google/Facebook OAuth.
- [x] **Mobile responsive**: Tối ưu thêm layout mobile cho hero, sản phẩm, form, admin table và nút Zalo.
- [x] **Mobile polish**: Sửa riêng layout `400px`/mobile cho nav, hero, badge, Zalo và account pill để không vỡ như desktop thu nhỏ.
- [x] **Smart Search**: Navbar có live search, gõ tên/mùi/nốt hương là gợi ý sản phẩm ngay.
- [x] **Filters nâng cao**: Lọc theo mùi hương, khoảng giá, kích thước hũ và sắp xếp giá/mới nhất.
- [x] **Smooth transitions**: Dùng Framer Motion cho product card/section xuất hiện mượt khi cuộn.
- [x] **Performance fallback ảnh**: Ảnh sản phẩm lỗi sẽ đổi sang asset local, không retry URL remote gây hàng trăm request failed.

### 2. Backend (BE) - Node.js + Express
- [x] **Hệ thống API**: Quản lý sản phẩm, đơn hàng, người dùng.
- [x] **Cơ sở dữ liệu**: MongoDB (Mongoose) linh hoạt cho các loại nến.
- [x] **JWT Authentication**: Login/register trả token cơ bản.
- [x] **Phân quyền Admin/User**: Middleware JWT bảo vệ route quản trị, user/admin lưu tách riêng trên frontend.
- [x] **Newsletter**: API lưu email nhận tin.
- [x] **Email thông báo đơn hàng**: Dùng Nodemailer SMTP, gửi về `anhy.2709.0820@gmail.com` khi cấu hình `EMAIL_USER/EMAIL_PASS`.
- [x] **Lưu trữ ảnh Cloudinary**: Admin upload ảnh sản phẩm qua backend, backend đẩy ảnh lên Cloudinary và lưu `secure_url` vào MongoDB.
- [x] **Reviews**: API đánh giá sản phẩm có sao, bình luận và ảnh thật khách upload.
- [x] **Order history**: Khách đăng nhập đặt hàng sẽ thấy lịch sử đơn và trạng thái cập nhật khi admin đổi.
- [x] **Lưu trữ ảnh cloud**: Đã chuyển upload ảnh sản phẩm sang Cloudinary để ảnh không mất khi redeploy.

### 3. Quản trị (Admin Dashboard)
- [x] **CRUD Sản phẩm**: Thêm/Sửa/Xóa nến thơm (tên, mùi, giá, ảnh) trên dashboard, hỗ trợ upload file JPG/PNG/WebP và preview ảnh.
- [x] **Quản lý đơn hàng**: Xem đơn hàng và cập nhật trạng thái.
- [x] **Quản lý tài khoản**: Admin sửa thông tin user, phân quyền và đặt lại mật khẩu.
- [x] **Blogs**: API blog và trang blog/FAQ.
- [ ] **Sửa sản phẩm/đơn/blog đầy đủ**: Cần bổ sung form edit chi tiết và phân quyền admin.

### 4. Hệ thống AI & Bot
- [ ] **Agent_skill**: Cấu hình kỹ năng cho AI Agent để duy trì phong cách và code chuẩn.
- [x] **FAQ/Zalo**: FAQ nằm trong trang Blog/FAQ, khách liên hệ nhanh bằng Zalo.
- [x] **OAuth Google/Facebook**: Có route OAuth backend và nút đăng nhập trên frontend; cần điền client id/secret để chạy thật.

---

## 🛠️ Công nghệ sử dụng
- **Frontend**: React, Vite, CSS (Standard/Vanilla for maximum flexibility).
- **Backend**: Node.js, Express, MongoDB.
- **Deployment**: Vercel (Frontend), Render (Backend/DB).

## ▶️ Chạy local
- Mở file `run_local.bat` ở thư mục gốc để tự kiểm tra Node/npm, cài dependencies nếu thiếu, chạy backend và frontend trong 2 cửa sổ riêng.
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Nếu muốn dùng dữ liệu MongoDB thật, bật MongoDB local tại `mongodb://127.0.0.1:27017/anhy_candle`, sau đó chạy `cd BE && node seed/seedData.js`.
- Dùng một trang đăng nhập chung tại `http://localhost:5173/auth`. Tài khoản admin mặc định là email/username `admin`, mật khẩu `admin123`; nếu tài khoản có `isAdmin=true` thì tự chuyển vào dashboard admin, tài khoản thường sẽ vào khu vực khách hàng.
- Google/Facebook login dùng OAuth thật, không còn tạo tài khoản demo. Cần điền đủ `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_CALLBACK_URL` trong `BE/.env`; callback URL trên Google/Facebook Developer Console phải trùng với `.env`.
- OAuth local cần cấu hình chính xác trong dashboard provider:
  - Google Authorized redirect URI: `http://localhost:5000/api/users/oauth/google/callback`
  - Facebook Valid OAuth Redirect URI: `http://localhost:5000/api/users/oauth/facebook/callback`
  - Có thể kiểm tra backend đang đọc đúng env bằng `http://localhost:5000/api/users/oauth/status` sau khi restart backend.
- Để gửi email thông báo đơn hàng bằng Gmail, cấu hình `EMAIL_USER` và `EMAIL_PASS` trong `BE/.env` bằng tài khoản Gmail/App Password. Email nhận thông báo là `ORDER_NOTIFY_EMAIL`, hiện dùng `anhy.2709.0820@gmail.com`.
- Khi khách bấm **Hoàn tất đặt hàng**, backend sẽ lưu đơn vào MongoDB trước, đơn xuất hiện trong Admin Dashboard, sau đó gửi email HTML pastel về Gmail cửa hàng. Nếu SMTP lỗi, đơn vẫn được lưu và backend ghi log lỗi gửi mail.
- Upload ảnh sản phẩm trong admin hỗ trợ JPG, PNG, WebP và cả HEIC/HEIF từ iPhone. Backend sẽ upload ảnh lên Cloudinary rồi lưu URL cloud vào sản phẩm.
- Để dùng upload Cloudinary, thêm `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` vào `BE/.env` hoặc Render Environment.
- Không dùng ảnh remote làm fallback trong `onError`; nếu ảnh upload/URL bị lỗi, UI dùng ảnh local `hero-banner.png` để tránh vòng lặp request và lag DevTools.
- Để test trạng thái đơn: đăng nhập tài khoản khách, đặt hàng ở checkout, đăng nhập admin `admin/admin123`, vào `/admin` đổi trạng thái đơn sang `Shipped` hoặc `Delivered`, quay lại `/auth` của khách để xem lịch sử đơn tự cập nhật khoảng mỗi 3 giây.

## 📁 Cấu trúc thư mục
- `/FE`: Toàn bộ mã nguồn giao diện người dùng.
- `/BE`: Toàn bộ mã nguồn API và cơ sở dữ liệu.
- `/Agent_skill`: Các kỹ năng và hướng dẫn chuyên biệt cho AI Agent.
- `/test`: Thư mục chạy thử nghiệm và kiểm soát code.
- `/Fix`: Thư mục lưu trữ các bản sửa lỗi nhanh.

---
*Dự án đang trong quá trình phát triển. Liên hệ AI Agent để biết thêm chi tiết.*
