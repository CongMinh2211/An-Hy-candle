import { ChevronDown, Heart, LogOut, Search, User, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { fallbackProducts } from '../data/shopData';
import { API_URLS } from '../config/api';
import { buildProductSearchText, normalizeSearchText } from '../utils/search';
import { handleProductImageError, resolveProductImageUrl } from '../utils/images';
import brandLogo from '../img/logo.jpg';

const productKey = (product) => product._id || product.id;

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [currentUser, setCurrentUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState(fallbackProducts);
  const navigate = useNavigate();

  useEffect(() => {
    // Sync user state from localStorage
    const syncUser = () => {
      const user = JSON.parse(localStorage.getItem('anhy_user') || 'null');
      const admin = JSON.parse(localStorage.getItem('anhy_admin') || 'null');
      setCurrentUser(admin || user);
    };

    syncUser();

    // Dynamic sync if other tabs/components update it
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(API_URLS.products);
        const data = response.ok ? await response.json() : [];
        if (data.length) setProducts(data);
      } catch {
        setProducts(fallbackProducts);
      }
    };

    loadProducts();
  }, []);

  const normalizedQuery = normalizeSearchText(query);
  const searchableProducts = products.length ? products : fallbackProducts;

  const suggestions = normalizedQuery
    ? searchableProducts
      .filter((product) => normalizeSearchText(buildProductSearchText(product)).includes(normalizedQuery))
      .slice(0, 5)
    : [];

  const handleLogout = () => {
    localStorage.removeItem('anhy_user');
    localStorage.removeItem('anhy_admin');
    setCurrentUser(null);
    setAccountOpen(false);
    window.dispatchEvent(new Event('storage'));
    navigate('/auth');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      background: 'rgba(245, 245, 240, 0.9)', /* var(--color-primary) with transparency */
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <Link to="/" className="nav-logo" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
        <img
          src={brandLogo}
          alt="An Hy candle"
          style={{
            height: '56px',
            width: 'auto',
            display: 'block',
            objectFit: 'contain'
          }}
        />
      </Link>
      
      <div className="nav-links" style={{ display: 'flex', gap: '30px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-accent)', fontWeight: 500, fontSize: '0.9rem' }}>TRANG CHỦ</Link>
        <Link to="/products" style={{ textDecoration: 'none', color: 'var(--color-accent)', fontWeight: 500, fontSize: '0.9rem' }}>SẢN PHẨM</Link>
        <Link to="/blog" style={{ textDecoration: 'none', color: 'var(--color-accent)', fontWeight: 500, fontSize: '0.9rem' }}>BLOG/FAQ</Link>
        <Link to="/contact" style={{ textDecoration: 'none', color: 'var(--color-accent)', fontWeight: 500, fontSize: '0.9rem' }}>LIÊN HỆ</Link>
      </div>
      
      <div className="nav-icons" style={{ display: 'flex', gap: '20px' }}>
        <div className="smart-search">
          <button className="icon-button" type="button" aria-label="Tìm kiếm" onClick={() => setSearchOpen((open) => !open)}>
            <Search size={22} />
          </button>
          {searchOpen && (
            <div className="search-popover">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm nến gỗ, hoa, citrus..."
              />
              {query && suggestions.length === 0 && <p>Chưa thấy sản phẩm phù hợp.</p>}
              {suggestions.map((product) => (
                <Link
                  key={productKey(product)}
                  to={`/products/${productKey(product)}`}
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery('');
                  }}
                >
                  <img
                    src={resolveProductImageUrl(product.image)}
                    alt={product.name}
                    onError={handleProductImageError}
                  />
                  <span>{product.name}<small>{product.scent} - {product.notes}</small></span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/wishlist" aria-label="Wishlist"><Heart size={22} style={{ color: 'var(--color-accent)', cursor: 'pointer' }} /></Link>
        <div className="account-menu">
          {!currentUser ? (
            <Link to="/auth" className="account-pill" aria-label="Đăng nhập hoặc đăng ký">
              <User size={18} />
              <span>Đăng nhập</span>
            </Link>
          ) : (
            <>
              <button
                className="account-pill"
                type="button"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
              >
                <User size={18} />
                <span>Tài khoản</span>
                <ChevronDown size={16} />
              </button>
              {accountOpen && (
                <div className="account-dropdown">
                  <strong>{currentUser.name || currentUser.email}</strong>
                  <Link to="/auth#personal-info" onClick={() => setAccountOpen(false)}>Thông tin cá nhân</Link>
                  {currentUser.isAdmin && (
                    <Link to="/admin" onClick={() => setAccountOpen(false)}>Trang quản trị</Link>
                  )}
                  <button type="button" onClick={handleLogout}>
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div 
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart size={22} style={{ color: 'var(--color-accent)' }} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'var(--color-secondary)',
              color: 'var(--color-accent)',
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '50%',
              fontWeight: 'bold'
            }}>{cartCount}</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
