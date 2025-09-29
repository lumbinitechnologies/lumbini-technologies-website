// ScrollingTextBanner.jsx

import React from 'react';
import { motion } from 'framer-motion';
import './ScrollingTextBanner.css';

const ScrollingTextBanner = () => {
  const bannerText = "Launch Your Career with Us! • Internships Now Open at Lumbini Technologies • Join our dynamic team, work on real-world projects, and gain hands-on experience in cutting-edge technologies • ";

  // Replace this URL with your actual Google Form URL
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScCEn1nqxA-OP_iZirxGy5hmFMmwx83vA6KZlFjAY64m7D-Ew/viewform?usp=header";

  const handleApplyClick = () => {
    // Open Google Form in a new tab
    window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
  };

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

  // return (
  //   <div className="scrolling-text-banner">
  //     {/* <div className="banner-text-wrapper">
  //       <motion.div
  //         className="banner-text"
  //         animate={{ x: [0, -3500] }}
  //         transition={{
  //           duration: 45,
  //           repeat: Infinity,
  //           ease: "linear"
  //         }}
  //       >
  //         {scrollingTextSegments()}
  //       </motion.div>
  //     </div>

  //     <button
  //       className="apply-now-btn-inline"
  //       onClick={handleApplyClick}
  //     >
  //       Apply Now
  //     </button> */}
  //   </div>
  // );
};

export default ScrollingTextBanner;