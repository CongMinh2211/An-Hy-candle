import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { fallbackProducts, mergeCatalogProducts } from '../data/shopData';
import ScrollReveal from './ScrollReveal';
import { API_URLS } from '../config/api';

const Bestsellers = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URLS.products);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (isMounted && data && data.length > 0) {
          setProducts(mergeCatalogProducts(data).slice(0, 4));
        } else if (isMounted) {
          setProducts(fallbackProducts.slice(0, 4));
        }
      } catch (error) {
        if (isMounted) {
          console.warn('API Fetch failed, using mock data:', error);
          setProducts(fallbackProducts.slice(0, 4));
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
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
