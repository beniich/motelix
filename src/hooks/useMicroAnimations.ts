import { useEffect, useState } from 'react';

// ─── Count-up hook ─────────────────────────────────────────────────────────────
export function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

// ─── Pulse on value change ─────────────────────────────────────────────────────
export function usePulseOnChange(value: unknown, duration = 600) {
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    setPulsing(true);
    const t = setTimeout(() => setPulsing(false), duration);
    return () => clearTimeout(t);
  }, [value, duration]);

  return pulsing;
}

// ─── Shake on trigger ─────────────────────────────────────────────────────────
export function useShake(trigger: unknown) {
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    setShaking(true);
    const t = setTimeout(() => setShaking(false), 500);
    return () => clearTimeout(t);
  }, [trigger]);

  return shaking;
}

// ─── Stagger entrance ─────────────────────────────────────────────────────────
export function useStagger(count: number, delay = 60) {
  const [visible, setVisible] = useState<boolean[]>(new Array(count).fill(false));

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < count; i++) {
      timeouts.push(
        setTimeout(() => {
          setVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * delay)
      );
    }
    return () => timeouts.forEach(clearTimeout);
  }, [count, delay]);

  return visible;
}
