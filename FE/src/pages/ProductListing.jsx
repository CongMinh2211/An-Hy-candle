import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { fallbackProducts, mergeCatalogProducts } from '../data/shopData';
import { API_URLS } from '../config/api';
import { buildProductSearchText, normalizeSearchText } from '../utils/search';

const MotionDiv = motion.div;
const MotionHeader = motion.header;

const ProductListing = () => {
  const [filter, setFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const normalizedSearch = normalizeSearchText(search);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const response = await fetch(API_URLS.products);
        const data = response.ok ? await response.json() : [];
        if (!isMounted) return;

        if (data.length) {
          setAllProducts(mergeCatalogProducts(data));
        } else {
          setAllProducts(fallbackProducts);
        }
      } catch {
        if (isMounted) {
          setAllProducts(fallbackProducts);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const productSource = allProducts.length ? allProducts : fallbackProducts;

  const filteredProducts = productSource
    .filter((p) => filter === 'All' || p.scent === filter)
    .filter((p) => sizeFilter === 'all' || (p.size || 'Standard') === sizeFilter)
    .filter((p) => normalizeSearchText(buildProductSearchText(p)).includes(normalizedSearch))
    .filter((p) => {
      if (priceFilter === 'under300') return p.price < 300000;
      if (priceFilter === '300to350') return p.price >= 300000 && p.price <= 350000;
      if (priceFilter === 'over350') return p.price > 350000;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'priceAsc') return a.price - b.price;
      if (sort === 'priceDesc') return b.price - a.price;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div style={{ padding: '60px 5%' }}>
      <MotionHeader
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <h1 style={{ fontSize: '3.5rem', color: 'var(--color-accent)', marginBottom: '10px' }}>Toàn Bộ Sản Phẩm</h1>
        <p style={{ opacity: 0.7 }}>Tìm kiếm mùi hương lý tưởng cho không gian của bạn</p>
      </MotionHeader>

      <MotionDiv
        className="controls filter-panel"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <input
          className="select-filter search-filter"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm tên nến, mùi hương..."
        />
        {['All', 'Woody', 'Floral', 'Fresh', 'Citrus', 'Spice'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '10px 25px',
              borderRadius: '25px',
              border: '1px solid var(--color-accent)',
              background: filter === cat ? 'var(--color-accent)' : 'transparent',
              color: filter === cat ? '#fff' : 'var(--color-accent)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            {cat === 'All' ? 'Tất Cả' : cat}
          </button>
        ))}
      </MotionDiv>
      <div className="controls" style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginBottom: '50px', flexWrap: 'wrap' }}>
        <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)} className="select-filter">
          <option value="all">Tất cả mức giá</option>
          <option value="under300">Dưới 300.000đ</option>
          <option value="300to350">300.000đ - 350.000đ</option>
          <option value="over350">Trên 350.000đ</option>
        </select>
        <select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)} className="select-filter">
          <option value="all">Tất cả kích thước</option>
          <option value="Small">Hũ nhỏ</option>
          <option value="Medium">Hũ vừa</option>
          <option value="Large">Hũ lớn</option>
          <option value="Standard">Tiêu chuẩn</option>
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="select-filter">
          <option value="newest">Mới nhất</option>
          <option value="priceAsc">Giá thấp - cao</option>
          <option value="priceDesc">Giá cao - thấp</option>
        </select>
      </div>

      <MotionDiv
        className="product-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '40px', 
        maxWidth: 'var(--max-width)', 
        margin: '0 auto' 
      }}>
        {isLoadingProducts && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.7 }}>
            Đang tải sản phẩm từ An Hy Candle...
          </p>
        )}
        {filteredProducts.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </MotionDiv>
    </div>
  );
};

export default ProductListing;
