import React, { useEffect, useRef, useState } from 'react';

// A unique, lightweight mouse-reactive canvas field with parallax dots
// - Uses requestAnimationFrame loop
// - Disables on mobile and respects prefers-reduced-motion
const MouseParallax = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Disable on small screens and respect reduced motion
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 768px)').matches;
    setEnabled(!(reduce || small));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    };

    // Dots with depth for parallax
    const DOT_COUNT = Math.round(Math.min(140, Math.max(60, width * height / 40000)));
    let dots = [];
    function initDots() {
      dots = new Array(DOT_COUNT).fill(0).map(() => {
        const depth = Math.random() * 1.2 + 0.3; // 0.3 - 1.5 depth
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.6 + 0.6,
          depth,
          vx: (Math.random() - 0.5) * 0.15 * depth,
          vy: (Math.random() - 0.5) * 0.15 * depth,
        };
      });
    }
    initDots();

    const handleMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const { x: mx, y: my } = mouseRef.current;

      // Draw connections softly around cursor
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        // Parallax pull towards mouse
        const dx = (mx - d.x) * 0.002 * d.depth;
        const dy = (my - d.y) * 0.002 * d.depth;
        d.vx += dx; d.vy += dy;
        d.vx *= 0.98; d.vy *= 0.98;
        d.x += d.vx; d.y += d.vy;

        // Wrap around edges
        if (d.x < -10) d.x = width + 10; if (d.x > width + 10) d.x = -10;
        if (d.y < -10) d.y = height + 10; if (d.y > height + 10) d.y = -10;

        // Dot
        ctx.beginPath();
        const dist = Math.hypot(mx - d.x, my - d.y);
        const alpha = Math.max(0, 0.45 - dist / 900);
        ctx.fillStyle = `rgba(250, 204, 21, ${alpha})`; // amber glow
        ctx.arc(d.x, d.y, d.r * (1 + d.depth * 0.2), 0, Math.PI * 2);
        ctx.fill();
      }

      // Lines between close dots near cursor
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dmx = (a.x + b.x) / 2 - mx;
          const dmy = (a.y + b.y) / 2 - my;
          const centerDist = Math.hypot(dmx, dmy);
          if (centerDist < 180) {
            const dd = Math.hypot(a.x - b.x, a.y - b.y);
            if (dd < 90) {
              const lineAlpha = Math.max(0, 0.3 - dd / 300) * Math.max(0, 1 - centerDist / 180);
              ctx.strokeStyle = `rgba(250, 204, 21, ${lineAlpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('resize', onResize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default MouseParallax;


