import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const QUERIES = {
  reduceMotion: '(prefers-reduced-motion: reduce)',
  portrait: '(orientation: portrait)',
  small: '(max-width: 768px)',
};

const shouldEnableEffect = () =>
  !Object.values(QUERIES).some(q => window.matchMedia(q).matches);

const IntroZoomOverlay = ({ src, alt = 'Intro' }) => {
  const wrapRef = useRef(null);
  const bgRef = useRef(null);

  // ✅ Three states: 'pending' (not yet checked), true, false
  const [enabled, setEnabled] = useState('pending');
  const [imgLoaded, setImgLoaded] = useState(false);

  // Evaluate media queries — with live listeners for orientation change
  useEffect(() => {
    const check = () => setEnabled(shouldEnableEffect());
    check(); // synchronous first check

    const mqls = Object.values(QUERIES).map(q => {
      const mql = window.matchMedia(q);
      mql.addEventListener('change', check);
      return mql;
    });

    return () => mqls.forEach(mql => mql.removeEventListener('change', check));
  }, []);

  // Preload image
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setImgLoaded(true);
    img.onerror = () => console.warn('[IntroZoomOverlay] Failed to load:', src);
    img.src = src;
  }, [src]);

  // GSAP — only when confirmed enabled AND image ready
  useEffect(() => {
    if (enabled !== true || !imgLoaded) return;

    const wrap = wrapRef.current;
    const bg = bgRef.current;
    if (!wrap || !bg) return;

    document.body.classList.add('intro-active');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => document.body.classList.add('intro-active'),
          onLeave: () => document.body.classList.remove('intro-active'),
          onEnterBack: () => document.body.classList.add('intro-active'),
          onLeaveBack: () => document.body.classList.remove('intro-active'),
        },
      });

      tl.fromTo(
        bg,
        { scale: 1, transformOrigin: '50% 50%' },
        { scale: 2.5, ease: 'none' },
        0
      );
    });

    const id = setTimeout(() => ScrollTrigger.refresh(), 50);

    return () => {
      clearTimeout(id);
      ctx.revert();
      document.body.classList.remove('intro-active');
    };
  }, [enabled, imgLoaded]);

  // ✅ Render nothing until media query check has resolved
  // This prevents the background div from painting before we know if it should show
  if (enabled === 'pending' || enabled === false || !src) return null;

  return (
    <section
      ref={wrapRef}
      className="intro-zoom-wrap"
      aria-label="Intro zoom image"
    >
      <div
        ref={bgRef}
        className="intro-zoom-bg"
        role="img"
        aria-label={alt}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform',
        }}
      />
    </section>
  );
};

export default IntroZoomOverlay;