export const fallbackProducts = [
  { id: 1, name: 'Ấm Áp (Cozy)', price: 320000, scent: 'Woody', size: 'Medium', category: 'Signature', notes: 'Đàn hương, hổ phách, vani', image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d5dfd0?q=80&w=1472&auto=format&fit=crop', description: 'Hương gỗ ấm áp, phù hợp phòng khách và buổi tối thư giãn.' },
  { id: 2, name: 'Sớm Mai (Daylight)', price: 350000, scent: 'Fresh', size: 'Large', category: 'Signature', notes: 'Cam bergamot, trà xanh, nhài', image: 'https://images.unsplash.com/photo-1596433809252-260c2745dfdd?q=80&w=1471&auto=format&fit=crop', description: 'Hương sáng, sạch và nhẹ nhàng cho góc làm việc.' },
  { id: 3, name: 'Rừng Khuya (Night Scent)', price: 380000, scent: 'Woody', size: 'Large', category: 'Signature', notes: 'Thông, tuyết tùng, xạ hương', image: 'https://images.unsplash.com/photo-1620023617300-610b2eeed598?q=80&w=1472&auto=format&fit=crop', description: 'Tầng hương trầm, yên tĩnh như khu rừng sau cơn mưa.' },
  { id: 4, name: 'Oải Hương (Lavender Dream)', price: 290000, scent: 'Floral', size: 'Small', category: 'Relax', notes: 'Oải hương, bạch đàn', image: 'https://images.unsplash.com/photo-1602873145311-bf43f628299a?q=80&w=1470&auto=format&fit=crop', description: 'Mùi thư giãn cho phòng ngủ, đọc sách và thiền nhẹ.' },
  { id: 5, name: 'Hương Chanh (Lemonade)', price: 260000, scent: 'Citrus', size: 'Small', category: 'Fresh', notes: 'Chanh vàng, bạc hà, vetiver', image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=1470&auto=format&fit=crop', description: 'Citrus tươi mới cho căn bếp và ban công sáng nắng.' },
  { id: 6, name: 'Mùa Thu (Autumn)', price: 315000, scent: 'Spice', size: 'Medium', category: 'Cozy', notes: 'Quế, tuyết tùng, mật ong', image: 'https://images.unsplash.com/photo-1608173169720-d62194f1ff34?q=80&w=1460&auto=format&fit=crop', description: 'Hương quế mật ong ấm cúng cho những tối ở nhà.' },
];

export const fallbackPosts = [
  {
    _id: 'guide-burn-candle',
    title: 'Cách đốt nến thơm lần đầu để mặt sáp tan đều',
    slug: 'cach-dot-nen-thom-lan-dau',
    excerpt: 'Một vài thao tác nhỏ giúp nến thơm bền mùi, cháy đẹp và ít bị lõm tim.',
    content: 'Lần đốt đầu tiên nên kéo dài 2-3 giờ để toàn bộ bề mặt sáp tan đều. Luôn cắt bấc còn khoảng 5mm trước mỗi lần đốt.',
    category: 'Hướng dẫn',
    coverImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1470&auto=format&fit=crop'
  },
  {
    _id: 'scent-room-guide',
    title: 'Chọn mùi hương theo từng không gian sống',
    slug: 'chon-mui-huong-theo-khong-gian',
    excerpt: 'Gợi ý mùi floral, woody, citrus cho phòng ngủ, phòng khách và góc làm việc.',
    content: 'Phòng ngủ hợp lavender và eucalyptus, phòng khách hợp woody/amber, góc làm việc hợp citrus hoặc green tea.',
    category: 'Cảm hứng',
    coverImage: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?q=80&w=1470&auto=format&fit=crop'
  },
  {
    _id: 'soy-wax',
    title: 'Vì sao An Hy chọn sáp đậu nành?',
    slug: 'vi-sao-chon-sap-dau-nanh',
    excerpt: 'Sáp đậu nành cháy chậm, ít khói và giữ hương tinh tế hơn cho không gian sống.',
    content: 'Sáp đậu nành là lựa chọn thân thiện hơn cho trải nghiệm nến thơm trong nhà, đặc biệt khi kết hợp với bấc cotton.',
    category: 'Chất liệu',
    coverImage: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?q=80&w=1470&auto=format&fit=crop'
  }
];

export const faqs = [
  { q: 'Nến An Hy có an toàn không?', a: 'Nến dùng sáp đậu nành, bấc cotton và tinh dầu chọn lọc. Bạn vẫn nên đặt nến xa rèm, giấy, trẻ nhỏ và thú cưng.' },
  { q: 'Một hũ nến cháy được bao lâu?', a: 'Tùy dung tích, hũ tiêu chuẩn thường cháy khoảng 40-50 giờ nếu cắt bấc và đốt đúng cách.' },
  { q: 'Có thể đổi trả không?', a: 'Nếu sản phẩm lỗi, vỡ khi vận chuyển hoặc giao sai mùi, bạn hãy liên hệ trong 48 giờ để được hỗ trợ.' }
];

export const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
