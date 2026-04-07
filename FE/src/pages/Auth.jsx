import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { formatPrice } from '../data/shopData';
import { API_URLS, API_BASE_URL } from '../config/api';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [accountTab, setAccountTab] = useState('profile');
  const [currentUser, setCurrentUser] = useState(() => (
    JSON.parse(localStorage.getItem('anhy_user') || 'null') || JSON.parse(localStorage.getItem('anhy_admin') || 'null')
  ));

  const persistUser = useCallback((data) => {
    if (data.isAdmin) {
      localStorage.setItem('anhy_admin', JSON.stringify(data));
      localStorage.removeItem('anhy_user');
      navigate('/admin');
      return;
    }

    localStorage.setItem('anhy_user', JSON.stringify(data));
    localStorage.removeItem('anhy_admin');
    setCurrentUser(data);
    setMessage(`Xin chào ${data.name}! Tài khoản khách hàng đã đăng nhập.`);
    // Trigger storage event for Navbar sync
    window.dispatchEvent(new Event('storage'));
  }, [navigate]);

  useEffect(() => {
    if (searchParams.get('oauth') === 'success') {
      persistUser({
        _id: searchParams.get('id'),
        name: searchParams.get('name'),
        email: searchParams.get('email'),
        isAdmin: searchParams.get('isAdmin') === 'true',
        token: searchParams.get('token')
      });
    }

    if (searchParams.get('oauth') === 'error') {
      setMessage(`OAuth lỗi: ${searchParams.get('message') || 'Không đăng nhập được'}`);
    }
  }, [persistUser, searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
    const endpoint = mode === 'login' ? '/login' : '/register';

    try {
      setIsAuthLoading(true);
      const response = await fetch(`${API_URLS.users}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể xác thực');
      persistUser(data);
    } catch (error) {
      setMessage(`Chưa đăng nhập/đăng ký được: ${error.message}`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const authHeaders = {
    Authorization: `Bearer ${currentUser?.token || ''}`,
    'Content-Type': 'application/json'
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch(`${API_URLS.users}/profile`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      persistUser(data);
      setProfileMessage('Đã lưu thông tin cá nhân vào CSDL.');
    } catch (error) {
      setProfileMessage(`Chưa lưu được hồ sơ: ${error.message}`);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch(`${API_URLS.users}/password`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setPasswordMessage('Đã đổi mật khẩu.');
      event.currentTarget.reset();
    } catch (error) {
      setPasswordMessage(`Chưa đổi được mật khẩu: ${error.message}`);
    }
  };

  const defaultAddress = currentUser?.addresses?.[0] || {};

  const loadOrders = useCallback(async () => {
    if (!currentUser?.token || currentUser?.isAdmin) return;

    try {
      const response = await fetch(`${API_URLS.orders}/my`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      if (response.ok) setOrders(await response.json());
    } catch {
      setOrders([]);
    }
  }, [currentUser?.isAdmin, currentUser?.token]);

  useEffect(() => {
    loadOrders();
    const timer = setInterval(loadOrders, 3000);
    return () => clearInterval(timer);
  }, [loadOrders]);

  return (
    <section className="content-section auth-layout">
      {!currentUser && (
        <div>
          <p className="eyebrow">ACCOUNT</p>
          <h1>{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'} An Hy</h1>
          <p>Một trang đăng nhập duy nhất: tài khoản admin sẽ tự vào dashboard, tài khoản thường sẽ vào khu vực khách hàng.</p>
        </div>
      )}
      {currentUser && (
        <div style={{ gridColumn: '1 / -1' }}>
          <p className="eyebrow">DASHBOARD</p>
          <h1>Chào mừng quay trở lại, {currentUser.name}!</h1>
          <p>
            Bạn đang đăng nhập với tư cách <strong>{currentUser.isAdmin ? 'Quản trị viên' : 'Khách hàng'}</strong>. 
            Từ đây bạn có thể quản lý thông tin cá nhân và xem lại lịch sử mua hàng.
          </p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            {currentUser.isAdmin && (
              <Link to="/admin" className="btn-premium" style={{ textDecoration: 'none' }}>
                Đến trang Quản trị
              </Link>
            )}
            <button
              className="outline-button"
              onClick={() => {
                localStorage.removeItem('anhy_user');
                localStorage.removeItem('anhy_admin');
                setCurrentUser(null);
                window.dispatchEvent(new Event('storage'));
                navigate('/auth');
              }}
            >
              Đăng xuất ngay
            </button>
          </div>
        </div>
      )}
      {!currentUser && (
        <form className="form-card" onSubmit={handleSubmit}>
          {mode !== 'login' && <input name="name" required placeholder="Họ và tên" />}
          <input name="email" required type="email" placeholder="Email" />
          <input name="password" required type="password" placeholder="Mật khẩu" />
          <button className="btn-premium" type="submit">
            {isAuthLoading ? <span className="button-loading"><span className="spinner" /> Đang xử lý...</span> : (mode === 'login' ? 'Đăng nhập' : 'Đăng ký')}
          </button>
          <button className="outline-button" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Chưa có tài khoản? Đăng ký khách hàng' : 'Đã có tài khoản? Đăng nhập'}
          </button>
          <div className="oauth-row">
            <a className="outline-button oauth-button" href={`${API_URLS.users}/oauth/google`}>Đăng nhập nhanh Google</a>
            <a className="outline-button oauth-button" href={`${API_URLS.users}/oauth/facebook`}>Đăng nhập nhanh Facebook</a>
          </div>
          {message && <p className="form-message">{message}</p>}
        </form>
      )}
      {currentUser && (
        <div className="account-panels">
          <div className="account-tabs">
            <button className={accountTab === 'profile' ? 'active' : ''} type="button" onClick={() => setAccountTab('profile')}>
              Thông tin cá nhân
            </button>
            <button className={accountTab === 'password' ? 'active' : ''} type="button" onClick={() => setAccountTab('password')}>
              Đổi mật khẩu
            </button>
            <button className={accountTab === 'orders' ? 'active' : ''} type="button" onClick={() => setAccountTab('orders')}>
              Đơn hàng
            </button>
          </div>
          {accountTab === 'profile' && (
            <form id="personal-info" className="form-card account-tab-panel" onSubmit={handleProfileSubmit}>
              <h2>Thông tin cá nhân</h2>
              <input name="name" defaultValue={currentUser.name || ''} required placeholder="Họ và tên" />
              <input name="phone" defaultValue={currentUser.phone || defaultAddress.phone || ''} placeholder="Số điện thoại" />
              <input name="address" defaultValue={defaultAddress.address || ''} placeholder="Địa chỉ" />
              <input name="district" defaultValue={defaultAddress.district || ''} placeholder="Quận/Huyện" />
              <input name="city" defaultValue={defaultAddress.city || ''} placeholder="Tỉnh/Thành phố" />
              <button className="btn-premium" type="submit">Lưu hồ sơ</button>
              {profileMessage && <p className="form-message">{profileMessage}</p>}
            </form>
          )}
          {accountTab === 'password' && (
            <form className="form-card account-tab-panel" onSubmit={handlePasswordSubmit}>
              <h2>Đổi mật khẩu</h2>
              <input name="currentPassword" type="password" placeholder="Mật khẩu hiện tại" />
              <input name="newPassword" type="password" required placeholder="Mật khẩu mới" />
              <button className="btn-premium" type="submit">Cập nhật mật khẩu</button>
              {passwordMessage && <p className="form-message">{passwordMessage}</p>}
            </form>
          )}
          {accountTab === 'orders' && (
            <div className="form-card account-history account-tab-panel">
              <h2>Lịch sử mua hàng</h2>
              <p>Trạng thái tự cập nhật vài giây một lần khi admin đổi đơn hàng.</p>
              {orders.length === 0 ? (
                <p className="form-message">Chưa có đơn hàng nào gắn với tài khoản này.</p>
              ) : orders.map((order) => (
                <div className="order-history-card" key={order._id}>
                  <div>
                    <strong>Đơn #{order._id.slice(-6).toUpperCase()}</strong>
                    <span>{formatPrice(order.totalPrice)}</span>
                  </div>
                  <div className={`order-progress status-${order.status?.toLowerCase()}`}>
                    <span>Đang xử lý</span>
                    <span>Đang giao</span>
                    <span>Đã giao</span>
                  </div>
                  <p>Trạng thái hiện tại: <strong>{order.status === 'Shipped' ? 'Đang giao' : order.status === 'Delivered' ? 'Đã giao' : order.status === 'Cancelled' ? 'Đã hủy' : 'Đang xử lý'}</strong></p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Auth;
