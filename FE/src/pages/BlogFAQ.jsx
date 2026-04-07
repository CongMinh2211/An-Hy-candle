import { useEffect, useState } from 'react';
import { faqs, fallbackPosts } from '../data/shopData';

const BlogFAQ = () => {
  const [posts, setPosts] = useState(fallbackPosts);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs');
        const data = response.ok ? await response.json() : [];
        if (data.length) setPosts(data);
      } catch {
        setPosts(fallbackPosts);
      }
    };

    loadPosts();
  }, []);

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">BLOG & FAQ</p>
          <h1>Hướng dẫn sử dụng nến thơm</h1>
        </div>
      </div>
      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post._id || post.slug} className="blog-card">
            <img src={post.coverImage} alt={post.title} />
            <p className="eyebrow">{post.category}</p>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
      <div className="faq-panel">
        <p className="eyebrow">FAQ BOT KNOWLEDGE</p>
        <h2>Câu hỏi thường gặp</h2>
        {faqs.map((faq, index) => (
          <div className="faq-item" key={faq.q}>
            <button onClick={() => setOpenFaq(openFaq === index ? null : index)}>
              <span>{faq.q}</span>
              <span>{openFaq === index ? '-' : '+'}</span>
            </button>
            {openFaq === index && <p>{faq.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogFAQ;
