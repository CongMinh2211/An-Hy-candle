import zaloLogo from '../../logozalo.png';

const FloatingZalo = () => {
  return (
    <a
      className="floating-zalo"
      href="https://zalo.me/0946081027"
      target="_blank"
      rel="noreferrer"
      aria-label="Liên hệ An Hy Candle qua Zalo"
    >
      <img src={zaloLogo} alt="Zalo" />
    </a>
  );
};

export default FloatingZalo;
