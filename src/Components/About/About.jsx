import React from 'react';
import './About.css';
import { motion } from 'framer-motion';
import chairmanImg from '../../assets/chairman.jpeg';
import nighaLogo from '../../assets/nighalogo.jpg';
import ideployLogo from '../../assets/ideploylogo.jpg';
import gatesLogo from '../../assets/gateslogo.png';
import member1 from '../../assets/yeshrajmaganti.jpg';
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

      {/* Managing Director Section */}
      <section className="managing-director">
        <h2>Our Chairman/ Managing Director</h2>
        <div className="director-card">
          <img src={chairmanImg} alt="Srinivas Chakravarthy Maganti" />
          <div className="director-info">
            <h3>Srinivas Chakravarthy Maganti</h3>
            <p>
          
            </p>
          </div>
        </div>
      </section>

      {/* Our Members Section */}
<section className="our-members" id="members">
  <h2>Our Members</h2>
  <div className="member-cards">
    <div className="member-card">
      <img src={member1} alt="Team Member 1" />
      <h4>Yeshraj Maganti</h4>
      <p></p>
    </div>
    <div className="member-card">
      <img src={member2}  alt="Team Member 2" />
      <h4>Krishna Prabhu Maganti</h4>
      <p></p>
    </div>
    <div className="member-card">
      <img src={member3}  alt="Team Member 3" />
      <h4>Ravi Kumar Lanke</h4>
      <p></p>
    </div>
     <div className="member-card">
      <img src={member4}  alt="Team Member 4" />
      <h4>Jagadeesh Pilli</h4>
      <p></p>
    </div>
  </div>

    {/* Mission Statement */}
  <p className="mission-statement">
    Our mission is to redefine digital experiences through creativity, innovation, and relentless quality.
    At Lumbini Technologies, we don't just build products—we build trust.
  </p>
</section>


      {/* Testimonials Section */}
     <section className="testimonials" id="clients">
  <h2>Our Clients</h2>
  <div className="testimonial-cards">
    <div className="testimonial">
      <img src={nighaLogo} alt="NIGHA TechGlobal" className="testimonial-logo" />
      <p>"NIGHA TechGlobal Private Limited is a client of your company, Lumbini Technologies. It is a private enterprise that collaborates with your team for specialized software development and IT services."</p>
      <h4>– NIGHA TECH GLOBAL PVT LTD</h4>
    </div>
    <div className="testimonial">
      <img src={ideployLogo} alt="iDeploy" className="testimonial-logo" />
      <p>"IDEPLOY is a software company that specializes in developing and deploying innovative technology solutions. It focuses on providing tailored services to enhance business operations and user experiences."</p>
      <h4>– i Deploy Bangalore</h4>
    </div>
    <div className="testimonial">
      <img src={gatesLogo} alt="GATES Institute" className="testimonial-logo" />
      <p>"GATE Institute of Management and Sciences is a client of Lumbini Technologies. The institute collaborates with your company for custom software solutions and IT support to enhance their academic and administrative processes."</p>
      <h4>– Gates Institute of Management and Sciences</h4>
    </div>
  </div>
</section>

    </motion.div>
  );
};

export default About;
