import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  pageKey: string;
  children: ReactNode;
}

const variants = {
  initial: {
    opacity: 0,
    y: 16,
    filter: 'blur(6px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as number[],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(6px)',
    transition: {
      duration: 0.25,
      ease: [0.64, 0, 0.78, 0] as number[],
    },
  },
};

export function PageTransition({ pageKey, children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
