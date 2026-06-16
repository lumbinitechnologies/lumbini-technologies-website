import React from 'react';
import './About.css';
import { motion } from 'framer-motion';
import chairmanImg from '../../assets/chairman.jpeg';
import nighaLogo from '../../assets/nighalogo.jpg';
import ideployLogo from '../../assets/ideploylogo.jpg';
import gatesLogo from '../../assets/gateslogo.png';
import inionDataLogo from '../../assets/iniondata.png';
//import member1 from '../../assets/yeshrajmaganti.jpg';
import member2 from '../../assets/krishnaprabhumaganti.jpg';
import member3 from '../../assets/ravikumarlanke.png';
import member4 from '../../assets/jagadeeshpilli.jpg';


const About = () => {
  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
    >
      {/* Company Overview */}
      <section className="about-intro" id="overview">
        <h1></h1>
        <p>
          At Lumbini Technologies, we are more than a tech company, we are architects of digital transformation. We specialize in cutting-edge web, mobile, and AI-driven applications that empower businesses to scale, innovate, and lead in a fast-changing world.

          Our strength lies in our passionate team and a forward-thinking mindset. Together, we combine creativity, innovation, and relentless quality to deliver solutions that redefine digital experiences.
        </p>
      </section>

      {/* Our Journey Section */}
      <section className="our-journey" id="journey">
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
      </section>

      {/* Managing Director Section */}
      <section className="managing-director">
        <h2>Our Chairman/ Managing Director</h2>
        <div className="director-cards">
          <div className="director-card">
            <img src={chairmanImg} alt="Srinivas Chakravarthy Maganti" />
            <h4>Srinivas Chakravarthy Maganti</h4>
            <p></p>
          </div>
        </div>
      </section>

      {/* Our Members Section */}
      <section className="our-members" id="members">
        <h2>Our Members</h2>
        <div className="member-cards">
          {/*<div className="member-card">
      <img src={member1} alt="Team Member 1" />
      <h4>Yeshraj Maganti</h4>
      <p>CEO</p>
    </div> */}
          <div className="member-card">
            <img src={member2} alt="Team Member 2" />
            <h4>Krishna Prabhu Maganti</h4>
            <p>CMO</p>
          </div>
          <div className="member-card">
            <img src={member3} alt="Team Member 3" />
            <h4>Ravi Kumar Lanke</h4>
            <p>CTO</p>
          </div>
          <div className="member-card">
            <img src={member4} alt="Team Member 4" />
            <h4>Jagadeesh Pilli</h4>
            <p>COO</p>
          </div>
        </div>

        {/* What We Do Section */}
        <section className="what-we-do" id="services">
          <h2>What We Do</h2>
          <div className="service-cards">
            <div className="service-card">
              <div className="service-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="26" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
                  <path d="M10 27h12M16 23v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M9 12l3 3-3 3M14 18h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>Software Development</h4>
              <p>Custom web, mobile, and enterprise applications designed to support business growth and operational efficiency.</p>
            </div>
            <div className="service-card">
              <div className="service-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.8" fill="none" />
                  <path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M7.76 7.76l2.83 2.83M21.41 21.41l2.83 2.83M7.76 24.24l2.83-2.83M21.41 10.59l2.83-2.83" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h4>Artificial Intelligence</h4>
              <p>AI-powered solutions that automate processes, improve decision-making, and create intelligent user experiences.</p>
            </div>
            <div className="service-card">
              <div className="service-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 20c-1.66-1.34-2-3.5-2-5a12 12 0 0124 0c0 1.5-.34 3.66-2 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <path d="M10 23c-.83-1-.83-2.5 0-4a8 8 0 0112 0c.83 1.5.83 3 0 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <circle cx="16" cy="25" r="2" stroke="currentColor" strokeWidth="1.8" fill="none" />
                </svg>
              </div>
              <h4>Cloud Engineering</h4>
              <p>Scalable cloud infrastructure, migration services, and deployment strategies built for reliability and performance.</p>
            </div>
            <div className="service-card">
              <div className="service-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 3L4 8v8c0 6.63 5.16 12.84 12 14 6.84-1.16 12-7.37 12-14V8L16 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
                  <path d="M11 16l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4>Cybersecurity</h4>
              <p>Comprehensive security solutions that protect digital assets, systems, and business operations.</p>
            </div>
            <div className="service-card">
              <div className="service-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 26h24M8 26V14l8-8 8 8v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <rect x="13" y="19" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none" />
                  <path d="M12 14h2M18 14h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h4>Engineering Solutions</h4>
              <p>Infrastructure and engineering services backed by years of practical project experience and technical expertise.</p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <p className="mission-statement">
          Our mission is to redefine digital experiences through creativity, innovation, and relentless quality.
          At Lumbini Technologies, we don't just build products—we build trust.
        </p>
      </section>


      {/* Testimonials Section */}
      <section className="testimonials" id="clients">
        <h2>Trusted By Our Clients</h2>
        <p className="clients-intro">
          We are proud to collaborate with organizations across technology,
          education, and business sectors, building long-term relationships
          through innovation, reliability, and trusted delivery.
        </p>
        <div className="testimonial-cards">
          <div className="testimonial">
            <img src={nighaLogo} alt="NIGHA TechGlobal" className="testimonial-logo" />
            <p>
              "Lumbini Technologies has been a reliable technology partner, consistently delivering solutions that align with our business goals. Their professionalism, responsiveness, and commitment to quality have made every collaboration smooth and successful."
            </p>
            <h4>– NIGHA TECH GLOBAL PVT LTD</h4>
          </div>
          <div className="testimonial">
            <img src={ideployLogo} alt="iDeploy" className="testimonial-logo" />
            <p>
              "The team at Lumbini Technologies brings strong technical expertise and a solution-oriented approach to every project. Their ability to understand requirements and deliver effective results has been truly valuable."
            </p>
            <h4>– iDeploy Bangalore</h4>
          </div>
          <div className="testimonial">
            <img src={gatesLogo} alt="GATES Institute" className="testimonial-logo" />
            <p>
              "Lumbini Technologies has helped us strengthen our digital ecosystem through dependable software solutions and dedicated support. Their work has contributed significantly to improving operational efficiency."
            </p>
            <h4>– Gates Institute of Management and Sciences</h4>
          </div>
          <div className="testimonial">
            <img
              src={inionDataLogo}
              alt="InionData"
              className="testimonial-logo"
            />
            <p>
              "Lumbini Technologies successfully delivered a modern, responsive, and professional website that accurately represents our brand. Their attention to detail, communication, and commitment to excellence ensured a smooth experience from concept to launch."
            </p>
            <h4>– InionData</h4>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us" id="why-us">
        <h2>Why Choose Lumbini Technologies</h2>
        <div className="why-cards">
          <div className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 3L4 8v6c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V8L14 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" fill="none" />
                <path d="M9 14l3.5 3.5L19 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4>Engineering Driven Approach</h4>
            <p>Our solutions are built on practical expertise, technical precision, and a commitment to quality.</p>
          </div>
          <div className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 4v4M14 20v4M4 14h4M20 14h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.7" fill="none" />
                <path d="M7.17 7.17l2.83 2.83M18 18l2.83 2.83M7.17 20.83l2.83-2.83M18 10l2.83-2.83" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            <h4>Innovation Focused</h4>
            <p>We continuously explore modern technologies to deliver solutions that create measurable value.</p>
          </div>
          <div className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="10" r="4" stroke="currentColor" strokeWidth="1.7" fill="none" />
                <path d="M6 24c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <h4>Customer Centric</h4>
            <p>Every project begins with understanding our clients' goals, challenges, and long-term vision.</p>
          </div>
          <div className="why-card">
            <div className="why-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 14.5C5 9.25 9.25 5 14.5 5S24 9.25 24 14.5 19.75 24 14.5 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
                <path d="M5 19v5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M14.5 9v5.5l3.5 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4>Reliable Partnership</h4>
            <p>We believe successful projects are built on trust, transparency, and long-term collaboration.</p>
          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default About;