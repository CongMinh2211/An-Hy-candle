import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fallbackProducts, formatPrice } from '../data/shopData';
import { API_URLS } from '../config/api';
import { handleProductImageError, resolveProductImageUrl, compressImage } from '../utils/images';

const emptyProduct = {
  name: '',
  price: '',
  scent: 'Woody',
  notes: '',
  description: '',
  image: '',
  size: 'Medium',
  category: 'Signature',
  inventory: 20
};

const testProductSample = {
  name: 'Test Mới (Cloud Bloom)',
  price: '245000',
  scent: 'Floral',
  notes: 'Hoa cam, lê trắng, vanilla',
  description: 'Sản phẩm test để kiểm tra luồng thêm mới bằng URL ảnh ngoài ổn định hơn.',
  image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  size: 'Medium',
  category: 'Test',
  inventory: 12
};

const readJsonSafely = async (response) => {
  const rawText = await response.text();

  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return { message: rawText };
  }
};

const AdminDashboard = () => {
  const [products, setProducts] = useState(fallbackProducts);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingUserId, setEditingUserId] = useState('');
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '', password: '', isAdmin: false });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('anhy_admin') || 'null');
  const adminHeaders = useMemo(() => ({
    Authorization: `Bearer ${admin?.token || ''}`,
    'Content-Type': 'application/json'
  }), [admin?.token]);

  const loadAdminData = useCallback(async () => {
    if (!admin?.isAdmin) return;

    const endpoints = [
      ['products', API_URLS.products],
      ['orders', API_URLS.orders],
      ['users', API_URLS.users],
      ['contacts', API_URLS.contact],
      ['subscribers', API_URLS.newsletter]
    ];

    try {
      const [productRes, orderRes, userRes, contactRes, subscriberRes] = await Promise.all(
        endpoints.map(([name, url]) => fetch(url, name === 'products' ? undefined : { headers: adminHeaders }))
      );
      if (productRes.ok) {
        const data = await productRes.json();
        if (data.length) setProducts(data);
      }
      if (orderRes.ok) setOrders(await orderRes.json());
      if (userRes.ok) setUsers(await userRes.json());
      if (contactRes.ok) setContacts(await contactRes.json());
      if (subscriberRes.ok) setSubscribers(await subscriberRes.json());
    } catch {
      setMessage('Đang dùng dữ liệu mẫu vì API/MongoDB chưa sẵn sàng.');
    }
  }, [admin?.isAdmin, adminHeaders]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  if (!admin?.isAdmin) {
    return (
      <section className="content-section">
        <div className="soft-panel">
          <p className="eyebrow">ADMIN LOCKED</p>
          <h1>Cần đăng nhập admin</h1>
          <p>Dùng trang đăng nhập chung. Nếu tài khoản có quyền admin, hệ thống sẽ tự đưa bạn vào dashboard.</p>
          <Link to="/auth" className="btn-premium" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>Đăng nhập</Link>
        </div>
      </section>
    );
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    const isEditing = Boolean(editingProductId);
    const url = isEditing 
      ? `${API_URLS.products}/${editingProductId}` 
      : API_URLS.products;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      let imageUrl = productForm.image;

      if (selectedImageFile) {
        setMessage('Đang nén và tải ảnh lên (thường mất vài giây)...');
        const compressedFile = await compressImage(selectedImageFile);
        
        const imageData = new FormData();
        imageData.append('image', compressedFile);

        const uploadResponse = await fetch(`${API_URLS.products}/upload`, {
          method: 'POST',
          headers: { Authorization: adminHeaders.Authorization },
          body: imageData
        });
        const uploadResult = await readJsonSafely(uploadResponse);
        if (!uploadResponse.ok) throw new Error(uploadResult.message);
        imageUrl = uploadResult.imageUrl;
      }

      const payload = {
        ...productForm,
        image: imageUrl,
        price: Number(productForm.price),
        inventory: Number(productForm.inventory)
      };

      const response = await fetch(url, {
        method,
        headers: adminHeaders,
        body: JSON.stringify(payload)
      });
      const data = await readJsonSafely(response);
      if (!response.ok) throw new Error(data.message);
      
      if (isEditing) {
        setProducts((items) => items.map(p => (p._id === editingProductId ? data : p)));
        setMessage('Đã cập nhật sản phẩm.');
      } else {
        setProducts((items) => [data, ...items]);
        setMessage('Đã thêm sản phẩm mới.');
      }
      
      setProductForm(emptyProduct);
      setEditingProductId('');
      setSelectedImageFile(null);
      setImagePreview('');
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('Load failed')) {
        setMessage('Lỗi kết nối mạng: Upload quá lâu hoặc server (Render) đang bận. Vui lòng thử lại với ảnh dung lượng nhỏ hơn, hoặc sử dụng URL ảnh ngoài.');
      } else {
        setMessage(`Lỗi: ${error.message}`);
      }
    }
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isAllowedType = allowedTypes.includes(file.type);
    const isAllowedExtension = allowedExtensions.includes(extension);
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (!isAllowedType && !isAllowedExtension) {
      setSelectedImageFile(null);
      setImagePreview('');
      setMessage('Chỉ hỗ trợ ảnh JPG, PNG, WebP, HEIC hoặc HEIF.');
      event.target.value = '';
      return;
    }

    if (file.size > maxSizeInBytes) {
      setSelectedImageFile(null);
      setImagePreview('');
      setMessage('Ảnh đang lớn hơn 5MB. Bạn hãy giảm dung lượng ảnh rồi thử lại.');
      event.target.value = '';
      return;
    }

    setSelectedImageFile(file);
    if (['heic', 'heif'].includes(extension) || ['image/heic', 'image/heif'].includes(file.type)) {
      setImagePreview('');
      setMessage('Đã nhận ảnh iPhone HEIC/HEIF. Web sẽ upload bình thường, nhưng một số trình duyệt có thể không xem trước được ảnh này.');
    } else {
      setImagePreview(URL.createObjectURL(file));
      setMessage('');
    }
  };

  const fillTestProduct = () => {
    setEditingProductId('');
    setSelectedImageFile(null);
    setProductForm(testProductSample);
    setImagePreview(testProductSample.image);
    setMessage('Đã nạp dữ liệu test mới. Bạn có thể bấm thêm sản phẩm để thử nhanh.');
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name || '',
      price: product.price || '',
      scent: product.scent || '',
      notes: product.notes || '',
      description: product.description || '',
      image: product.image || '',
      size: product.size || 'Medium',
      category: product.category || 'Signature',
      inventory: product.inventory || 20
    });
    setSelectedImageFile(null);
    setImagePreview(product.image || '');
    // Scroll to form
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}" không?`)) {
      return;
    }

    const id = product._id || product.id;
    setProducts((items) => items.filter((item) => (item._id || item.id) !== id));
    if (!product._id) return;

    try {
      await fetch(`${API_URLS.products}/${product._id}`, { method: 'DELETE', headers: adminHeaders });
      setMessage('Đã xóa sản phẩm.');
    } catch {
      setMessage('Chưa xóa được trên API, kiểm tra MongoDB/backend.');
    }
  };

  const updateOrderStatus = async (order, status) => {
    try {
      const response = await fetch(`${API_URLS.orders}/${order._id}/status`, {
        method: 'PUT',
        headers: adminHeaders,
        body: JSON.stringify({ status, isPaid: order.isPaid })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setOrders((items) => items.map((item) => (item._id === data._id ? data : item)));
      setMessage('Đã cập nhật trạng thái đơn hàng.');
    } catch (error) {
      setMessage(`Chưa cập nhật được đơn: ${error.message}`);
    }
  };

  const startEditUser = (user) => {
    setEditingUserId(user._id);
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      isAdmin: Boolean(user.isAdmin)
    });
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    if (!editingUserId) return;

    try {
      const response = await fetch(`${API_URLS.users}/${editingUserId}`, {
        method: 'PUT',
        headers: adminHeaders,
        body: JSON.stringify(userForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setUsers((items) => items.map((item) => (item._id === data._id ? { ...item, ...data } : item)));
      setEditingUserId('');
      setUserForm({ name: '', email: '', phone: '', password: '', isAdmin: false });
      setMessage('Đã cập nhật tài khoản/mật khẩu.');
    } catch (error) {
      setMessage(`Chưa cập nhật được tài khoản: ${error.message}`);
    }
  };

  return (
    <section className="content-section admin-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ADMIN DASHBOARD</p>
          <h1>Quản trị An Hy Candle</h1>
          <p>Xin chào {admin.name}. Dashboard này không hiển thị trên menu công khai; dùng để quản lý sản phẩm, đơn, khách hàng, liên hệ và newsletter.</p>
        </div>
        <button
          className="outline-button"
          onClick={() => {
            localStorage.removeItem('anhy_admin');
            navigate('/auth');
          }}
        >
          Đăng xuất admin
        </button>
      </div>

      <div className="admin-stats">
        <div><strong>{products.length}</strong><span>Sản phẩm</span></div>
        <div><strong>{orders.length}</strong><span>Đơn hàng</span></div>
        <div><strong>{users.length}</strong><span>Người dùng</span></div>
        <div><strong>{contacts.length}</strong><span>Liên hệ</span></div>
        <div><strong>{subscribers.length}</strong><span>Email newsletter</span></div>
      </div>

      <form className="admin-form" onSubmit={handleProductSubmit}>
        <h2>{editingProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm nến'}</h2>
        <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required placeholder="Tên sản phẩm" />
        <input value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required type="number" placeholder="Giá VND" />
        <input value={productForm.scent} onChange={(e) => setProductForm({ ...productForm, scent: e.target.value })} placeholder="Mùi hương" />
        <select value={productForm.size} onChange={(e) => setProductForm({ ...productForm, size: e.target.value })} className="select-filter">
          <option value="Small">Hũ nhỏ</option>
          <option value="Medium">Hũ vừa</option>
          <option value="Large">Hũ lớn</option>
          <option value="Standard">Tiêu chuẩn</option>
        </select>
        <input value={productForm.notes} onChange={(e) => setProductForm({ ...productForm, notes: e.target.value })} placeholder="Nốt hương" />
        <label className="admin-upload">
          <span>Upload ảnh sản phẩm</span>
          <input type="file" accept="image/jpeg,image/png,image/webp,.heic,.heif,image/heic,image/heif" onChange={handleImageFileChange} />
          <small>Ảnh sẽ được upload lên Cloudinary. Nếu bạn dán URL ảnh ngoài như Unsplash, hệ thống cũng sẽ tự import ảnh đó vào Cloudinary khi lưu sản phẩm.</small>
        </label>
        <input value={productForm.image} onChange={(e) => { setProductForm({ ...productForm, image: e.target.value }); setImagePreview(e.target.value); }} required={!selectedImageFile} placeholder="Hoặc dán URL hình ảnh" />
        {(imagePreview || selectedImageFile) && (
          <div className="admin-image-preview">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Xem trước sản phẩm"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.style.display = 'none';
                  setMessage('Trình duyệt này không xem trước được URL ảnh đó, nhưng hệ thống vẫn sẽ thử import ảnh vào Cloudinary khi bạn lưu sản phẩm.');
                }}
              />
            ) : (
              <div className="admin-image-placeholder">HEIC</div>
            )}
            <span>{selectedImageFile ? selectedImageFile.name : 'Ảnh hiện tại/URL'}</span>
          </div>
        )}
        <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required placeholder="Mô tả sản phẩm" />
        <div className="flex-row" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-premium" type="submit" style={{ flex: 1 }}>{editingProductId ? 'Lưu cập nhật' : 'Thêm sản phẩm'}</button>
          {!editingProductId && (
            <button className="outline-button" type="button" onClick={fillTestProduct}>
              Nạp dữ liệu test
            </button>
          )}
          {editingProductId && <button className="outline-button" type="button" onClick={() => { setEditingProductId(''); setProductForm(emptyProduct); setSelectedImageFile(null); setImagePreview(''); }}>Hủy</button>}
        </div>
      </form>

      {message && <p className="form-message">{message}</p>}

      <div className="admin-table">
        <h2>Danh sách sản phẩm</h2>
        {products.map((product) => (
          <div className="admin-row" key={product._id || product.id}>
            <img
              src={resolveProductImageUrl(product.image)}
              alt={product.name}
              onError={handleProductImageError}
            />
            <span>{product.name}</span>
            <span>{formatPrice(product.price)}</span>
            <span>{product.scent}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="outline-button small" onClick={() => startEditProduct(product)}>Sửa</button>
              <button className="outline-button small contrast" onClick={() => deleteProduct(product)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-table">
        <h2>Đơn hàng gần đây</h2>
        {orders.length === 0 ? <p>Chưa có đơn hàng hoặc MongoDB chưa bật.</p> : orders.map((order) => (
          <div className="admin-row" key={order._id}>
            <span>{order.shippingAddress?.fullName || 'Khách hàng'}</span>
            <span>{formatPrice(order.totalPrice)}</span>
            <span>{order.paymentMethod?.toUpperCase()}</span>
            <select value={order.status} onChange={(event) => updateOrderStatus(order, event.target.value)} className="select-filter">
              <option value="Processing">Đang xử lý</option>
              <option value="Paid">Đã thanh toán</option>
              <option value="Shipped">Đã giao vận</option>
              <option value="Delivered">Đã giao</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>
        ))}
      </div>

      <div className="admin-table">
        <h2>Người dùng</h2>
        {users.length === 0 ? <p>Chưa có tài khoản khách hàng.</p> : users.map((user) => (
          <div className="admin-row simple" key={user._id}>
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>{user.phone || 'Chưa có SĐT'} - {user.isAdmin ? 'Admin' : 'Khách hàng'}</span>
            <button className="outline-button" onClick={() => startEditUser(user)}>Sửa</button>
          </div>
        ))}
      </div>

      {editingUserId && (
        <form className="admin-form" onSubmit={handleUserSubmit}>
          <h2>Quản lý tài khoản & mật khẩu</h2>
          <input value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })} required placeholder="Tên" />
          <input value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} required placeholder="Email/username" />
          <input value={userForm.phone} onChange={(event) => setUserForm({ ...userForm, phone: event.target.value })} placeholder="Số điện thoại" />
          <input value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} placeholder="Mật khẩu mới (bỏ trống nếu không đổi)" />
          <label className="checkbox-row">
            <input type="checkbox" checked={userForm.isAdmin} onChange={(event) => setUserForm({ ...userForm, isAdmin: event.target.checked })} />
            Quyền admin
          </label>
          <button className="btn-premium" type="submit">Lưu tài khoản</button>
          <button className="outline-button" type="button" onClick={() => setEditingUserId('')}>Hủy</button>
        </form>
      )}

      <div className="admin-table">
        <h2>Liên hệ khách hàng</h2>
        {contacts.length === 0 ? <p>Chưa có lời nhắn liên hệ.</p> : contacts.map((contact) => (
          <div className="admin-row simple" key={contact._id}>
            <span>{contact.name}</span>
            <span>{contact.email}</span>
            <span>{contact.message}</span>
          </div>
        ))}
      </div>

      <div className="admin-table">
        <h2>Newsletter</h2>
        {subscribers.length === 0 ? <p>Chưa có email đăng ký nhận tin.</p> : subscribers.map((subscriber) => (
          <div className="admin-row simple" key={subscriber._id}>
            <span>{subscriber.email}</span>
            <span>{subscriber.source}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboard;
