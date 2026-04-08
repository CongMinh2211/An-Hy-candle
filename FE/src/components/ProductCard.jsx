import { useCart } from '../context/CartContext';
import { Heart, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { handleProductImageError, resolveProductImageUrl } from '../utils/images';
const MotionDiv = motion.div;

const ProductCard = ({ product }) => {
  const { addToCart, getProductKey, toggleWishlist, isWishlisted } = useCart();
  const productKey = getProductKey(product);
  const wished = isWishlisted(product);

  return (
    <MotionDiv
    className="glass-effect"
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.18 }}
    transition={{ duration: 0.45 }}
    style={{
      padding: '18px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}
    >
      <div className="product-image-frame">
        <img
          src={resolveProductImageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          onError={handleProductImageError}
        />
      </div>
      <button
        aria-label="Thêm vào wishlist"
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        style={{
          position: 'absolute',
          top: '28px',
          right: '28px',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
            background: '#fffaf7',
          color: wished ? '#b44b5b' : 'var(--color-accent)',
          cursor: 'pointer',
          boxShadow: 'var(--soft-shadow)'
        }}
      >
        <Heart size={18} fill={wished ? '#b44b5b' : 'none'} />
      </button>
      
      <div style={{ flex: 1 }}>
        <p style={{ letterSpacing: '2px', fontSize: '0.7rem', marginBottom: '8px', opacity: 0.6 }}>AN HY NEW ARRIVAL</p>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--color-accent)', fontWeight: 700 }}>{product.name}</h3>
        
        {/* Scent Notes Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '5px', 
          marginBottom: '12px',
          fontSize: '0.85rem',
          color: 'var(--color-accent)',
          opacity: 0.8,
          fontStyle: 'italic'
        }}>
          <Wind size={14} />
          <span>{product.notes || 'Scent Notes'}</span>
        </div>

        <p style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--color-accent)' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          className="btn-premium" 
          style={{ flex: 1, fontSize: '0.8rem', padding: '12px 15px' }}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          Thêm Vào Giỏ
        </button>
        <Link
          to={`/products/${productKey}`}
          style={{ 
            background: '#fffaf7', 
            border: '1px solid rgba(90, 51, 47, 0.45)', 
            color: 'var(--color-accent)',
            borderRadius: '30px',
            padding: '12px 15px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          Chi Tiết
        </Link>
      </div>
    </MotionDiv>
  );
};

export default ProductCard;
