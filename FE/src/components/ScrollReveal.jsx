import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  return (
    <MotionDiv
      className={className}
      initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionDiv>
  );
};

export default ScrollReveal;
