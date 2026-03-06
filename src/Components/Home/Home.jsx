import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Home.css";
import IntroZoomOverlay from "../Effects/IntroZoomOverlay";
import heroImage from "../../assets/front-bg.png";

const Home = () => {
  const services = [
    {
      title: "Shaping Tomorrow, Today",
      description: `At Lumbini Technologies, we imagine a future where technology empowers people and businesses to reach their full potential. Our mission is to craft transformative solutions that inspire progress and make us a trusted force in the digital world.`,
    },
    {
      title: "Driven by Integrity. Powered by Innovation.",
      description: `Excellence isn't just a goal — it's our foundation. With integrity at our core and innovation as our fuel, we deliver solutions that don't just solve problems but create meaningful impact.`,
    },
    {
      title: "Built Around You. Ready for the Future.",
      description: `Every decision we make starts with our customers in mind. By blending cutting-edge technology with real-world needs, we help organizations and individuals thrive in an ever-evolving digital landscape.`,
    },
    {
      title: "Always On. Always With You.",
      description: `Your success never clocks out, and neither do we. Our team is available 24/7, ensuring your systems stay reliable, secure, and ready for whatever comes next.`,
    },
  ];

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

      {/* Hero Section */}
      <div className="Hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
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
