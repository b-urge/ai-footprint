import { useEffect, useRef, useState } from "react";

export function useAnimatedValue(
  target: number,
  speed = 0.08,
  precision = 2
): number {
  const [display, setDisplay] = useState(target);
  const current = useRef(target);
  const raf = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      current.current += (target - current.current) * speed;
      if (Math.abs(target - current.current) < 0.001) {
        current.current = target;
      }
      setDisplay(Number(current.current.toFixed(precision)));
      if (current.current !== target) {
        raf.current = requestAnimationFrame(animate);
      }
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, speed, precision]);

  return display;
}
