import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fallbackProducts } from '../data/shopData';
import ProductCard from '../components/ProductCard';
import productFallbackImage from '../assets/hero-banner.png';

const fallbackImage = productFallbackImage;
const MotionDiv = motion.div;

const Accordion = ({ id, title, content, openAccordion, setOpenAccordion }) => {
  const isOpen = openAccordion === id;

  return (
    <div style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', marginBottom: '10px' }}>
      <button 
        onClick={() => setOpenAccordion(isOpen ? null : id)}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '15px 0', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--color-accent)'
        }}
      >
        {title} {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && (
        <div style={{ paddingBottom: '15px', fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6' }}>
          {content}
        </div>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('notes');
  const [selectedImage, setSelectedImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewMessage, setReviewMessage] = useState('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const fallbackProduct = useMemo(() => {
    return fallbackProducts.find((item) => item.id === Number(id)) || fallbackProducts[0];
  }, [id]);

  const [product, setProduct] = useState(fallbackProduct);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id || Number.isFinite(Number(id))) {
        setProduct(fallbackProduct);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (response.ok) {
          setProduct(await response.json());
        }
      } catch {
        setProduct(fallbackProduct);
      }
    };

    loadProduct();
  }, [fallbackProduct, id]);

  const gallery = [product.image, product.image2, product.image3].filter(Boolean);
  const activeImage = gallery.includes(selectedImage) ? selectedImage : product.image;
  const productId = product._id || product.id || id;
  const recommendations = fallbackProducts
    .filter((item) => item.id !== Number(product.id || id) && (item.scent === product.scent || item.category === product.category))
    .slice(0, 3);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/product/${productId}`);
        if (response.ok) setReviews(await response.json());
      } catch {
        setReviews([]);
      }
    };

    if (productId) loadReviews();
  }, [productId]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('anhy_user') || 'null');
    const formData = new FormData(event.currentTarget);
    formData.append('productId', String(productId));

    try {
      setIsReviewSubmitting(true);
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setReviews((items) => [data, ...items]);
      setReviewMessage('Đã gửi đánh giá. Cảm ơn bạn đã chia sẻ ảnh thật!');
      event.currentTarget.reset();
    } catch (error) {
      setReviewMessage(`Chưa gửi được đánh giá: ${error.message}`);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  return (
    <>
    <MotionDiv
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      style={{ padding: '60px 5%', display: 'flex', gap: '80px', maxWidth: 'var(--max-width)', margin: '0 auto' }}
    >
      <div className="product-image" style={{ flex: 1.2 }}>
        <img 
          src={activeImage || fallbackImage} 
          alt={product.name} 
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
          style={{ 
            width: '100%', 
            borderRadius: 'var(--border-radius)', 
            boxShadow: 'var(--soft-shadow)', 
            aspectRatio: '4/5',
            objectFit: 'cover'
          }} 
        />
        <div className="thumb-row">
          {gallery.map((image) => (
            <button key={image} onClick={() => setSelectedImage(image)} className={image === activeImage ? 'active-thumb' : ''}>
              <img
                src={image || fallbackImage}
                alt={`${product.name} thumbnail`}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = fallbackImage;
                }}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="product-info" style={{ flex: 1, padding: '20px 0' }}>
        <p style={{ letterSpacing: '4px', fontSize: '0.8rem', opacity: 0.6, marginBottom: '10px' }}>SẢN PHẨM MỚI NHẤT</p>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--color-accent)' }}>{product.name}</h1>
        <p className="review-stars">★★★★★ <span>{reviews.length ? `${reviews.length} đánh giá thật` : '4.9/5 từ khách hàng'}</span></p>
        <p style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '30px', color: 'var(--color-accent)' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
        </p>
        
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.8, marginBottom: '40px' }}>
          {product.description}
        </p>
        
        <div className="purchase-controls" style={{ display: 'flex', gap: '20px', marginBottom: '50px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            border: '1px solid var(--color-accent)', 
            borderRadius: '25px', 
            padding: '5px 20px',
            gap: '15px'
          }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>—</button>
            <span style={{ fontWeight: 600 }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
          </div>
          <button
            className="btn-premium"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onClick={() => {
              for (let index = 0; index < qty; index += 1) addToCart(product);
            }}
          >
            <ShoppingBag size={18} /> THÊM VÀO GIỎ HÀNG
          </button>
        </div>

        <div className="product-accordions">
          <Accordion id="notes" title="Nốt Hương Chính" content={product.notes} openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} />
          <Accordion id="materials" title="Thành Phần & Chất Liệu" content={product.materials || '100% Sáp đậu nành thiên nhiên, bấc cotton không chì, tinh dầu chọn lọc.'} openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} />
          <Accordion id="care" title="Hướng Dẫn Bảo Quản & Sử Dụng" content={product.care || 'Cắt bấc còn khoảng 5mm trước mỗi lần đốt, không đốt quá 4 giờ liên tục và luôn đặt nến trên bề mặt chịu nhiệt.'} openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} />
        </div>
        <div className="review-box">
          <h3>Reviews</h3>
          {reviews.length === 0 ? (
            <p>“Mùi thơm rất dịu, packaging pastel đẹp và sang. Đốt phòng ngủ cực thư giãn.”</p>
          ) : reviews.map((review) => (
            <div className="review-item" key={review._id}>
              <p className="review-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
              <p>{review.comment}</p>
              {review.image && <img src={review.image} alt={`Ảnh đánh giá của ${review.userName}`} />}
              <strong>- {review.userName}</strong>
            </div>
          ))}
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h4>Gửi đánh giá của bạn</h4>
            <input name="userName" placeholder="Tên của bạn (nếu chưa đăng nhập)" />
            <select name="rating" defaultValue="5" className="select-filter">
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
            <textarea name="comment" required placeholder="Bạn thấy mùi hương, đóng gói, độ lưu hương như thế nào?" />
            <input name="image" type="file" accept="image/jpeg,image/png,image/webp" />
            <button className="btn-premium" type="submit" disabled={isReviewSubmitting}>
              {isReviewSubmitting ? <span className="button-loading"><span className="spinner" /> Đang gửi...</span> : 'Gửi đánh giá'}
            </button>
            {reviewMessage && <p className="form-message">{reviewMessage}</p>}
          </form>
        </div>
      </div>
    </MotionDiv>
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">UPSELLING</p>
          <h2>Có thể bạn cũng thích...</h2>
        </div>
      </div>
      <div className="product-grid">
        {recommendations.map((item) => <ProductCard key={item.id} product={item} />)}
      </div>
    </section>
    </>
  );
};

export default ProductDetail;
