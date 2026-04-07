const nodemailer = require('nodemailer');

const storeEmail = process.env.ORDER_NOTIFY_EMAIL || 'anhy.2709.0820@gmail.com';

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
}).format(value || 0);

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const getPaymentLabel = (method) => {
  if (method === 'qr') return 'VietQR - chờ kiểm tra chuyển khoản';
  if (method === 'cod') return 'COD - thanh toán khi nhận hàng';
  return String(method || 'Chưa rõ').toUpperCase();
};

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const buildOrderHtml = (order) => {
  const orderCode = order._id.toString().slice(-6).toUpperCase();
  const address = order.shippingAddress || {};
  const paymentLabel = getPaymentLabel(order.paymentMethod);
  const itemsRows = order.items
    .map((item) => `
      <tr>
        <td style="padding: 14px 10px; border-bottom: 1px solid #f3d9d2; color: #5a332f; vertical-align: top;">
          <strong>${escapeHtml(item.name)}</strong>
          <div style="font-size: 12px; line-height: 1.4; color: #9a6a5f; margin-top: 4px;">Nến thơm An Hy Candle</div>
        </td>
        <td style="padding: 14px 8px; border-bottom: 1px solid #f3d9d2; text-align: center; color: #5a332f; vertical-align: top;">${item.qty}</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #f3d9d2; text-align: right; color: #5a332f; font-weight: 700; vertical-align: top;">${formatCurrency(item.price * item.qty)}</td>
      </tr>
    `)
    .join('');

  return `
    <!doctype html>
    <html lang="vi">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>An Hy Candle - Đơn hàng mới</title>
      </head>
      <body style="margin: 0; padding: 0; background: #fff1ec; font-family: Arial, Helvetica, sans-serif; color: #5a332f;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; background: #fff1ec; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 16px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 560px; background: #fffaf7; border: 1px solid #f1cec4; border-radius: 22px; overflow: hidden; border-collapse: separate;">
                <tr>
                  <td align="center" style="background: #ffd8d0; padding: 26px 18px;">
                    <div style="display: inline-block; padding: 7px 12px; border-radius: 999px; border: 1px solid rgba(90, 51, 47, 0.18); color: #7a4b42; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">New Order</div>
                    <h1 style="margin: 16px 0 8px; font-family: Georgia, 'Times New Roman', serif; font-size: 31px; line-height: 1.05; color: #5a332f;">An Hy Candle</h1>
                    <p style="margin: 0; color: #7a4b42; font-size: 14px; line-height: 1.5;">Có khách vừa hoàn tất đặt hàng trên website</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px;">
                    <div style="background: #fff0eb; border: 1px solid #f3d9d2; border-radius: 18px; padding: 16px; margin-bottom: 18px;">
                      <p style="margin: 0 0 7px; letter-spacing: 2px; text-transform: uppercase; font-size: 11px; color: #9a6a5f;">Mã đơn</p>
                      <h2 style="margin: 0; font-size: 24px; color: #5a332f;">#${orderCode}</h2>
                      <p style="margin: 10px 0 0; color: #7a4b42; font-size: 14px; line-height: 1.45;">${paymentLabel}</p>
                    </div>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
                      <tr style="background-color: #ffe2dc;">
                        <th style="text-align: left; padding: 12px 10px; color: #5a332f; font-size: 13px;">Sản phẩm</th>
                        <th style="text-align: center; padding: 12px 8px; color: #5a332f; font-size: 13px; width: 42px;">SL</th>
                        <th style="text-align: right; padding: 12px 10px; color: #5a332f; font-size: 13px; width: 112px;">Thành tiền</th>
                      </tr>
                      ${itemsRows}
                    </table>

                    <div style="background: #fffaf7; border: 1px solid #f3d9d2; border-radius: 18px; padding: 16px; text-align: right; margin-bottom: 18px;">
                      <p style="margin: 6px 0; font-size: 14px;">Tạm tính: <strong>${formatCurrency(order.subtotal)}</strong></p>
                      <p style="margin: 6px 0; font-size: 14px;">Phí vận chuyển: <strong>${formatCurrency(order.shippingFee)}</strong></p>
                      <p style="margin: 12px 0 0; font-size: 21px; line-height: 1.25; color: #5a332f;">Tổng cộng: <strong>${formatCurrency(order.totalPrice)}</strong></p>
                    </div>

                    <div style="background-color: #fff0eb; padding: 16px; border-radius: 18px; margin-bottom: 18px; word-break: break-word;">
                      <h3 style="margin: 0 0 12px; color: #5a332f; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; line-height: 1.12;">Thông tin khách hàng</h3>
                      <p style="margin: 7px 0; font-size: 14px; line-height: 1.45;"><strong>Họ tên:</strong> ${escapeHtml(address.fullName)}</p>
                      <p style="margin: 7px 0; font-size: 14px; line-height: 1.45;"><strong>Số điện thoại:</strong> ${escapeHtml(address.phone)}</p>
                      <p style="margin: 7px 0; font-size: 14px; line-height: 1.45;"><strong>Email:</strong> ${escapeHtml(address.email)}</p>
                      <p style="margin: 7px 0; font-size: 14px; line-height: 1.45;"><strong>Địa chỉ:</strong> ${escapeHtml(address.address)}, ${escapeHtml(address.district)}, ${escapeHtml(address.city)}</p>
                      <p style="margin: 14px 0 0; font-size: 14px; line-height: 1.5;">
                        <strong>Thanh toán:</strong>
                        <span style="display: inline-block; max-width: 100%; margin-top: 6px; background-color: #df8b63; color: white; padding: 7px 10px; border-radius: 12px; font-size: 13px; line-height: 1.35; white-space: normal;">${paymentLabel}</span>
                      </p>
                    </div>

                    ${order.paymentMethod === 'qr' ? `
                      <div style="border-left: 4px solid #df8b63; background: #fffaf7; padding: 14px; border-radius: 14px; margin-bottom: 18px; font-size: 14px; line-height: 1.5;">
                        <strong>Cần kiểm tra chuyển khoản:</strong>
                        <p style="margin: 8px 0 0;">Khách chọn VietQR. Hãy kiểm tra tài khoản ngân hàng theo nội dung chuyển khoản trước khi đổi trạng thái đơn sang “Đã thanh toán” hoặc “Đang giao”.</p>
                      </div>
                    ` : ''}

                    <div style="text-align: center; margin-top: 22px;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" style="display: inline-block; background: #df8b63; color: #ffffff; text-decoration: none; padding: 13px 20px; border-radius: 999px; font-weight: 700; font-size: 14px;">Mở Admin Dashboard</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #6b4038; padding: 16px; text-align: center; font-size: 12px; color: #fffaf7; line-height: 1.45;">
                    Email tự động từ website An Hy Candle - giữ lại để đối chiếu đơn hàng.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

const buildOrderText = (order) => {
  const address = order.shippingAddress || {};
  const lines = [
    `An Hy Candle - Đơn hàng mới #${order._id.toString().slice(-6).toUpperCase()}`,
    `Khách: ${address.fullName}`,
    `SĐT: ${address.phone}`,
    `Email: ${address.email}`,
    `Địa chỉ: ${address.address}, ${address.district}, ${address.city}`,
    `Thanh toán: ${getPaymentLabel(order.paymentMethod)}`,
    `Tổng cộng: ${formatCurrency(order.totalPrice)}`,
    '',
    'Sản phẩm:',
    ...order.items.map((item) => `- ${item.name} x${item.qty}: ${formatCurrency(item.price * item.qty)}`)
  ];

  return lines.join('\n');
};

const sendOrderNotification = async (order) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('Email notification skipped: EMAIL_USER/EMAIL_PASS is not configured.');
    return { skipped: true };
  }

  try {
    await transporter.sendMail({
      from: `"An Hy Candle Store" <${process.env.EMAIL_USER}>`,
      to: storeEmail,
      subject: `[ĐƠN MỚI] ${order.shippingAddress.fullName} - ${formatCurrency(order.totalPrice)}`,
      text: buildOrderText(order),
      html: buildOrderHtml(order),
      encoding: 'utf-8',
      textEncoding: 'base64'
    });
    console.log(`Email notification sent to ${storeEmail}`);
    return { skipped: false };
  } catch (error) {
    console.error('Nodemailer error:', error);
    throw error;
  }
};

module.exports = { sendOrderNotification, buildOrderHtml };
