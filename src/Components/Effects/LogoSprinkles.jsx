import React, { useEffect, useRef, useState } from 'react';

// Professional subtle sparkles emitted from logo area on hover/idle
const LogoSprinkles = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(!reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = 380);
    let height = (canvas.height = 150);

    // Position canvas relative to the logo via CSS
    const sparkleColor = 'rgba(255, 255, 255, 0.95)';
    const accentColor = 'rgba(250, 204, 21, 0.95)';

    const particles = [];
    function spawn(x, y) {
      const angle = Math.random() * Math.PI - Math.PI / 2; // upward cone
      const speed = Math.random() * 0.7 + 0.3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3,
        life: 1,
        r: Math.random() * 1.6 + 0.6,
        color: Math.random() < 0.7 ? sparkleColor : accentColor,
      });
    }

    // Periodic emission from left/middle/right of logo area
    let t = 0;
    const emit = () => {
      t += 1;
      const lanes = [width * 0.2, width * 0.5, width * 0.8];
      lanes.forEach((lx) => {
        if (Math.random() < 0.8) spawn(lx, height - 22);
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (t % 3 === 0) emit();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.004; // slight gravity
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.008;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const a = Math.max(0, Math.min(1, p.life));
        ctx.beginPath();
        ctx.fillStyle = p.color.replace('0.9', (0.15 + 0.6 * a).toFixed(2));
        ctx.arc(p.x, p.y, p.r * (0.6 + 0.6 * a), 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="logo-sprinkles"
      width={320}
      height={120}
      aria-hidden
    />
  );
};

export default LogoSprinkles;


