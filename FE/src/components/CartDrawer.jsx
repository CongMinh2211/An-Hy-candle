import { X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { 
    cartItems, 
    updateQty, 
    removeFromCart, 
    isCartOpen, 
    setIsCartOpen, 
    cartTotal,
    getProductKey
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1999,
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 'min(450px, 90%)',
        height: '100%',
        backgroundColor: 'var(--color-primary)',
        zIndex: 2000,
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <header style={{ 
          padding: '30px', 
          borderBottom: '1px solid rgba(0,0,0,0.05)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h2 style={{ color: 'var(--color-accent)', fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>Giỏ Hàng</h2>
          <X size={24} style={{ cursor: 'pointer', color: 'var(--color-accent)' }} onClick={() => setIsCartOpen(false)} />
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.5 }}>
              <p>Giỏ hàng của bạn đang trống.</p>
              <button 
                className="btn-premium" 
                style={{ marginTop: '20px' }}
                onClick={() => setIsCartOpen(false)}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            cartItems.map(item => {
              const itemKey = getProductKey(item);
              return (
              <div key={itemKey} style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid rgba(0,0,0,0.02)', paddingBottom: '20px' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: 'var(--border-radius)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-accent)', fontSize: '1.1rem' }}>{item.name}</h4>
                  <p style={{ fontWeight: 600, margin: '0 0 15px 0', opacity: 0.8 }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '30px', padding: '4px 12px', background: '#fff' }}>
                      <Minus size={14} style={{ cursor: 'pointer', opacity: item.qty > 1 ? 1 : 0.3 }} onClick={() => updateQty(itemKey, item.qty - 1)} />
                      <span style={{ margin: '0 12px', fontSize: '1rem', fontWeight: 600 }}>{item.qty}</span>
                      <Plus size={14} style={{ cursor: 'pointer' }} onClick={() => updateQty(itemKey, item.qty + 1)} />
                    </div>
                    <Trash2 
                      size={18} 
                      style={{ cursor: 'pointer', opacity: 0.4, transition: '0.2s' }} 
                      onMouseEnter={e => e.target.style.opacity = 1}
                      onMouseLeave={e => e.target.style.opacity = 0.4}
                      onClick={() => removeFromCart(itemKey)}
                    />
                  </div>
                </div>
                <p style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.qty)}
                </p>
              </div>
            )})
          )}
        </div>

        {cartItems.length > 0 && (
          <footer style={{ padding: '30px', borderTop: '1px solid rgba(0,0,0,0.1)', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <span style={{ fontWeight: 600, fontSize: '1.1rem', opacity: 0.7 }}>TỔNG CỘNG (TẠM TÍNH)</span>
              <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-accent)' }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
              </span>
            </div>
            <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="btn-premium" style={{ width: '100%', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '1rem', textDecoration: 'none', boxSizing: 'border-box' }}>
              TIẾN HÀNH THANH TOÁN <CreditCard size={20} />
            </Link>
            <p onClick={() => setIsCartOpen(false)} style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', cursor: 'pointer', opacity: 0.6, fontWeight: 500 }}>Tiếp Tục Mua Sắm</p>
          </footer>
        )}

        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    </>
  );
};

export default CartDrawer;
