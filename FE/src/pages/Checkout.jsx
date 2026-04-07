import { useState } from 'react';
import { ShieldCheck, QrCode, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import OrderSuccess from '../components/OrderSuccess';
import qrImage from '../../QR.jpg';
import { API_URLS } from '../config/api';

const Checkout = () => {
  const { cartItems, cartTotal, getProductKey, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [orderMessage, setOrderMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [emailNotification, setEmailNotification] = useState('');

  const subtotal = cartTotal;
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shipping;
  const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const objectIdPattern = /^[a-f\d]{24}$/i;
    const user = JSON.parse(localStorage.getItem('anhy_user') || 'null');

    try {
      setIsSubmitting(true);
      const response = await fetch(API_URLS.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product: objectIdPattern.test(item._id || '') ? item._id : undefined,
            name: item.name,
            qty: item.qty,
            price: item.price,
          })),
          shippingAddress: Object.fromEntries(formData.entries()),
          paymentMethod,
          subtotal,
          shippingFee: shipping,
          totalPrice: total,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể tạo đơn hàng');
      
      if (data.emailNotification === 'failed') {
        setOrderMessage('Đơn đã lưu vào Admin nhưng email chưa gửi được. Hãy xem log backend.');
      } else if (data.emailNotification === 'skipped') {
        setOrderMessage('Đơn đã lưu vào Admin nhưng SMTP email chưa được cấu hình.');
      } else {
        setOrderMessage('Đơn đã lưu vào Admin và email thông báo đã gửi về Gmail cửa hàng.');
      }
      setEmailNotification(data.emailNotification || '');
      setOrderData(data.order);
      clearCart();
    } catch (error) {
      setOrderMessage(`Chưa gửi được đơn lên API: ${error.message}.`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmTransfer = () => {
    alert('Cảm ơn bạn! An Hy Candle đã nhận được thông báo. Chúng tôi sẽ kiểm tra tài khoản và xác nhận đơn hàng sớm nhất có thể.');
  };

  if (orderData) {
    return <OrderSuccess order={orderData} emailNotification={emailNotification} onConfirmTransfer={handleConfirmTransfer} />;
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '100px 5%', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-accent)' }}>Giỏ hàng đang trống</h1>
        <p style={{ marginBottom: '30px', opacity: 0.75 }}>Hãy chọn một mùi hương yêu thích trước khi thanh toán.</p>
        <Link to="/products" className="btn-premium" style={{ textDecoration: 'none' }}>Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 5%', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '60px' }}>
      {/* Left Column: Shipping & Payment */}
      <div style={{ flex: 1.5 }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: 'var(--color-accent)' }}>Thông Tin Thanh Toán</h2>
        
        <form id="checkout-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
          <input name="fullName" required type="text" placeholder="Họ và Tên" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ddd', gridColumn: 'span 2' }} />
          <input name="email" required type="email" placeholder="Email" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ddd', gridColumn: 'span 2' }} />
          <input name="phone" required type="tel" placeholder="Số điện thoại" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ddd', gridColumn: 'span 2' }} />
          <input name="address" required type="text" placeholder="Địa chỉ" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ddd', gridColumn: 'span 2' }} />
          <input name="city" required type="text" placeholder="Thành phố" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input name="district" required type="text" placeholder="Quận/Huyện" style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
        </form>

        <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Phương Thức Thanh Toán</h3>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <div 
            onClick={() => setPaymentMethod('qr')}
            style={{ 
              flex: 1, padding: '20px', borderRadius: '12px', border: paymentMethod === 'qr' ? '2px solid var(--color-accent)' : '1px solid #ddd',
              cursor: 'pointer', textAlign: 'center', background: paymentMethod === 'qr' ? 'rgba(93, 64, 55, 0.05)' : '#fff'
            }}
          >
            <QrCode size={30} style={{ marginBottom: '10px' }} />
            <p style={{ fontWeight: 600, margin: 0 }}>Quét Mã VietQR</p>
          </div>
          <div 
            onClick={() => setPaymentMethod('cod')}
            style={{ 
              flex: 1, padding: '20px', borderRadius: '12px', border: paymentMethod === 'cod' ? '2px solid var(--color-accent)' : '1px solid #ddd',
              cursor: 'pointer', textAlign: 'center', background: paymentMethod === 'cod' ? 'rgba(93, 64, 55, 0.05)' : '#fff'
            }}
          >
            <Banknote size={30} style={{ marginBottom: '10px' }} />
            <p style={{ fontWeight: 600, margin: 0 }}>Thanh Toán COD</p>
          </div>
        </div>

        {paymentMethod === 'qr' && (
          <div className="glass-effect" style={{ padding: '30px', textAlign: 'center', marginBottom: '40px' }}>
            <p style={{ marginBottom: '15px', fontSize: '0.9rem', opacity: 0.8 }}>Vui lòng quét mã bên dưới để thanh toán đơn hàng</p>
            <img src={qrImage} alt="QR chuyển khoản An Hy Candle" style={{ width: '260px', maxWidth: '100%', borderRadius: '18px', boxShadow: 'var(--soft-shadow)' }} />
            <p style={{ marginTop: '15px', fontWeight: 600 }}>Thanh toán: {formatPrice(total)}</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.75 }}>Nội dung chuyển khoản: ANHY + số điện thoại của bạn</p>
          </div>
        )}

        <button form="checkout-form" className="btn-premium" disabled={isSubmitting} style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}>
          {isSubmitting ? <span className="button-loading"><span className="spinner" /> ĐANG GỬI ĐƠN...</span> : 'HOÀN TẤT ĐẶT HÀNG'}
        </button>
        {orderMessage && <p style={{ marginTop: '20px', fontWeight: 600, color: 'red' }}>{orderMessage}</p>}
      </div>

      {/* Right Column: Order Summary */}
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.02)', padding: '40px', borderRadius: '15px', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '30px' }}>Đơn Hàng Của Bạn</h3>
        {cartItems.map(item => (
          <div key={getProductKey(item)} style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <img src={item.image} alt={item.name} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
              <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--color-accent)', color: '#fff', fontSize: '0.7rem', width: '20px', height: '20px', borderRadius: '50%', textAlign: 'center', lineHeight: '20px' }}>{item.qty}</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{item.name}</p>
              <p style={{ margin: 0, opacity: 0.6, fontSize: '0.9rem' }}>Loại nến: Soy Wax</p>
            </div>
            <p style={{ margin: 0, fontWeight: 700 }}>{formatPrice(item.price * item.qty)}</p>
          </div>
        ))}
        
        <div style={{ borderTop: '1px solid #ddd', marginTop: '30px', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ opacity: 0.7 }}>Tạm tính</span>
            <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ opacity: 0.7 }}>Phí vận chuyển</span>
            <span style={{ fontWeight: 600 }}>{formatPrice(shipping)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800 }}>
            <span>Tổng cộng</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', gap: '15px', opacity: 0.5, fontSize: '0.8rem' }}>
          <ShieldCheck size={40} />
          <p>Cam kết bảo mật thông tin khách hàng và vận chuyển an toàn tuyệt đối cho mọi đơn hàng An Hy Candle.</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
