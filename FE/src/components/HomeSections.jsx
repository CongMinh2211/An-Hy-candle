import { Link } from 'react-router-dom';
import { fallbackPosts } from '../data/shopData';
import ScrollReveal from './ScrollReveal';

const HomeSections = () => {
  return (
    <>
      <section id="story" className="content-section split-section">
        <ScrollReveal>
          <p className="eyebrow">OUR STORY</p>
          <h2>Nến thơm thủ công cho những khoảng nghỉ dịu dàng</h2>
          <p>An Hy Candle theo đuổi cảm giác ấm cúng, tối giản và thanh lịch: màu be, hồng phấn, nâu ấm, khoảng trắng rộng và hình ảnh sản phẩm giàu cảm xúc.</p>
        </ScrollReveal>
        <ScrollReveal className="soft-panel ritual-panel" delay={0.12}>
          <h3>Cam kết An Hy</h3>
          <p>100% sáp đậu nành, bấc cotton, đóng gói quà tặng tinh tế và trải nghiệm mua hàng nhẹ nhàng như một Shopify theme cao cấp.</p>
        </ScrollReveal>
      </section>

      <section id="guide" className="content-section">
        <ScrollReveal className="section-heading">
          <p className="eyebrow">JOURNAL</p>
          <h2>Tin tức & hướng dẫn sử dụng nến</h2>
          <Link to="/blog" className="text-link">Xem blog</Link>
        </ScrollReveal>
        <div className="blog-grid">
          {fallbackPosts.map((post) => (
            <article key={post._id} className="blog-card">
              <img src={post.coverImage} alt={post.title} />
              <p className="eyebrow">{post.category}</p>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <ScrollReveal className="newsletter-band">
        <p className="eyebrow">AN HY CLUB</p>
        <h2>Nhận ưu đãi và bài viết chăm sóc nến</h2>
        <Link to="/contact" className="btn-premium">Đăng ký nhận tin</Link>
      </ScrollReveal>
    </>
  );
};

export default HomeSections;
