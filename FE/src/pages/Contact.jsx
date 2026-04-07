import { useState } from 'react';
import zaloLogo from '../../logozalo.png';

const Contact = () => {
  const [message, setMessage] = useState('');

  const submitContact = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage('An Hy đã nhận lời nhắn và sẽ phản hồi sớm.');
      event.currentTarget.reset();
    } catch (error) {
      setMessage(`Chưa gửi được form: ${error.message}`);
    }
  };

  return (
    <section id="contact" className="content-section contact-layout">
      <div>
        <p className="eyebrow">CONTACT</p>
        <h1>Liên hệ An Hy Candle</h1>
        <p>Gửi yêu cầu tư vấn mùi hương, đơn hàng quà tặng hoặc phản hồi sản phẩm. Nếu cần phản hồi nhanh, bạn có thể nhắn Zalo trực tiếp cho An Hy.</p>
        <div className="zalo-contact-card">
          <img src={zaloLogo} alt="Zalo An Hy Candle" />
          <div>
            <p className="eyebrow">ZALO SUPPORT</p>
            <h2>0946081027</h2>
            <p>Tư vấn chọn mùi, xác nhận chuyển khoản và hỗ trợ đơn hàng nhanh.</p>
            <a className="btn-premium" href="https://zalo.me/0946081027" target="_blank" rel="noreferrer">Nhắn Zalo ngay</a>
          </div>
        </div>
        <div className="map-card">
          <p className="eyebrow">VỊ TRÍ</p>
          <h3>Phường Vĩnh Quang, TP. Rạch Giá, Kiên Giang</h3>
          <iframe
            title="An Hy Candle - Phường Vĩnh Quang, Rạch Giá, Kiên Giang"
            src="https://www.google.com/maps?q=Ph%C6%B0%E1%BB%9Dng%20V%C4%A9nh%20Quang%2C%20Th%C3%A0nh%20ph%E1%BB%91%20R%E1%BA%A1ch%20Gi%C3%A1%2C%20Ki%C3%AAn%20Giang&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      <div>
        <form className="form-card" onSubmit={submitContact}>
          <input name="name" required placeholder="Họ và tên" />
          <input name="email" required type="email" placeholder="Email" />
          <input name="phone" placeholder="Số điện thoại" />
          <textarea name="message" required placeholder="Bạn cần An Hy hỗ trợ gì?" rows="5" />
          <button className="btn-premium" type="submit">Gửi liên hệ</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </section>
  );
};

export default Contact;
