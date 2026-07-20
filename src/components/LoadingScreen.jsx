import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white"
        >
          {/* Logo container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Elegant Luxury Logo Icon */}
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-500/30 bg-gradient-to-tr from-slate-950 to-slate-900 shadow-[0_0_50px_rgba(245,158,11,0.25)]">
              {/* Spinner ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-1 rounded-full border-t-2 border-r-2 border-amber-500"
              />
              <span className="text-3xl font-bold tracking-widest text-amber-500">D</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl font-bold tracking-widest text-white uppercase sm:text-3xl">
              DHEERAN
            </h1>
            <p className="mt-1 text-xs tracking-[0.3em] text-amber-500 uppercase">
              Tours & Travels
            </p>
          </motion.div>

          {/* Subtitle / status */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-12 text-sm tracking-widest text-slate-400"
          >
            Experiencing Premium Journeys...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default LoadingScreen;
