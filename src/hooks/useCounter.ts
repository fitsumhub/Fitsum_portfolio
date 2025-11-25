import { useEffect, useState } from 'react';

interface UseCounterOptions {
  duration?: number;
  startOnMount?: boolean;
}

export const useCounter = (
  target: number,
  options: UseCounterOptions = {}
) => {
  const { duration = 2000, startOnMount = false } = options;
  const [count, setCount] = useState(startOnMount ? 0 : target);
  const [isAnimating, setIsAnimating] = useState(false);

  const animate = () => {
    setIsAnimating(true);
    const start = 0;
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(start + (target - start) * easeOut);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(updateCount);
  };

  useEffect(() => {
    if (startOnMount) {
      animate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, startOnMount]);

  return { count, animate, isAnimating };
};

