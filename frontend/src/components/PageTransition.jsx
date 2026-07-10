import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -15 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.25,
};

const PageTransition = () => {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {element && (
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {element}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;
