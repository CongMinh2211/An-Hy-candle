import React from 'react';
import { CheckCircle, ArrowRight, Clipboard, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import qrImage from '../../QR.jpg';

const OrderSuccess = ({ order, emailNotification, onConfirmTransfer }) => {
  const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép nội dung chuyển khoản!');
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <CheckCircle size={80} color="#4bb543" style={{ marginBottom: '20px' }} />
      <h1 style={{ color: 'var(--color-accent)', fontSize: '2.5rem', marginBottom: '10px' }}>Đặt Hàng Thành Công!</h1>
      <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '40px' }}>
        Cảm ơn bạn đã tin tưởng chọn An Hy Candle. Đơn hàng <strong>#{order._id.toString().slice(-6).toUpperCase()}</strong> của bạn đang được xử lý.
      </p>
      {emailNotification && (
        <p className="form-message" style={{ margin: '0 auto 28px', maxWidth: '620px' }}>
          {emailNotification === 'sent'
            ? 'Email thông báo đơn hàng đã gửi về Gmail cửa hàng.'
            : emailNotification === 'failed'
              ? 'Đơn đã lưu nhưng email thông báo chưa gửi được, An Hy sẽ kiểm tra log backend.'
              : 'Đơn đã lưu nhưng SMTP email chưa được cấu hình.'}
        </p>
      )}

      {order.paymentMethod === 'qr' && (
        <div className="glass-effect" style={{ padding: '30px', borderRadius: '20px', marginBottom: '40px', border: '1px solid var(--color-accent)' }}>
          <h3 style={{ marginBottom: '20px', color: '#5d4037' }}>Hướng dẫn chuyển khoản</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <img 
              src={qrImage} 
              alt="QR chuyển khoản" 
              style={{ width: '250px', borderRadius: '15px', boxShadow: 'var(--soft-shadow)' }} 
            />
            <div style={{ textAlign: 'left', width: '100%', maxWidth: '400px', background: 'rgba(93, 64, 55, 0.05)', padding: '20px', borderRadius: '12px' }}>
              <p style={{ margin: '5px 0' }}><strong>Số tiền:</strong> {formatPrice(order.totalPrice)}</p>
              <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>Nội dung:</strong> ANHY {order.shippingAddress.phone}</span>
                <button 
                  onClick={() => copyToClipboard(`ANHY ${order.shippingAddress.phone}`)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)' }}
                >
                  <Clipboard size={18} />
                </button>
              </p>
            </div>
            
            <button 
              onClick={onConfirmTransfer}
              className="btn-premium"
              style={{ width: '100%', padding: '15px', marginTop: '10px' }}
            >
              TÔI ĐÃ CHUYỂN KHOẢN
            </button>
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              Nhấn nút trên để chúng tôi kiểm tra và xác nhận đơn hàng nhanh hơn.
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Link to="/products" className="btn-premium" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Tiếp tục mua sắm <ArrowRight size={20} />
        </Link>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-accent)', fontWeight: 600, alignSelf: 'center' }}>
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
