import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Fullscreen intro image that zooms on initial scroll and reveals the site
// - Pinned section, scrubs scale 1 -> 1.6 while fading out overlay
// - Disabled on small screens and when prefers-reduced-motion
const IntroZoomOverlay = ({ src, alt = 'Intro' }) => {
  const wrapRef = useRef(null);
  const bgRef = useRef(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(!reduce);
    if (!reduce) {
      document.body.classList.add('intro-active');
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const bg = bgRef.current;

    const ctx = gsap.context(() => {
      // Use a single timeline with pin + scrub so both zoom and fade are synced
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          markers: false,
          onLeave: () => {
            document.body.classList.remove('intro-active');
          },
        },
      });

      // Animate background size to create a true zoom without transparency gaps
      tl.fromTo(
        bg,
        { backgroundSize: '100% 100%' },
        { backgroundSize: '800% 800%', ease: 'none' },
        0
      );
    }, wrap);

    return () => ctx.revert();
  }, [enabled]);

  // No image load listener needed for background div; still refresh once
  useEffect(() => {
    if (!enabled) return;
    try { ScrollTrigger.refresh(); } catch (_) {}
    return () => {
      document.body.classList.remove('intro-active');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <section ref={wrapRef} className="intro-zoom-wrap" aria-label="Intro zoom image">
      <div
        ref={bgRef}
        className="intro-zoom-bg"
        role="img"
        aria-label={alt}
        style={{ backgroundImage: `url(${src})` }}
      />
    </section>
  );
};

export default IntroZoomOverlay;


