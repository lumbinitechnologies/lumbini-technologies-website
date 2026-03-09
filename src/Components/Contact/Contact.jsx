import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.2, ease: 'easeOut', when: "beforeChildren", staggerChildren: 0.15 },
  },
};
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  React.useEffect(() => { emailjs.init('ff8fWszDkzCSx-XBq'); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (msg.text) setMsg({ text: '', type: '' });
  };

  const showMsg = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 5000);
  };

  const validateForm = () => {
    if (!formData.name.trim())    { showMsg('Please enter your name', 'error'); return false; }
    if (!formData.email.trim())   { showMsg('Please enter your email', 'error'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { showMsg('Please enter a valid email address', 'error'); return false; }
    if (!formData.message.trim()) { showMsg('Please enter your message', 'error'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await emailjs.sendForm('service_alyb4ni', 'template_roai3bb', form.current, 'ff8fWszDkzCSx-XBq');
      console.log('✅ Email sent:', result.text);
      showMsg("Message sent successfully! We'll get back to you soon.", 'success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('❌ Email failed:', error);
      showMsg('Failed to send message. Please try again or contact us directly.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        @keyframes glitchBlink {
          0%, 94%, 100% { opacity: 1; text-shadow: 0 0 10px #facc15, 0 0 40px rgba(250,204,21,0.2); }
          95%            { opacity: 0.2; text-shadow: 5px 0 #facc15; }
          97%            { opacity: 0.8; text-shadow: -4px 0 #facc15; }
        }
        @keyframes whisperIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes terminalCursor {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }

        .contact-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          background: transparent;
          padding: 8rem 1rem;
          margin-top: 7rem;
        }

        /* ── CARD: same white glass as Login/Signup ── */
        .contact-wrap {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
          padding: 2.5rem 3rem;
          width: 100%;
          max-width: 550px;
          box-sizing: border-box;
          text-align: center;
          font-family: 'Share Tech Mono', monospace;
        }

        /* ── Terminal dot bar ── */
        .contact-tbar {
          display: flex; align-items: center; gap: 5px;
          margin-bottom: 1.6rem;
          padding: 0.3rem 0.65rem;
          background: rgba(57,255,20,0.06);
          border: 1px solid rgba(57,255,20,0.2);
          border-radius: 5px;
          font-size: 0.56rem; color: #39ff14; letter-spacing: 0.12em;
          text-align: left;
        }
        .contact-tbar-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .contact-tbar-text { flex: 1; padding-left: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .contact-cursor {
          display: inline-block; width: 5px; height: 10px;
          background: #39ff14; margin-left: 3px;
          animation: terminalCursor 1s step-end infinite;
          vertical-align: middle;
        }

        /* ── Title ── */
        .contact-heading {
          font-family: 'Orbitron', monospace;
          font-size: 2rem; font-weight: 900;
          color: #facc15; letter-spacing: 3px;
          margin-bottom: 0.4rem;
          text-shadow: 0 0 20px rgba(250,204,21,0.5), 0 0 40px rgba(250,204,21,0.2);
          animation: glitchBlink 6s infinite;
        }
        .contact-subtitle {
          color: rgba(57, 255, 20, 0.55);
          font-size: 0.76rem; letter-spacing: 2px;
          font-family: 'Share Tech Mono', monospace;
          text-transform: uppercase; margin-bottom: 1.8rem;
        }

        /* ── Message banner ── */
        .contact-msg {
          padding: 10px 14px; margin-bottom: 1rem;
          border-radius: 6px; font-size: 0.74rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.03em; line-height: 1.6;
          text-align: left;
          animation: whisperIn 0.3s ease forwards;
        }
        .contact-msg.success {
          background: rgba(57,255,20,0.06);
          border: 1px solid rgba(57,255,20,0.25);
          border-left: 3px solid #39ff14;
          color: #39ff14;
        }
        .contact-msg.error {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.3);
          border-left: 3px solid #ef4444;
          color: #f87171;
        }

        /* ── Form ── */
        .contact-form {
          display: flex; flex-direction: column; gap: 12px;
          margin-bottom: 1.8rem;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%; padding: 14px 16px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(250, 204, 21, 0.3);
          border-radius: 8px;
          color: #fff; font-size: 0.95rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.05em;
          outline: none; box-sizing: border-box;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: rgba(250, 204, 21, 0.28);
        }
        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: #facc15;
          box-shadow: 0 0 0 2px rgba(250,204,21,0.12), 0 0 18px rgba(250,204,21,0.1);
          background: rgba(255, 255, 255, 0.1);
        }
        .contact-form textarea { resize: vertical; min-height: 120px; }

        /* ── Button ── */
        .contact-btn {
          width: 100%; padding: 14px;
          background: #facc15; color: #000;
          border: none; border-radius: 8px;
          font-family: 'Orbitron', monospace;
          font-size: 1rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer; margin-top: 0.25rem;
          transition: all 0.3s ease;
        }
        .contact-btn:hover:not(:disabled) {
          background: #fde047;
          transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(250,204,21,0.45), 0 0 40px rgba(250,204,21,0.15);
        }
        .contact-btn:active { transform: translateY(0); }
        .contact-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        /* ── Info section ── */
        .contact-divider {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1.2rem;
        }
        .contact-info-label {
          font-size: 0.62rem; font-family: 'Share Tech Mono', monospace;
          color: rgba(57,255,20,0.45); text-transform: uppercase;
          letter-spacing: 0.15em; margin-bottom: 0.6rem;
          text-align: left;
        }
        .contact-info {
          text-align: left;
        }
        .contact-info p {
          font-size: 0.76rem; font-family: 'Share Tech Mono', monospace;
          color: rgba(255,255,255,0.4); line-height: 1.9; margin: 0;
          letter-spacing: 0.03em;
        }
        .contact-info span { color: #facc15; }

        @media (max-width: 768px) {
          .contact-page { padding: 10rem 1rem; margin-top: 1rem; }
          .contact-wrap { padding: 2rem 1.5rem; }
          .contact-heading { font-size: 1.5rem; }
          .contact-btn { font-size: 0.9rem; }
        }
        @media (max-width: 480px) {
          .contact-wrap { padding: 1.5rem 1.2rem; }
          .contact-heading { font-size: 1.3rem; }
        }
      `}</style>

      <div className="contact-page">
        <motion.div
          className="contact-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Terminal bar */}
          <motion.div className="contact-tbar" variants={childVariants}>
            <span className="contact-tbar-dot" style={{ background: "#ff5f57" }} />
            <span className="contact-tbar-dot" style={{ background: "#facc15" }} />
            <span className="contact-tbar-dot" style={{ background: "#39ff14" }} />
            <span className="contact-tbar-text">CONTACT.SYS — MESSAGE DISPATCH<span className="contact-cursor" /></span>
          </motion.div>

          <motion.h1 className="contact-heading" variants={childVariants}>
            CONTACT US
          </motion.h1>
          <motion.p className="contact-subtitle" variants={childVariants}>
            // send us a transmission
          </motion.p>

          {/* Message banner */}
          {msg.text && (
            <motion.div
              className={`contact-msg ${msg.type}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg.type === 'error' ? '// ERROR — ' : '// SUCCESS — '}{msg.text}
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            ref={form}
            className="contact-form"
            variants={childVariants}
            onSubmit={handleSubmit}
          >
            <input
              type="text" name="name"
              placeholder="your_name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email" name="email"
              placeholder="your_email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <textarea
              rows="5" name="message"
              placeholder="your_message"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
            <input type="hidden" name="to_email" value="admin@lumbinitechnologies.com" />

            <button type="submit" className="contact-btn" disabled={isLoading}>
              {isLoading ? 'TRANSMITTING...' : 'SEND MESSAGE'}
            </button>
          </motion.form>

          {/* Contact info */}
          <hr className="contact-divider" />
          <motion.div variants={childVariants}>
            <div className="contact-info-label">// contact.dat</div>
            <div className="contact-info">
              <p><span>email</span> — admin@lumbinitechnologies.com</p>
              <p><span>phone</span> — +91 9848294006</p>
              <p>
                <span>address</span> — Flat No. 9, 3rd Floor, A Block, Sarvani Towers,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Siddhartha Nagar, Vijayawada - 520010
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
};

export default Contact;