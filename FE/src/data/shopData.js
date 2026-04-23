import productImage1 from '../img/1.jpg';
import productImage2 from '../img/2.jpg';
import productImage3 from '../img/3.jpg';
import productImage4 from '../img/4.jpg';
import productImage5 from '../img/5.jpg';
import productImage6 from '../img/6.jpg';
import productImage7 from '../img/7.jpg';
import productImage8 from '../img/8.jpg';
import productImage9 from '../img/9.jpg';
import productImage10 from '../img/10.jpg';

export const fallbackProducts = [
  { id: 1, name: '3 loại nến ly Trái mới', price: 200000, scent: 'Fresh', size: 'Medium', category: 'Scent Notes', notes: 'Lemon, táo xanh, trái cây', image: productImage1, description: 'Bộ sưu tập trái cây tươi mới, sáng phòng và hợp không gian trẻ trung.' },
  { id: 2, name: 'Nến Ly Hoa Lan Vanilla', price: 200000, scent: 'Floral', size: 'Medium', category: 'Scent Notes', notes: 'Hoa lan, vanilla, xạ hương', image: productImage2, description: 'Mùi hoa lan mềm, ngọt dịu với nền vanilla dễ chịu cho phòng ngủ và bàn trang điểm.' },
  { id: 3, name: 'Nến Ly Thảo Mộc', price: 200000, scent: 'Woody', size: 'Medium', category: 'Scent Notes', notes: 'Thảo mộc, gỗ khô, lá xanh', image: productImage3, description: 'Tầng hương thảo mộc khô và gỗ nhẹ, hợp góc đọc sách và làm việc yên tĩnh.' },
  { id: 4, name: 'Tealight Mix Hương', price: 100000, scent: 'Fresh', size: 'Standard', category: 'Gift Box', notes: 'Vanilla, caramel, dâu, oải hương', image: productImage4, description: 'Hộp 8 viên mix nhiều mùi để thử nhanh nhiều tầng hương trong cùng một set.' },
  { id: 5, name: 'Nến Tealight (Không Mùi)', price: 110000, scent: 'Fresh', size: 'Standard', category: 'Tealight', notes: 'Không mùi', image: productImage5, description: 'Hộp 25 viên tealight không mùi, phù hợp đèn đốt tinh dầu và setup bàn tiệc.' },
  { id: 6, name: 'Caramel', price: 200000, scent: 'Spice', size: 'Medium', category: 'Dessert', notes: 'Caramel, bơ ngậy, bánh nướng', image: productImage6, description: 'Mùi caramel ngọt ấm, hợp buổi tối và không gian bếp hoặc quán nhỏ.' },
  { id: 7, name: 'Blackberry Juice', price: 200000, scent: 'Fresh', size: 'Medium', category: 'Fruit', notes: 'Quả mọng, nho đen, đường nâu', image: productImage7, description: 'Mùi quả mọng đậm, có độ ngọt nhẹ và cảm giác trẻ trung, dễ dùng hằng ngày.' },
  { id: 8, name: 'Popcorn', price: 220000, scent: 'Spice', size: 'Medium', category: 'Dessert', notes: 'Bắp rang, caramel, kem béo', image: productImage8, description: 'Mùi bắp rang bơ rõ nét, thiên ngọt và rất hợp set quà hoặc decor vui mắt.' },
  { id: 9, name: 'Layer Cake', price: 200000, scent: 'Floral', size: 'Medium', category: 'Dessert', notes: 'Bánh kem, berry, vanilla', image: productImage9, description: 'Mùi bánh ngọt mềm với lớp berry nhẹ, phù hợp góc chụp ảnh và bàn học.' },
  { id: 10, name: 'Bông Cúc', price: 15000, scent: 'Floral', size: 'Small', category: 'Phụ kiện', notes: 'Bông cúc', image: productImage10, description: 'Bông cúc trang trí lẻ, giá 15.000đ cho 1 bông.' },
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
