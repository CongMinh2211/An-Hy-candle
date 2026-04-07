import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist } = useCart();

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WISHLIST</p>
          <h1>Sản phẩm yêu thích</h1>
          <p>Lưu bằng localStorage để khách quay lại vẫn thấy danh sách nến đã thích.</p>
        </div>
      </div>
      {wishlist.length === 0 ? (
        <div className="soft-panel">Bạn chưa lưu sản phẩm nào. Hãy bấm biểu tượng trái tim trên card sản phẩm.</div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => <ProductCard key={product._id || product.id} product={product} />)}
        </div>
      )}
    </section>
  );
};

export default Wishlist;
