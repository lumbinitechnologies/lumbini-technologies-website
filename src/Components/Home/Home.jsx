import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Home.css';
import IntroZoomOverlay from '../Effects/IntroZoomOverlay';
import heroImage from '../../assets/front-bg.png';

const Home = () => {
  // Services data for cards
  const services = [
    {
      title: 'Shaping Tomorrow, Today',
      description:
        'At Lumbini Technologies, we imagine a future where technology empowers people and businesses to reach their full potential. Our mission is to craft transformative solutions that inspire progress and make us a trusted force in the digital world.',
    },
    {
      title: 'Driven by Integrity. Powered by Innovation.',
      description:
        'Excellence isn’t just a goal—it’s our foundation. With integrity at our core and innovation as our fuel, we deliver solutions that don’t just solve problems but create meaningful impact.',
    },
    {
      title: 'Built Around You. Ready for the Future.',
      description:
        'Every decision we make starts with our customers in mind. By blending cutting-edge technology with real-world needs, we help organizations and individuals thrive in an ever-evolving digital landscape.',
    },
    {
      title: 'Always On. Always With You.',
      description:
        'Your success never clocks out, and neither do we. Our team is available 24/7, ensuring your systems stay reliable, secure, and ready for whatever comes next.',
    },
  ];

  // Banner text
  const bannerText = "Launch Your Career with Us! • Internships Now Open at Lumbini Technologies • Join our dynamic team, work on real-world projects, and gain hands-on experience in cutting-edge technologies • ";

  // Replace this URL with your actual Google Form URL
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScCEn1nqxA-OP_iZirxGy5hmFMmwx83vA6KZlFjAY64m7D-Ew/viewform?usp=header";

  // Handle apply button click
  const handleApplyClick = () => {
    // Open Google Form in a new tab
    window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
  };

  // Generate scrolling text segments
  const scrollingTextSegments = () => {
    const content = [];
    for (let i = 0; i < 15; i++) {
      content.push(
        <span key={`text-${i}`} className="banner-text-segment">
          {bannerText}
        </span>
      );
      content.push(
        <span key={`spacer-${i}`} className="banner-text-segment">
          {" "}
        </span>
      );
    }
    return content;
  };

  // Animation variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const [showIntro, setShowIntro] = useState(false);

  // Show intro once per full page load; not when navigating back to Home within SPA
  useEffect(() => {
    if (!window.__introShown) {
      setShowIntro(true);
      window.__introShown = true;
    }
  }, []);

  return (
    <div className="home-container">
      {showIntro && (
        <IntroZoomOverlay src={heroImage} alt="Lumbini Technologies" />
      )}
      {/* Scrolling Banner */}
      <div className="scrolling-text-banner">
        <div className="banner-text-wrapper">
          <motion.div
            className="banner-text"
            animate={{ x: [0, -3500] }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {scrollingTextSegments()}
          </motion.div>
        </div>

        <button
          className="apply-now-btn-inline"
          onClick={handleApplyClick}
        >
          Apply Now
        </button>
      </div>

      {/* Hero Section */}
      <div className="Hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1>Your Vision, Our Technology — A Perfect Match</h1>
        </motion.div>
      </div>

      {/* Service Cards */}
      <motion.section
        className="cards-section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="cards-container">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="card"
              variants={cardVariants}
              transition={{ duration: 0.5 }}
            >
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;