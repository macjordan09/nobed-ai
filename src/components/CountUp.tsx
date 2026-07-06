"use client";

import { useEffect, useRef, useState } from "react";

// Counts up to `value` when scrolled into view.
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1400,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done.current) {
          done.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    // Fallback: if it never scrolls into view (e.g. static capture), snap to value.
    const fallback = setTimeout(() => {
      if (!done.current) {
        done.current = true;
        setN(value);
      }
    }, 2500);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}
