import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Coffee, Award, Users } from "lucide-react";
import { supabase } from "../../services/supabase";
import "./Career.css";

const Career = () => {
  const navigate = useNavigate();

  const handleApply = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      // User not logged in
      navigate("/Login?redirect=/internship-application");
    } else {
      // User logged in
      navigate("/internship-application");
    }
  };

  const internship = {
    id: 1,
    title: "Student Internship Application",
    description: `We're currently accepting applications for student internships. If you're passionate about learning and building real-world projects with us, submit your application using the form.`,
  };

  const benefits = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health & Wellness",
      description:
        "Comprehensive health insurance, mental health support, and wellness programs for you and your family",
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Work-Life Balance",
      description:
        "Flexible working hours, remote work options, unlimited PTO, and a supportive work environment",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Growth & Learning",
      description:
        "Learning budget, conference attendance, certification support, and clear career development paths",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Great Culture",
      description:
        "Collaborative environment, team events, innovation time, and work with amazing colleagues",
    },
  ];

  const JobCard = ({ job }) => (
    <motion.div whileHover={{ y: -5 }} className="job-card">
      <div className="job-card-header">
        <div className="job-info">
          <h3 className="job-title">{job.title}</h3>
        </div>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="modal-actions">
        <button onClick={handleApply} className="btn btn-primary">
          Apply Now
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="career-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
          >
            Join Our <span className="text-highlight">Innovation</span> Journey
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-subtitle"
          >
            Build the future with cutting-edge technology and an amazing team
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-stats"
          >
            <div className="stat-card">
              <span className="stat-number">20+</span>
              <p className="stat-label">Team Members</p>
            </div>

            <div className="stat-card">
              <span className="stat-number">1</span>
              <p className="stat-label">Active Internship</p>
            </div>

            <div className="stat-card">
              <span className="stat-number">Vijayawada</span>
              <p className="stat-label">Current Workspace</p>
            </div>

            <div className="stat-card">
              <span className="stat-number">Bangalore</span>
              <p className="stat-label">Workspace Coming Soon</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="info-banner"
          >
            <p className="info-text">
              We are currently offering{" "}
              <strong>internships for students</strong>
              only. Our team has <strong>20+ members</strong>. One workspace is
              active in <strong>Vijayawada</strong>, and another is{" "}
              <strong>coming soon in Bangalore</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-container">
          <h2 className="section-title">Why Work With Us?</h2>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="benefit-card"
              >
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Internship Section */}
      <section className="jobs-section">
        <div className="section-container">
          <h2 className="section-title">Internship Application</h2>

          <div className="jobs-grid">
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <JobCard job={internship} />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Career;
