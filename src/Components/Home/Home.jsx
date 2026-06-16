import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import IntroZoomOverlay from "../Effects/IntroZoomOverlay";
import heroImage from "../../assets/front-bg.png";

const styles = `
  .home-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
    padding-top: 110px;
  }

  .scrolling-text-banner {
    width: 100%;
    height: clamp(22px, 3.5vw, 40px);
    background: linear-gradient(90deg, #1a1a1a, #2a2a2a, #1a1a1a);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    display: flex;
    align-items: center;
    white-space: nowrap;
    position: relative;
    top: auto;
    left: 0;
    box-sizing: border-box;
    padding-left: 10px;
    justify-content: space-between;
    padding-right: 10px;
  }

  .banner-text-wrapper {
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex-grow: 1;
    overflow: hidden;
  }

  .banner-text {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .banner-text-segment {
    color: #fff;
    font-size: clamp(0.55rem, 1.2vw, 1rem);
    font-weight: 500;
    padding: 0 clamp(3px, 0.8vw, 10px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    display: inline-block;
    white-space: nowrap;
  }

  .apply-now-btn-inline {
    background: yellow;
    color: black;
    border: none;
    padding: clamp(3px, 0.6vw, 6px) clamp(8px, 1.2vw, 16px);
    font-size: clamp(0.55rem, 1.1vw, 0.85rem);
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
    transition: all 0.2s ease;
    border-radius: 4px;
    min-width: clamp(65px, 8vw, 90px);
    white-space: nowrap;
    pointer-events: auto;
    flex-shrink: 0;
    margin-left: clamp(6px, 1vw, 15px);
  }

  .apply-now-btn-inline:hover {
    background: yellow;
    color: black;
    box-shadow: 0 6px 20px rgba(255, 245, 107, 0.4);
    transform: translateY(-1px);
  }

  .apply-now-btn-inline:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(255, 245, 107, 0.4);
  }

  .apply-now-btn-inline:focus {
    outline: 2px solid yellow;
    outline-offset: 2px;
  }

  /* ---------- Hero ---------- */

  .Hero {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    min-height: calc(100vh - 110px);
    color: white;
    text-align: center;
    padding-top: clamp(4rem, 8vw, 7.5rem);
    padding-bottom: clamp(3rem, 6vw, 5rem);
    padding-left: clamp(10px, 4vw, 20px);
    padding-right: clamp(10px, 4vw, 20px);
    box-sizing: border-box;
    background: transparent;
    position: relative;
    z-index: 5;
  }

  .hero-text {
    max-width: 900px;
    margin-top: 0;
    position: relative;
    z-index: 3;
    padding: 0 clamp(5px, 2vw, 0px);
  }

  .hero-text h1 {
    font-size: clamp(1.4rem, 4.5vw, 3.2rem);
    font-weight: bold;
    line-height: 1.2;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
    margin-bottom: clamp(0.8rem, 2vw, 1.4rem);
  }

  .hero-text p {
    font-size: clamp(0.88rem, 2vw, 1.2rem);
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.7;
    max-width: 820px;
    margin: 0 auto;
  }

  /* ---------- Shared section shell ---------- */
  /* Every section below shares the same rhythm: eyebrow + line, heading,
     optional lead paragraph, then content. This keeps spacing and type
     scale consistent across the whole page. */

  .section-block {
    padding: clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 3rem);
    background: transparent;
    text-align: center;
    position: relative;
    z-index: 6;
    width: 100%;
    box-sizing: border-box;
  }

  .section-block.alt {
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0) 100%);
  }

  .section-inner {
    max-width: 1600px;
    margin: 0 auto;
  }

  .section-pre-title {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    color: #39ff14;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 0.8rem;
  }

  .section-separator-line {
    width: 60px;
    height: 3px;
    background-color: #facc15;
    margin: 0 auto 1.5rem;
    border-radius: 99px;
  }

  .section-inner h2 {
    font-size: clamp(1.2rem, 3vw, 2.1rem);
    font-weight: bold;
    color: white;
    margin: 0 0 clamp(0.8rem, 2vw, 1.2rem);
  }

  .section-inner > p.section-lead {
    font-size: clamp(0.85rem, 1.8vw, 1.05rem);
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.8;
    max-width: 900px;
    margin: 0 auto clamp(2rem, 4vw, 3rem);
  }

  /* ---------- Heritage / stats (within hero) ---------- */

  .engineering-section {
    margin-top: clamp(3rem, 6vw, 5.5rem);
    width: 100%;
    max-width: 1600px;
  }

  .stats-row {
    display: flex;
    justify-content: center;
    align-items: stretch;
    flex-wrap: wrap;
    gap: clamp(1.5rem, 4vw, 3.5rem);
    margin-top: clamp(1rem, 2vw, 1.5rem);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 clamp(0.5rem, 1.5vw, 1.5rem);
    position: relative;
    min-width: clamp(90px, 13vw, 150px);
  }

  .stat-item:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 8%;
    right: clamp(-0.75rem, -2vw, -1.75rem);
    width: 1px;
    height: 84%;
    background: linear-gradient(180deg, transparent, rgba(250, 204, 21, 0.35), transparent);
  }

  .stat-item .stat-number {
    font-size: clamp(1.7rem, 3.6vw, 2.6rem);
    font-weight: 800;
    color: #facc15;
    line-height: 1;
    letter-spacing: -0.01em;
    font-variant-numeric: tabular-nums;
  }

  .stat-item .stat-label {
    font-size: clamp(0.65rem, 1.15vw, 0.8rem);
    color: rgba(255, 255, 255, 0.5);
    margin-top: clamp(0.4rem, 1vw, 0.6rem);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    line-height: 1.4;
  }

  /* ---------- Value cards ---------- */

  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(clamp(150px, 22vw, 280px), 1fr));
    gap: clamp(0.8rem, 2vw, 1.8rem);
    max-width: 1800px;
    margin: 0 auto;
  }

  .card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: clamp(1rem, 2.5vw, 1.6rem);
    text-align: left;
    transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
  }

  .card:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(250, 204, 21, 0.35);
    transform: translateY(-4px);
  }

  .card h3 {
    font-size: clamp(0.95rem, 1.7vw, 1.15rem);
    font-weight: 600;
    color: #facc15;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .card p {
    font-size: clamp(0.78rem, 1.4vw, 0.92rem);
    color: rgba(255, 255, 255, 0.62);
    line-height: 1.65;
  }

  /* ---------- Services ---------- */

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(clamp(140px, 20vw, 250px), 1fr));
    gap: clamp(0.8rem, 2vw, 1.4rem);
    max-width: 1800px;
    margin: 0 auto;
  }

  .service-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: clamp(1rem, 2.5vw, 1.6rem);
    text-align: left;
    transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
  }

  .service-card:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(250, 204, 21, 0.35);
    transform: translateY(-4px);
  }

  .service-card h3 {
    font-size: clamp(0.85rem, 1.6vw, 1.05rem);
    font-weight: 600;
    color: white;
    margin-bottom: 6px;
    line-height: 1.3;
  }

  .service-card p {
    font-size: clamp(0.72rem, 1.3vw, 0.88rem);
    color: rgba(255, 255, 255, 0.58);
    line-height: 1.55;
  }

  /* ---------- Why grid ---------- */

  .why-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(clamp(160px, 22vw, 290px), 1fr));
    gap: clamp(0.8rem, 2vw, 1.4rem);
    max-width: 1800px;
    margin: 0 auto;
  }

  .why-card {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: clamp(1rem, 2.5vw, 1.6rem);
    text-align: left;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(6px);
    transition: border-color 0.25s ease, background 0.25s ease;
  }

  .why-card:hover {
    border-color: rgba(250, 204, 21, 0.3);
    background: rgba(255, 255, 255, 0.07);
  }

  .why-card h3 {
    font-size: clamp(0.85rem, 1.6vw, 1rem);
    font-weight: 600;
    color: #facc15;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .why-card p {
    font-size: clamp(0.72rem, 1.3vw, 0.88rem);
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.65;
  }

  /* ---------- CTA ---------- */

  .cta-section {
    padding: clamp(3rem, 6vw, 5.5rem) clamp(1rem, 4vw, 3rem);
  }

  .cta-section .section-inner h2 {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-btn {
    background: #facc15;
    color: #111;
    border: none;
    padding: clamp(10px, 1.5vw, 14px) clamp(24px, 4vw, 44px);
    font-size: clamp(0.88rem, 1.6vw, 1rem);
    font-weight: 700;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    letter-spacing: 0.02em;
  }

  .cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(250, 204, 21, 0.35);
  }

  .cta-btn:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(250, 204, 21, 0.25);
  }

  .cta-btn:focus-visible {
    outline: 2px solid #facc15;
    outline-offset: 3px;
  }

  /* ---------- Responsive ---------- */

  @media (max-width: 1024px) and (min-width: 769px) {
    .home-container { padding-top: 100px; }
  }

  @media (max-width: 768px) {
    .home-container { padding-top: 90px; }
    .cards-container { grid-template-columns: repeat(2, 1fr); }
    .services-grid { grid-template-columns: repeat(2, 1fr); }
    .why-grid { grid-template-columns: repeat(2, 1fr); }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0;
    }

    .stat-item {
      padding: clamp(1rem, 3vw, 1.5rem) clamp(0.5rem, 2vw, 1rem);
      min-width: 0;
    }

    .stat-item:not(:last-child)::after {
      display: none;
    }

    .stat-item:nth-child(odd) {
      border-right: 1px solid rgba(250, 204, 21, 0.18);
    }

    .stat-item:nth-child(-n+2) {
      border-bottom: 1px solid rgba(250, 204, 21, 0.18);
    }
  }

  @media (max-width: 480px) {
    .home-container { padding-top: 80px; }
    .cards-container { grid-template-columns: repeat(2, 1fr); }
    .services-grid { grid-template-columns: repeat(2, 1fr); }
    .why-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 360px) {
    .home-container { padding-top: 70px; }
    .cards-container { grid-template-columns: repeat(2, 1fr); }
    .why-grid { grid-template-columns: 1fr; }
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const Home = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!window.__introShown) {
      setShowIntro(true);
      window.__introShown = true;
    }
  }, []);

  const valueCards = [
    {
      title: "Shaping Tomorrow, Today",
      description:
        "At Lumbini Technologies, we imagine a future where technology empowers people and businesses to reach their full potential. Our mission is to craft transformative solutions that inspire progress and make us a trusted force in the digital world.",
    },
    {
      title: "Integrity Meets Innovation",
      description:
        "Excellence is our foundation. With integrity at our core and innovation as our fuel, we deliver solutions that create meaningful impact rather than just solve problems.",
    },
    {
      title: "Built Around You",
      description:
        "Every decision we make starts with our customers in mind. By blending cutting-edge technology with real-world needs, we help organizations and individuals thrive in an evolving digital landscape.",
    },
    {
      title: "Always On, Always With You",
      description:
        "Your success never clocks out and neither do we. Our team is available around the clock, ensuring your systems stay reliable, secure, and ready for whatever comes next.",
    },
  ];

  const services = [
    { title: "Software Development", description: "Custom applications and platforms built to perform at any scale." },
    { title: "Artificial Intelligence", description: "Intelligent systems that turn data into decisions that matter." },
    { title: "Cloud Engineering", description: "Reliable, secure cloud infrastructure designed for growth." },
    { title: "Cybersecurity", description: "End-to-end protection that keeps you ahead of threats." },
    { title: "Electrical Engineering", description: "Proven infrastructure expertise built over decades of real projects." },
    { title: "Digital Transformation", description: "Full-scale modernization from strategy through to execution." },
  ];

  const whyCards = [
    { title: "Engineering Mindset", description: "Every solution we build reflects the precision, reliability, and long-term thinking that engineering demands." },
    { title: "Modern Technology", description: "Deep expertise across AI, cloud platforms, software development, and cybersecurity, all under one roof." },
    { title: "Customer Focus", description: "We don't sell packages. Every solution is shaped around your specific business challenges and goals." },
    { title: "Continuous Support", description: "Dedicated assistance available whenever you need it, so your operations never miss a beat." },
  ];

  return (
    <>
      <style>{styles}</style>

      <div className="home-container">
        {showIntro && (
          <IntroZoomOverlay src={heroImage} alt="Lumbini Technologies" />
        )}

        {/* Hero */}
        <div className="Hero">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1>Engineering Reliable Solutions<br />For a Digital World</h1>
            <p>
              We help organizations build reliable software, intelligent systems, and modern digital infrastructure designed for long term success.
            </p>
          </motion.div>

          {/* Engineering Foundation */}
          <motion.div
            className="engineering-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <div className="section-inner">
              <div className="section-separator-line"></div>
              <span className="section-pre-title">Built on Real World Engineering Experience</span>
              <h2>A Foundation Built on Engineering Excellence</h2>
              <p className="section-lead">
                Long before expanding into software and digital solutions, Lumbini
                Technologies built its reputation through electrical engineering and
                infrastructure projects across banking, government, industrial, and
                commercial sectors. Today, we combine that experience with modern software
                development, artificial intelligence, cloud engineering, and cybersecurity
                to help businesses move forward with confidence.
              </p>
              <div className="stats-row">
                {[
                  { number: "50+", label: "Infrastructure Projects" },
                  { number: "AI", label: "Digital Solutions" },
                  { number: "24/7", label: "Support" },
                  { number: "Eng.", label: "Driven Approach" },
                ].map((stat, i) => (
                  <div className="stat-item" key={i}>
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Value Cards */}
        <motion.section
          className="section-block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <div className="section-inner">
            <h2>What Drives Us</h2>
            <div className="cards-container">
              {valueCards.map((card, index) => (
                <motion.div key={index} className="card" variants={itemVariants} transition={{ duration: 0.5 }}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Services */}
        <motion.section
          className="section-block alt"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <div className="section-inner">
            <h2>What We Do</h2>
            <div className="services-grid">
              {services.map((svc, i) => (
                <motion.div key={i} className="service-card" variants={itemVariants} transition={{ duration: 0.45 }}>
                  <h3>{svc.title}</h3>
                  <p>{svc.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Why Lumbini */}
        <motion.section
          className="section-block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <div className="section-inner">
            <h2>Why Organizations Choose Lumbini Technologies</h2>
            <div className="why-grid">
              {whyCards.map((item, i) => (
                <motion.div key={i} className="why-card" variants={itemVariants} transition={{ duration: 0.45 }}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="section-block alt cta-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="section-inner">
            <h2>Let's Build Something Meaningful Together</h2>
            <p className="section-lead">
              Whether you're planning a new digital product, modernizing infrastructure,
              or exploring AI solutions, our team is ready to help.
            </p>
            <button className="cta-btn">Contact Us</button>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default Home;