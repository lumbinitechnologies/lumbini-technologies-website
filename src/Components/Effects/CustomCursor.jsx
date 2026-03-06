import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(true);
  const x = useSpring(0, { stiffness: 400, damping: 40, mass: 0.3 });
  const y = useSpring(0, { stiffness: 400, damping: 40, mass: 0.3 });
  const xr = useSpring(0, { stiffness: 200, damping: 30 });
  const yr = useSpring(0, { stiffness: 200, damping: 30 });
  const rafRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const small = window.matchMedia("(max-width: 768px)").matches;
    setEnabled(!(reduce || small));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
        xr.set(e.clientX);
        yr.set(e.clientY);
      });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, x, y, xr, yr]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        *, *::before, *::after {
          cursor: none !important;
        }
        .cursor-dot,
        .cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 99999;
          border-radius: 50%;
          will-change: transform;
        }
        .cursor-dot {
          width: 8px;
          height: 8px;
          background: #ffffff;
        }
        .cursor-ring {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          background: transparent;
        }
      `}</style>

      <motion.div
        aria-hidden
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="cursor-dot"
      />
      <motion.div
        aria-hidden
        style={{
          x: xr,
          y: yr,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="cursor-ring"
      />
    </>
  );
};

export default CustomCursor;
