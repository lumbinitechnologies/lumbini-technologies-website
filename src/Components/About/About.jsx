import React from 'react';
import { motion } from 'framer-motion';
import chairmanImg from '../../assets/chairman.jpeg';
import nighaLogo from '../../assets/nighalogo.jpg';
import ideployLogo from '../../assets/ideploylogo.jpg';
import gatesLogo from '../../assets/gateslogo.png';
import inionDataLogo from '../../assets/iniondata.png';
import member2 from '../../assets/krishnaprabhumaganti.jpg';
import member3 from '../../assets/ravikumarlanke.png';
import member4 from '../../assets/jagadeeshpilli.jpg';

const styles = `
  /* ─── Base ─────────────────────────────────────────────────── */

  .about-container {
    padding: 4rem 2rem;
    padding-top: 0;
    color: white;
    background: transparent;
    position: relative;
    z-index: 1;
    overflow-x: hidden;
  }

  /* ─── Shared headings ───────────────────────────────────────── */

  .about-container h2 {
    font-size: clamp(1.25rem, 2.5vw, 1.6rem);
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 2rem;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.55);
  }

  /* ─── Intro ─────────────────────────────────────────────────── */

  .about-intro {
    text-align: center;
    margin-bottom: 5rem;
    /* navbar is fixed ~64px tall on desktop, ~50px on mobile.
       Use padding-top so the scrim ::before doesn't bleed into navbar space */
    padding-top: 6rem;
    margin-top: 0;
  }

  .about-intro h1 {
    font-size: clamp(1.6rem, 3.5vw, 2.5rem);
    font-weight: 800;
    margin-bottom: 1rem;
    text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);
  }

  .about-intro p {
    font-size: clamp(0.95rem, 1.8vw, 1.15rem);
    max-width: 800px;
    margin: 0 auto;
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.8;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45);
  }

  /* ─── Journey ───────────────────────────────────────────────── */

  .our-journey {
    text-align: center;
    margin-bottom: 5rem;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .journey-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .journey-block {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 1rem;
    padding: 1.6rem 2rem;
    max-width: 720px;
    width: 100%;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }

  .journey-block:hover {
    background: rgba(255, 255, 255, 0.11);
    box-shadow: 0 6px 20px rgba(250, 204, 21, 0.08);
  }

  .journey-block p {
    font-size: clamp(0.88rem, 1.6vw, 1rem);
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
  }

  .journey-divider {
    width: 2px;
    height: 32px;
    background: linear-gradient(to bottom, rgba(250, 204, 21, 0.45), rgba(255, 255, 255, 0.12));
    flex-shrink: 0;
  }

  /* ─── Gradient scrim ────────────────────────────────────────── */

  .needs-scrim {
    position: relative;
  }

  .needs-scrim::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 90% 100% at 50% 50%,
      rgba(0, 0, 0, 0.38) 0%,
      rgba(0, 0, 0, 0.18) 55%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 0;
  }

  .needs-scrim > * {
    position: relative;
    z-index: 1;
  }

  /* ─── Director ──────────────────────────────────────────────── */

  .managing-director {
    text-align: center;
    margin-bottom: 5rem;
  }

  .director-cards {
    display: grid;
    justify-items: center;
    gap: 2rem;
    width: 100%;
    margin: 0 auto;
  }

  .director-card {
    background: rgba(255, 255, 255, 0.08);
    padding: 2rem;
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    width: 320px;
    min-height: 270px;
    height: auto;
    text-align: center;
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .director-card:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.13);
    box-shadow: 0 10px 30px rgba(250, 204, 21, 0.12);
    border-color: rgba(250, 204, 21, 0.25);
  }

  .director-card img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1.5rem;
    border: 2px solid rgba(250, 204, 21, 0.3);
  }

  .director-card h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 6px;
    color: #ffffff;
  }

  .director-card p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }

  /* ─── Members ───────────────────────────────────────────────── */

  .our-members {
    text-align: center;
    margin-bottom: 5rem;
  }

  .member-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .member-card {
    background: rgba(255, 255, 255, 0.08);
    padding: 2rem;
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    width: 300px;
    min-height: 260px;
    height: auto;
    text-align: center;
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
  }

  .member-card:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.13);
    box-shadow: 0 10px 30px rgba(250, 204, 21, 0.12);
    border-color: rgba(250, 204, 21, 0.25);
  }

  .member-card img {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1.2rem;
    border: 2px solid rgba(250, 204, 21, 0.3);
  }

  .member-card h4 {
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 5px;
    color: #ffffff;
  }

  .member-card p {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.88rem;
  }

  /* ─── Mission ───────────────────────────────────────────────── */

  .mission-statement {
    margin-top: 2.5rem;
    font-size: clamp(0.95rem, 1.8vw, 1.08rem);
    text-align: center;
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.7;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  /* ─── Clients intro ─────────────────────────────────────────── */

  .clients-intro {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.68);
    max-width: 620px;
    margin: 0.5rem auto 2rem auto;
    line-height: 1.7;
  }

  /* ─── Testimonials ──────────────────────────────────────────── */

  .testimonials {
    text-align: center;
    margin-top: 7rem;
  }

  .testimonial-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.8rem;
    margin-top: 2rem;
  }

  .testimonial {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #fff;
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }

  .testimonial:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.13);
    box-shadow: 0 10px 28px rgba(250, 204, 21, 0.1);
    border-color: rgba(250, 204, 21, 0.22);
  }

  .testimonial-logo {
    width: 80px;
    height: auto;
    margin: 0 auto 1.2rem auto;
    border-radius: 8px;
    display: block;
  }

  .testimonial p {
    font-style: italic;
    margin-bottom: 1rem;
    line-height: 1.65;
    font-size: 0.92rem;
    color: rgba(255, 255, 255, 0.82);
  }

  .testimonial h4 {
    text-align: right;
    font-size: 0.95rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.88);
    margin-top: 1.5rem;
  }

  /* ─── Why Choose Us ─────────────────────────────────────────── */

  .why-choose-us {
    text-align: center;
    margin-top: 7rem;
    margin-bottom: 4rem;
  }

  .why-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.4rem;
    margin-top: 1rem;
  }

  .about-why-card {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem 1.4rem;
    border-radius: 1.2rem;
    text-align: center;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }

  .about-why-card:hover {
    transform: translateY(-7px);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 24px rgba(250, 204, 21, 0.1);
    border-color: rgba(250, 204, 21, 0.28);
  }

  .why-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(250, 204, 21, 0.1);
    color: rgba(250, 204, 21, 0.85);
    margin: 0 auto 1.1rem auto;
    transition: background 0.3s ease, color 0.3s ease;
  }

  .about-why-card:hover .why-icon {
    background: rgba(250, 204, 21, 0.18);
    color: #facc15;
  }

  .about-why-card h4 {
    font-size: 0.98rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #facc15;
  }

  .about-why-card p {
    font-size: 0.88rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.68);
    margin: 0;
  }

  /* ─── Tablet (769px – 1024px) ───────────────────────────────── */

  @media (max-width: 1024px) and (min-width: 769px) {
    .about-container { padding: 0 1.5rem 3rem; }
    .about-intro { padding-top: 5rem; }
    .director-card { width: 280px; }
    .director-card img { width: 100px; height: 100px; }
    .member-card { width: 260px; }
    .member-card img { width: 100px; height: 100px; }
    .why-cards { grid-template-columns: repeat(2, 1fr); }
  }

  /* ─── Mobile (≤ 768px) ──────────────────────────────────────── */

  @media (max-width: 768px) {
    .about-container { padding: 0 1rem 2rem; }

    /* padding-top instead of margin-top — keeps scrim contained */
    .about-intro { padding-top: 4.5rem; margin-bottom: 3rem; }
    .about-intro p { font-size: 0.92rem; padding: 0 0.4rem; }

    .mission-statement { font-size: 0.92rem; padding: 0 0.4rem; }

    .our-journey { margin-bottom: 3rem; padding: 0 0.5rem; }
    .journey-block { padding: 1.1rem 1rem; }
    .journey-block p { font-size: 0.88rem; }
    .journey-divider { height: 22px; }

    .managing-director { margin-bottom: 3rem; }
    .director-card {
      width: 100%;
      max-width: 340px;
      min-height: unset;
      height: auto;
      padding: 1.4rem;
    }
    .director-card img { width: 90px; height: 90px; margin-bottom: 1rem; }
    .director-card h4 { font-size: 0.95rem; }

    /* 2-column grid for members on mobile */
    .member-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .member-card {
      width: 100%;
      min-height: unset;
      height: auto;
      padding: 1.2rem 0.8rem;
    }
    .member-card img { width: 75px; height: 75px; margin-bottom: 0.9rem; }
    .member-card h4 { font-size: 0.88rem; }
    .member-card p { font-size: 0.8rem; }

    .testimonials { margin-top: 4rem; }
    .testimonial-cards { grid-template-columns: 1fr; gap: 1rem; }
    .testimonial { padding: 1.4rem; }
    .testimonial p { font-size: 0.88rem; }
    .testimonial h4 { font-size: 0.9rem; margin-top: 1rem; }

    .why-choose-us { margin-top: 4rem; margin-bottom: 2rem; }
    .why-cards { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .about-why-card { padding: 1.2rem 1rem; }
    .why-icon { width: 42px; height: 42px; }
    .about-why-card h4 { font-size: 0.88rem; }
    .about-why-card p { font-size: 0.8rem; }
  }

  /* ─── Small phones (≤ 480px) ────────────────────────────────── */

  @media (max-width: 480px) {
    .about-container { padding: 0 0.75rem 1.5rem; }
    .about-intro { padding-top: 4rem; margin-bottom: 2rem; }

    /* Stack member cards to single column on very small screens */
    .member-cards { grid-template-columns: 1fr; gap: 0.8rem; }
    .member-card img { width: 80px; height: 80px; }

    .why-cards { grid-template-columns: 1fr; gap: 0.8rem; }
    .testimonial-cards { gap: 0.8rem; }

    .clients-intro { font-size: 0.88rem; }
  }

  /* ─── Tiny phones (≤ 360px) ────────────────────────────────── */

  @media (max-width: 360px) {
    .about-container { padding: 0 0.5rem 1rem; }
    .about-intro { padding-top: 3.5rem; }
  }
`;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const About = () => {
  return (
    <>
      <style>{styles}</style>
      <motion.div
        className="about-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
      >

        {/* ── Company Overview ───────────────────────────────── */}
        <motion.section
          className="about-intro needs-scrim"
          id="overview"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p>
            At Lumbini Technologies, we are more than a tech company — we are architects of digital transformation.
            We specialize in cutting-edge web, mobile, and AI-driven applications that empower businesses to scale,
            innovate, and lead in a fast-changing world. Our strength lies in our passionate team and a forward-thinking
            mindset. Together, we combine creativity, innovation, and relentless quality to deliver solutions that
            redefine digital experiences.
          </p>
        </motion.section>

        {/* ── Our Journey ────────────────────────────────────── */}
        <motion.section
          className="our-journey needs-scrim"
          id="journey"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <h2>Our Journey</h2>
          <div className="journey-content">
            <div className="journey-block">
              <p>
                Lumbini Technologies began with a strong foundation in engineering and infrastructure services,
                delivering projects across electrical systems, power distribution, and industrial sectors.
              </p>
            </div>
            <div className="journey-divider" aria-hidden="true"></div>
            <div className="journey-block">
              <p>
                Over the years, the organization expanded its expertise to meet the growing demands of a digital world.
                Today, Lumbini Technologies provides software development, artificial intelligence, cloud engineering,
                cybersecurity, and digital transformation solutions for businesses and institutions.
              </p>
            </div>
            <div className="journey-divider" aria-hidden="true"></div>
            <div className="journey-block">
              <p>
                While technology continues to evolve, our commitment remains unchanged: delivering reliable solutions
                built on technical excellence, innovation, and trust.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Chairman / Managing Director ───────────────────── */}
        <motion.section
          className="managing-director needs-scrim"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <h2>Our Chairman / Managing Director</h2>
          <div className="director-cards">
            <div className="director-card">
              <img src={chairmanImg} alt="Srinivas Chakravarthy Maganti" />
              <h4>Srinivas Chakravarthy Maganti</h4>
              <p></p>
            </div>
          </div>
        </motion.section>

        {/* ── Our Members ────────────────────────────────────── */}
        <section className="our-members needs-scrim" id="members">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            Our Members
          </motion.h2>
          <motion.div
            className="member-cards"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            {[
              { src: member2, name: 'Krishna Prabhu Maganti', role: 'CMO' },
              { src: member3, name: 'Ravi Kumar Lanke',       role: 'CTO' },
              { src: member4, name: 'Jagadeesh Pilli',        role: 'COO' },
            ].map((m) => (
              <motion.div key={m.name} className="member-card" variants={item}>
                <img src={m.src} alt={m.name} />
                <h4>{m.name}</h4>
                <p>{m.role}</p>
              </motion.div>
            ))}
          </motion.div>

          <p className="mission-statement">
            Our mission is to redefine digital experiences through creativity, innovation, and relentless quality.
            At Lumbini Technologies, we don't just build products — we build trust.
          </p>
        </section>

        {/* ── Testimonials ───────────────────────────────────── */}
        <motion.section
          className="testimonials needs-scrim"
          id="clients"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp}>Trusted By Our Clients</motion.h2>
          <motion.p className="clients-intro" variants={fadeUp}>
            We are proud to collaborate with organizations across technology, education, and business sectors,
            building long-term relationships through innovation, reliability, and trusted delivery.
          </motion.p>
          <div className="testimonial-cards">
            {[
              {
                logo: nighaLogo, alt: 'NIGHA TechGlobal',
                quote: 'Lumbini Technologies has been a reliable technology partner, consistently delivering solutions that align with our business goals. Their professionalism, responsiveness, and commitment to quality have made every collaboration smooth and successful.',
                by: '– NIGHA TECH GLOBAL PVT LTD',
              },
              {
                logo: ideployLogo, alt: 'iDeploy',
                quote: 'The team at Lumbini Technologies brings strong technical expertise and a solution-oriented approach to every project. Their ability to understand requirements and deliver effective results has been truly valuable.',
                by: '– iDeploy Bangalore',
              },
              {
                logo: gatesLogo, alt: 'GATES Institute',
                quote: 'Lumbini Technologies has helped us strengthen our digital ecosystem through dependable software solutions and dedicated support. Their work has contributed significantly to improving operational efficiency.',
                by: '– Gates Institute of Management and Sciences',
              },
              {
                logo: inionDataLogo, alt: 'InionData',
                quote: 'Lumbini Technologies successfully delivered a modern, responsive, and professional website that accurately represents our brand. Their attention to detail, communication, and commitment to excellence ensured a smooth experience from concept to launch.',
                by: '– InionData',
              },
            ].map((t) => (
              <motion.div key={t.by} className="testimonial" variants={item}>
                <img src={t.logo} alt={t.alt} className="testimonial-logo" />
                <p>"{t.quote}"</p>
                <h4>{t.by}</h4>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Why Choose Us ──────────────────────────────────── */}
        <motion.section
          className="why-choose-us needs-scrim"
          id="why-us"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp}>Why Choose Lumbini Technologies</motion.h2>
          <div className="why-cards">
            {[
              {
                title: 'Engineering Driven Approach',
                desc: 'Our solutions are built on practical expertise, technical precision, and a commitment to quality.',
                icon: (
                  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 3L4 8v6c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V8L14 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" fill="none"/>
                    <path d="M9 14l3.5 3.5L19 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                title: 'Innovation Focused',
                desc: 'We continuously explore modern technologies to deliver solutions that create measurable value.',
                icon: (
                  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 4v4M14 20v4M4 14h4M20 14h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.7" fill="none"/>
                    <path d="M7.17 7.17l2.83 2.83M18 18l2.83 2.83M7.17 20.83l2.83-2.83M18 10l2.83-2.83" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                title: 'Customer Centric',
                desc: 'Every project begins with understanding our clients\' goals, challenges, and long-term vision.',
                icon: (
                  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14" cy="10" r="4" stroke="currentColor" strokeWidth="1.7" fill="none"/>
                    <path d="M6 24c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
                  </svg>
                ),
              },
              {
                title: 'Reliable Partnership',
                desc: 'We believe successful projects are built on trust, transparency, and long-term collaboration.',
                icon: (
                  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 14.5C5 9.25 9.25 5 14.5 5S24 9.25 24 14.5 19.75 24 14.5 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
                    <path d="M5 19v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M14.5 9v5.5l3.5 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
            ].map((w) => (
              <motion.div key={w.title} className="about-why-card" variants={item}>
                <div className="why-icon">{w.icon}</div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </motion.div>
    </>
  );
};

export default About;