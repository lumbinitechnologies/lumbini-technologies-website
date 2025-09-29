// ServicePage.jsx
import React from 'react';
import './ServicePage.css';
import { motion } from 'framer-motion';
import '../Home/Home.css';

const services = [
  {
    title: "Smart Web & Mobile Solutions",
    description: "Next-generation web and mobile applications built with scalable architectures, modern frameworks, and seamless user experiences."
  },
  {
    title: "Cloud Migration & Modernization", 
    description: "Moving legacy systems to the cloud (AWS, Azure, GCP) with automation, scalability, and cost-optimization strategies."
  },
  {
    title: "AI & Machine Learning Solutions",
    description: "Intelligent systems powered by AI/ML for predictive analytics, automation, personalization, and decision-making.."
  },
  {
    title: "Cybersecurity & Digital Trust",
    description: "End-to-end protection through advanced cybersecurity, threat detection, and compliance-driven solutions."
  },
  {
    title: "Data Engineering & Analytics", 
    description: "Building robust data pipelines, warehouses, and real-time analytics platforms to turn raw data into business insights.."
  },
  {
    title: "Blockchain & Web3 Solutions ",
    description: "Secure, decentralized applications and smart contracts that enable transparency, trust, and innovation.."
  },
  {
    title: "IoT & Edge Computing",
    description: "Connected devices and real-time data processing at the edge for industries like healthcare, manufacturing, and logistics."
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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ServicePage = () => {
  return (
    <motion.div
      className="services-container"
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -30 }}
      variants={containerVariants}
    >
      <h1 className="services-heading">Our Services</h1>
      <div className="services-grid">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="service-card card"
            variants={cardVariants}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServicePage;