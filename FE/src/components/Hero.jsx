import heroImg from '../assets/hero-banner.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;
const MotionP = motion.p;
const MotionH1 = motion.h1;
const MotionImg = motion.img;

const Hero = () => {
  return (
    <section className="hero-scene" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5%',
      background: 'transparent',
      height: '85vh',
      minHeight: '600px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <MotionDiv
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ flex: 1, paddingRight: '50px', zIndex: 2 }}
      >
        <MotionP
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ letterSpacing: '4px', fontSize: '0.9rem', marginBottom: '15px' }}
        >
          — HANDCRAFTED WITH LOVE —
        </MotionP>
        
        <MotionH1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ fontSize: '5rem', lineHeight: '1.05', marginBottom: '25px', color: 'var(--color-accent)' }}
        >
          Thắp Sáng <br /> <span style={{ fontStyle: 'italic', fontWeight: '400' }}>Thế Giới</span> <br /> Của Bạn
        </MotionH1>
        
        <MotionP
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '500px' }}
        >
          Nến thơm từ sáp đậu nành thiên nhiên, mang đến hơi ấm và sự bình yên vô tận cho tâm hồn bạn.
        </MotionP>
        
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{ display: 'flex', gap: '20px' }}
        >
          <Link to="/products" className="btn-premium" style={{ textDecoration: 'none', padding: '15px 35px' }}>Xem Bộ Sưu Tập</Link>
          <a href="#story" className="outline-button" style={{ padding: '15px 35px', textDecoration: 'none' }}>Câu Chuyện</a>
        </MotionDiv>
      </MotionDiv>
      
      <MotionDiv
        initial={{ opacity: 0, scale: 1.1, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ flex: 1.2, position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
      >
        <div style={{ 
          width: '100%', 
          height: '80%', 
          borderRadius: '200px 200px 40px 40px', 
          overflow: 'hidden',
          boxShadow: 'var(--soft-shadow)',
          position: 'relative'
        }}>
          <MotionImg
            src={heroImg} 
            alt="An Hy Candle Hero" 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover',
            }} 
          />
        </div>
        
        <MotionDiv
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 100 }}
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '0%',
            background: 'var(--color-secondary)',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10px',
            boxShadow: 'var(--soft-shadow)',
            zIndex: 3
          }}
        >
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>100%</span>
          <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>SÁP ĐẬU NÀNH</span>
        </MotionDiv>
      </MotionDiv>
    </section>
  );
};

export default Hero;
