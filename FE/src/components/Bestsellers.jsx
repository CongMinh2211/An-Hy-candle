import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { fallbackProducts } from '../data/shopData';
import ScrollReveal from './ScrollReveal';
import { API_URLS } from '../config/api';

const Bestsellers = () => {
  const [products, setProducts] = useState(fallbackProducts.slice(0, 4));

  useEffect(() => {
    const fetchProducts = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1800);
      try {
        const response = await fetch(API_URLS.products, { signal: controller.signal });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data && data.length > 0) {
          setProducts(data.slice(0, 4));
        }
      } catch (error) {
        console.warn('API Fetch failed, using mock data:', error);
      } finally {
        clearTimeout(timeout);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="section-bestsellers liquid-section scented-section" style={{ padding: '100px 5%', textAlign: 'center' }}>
      <ScrollReveal>
        <p className="eyebrow">— SẢN PHẨM NỔI BẬT —</p>
        <h2 style={{ fontSize: '3rem', marginBottom: '60px', color: 'var(--color-accent)' }}>Mùi Hương Yêu Thích Nhất</h2>
      </ScrollReveal>
      
      <div className="product-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '40px', 
        maxWidth: 'var(--max-width)', 
        margin: '0 auto' 
      }}>
        {products.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>

      <Link to="/products" className="btn-premium magnetic-link" style={{ 
        marginTop: '60px', 
        background: 'transparent', 
        color: 'var(--color-accent)', 
        border: '1px solid var(--color-accent)',
        display: 'inline-block',
        textDecoration: 'none'
      }}>
        Xem Tất Cả Sản Phẩm →
      </Link>
    </section>
  );
};

export default Bestsellers;
