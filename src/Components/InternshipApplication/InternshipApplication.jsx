import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { supabase } from "../../services/supabase";
import "./InternshipApplication.css";

const InternshipApplication = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    university: "",
    degree: "",
    year: "",
    skills: "",
    resume: null,
    motivation: "",
    confirmed: false,
  });

  const [resumeFileName, setResumeFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
      setResumeFileName(file.name);
      if (errors.resume) setErrors((prev) => ({ ...prev, resume: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.university.trim())
      newErrors.university = "College is required";
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.year) newErrors.year = "Year / Semester is required";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";
    if (!formData.resume) newErrors.resume = "Resume is required";
    if (!formData.motivation.trim())
      newErrors.motivation = "Please answer this question";
    if (!formData.confirmed)
      newErrors.confirmed = "Please confirm before submitting";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErr = document.querySelector(".field-error");
      if (firstErr)
        firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        alert("Please login first");
        navigate("/Login?redirect=/internship-application", { replace: true });
        return;
      }

      // Upload resume to Supabase Storage
      const fileExt = formData.resume.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, formData.resume);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

      // Insert — column names match DB schema exactly
      const { error } = await supabase.from("applications").insert([
        {
          name: formData.name,
          email: user.email,
          phone: formData.phone,
          university: formData.university,
          degree: formData.degree,
          year: formData.year,
          skills: formData.skills,
          motivation: formData.motivation,
          resume_url: publicUrlData.publicUrl,
          status: "pending",
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Error submitting application: " + err.message);
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="apply-page">
        <motion.div
          className="apply-success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="success-icon">✓</div>
          <h2 className="success-title">Application Submitted!</h2>
          <p className="success-text">
            Thank you for applying. Our team will review your application and
            get back to you soon.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/Career")}
          >
            Back to Careers
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <div className="apply-back-wrap">
        <button className="apply-back-btn" onClick={() => navigate("/Career")}>
          <ArrowLeft className="back-icon" />
          Back to Careers
        </button>
      </div>

      <motion.div
        className="apply-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="apply-header">
          <h1 className="apply-title">
            Student <span className="text-highlight">Internship</span>{" "}
            Application
          </h1>
          <p className="apply-subtitle">
            Fill in all the details carefully. Fields marked{" "}
            <span className="required-star">*</span> are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="apply-form" noValidate>
          {/* ── 1. PERSONAL ── */}
          <div className="form-section">
            <div className="form-section-label">
              <span className="section-number">1</span>
              Personal Information
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-input ${errors.name ? "input-error" : ""}`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className="field-error">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${errors.phone ? "input-error" : ""}`}
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <span className="field-error">{errors.phone}</span>
                )}
              </div>
            </div>
          </div>

          {/* ── 2. EDUCATION ── */}
          <div className="form-section">
            <div className="form-section-label">
              <span className="section-number">2</span>
              Education
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  College / University <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="university"
                  className={`form-input ${errors.university ? "input-error" : ""}`}
                  placeholder="e.g. VIT University"
                  value={formData.university}
                  onChange={handleChange}
                />
                {errors.university && (
                  <span className="field-error">{errors.university}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Degree / Course <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="degree"
                  className={`form-input ${errors.degree ? "input-error" : ""}`}
                  placeholder="e.g. B.Tech Computer Science"
                  value={formData.degree}
                  onChange={handleChange}
                />
                {errors.degree && (
                  <span className="field-error">{errors.degree}</span>
                )}
              </div>
            </div>

            <div className="form-row single">
              <div className="form-group">
                <label className="form-label">
                  Current Year / Semester{" "}
                  <span className="required-star">*</span>
                </label>
                <select
                  name="year"
                  className={`form-input form-select ${errors.year ? "input-error" : ""}`}
                  value={formData.year}
                  onChange={handleChange}
                >
                  <option value="">Select year / semester</option>
                  <option value="1st Year / Sem 1">1st Year / Sem 1</option>
                  <option value="1st Year / Sem 2">1st Year / Sem 2</option>
                  <option value="2nd Year / Sem 3">2nd Year / Sem 3</option>
                  <option value="2nd Year / Sem 4">2nd Year / Sem 4</option>
                  <option value="3rd Year / Sem 5">3rd Year / Sem 5</option>
                  <option value="3rd Year / Sem 6">3rd Year / Sem 6</option>
                  <option value="4th Year / Sem 7">4th Year / Sem 7</option>
                  <option value="4th Year / Sem 8">4th Year / Sem 8</option>
                </select>
                {errors.year && (
                  <span className="field-error">{errors.year}</span>
                )}
              </div>
            </div>
          </div>

          {/* ── 3. SKILLS ── */}
          <div className="form-section">
            <div className="form-section-label">
              <span className="section-number">3</span>
              Skills
            </div>

            <div className="form-group">
              <label className="form-label">
                Technical Skills <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="skills"
                className={`form-input ${errors.skills ? "input-error" : ""}`}
                placeholder="e.g. React, Node.js, Python, Figma..."
                value={formData.skills}
                onChange={handleChange}
              />
              <span className="field-hint">Separate skills with commas</span>
              {errors.skills && (
                <span className="field-error">{errors.skills}</span>
              )}
            </div>
          </div>

          {/* ── 4. RESUME ── */}
          <div className="form-section">
            <div className="form-section-label">
              <span className="section-number">4</span>
              Resume
            </div>

            <div className="form-group">
              <label className="form-label">
                Upload Resume (PDF) <span className="required-star">*</span>
              </label>
              <label
                className={`file-upload-label ${errors.resume ? "file-error" : ""}`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  className="file-input-hidden"
                  onChange={handleFileChange}
                />
                <span className="file-upload-inner">
                  <Upload className="upload-icon" />
                  {resumeFileName ? (
                    <span className="file-name">{resumeFileName}</span>
                  ) : (
                    <span className="file-placeholder">
                      Click to upload your resume (PDF only)
                    </span>
                  )}
                </span>
              </label>
              {errors.resume && (
                <span className="field-error">{errors.resume}</span>
              )}
            </div>
          </div>

          {/* ── 5. SHORT QUESTION ── */}
          <div className="form-section">
            <div className="form-section-label">
              <span className="section-number">5</span>
              Short Question
            </div>

            <div className="form-group">
              <label className="form-label">
                Why do you want this internship?{" "}
                <span className="required-star">*</span>
              </label>
              <textarea
                name="motivation"
                rows="5"
                className={`form-textarea ${errors.motivation ? "input-error" : ""}`}
                placeholder="Tell us what excites you about this opportunity..."
                value={formData.motivation}
                onChange={handleChange}
              />
              <span className="field-hint">
                Minimum 50 characters recommended
              </span>
              {errors.motivation && (
                <span className="field-error">{errors.motivation}</span>
              )}
            </div>
          </div>

          {/* ── 6. CONFIRMATION ── */}
          <div className="form-section">
            <div className="form-section-label">
              <span className="section-number">6</span>
              Confirmation
            </div>

            <div className="form-group">
              <label
                className={`checkbox-label ${errors.confirmed ? "checkbox-error" : ""}`}
              >
                <input
                  type="checkbox"
                  name="confirmed"
                  className="checkbox-input"
                  checked={formData.confirmed}
                  onChange={handleChange}
                />
                <span className="checkbox-custom" />
                <span className="checkbox-text">
                  I confirm that the information provided is correct and
                  accurate to the best of my knowledge.
                </span>
              </label>
              {errors.confirmed && (
                <span className="field-error">{errors.confirmed}</span>
              )}
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div className="apply-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/Career")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="btn-loading">
                  <span className="spinner" /> Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default InternshipApplication;
