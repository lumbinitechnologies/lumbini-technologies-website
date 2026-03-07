import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QUERIES = {
  reduceMotion: "(prefers-reduced-motion: reduce)",
  portrait: "(orientation: portrait)",
  small: "(max-width: 768px)",
};

const shouldEnableEffect = () =>
  !Object.values(QUERIES).some((q) => window.matchMedia(q).matches);

const IntroZoomOverlay = ({ src, alt = "Intro" }) => {
  const wrapRef = useRef(null);
  const bgRef = useRef(null);
  const stRef = useRef(null);

  const [enabled, setEnabled] = useState("pending");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const check = () => setEnabled(shouldEnableEffect());
    check();
    const mqls = Object.values(QUERIES).map((q) => {
      const mql = window.matchMedia(q);
      mql.addEventListener("change", check);
      return mql;
    });
    return () =>
      mqls.forEach((mql) => mql.removeEventListener("change", check));
  }, []);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setImgLoaded(true);
    img.onerror = () => console.warn("[IntroZoomOverlay] Failed to load:", src);
    img.src = src;
  }, [src]);

  useEffect(() => {
    if (enabled !== true || !imgLoaded) return;
    const id = setTimeout(() => setShowScrollBtn(true), 800);
    return () => clearTimeout(id);
  }, [enabled, imgLoaded]);

  useEffect(() => {
    if (enabled !== true || !imgLoaded) return;

    const wrap = wrapRef.current;
    const bg = bgRef.current;
    if (!wrap || !bg) return;

    document.body.classList.add("intro-active");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "+=400%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => document.body.classList.add("intro-active"),
          onLeave: () => {
            document.body.classList.remove("intro-active");
            setShowScrollBtn(false);
          },
          onEnterBack: () => {
            document.body.classList.add("intro-active");
            setShowScrollBtn(true);
          },
          onLeaveBack: () => document.body.classList.remove("intro-active"),
          onRefresh: (self) => {
            stRef.current = self;
          },
        },
      });

      tl.fromTo(
        bg,
        { scale: 1, transformOrigin: "50% 50%" },
        { scale: 5.5, ease: "none" },
        0,
      );
    });

    const id = setTimeout(() => {
      ScrollTrigger.refresh();
      const all = ScrollTrigger.getAll();
      if (all.length > 0) stRef.current = all[0];
    }, 50);

    return () => {
      clearTimeout(id);
      ctx.revert();
      stRef.current = null;
      document.body.classList.remove("intro-active");
    };
  }, [enabled, imgLoaded]);

  // ── Scroll past the intro pin + extra offset to land on Hero ─────────────
  const handleScrollToHome = () => {
    // Increase the multiplier (currently 1.5) if you need to go further down
    const EXTRA = window.innerHeight * 1.2;

    if (stRef.current) {
      window.scrollTo({ top: stRef.current.end + EXTRA, behavior: "smooth" });
      return;
    }

    const wrap = wrapRef.current;
    if (!wrap) return;
    const pinSpacer =
      wrap.closest("[data-scrolltrigger-pin-spacer]") || wrap.parentElement;
    if (pinSpacer) {
      window.scrollTo({
        top: pinSpacer.offsetTop + pinSpacer.offsetHeight + EXTRA,
        behavior: "smooth",
      });
      return;
    }

    window.scrollTo({
      top: wrap.offsetTop + window.innerHeight * 6,
      behavior: "smooth",
    });
  };

  if (enabled === "pending" || enabled === false || !src) return null;

  return (
    <>
      <style>{`
        @keyframes introFadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes introPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(250,204,21,0.5); }
          50%       { box-shadow: 0 0 0 10px rgba(250,204,21,0); }
        }
        @keyframes introArrowBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(3px); }
        }
        .intro-scroll-btn {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          padding: 0.6rem 1.6rem;
          background: #facc15;
          color: #000;
          border: none;
          border-radius: 2rem;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: introFadeUp 0.5s ease forwards, introPulse 2s ease-in-out 1s infinite;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .intro-scroll-btn:hover {
          background: #fde047;
          transform: translateX(-50%) translateY(-3px);
          box-shadow: 0 8px 28px rgba(250,204,21,0.5);
        }
        .intro-scroll-btn:active {
          transform: translateX(-50%) translateY(0);
          background: #eab308;
        }
        .intro-scroll-btn .intro-arrow {
          animation: introArrowBounce 1.2s ease-in-out infinite;
        }
      `}</style>

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
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
          }}
        />

        {showScrollBtn && (
          <button
            onClick={handleScrollToHome}
            className="intro-scroll-btn"
            aria-label="Skip intro and explore"
          >
            Explore
            <svg
              className="intro-arrow"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7 2v10M3 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </section>
    </>
  );
};

export default IntroZoomOverlay;
