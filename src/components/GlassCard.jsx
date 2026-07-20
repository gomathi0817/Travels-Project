import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 shadow-sm cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
};
export default GlassCard;
