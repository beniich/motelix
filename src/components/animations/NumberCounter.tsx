import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

interface NumberCounterProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}

export function NumberCounter({
  value,
  duration = 1,
  format = (n) => Math.round(n).toString(),
}: NumberCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => format(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration });
    return controls.stop;
  }, [value, duration, count]);

  return <motion.span>{rounded}</motion.span>;
}
