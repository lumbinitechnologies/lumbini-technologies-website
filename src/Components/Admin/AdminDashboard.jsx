import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { jsPDF } from "jspdf";
import signature from "../../assets/yeshraj_signature.png";

// ── Certificate PDF ───────────────────────────────────────────────────────────
const buildCertificatePDF = (app) => {
  console.log("Certificate generator running");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const name = app.name || "Intern Name";
  const company = "Lumbini Technologies";
  const role = "Software Engineer Intern";
  const CONTENT_X = 14;
  const CONTENT_W = W - 14 - 8;
  const LINE_H = 6.2;

  doc.setFillColor(26, 58, 140);
  doc.rect(0, 0, 7, H, "F");
  doc.setFillColor(26, 58, 140);
  doc.rect(0, 0, W, 38, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  const companyText = "LUMBINI TECHNOLOGIES P LTD.";
  doc.text(companyText, (W - doc.getTextWidth(companyText)) / 2, 29);
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(12, 33, W - 5, 33);
  doc.setDrawColor(26, 58, 140);
  doc.setLineWidth(1.5);
  doc.line(12, 42, W - 5, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const title = "Certificate of Appreciation";
  doc.text(title, (W - doc.getTextWidth(title)) / 2, 55);
  doc.setFontSize(11);
  const sub = "This certificate is proudly presented to";
  doc.text(sub, (W - doc.getTextWidth(sub)) / 2, 75);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(name, (W - doc.getTextWidth(name)) / 2, 86);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(0, 0, 0);

  let y = 97;
  const paras = [
    "In recognition and appreciation of the dedication, hard work, and valuable contributions made during the internship at " +
      company +
      ".",
    "During the internship period, " +
      name +
      " served as a " +
      role +
      " and consistently displayed a strong sense of responsibility, professionalism, and commitment to excellence.",
    name +
      " showed initiative, creativity, and a positive attitude while contributing to various tasks and responsibilities within the organization.",
    "The management and staff of " +
      company +
      " greatly appreciate the hard work and dedication shown during this period.",
    "We extend our best wishes for a bright and successful career ahead.",
  ];
  paras.forEach((para) => {
    const lines = doc.splitTextToSize(para, CONTENT_W);
    lines.forEach((line) => {
      doc.text(line, CONTENT_X, y);
      y += LINE_H;
    });
    y += 4;
  });

  const dateY = Math.max(y + 8, 200);
  doc.setFontSize(10.5);
  doc.text("Date: " + issueDate, CONTENT_X, dateY);

  const sigLabelY = dateY + 24;
  const sigLineY = sigLabelY + 6;
  const sigNameY = sigLineY + 8;
  const sigTitle1Y = sigNameY + 7;
  const sigTitle2Y = sigTitle1Y + 6;
  const sigEmailY = sigTitle2Y + 6;
  const sigPhoneY = sigEmailY + 5;

  doc.addImage(signature, "PNG", CONTENT_X, sigLabelY, 42, 14);
  doc.setDrawColor(51, 51, 51);
  doc.setLineWidth(0.6);
  doc.line(CONTENT_X, sigLineY, CONTENT_X + 55, sigLineY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("Yeshraj Maganti", CONTENT_X, sigNameY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text("CEO & Talent Acquisition Team", CONTENT_X, sigTitle1Y);
  doc.text("Lumbini Technologies", CONTENT_X, sigTitle2Y);
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text("hr@lumbinitechnologies.onmicrosoft.com", CONTENT_X, sigEmailY);
  doc.text("+91 9848294006", CONTENT_X, sigPhoneY);

  const FOOTER_H = 18;
  doc.setFillColor(13, 32, 96);
  doc.rect(0, H - FOOTER_H, W, FOOTER_H, "F");
  doc.setDrawColor(58, 90, 176);
  doc.setLineWidth(0.5);
  doc.line(W / 2 + 6, H - FOOTER_H + 3, W / 2 + 6, H - 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "Flat No. 9, 3rd Floor, A Block, Sarvani Towers,",
    14,
    H - FOOTER_H + 7,
  );
  doc.setFont("helvetica", "normal");
  doc.text("Siddhartha Nagar, Vijayawada - 520010.", 14, H - FOOTER_H + 13);
  const rightX = W / 2 + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("+91 9848294006", rightX, H - FOOTER_H + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("hr@lumbinitechnologies.onmicrosoft.com", rightX, H - FOOTER_H + 13);

  return doc;
};

// ── Offer Letter PDF ──────────────────────────────────────────────────────────
const buildOfferLetterPDF = (app) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const ML = 20;
  const MR = 20;
  const CW = W - ML - MR;
  const FOOTER_Y = H - 14;

  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const refNo = `LT/OL/${new Date().getFullYear()}/${String(app.id || "001").slice(-4).padStart(4, "0")}`;

  doc.setFillColor(22, 49, 120);
  doc.rect(0, 0, 8, H, "F");
  doc.rect(0, 0, W, 23, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text("LUMBINI TECHNOLOGIES PVT. LTD.", W / 2, 9.5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(180, 210, 255);
  doc.text("www.lumbinitechnologies.com  ·  hr@lumbinitechnologies.com  ·  +91 9848294006", W / 2, 15.5, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(220, 235, 255);
  doc.text("OFFER OF INTERNSHIP", W / 2, 21, { align: "center" });

  doc.setDrawColor(218, 165, 32);
  doc.setLineWidth(0.8);
  doc.line(ML, 25, W - MR, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Ref: ${refNo}`, ML, 31);
  doc.text(`Date: ${issueDate}`, W - MR, 31, { align: "right" });

  let y = 40;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text(app.name || "Candidate Name", ML, y); y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  if (app.email)      { doc.text(app.email,      ML, y); y += 3.8; }
  if (app.phone)      { doc.text(app.phone,      ML, y); y += 3.8; }
  if (app.university) { doc.text(app.university, ML, y); y += 3.8; }
  if (app.degree)     { doc.text(app.degree,     ML, y); y += 3.8; }
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(22, 49, 120);
  const subject = "Subject: Offer of Internship — Software Engineer Intern";
  doc.text(subject, ML, y);
  doc.setDrawColor(22, 49, 120);
  doc.setLineWidth(0.3);
  doc.line(ML, y + 1, ML + doc.getTextWidth(subject), y + 1);
  y += 6.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(20, 20, 20);
  doc.text(`Dear ${(app.name || "Candidate").split(" ")[0]},`, ML, y);
  y += 5.5;

  const para1 = `We are pleased to offer you the position of Software Engineer Intern at Lumbini Technologies Private Limited. Based on our evaluation of your application, we believe your skills and enthusiasm will contribute positively to our team and provide practical exposure to real-world software development.`;
  doc.setFontSize(9.5);
  doc.splitTextToSize(para1, CW).forEach((l) => { doc.text(l, ML, y); y += 4.8; });
  y += 3;

  const COL1 = 48;
  const ROW_H = 6.5;
  const rows = [
    ["Position",     "Software Engineer Intern"],
    ["Department",   "Engineering & Product"],
    ["Reporting To", "Project Mentor / Team Lead"],
    ["Duration",     "2 Months"],
    ["Mode",         "Hybrid / As Mutually Discussed"],
    ["Stipend",      "As per internship policy"],
    ["Start Date",   "As communicated separately"],
  ];
  const TABLE_H = rows.length * ROW_H + 9;

  doc.setFillColor(246, 248, 254);
  doc.setDrawColor(210, 220, 245);
  doc.setLineWidth(0.3);
  doc.roundedRect(ML, y, CW, TABLE_H, 2, 2, "FD");

  doc.setFillColor(22, 49, 120);
  doc.roundedRect(ML, y, CW, 8, 2, 2, "F");
  doc.rect(ML, y + 4, CW, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("INTERNSHIP DETAILS", ML + CW / 2, y + 6, { align: "center" });

  let ry = y + 12;
  rows.forEach(([key, val], i) => {
    if (i % 2 === 1) {
      doc.setFillColor(237, 241, 252);
      doc.rect(ML + 0.5, ry - 4, CW - 1, ROW_H, "F");
    }
    doc.setDrawColor(210, 220, 245);
    doc.setLineWidth(0.25);
    doc.line(ML + COL1, ry - 4, ML + COL1, ry + 3);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(50, 60, 100);
    doc.text(key, ML + 3, ry);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(25, 25, 25);
    doc.text(val, ML + COL1 + 3, ry);
    if (i < rows.length - 1) {
      doc.setDrawColor(215, 225, 248);
      doc.line(ML + 0.5, ry + 3, ML + CW - 0.5, ry + 3);
    }
    ry += ROW_H;
  });
  y += TABLE_H + 9;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(22, 49, 120);
  doc.text("Key Responsibilities", ML, y);
  doc.setDrawColor(218, 165, 32);
  doc.setLineWidth(0.5);
  doc.line(ML, y + 1.2, ML + 44, y + 1.2);
  y += 7.5;

  const responsibilities = [
    "Assist the engineering team in developing, testing, and maintaining software applications.",
    "Participate in project discussions, sprint planning, and technical reviews.",
    "Write clean, maintainable, and well-documented code following team standards.",
    "Collaborate with mentors and team members to deliver assigned tasks on time.",
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  responsibilities.forEach((item) => {
    const wrapped = doc.splitTextToSize(item, CW - 7);
    doc.text("•", ML + 1, y);
    wrapped.forEach((line, li) => { doc.text(line, ML + 5, y + li * 4.8); });
    y += wrapped.length * 4.8 + 1.8;
  });
  y += 3.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(22, 49, 120);
  doc.text("Terms & Conditions", ML, y);
  doc.setDrawColor(218, 165, 32);
  doc.setLineWidth(0.5);
  doc.line(ML, y + 1.2, ML + 42, y + 1.2);
  y += 7.5;

  const terms = [
    "The internship is for learning and training purposes and does not constitute an employment contract.",
    "The intern must maintain strict confidentiality regarding all company information and intellectual property.",
    "All work produced during the internship will remain the property of Lumbini Technologies Private Limited.",
    "Professional conduct, punctuality, and adherence to company policies are expected throughout the internship.",
    "A Certificate of Internship will be issued upon successful completion of the internship program.",
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  terms.forEach((item) => {
    const wrapped = doc.splitTextToSize(item, CW - 7);
    doc.text("•", ML + 1, y);
    wrapped.forEach((line, li) => { doc.text(line, ML + 5, y + li * 4.8); });
    y += wrapped.length * 4.8 + 1.8;
  });
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text("For Lumbini Technologies Pvt. Ltd.", ML, y);
  y += 6;

  doc.addImage(signature, "PNG", ML - 8, y, 42, 14);
  y += 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(22, 49, 120);
  doc.text("Yeshraj Maganti", ML, y);
  y += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 70);
  doc.text("CEO & Talent Acquisition", ML, y);
  y += 4.5;
  doc.text("Lumbini Technologies Pvt. Ltd.", ML, y);

  doc.setFillColor(13, 32, 96);
  doc.rect(0, FOOTER_Y, W, 14, "F");
  doc.setDrawColor(80, 110, 200);
  doc.setLineWidth(0.4);
  doc.line(W / 2 + 5, FOOTER_Y + 2.5, W / 2 + 5, FOOTER_Y + 11.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(200, 220, 255);
  doc.text("Flat No. 9, 3rd Floor, A Block, Sarvani Towers,", 12, FOOTER_Y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(160, 190, 240);
  doc.text("Siddhartha Nagar, Vijayawada – 520010", 12, FOOTER_Y + 10.5);

  const fRX = W / 2 + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("+91 9848294006", fRX, FOOTER_Y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(160, 190, 240);
  doc.text("hr@lumbinitechnologies.com", fRX, FOOTER_Y + 10.5);

  return doc;
};

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:     { label: "Pending",     color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
  shortlisted: { label: "Shortlisted", color: "#facc15", bg: "rgba(250,204,21,0.12)"  },
  selected:    { label: "Selected",    color: "#39ff14", bg: "rgba(57,255,20,0.10)"   },
  rejected:    { label: "Rejected",    color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

// ── Supabase helpers ──────────────────────────────────────────────────────────

// ✅ FIXED: now includes user_id from app so interns.user_id is never NULL
// Without user_id, UserDashboard's .eq("user_id", user.id) lookup always fails
const getOrCreateIntern = async (app) => {
  const { data: existing } = await supabase
    .from("interns")
    .select("id")
    .eq("application_id", app.id)
    .maybeSingle();
  if (existing) return existing.id;
  const { data: created, error } = await supabase
    .from("interns")
    .insert({
      application_id: app.id,
      user_id:        app.user_id,   // ← ADDED: links intern to auth.users.id
      name:           app.name,
      email:          app.email,
      start_date:     new Date().toISOString().split("T")[0],
      end_date:       null,
    })
    .select("id")
    .single();
  if (error) throw new Error("Could not create intern record: " + error.message);
  return created.id;
};

const uploadAndSaveDocument = async (pdfBlob, _fileName, internId, documentType) => {
  const fixedFileName = documentType === "offer_letter" ? "offer_letter.pdf" : "certificate.pdf";
  const path = `${internId}/${documentType}/${fixedFileName}`;

  await supabase.storage.from("documents").remove([path]);

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(path, pdfBlob, { contentType: "application/pdf", upsert: true, cacheControl: "0" });
  if (uploadError) throw new Error("Upload failed: " + uploadError.message);

  const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
  const fileUrl = urlData?.publicUrl;

  await supabase.from("documents").upsert({
    intern_id: internId,
    document_type: documentType,
    file_url: fileUrl,
  });
  return fileUrl;
};

// ── Component ─────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [sending, setSending] = useState(null);
  const [toast, setToast] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => { fetchApplications(); }, []);

  useEffect(() => {
    if (!selected) { setDocuments([]); return; }
    const fetchDocs = async () => {
      try {
        const internId = await getOrCreateIntern(selected);
        const { data } = await supabase.from("documents").select("*").eq("intern_id", internId);
        setDocuments(data || []);
      } catch {
        setDocuments([]);
      }
    };
    fetchDocs();
  }, [selected]);

  const fetchApplications = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) { setApplications([]); setLoadError(error.message); }
      else setApplications(data || []);
    } catch (e) {
      setApplications([]);
      setLoadError(e.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    await supabase.from("applications").update({ status }).eq("id", id);
    await fetchApplications();
    if (selected?.id === id) setSelected((prev) => ({ ...prev, status }));
    setUpdating(null);
    showToast("Marked as " + status);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerateDocument = async (type) => {
    if (!selected) return;
    setSending(`${selected.id}:${type}`);
    try {
      const doc =
        type === "offer"
          ? buildOfferLetterPDF(selected)
          : buildCertificatePDF(selected);
      const labelMap = { offer: "Offer_Letter", certificate: "Certificate" };
      const downloadName = `${selected.name?.replace(/\s+/g, "_")}_${labelMap[type]}.pdf`;
      doc.save(`${Date.now()}_${downloadName}`);
      try {
        const pdfBlob = doc.output("blob");
        const internId = await getOrCreateIntern(selected);
        const docTypeMap = { offer: "offer_letter", certificate: "certificate" };
        const fileUrl = await uploadAndSaveDocument(pdfBlob, downloadName, internId, docTypeMap[type]);
        console.log("[AdminDashboard] Document saved:", fileUrl);
        const { data: freshDocs } = await supabase.from("documents").select("*").eq("intern_id", internId);
        setDocuments(freshDocs || []);
        showToast(`${labelMap[type].replace("_", " ")} downloaded & saved ✓`);
      } catch (uploadErr) {
        console.warn("[AdminDashboard] Upload failed:", uploadErr.message);
        showToast(`${labelMap[type].replace("_", " ")} downloaded ✓`);
      }
    } catch (e) {
      console.error("[AdminDashboard] PDF generation failed:", e);
      showToast("Failed to generate document.");
    } finally {
      setSending(null);
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.university?.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filter === "all" || a.status === filter);
  });

  const counts = {
    all:         applications.length,
    pending:     applications.filter((a) => a.status === "pending").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    selected:    applications.filter((a) => a.status === "selected").length,
    rejected:    applications.filter((a) => a.status === "rejected").length,
  };

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adm {
          min-height: 100vh;
          background: #040404;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
          padding-top: 70px;
        }

        .adm-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 36px; border-bottom: 1px solid rgba(250,204,21,0.08);
          background: #040404; position: sticky; top: 70px; z-index: 50;
        }

        .adm-logo { display: flex; align-items: center; gap: 10px; font-size: 1rem; font-weight: 800; color: #fff; letter-spacing: 0.04em; }
        .adm-logo-dot { width: 10px; height: 10px; border-radius: 50%; background: #facc15; box-shadow: 0 0 10px rgba(250,204,21,0.6); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.85)} }

        .adm-refresh-btn {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); color: #64748b;
          font-size: 13px; font-family: 'JetBrains Mono', monospace;
          padding: 7px 14px; border-radius: 6px; cursor: pointer; transition: all 0.2s;
        }
        .adm-refresh-btn:hover { color: #facc15; border-color: rgba(250,204,21,0.25); }

        .adm-body { padding: 32px 36px; max-width: 1400px; margin: 0 auto; }

        .adm-stats { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; margin-bottom: 28px; }
        .adm-stat {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px;
          padding: 16px 20px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
        }
        .adm-stat::before { content:''; position:absolute; top:0;left:0;right:0; height:2px; background:var(--accent); opacity:0; transition:opacity 0.2s; }
        .adm-stat:hover::before, .adm-stat.active::before { opacity: 1; }
        .adm-stat:hover, .adm-stat.active { border-color: var(--accent-dim); background: rgba(255,255,255,0.04); }
        .adm-stat-label { font-size:11px; font-family:'JetBrains Mono',monospace; color:rgba(255,255,255,0.25); text-transform:uppercase; letter-spacing:.1em; margin-bottom:6px; }
        .adm-stat-num { font-size:2rem; font-weight:800; color:var(--accent); line-height:1; }

        .adm-controls { display:flex; gap:12px; margin-bottom:20px; align-items:center; }
        .adm-search {
          flex:1; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:8px;
          padding:10px 16px; color:#e2e8f0; font-size:14px; font-family:'Syne',sans-serif;
          outline:none; transition:border-color 0.2s;
        }
        .adm-search::placeholder { color:rgba(255,255,255,0.15); }
        .adm-search:focus { border-color:rgba(250,204,21,0.3); }
        .adm-count { font-family:'JetBrains Mono',monospace; font-size:13px; color:rgba(255,255,255,0.2); white-space:nowrap; }

        .adm-table-wrap { background:rgba(255,255,255,0.015); border:1px solid rgba(255,255,255,0.06); border-radius:12px; overflow:hidden; }
        .adm-table { width:100%; border-collapse:collapse; }
        .adm-table thead tr { background:rgba(255,255,255,0.025); border-bottom:1px solid rgba(255,255,255,0.06); }
        .adm-table th { padding:12px 16px; text-align:left; font-size:11px; font-family:'JetBrains Mono',monospace; color:rgba(255,255,255,0.2); text-transform:uppercase; letter-spacing:.1em; font-weight:600; }
        .adm-table tbody tr { border-bottom:1px solid rgba(255,255,255,0.04); cursor:pointer; transition:background 0.15s; }
        .adm-table tbody tr:last-child { border-bottom:none; }
        .adm-table tbody tr:hover { background:rgba(250,204,21,0.03); }
        .adm-table tbody tr.row-selected { background:rgba(250,204,21,0.05); }
        .adm-table td { padding:13px 16px; font-size:14px; color:#94a3b8; vertical-align:middle; }
        .adm-name { font-weight:700; color:#e2e8f0; font-size:14px; }
        .adm-email { font-family:'JetBrains Mono',monospace; font-size:12px; color:rgba(255,255,255,0.25); }

        .adm-status-badge { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600; font-family:'JetBrains Mono',monospace; background:var(--sbg); color:var(--sc); white-space:nowrap; }
        .adm-status-dot { width:6px; height:6px; border-radius:50%; background:var(--sc); }

        .adm-actions { display:flex; gap:6px; flex-wrap:wrap; }
        .adm-action-btn { padding:5px 11px; border-radius:6px; font-size:11px; font-family:'JetBrains Mono',monospace; font-weight:600; border:1px solid transparent; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
        .adm-action-btn:disabled { opacity:.4; cursor:not-allowed; }

        .btn-shortlist { background:rgba(250,204,21,.08); border-color:rgba(250,204,21,.2); color:#facc15; }
        .btn-shortlist:hover:not(:disabled) { background:rgba(250,204,21,.16); border-color:#facc15; }
        .btn-select { background:rgba(57,255,20,.08); border-color:rgba(57,255,20,.2); color:#39ff14; }
        .btn-select:hover:not(:disabled) { background:rgba(57,255,20,.16); border-color:#39ff14; }
        .btn-reject { background:rgba(248,113,113,.08); border-color:rgba(248,113,113,.2); color:#f87171; }
        .btn-reject:hover:not(:disabled) { background:rgba(248,113,113,.16); border-color:#f87171; }
        .btn-offer { background:rgba(59,130,246,.08); border-color:rgba(59,130,246,.2); color:#60a5fa; }
        .btn-offer:hover:not(:disabled) { background:rgba(59,130,246,.16); border-color:#60a5fa; }
        .btn-certificate { background:rgba(251,146,60,.08); border-color:rgba(251,146,60,.2); color:#fb923c; }
        .btn-certificate:hover:not(:disabled) { background:rgba(251,146,60,.16); border-color:#fb923c; }

        .adm-empty { text-align:center; padding:60px 20px; color:rgba(255,255,255,0.1); font-family:'JetBrains Mono',monospace; font-size:13px; }
        .adm-loading { text-align:center; padding:60px; color:#facc15; font-family:'JetBrains Mono',monospace; font-size:13px; animation:flicker 1.2s infinite; }
        @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:.4} }

        .adm-drawer-overlay { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:100; backdrop-filter:blur(4px); }
        .adm-drawer { position:fixed; top:0; right:0; width:420px; height:100vh; background:#060a0f; border-left:1px solid rgba(250,204,21,0.1); z-index:101; overflow-y:auto; padding:28px 28px 48px; animation:slideIn .25s ease; }
        @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }

        .adm-drawer-close { position:absolute; top:16px; right:20px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:rgba(255,255,255,0.3); width:30px; height:30px; border-radius:6px; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
        .adm-drawer-close:hover { color:#f87171; border-color:rgba(248,113,113,0.3); }
        .adm-drawer-name { font-size:1.4rem; font-weight:800; color:#fff; margin-bottom:4px; padding-right:36px; }
        .adm-drawer-email { font-family:'JetBrains Mono',monospace; font-size:12px; color:rgba(255,255,255,0.25); margin-bottom:20px; }
        .adm-drawer-section { margin-bottom:20px; }
        .adm-drawer-section-title { font-size:10px; font-family:'JetBrains Mono',monospace; color:rgba(57,255,20,0.35); text-transform:uppercase; letter-spacing:.15em; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.05); }
        .adm-drawer-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; gap:12px; }
        .adm-drawer-key { font-size:12px; color:rgba(255,255,255,0.2); font-family:'JetBrains Mono',monospace; flex-shrink:0; }
        .adm-drawer-val { font-size:13px; color:#64748b; text-align:right; word-break:break-word; }
        .adm-drawer-answer { font-size:13px; color:#475569; line-height:1.6; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:12px 14px; margin-top:6px; }
        .adm-drawer-resume-btn { display:inline-flex; align-items:center; gap:6px; margin-top:8px; padding:8px 14px; background:rgba(250,204,21,.08); border:1px solid rgba(250,204,21,.25); border-radius:6px; color:#facc15; font-size:12px; font-family:'JetBrains Mono',monospace; font-weight:600; text-decoration:none; transition:all 0.2s; }
        .adm-drawer-resume-btn:hover { background:rgba(250,204,21,.15); border-color:#facc15; }
        .adm-drawer-actions { display:flex; gap:8px; margin-top:24px; flex-wrap:wrap; }
        .adm-drawer-actions .adm-action-btn { flex:1; padding:9px 12px; font-size:12px; text-align:center; }

        .adm-docs-divider { font-size:9px; font-family:'JetBrains Mono',monospace; color:rgba(57,255,20,0.35); text-transform:uppercase; letter-spacing:.15em; margin: 16px 0 10px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.05); }

        .adm-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#facc15; color:#000; font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; padding:10px 22px; border-radius:999px; z-index:200; animation:toastIn .3s ease; white-space:nowrap; }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

        @media (max-width:1024px) { .adm-stats{grid-template-columns:repeat(3,1fr)} }
        @media (max-width:768px) {
          .adm { padding-top: 60px; }
          .adm-topbar { top: 60px; padding:14px 16px; }
          .adm-body{padding:20px 16px}
          .adm-stats{grid-template-columns:repeat(2,1fr)} .adm-drawer{width:100%}
          .adm-table th:nth-child(3), .adm-table td:nth-child(3){display:none}
        }
      `}</style>

      <div className="adm">
        <div className="adm-topbar">
          <div className="adm-logo">
            <div className="adm-logo-dot" />
            Lumbini Admin
          </div>
          <button className="adm-refresh-btn" onClick={fetchApplications}>
            ↻ Refresh
          </button>
        </div>

        <div className="adm-body">
          <div className="adm-stats">
            {[
              { key: "all",         label: "Total",       accent: "#facc15" },
              { key: "pending",     label: "Pending",     accent: "#6b7280" },
              { key: "shortlisted", label: "Shortlisted", accent: "#facc15" },
              { key: "selected",    label: "Selected",    accent: "#39ff14" },
              { key: "rejected",    label: "Rejected",    accent: "#f87171" },
            ].map(({ key, label, accent }) => (
              <div
                key={key}
                className={"adm-stat" + (filter === key ? " active" : "")}
                style={{ "--accent": accent, "--accent-dim": accent + "33" }}
                onClick={() => setFilter(key)}
              >
                <div className="adm-stat-label">{label}</div>
                <div className="adm-stat-num">{counts[key]}</div>
              </div>
            ))}
          </div>

          <div className="adm-controls">
            <input
              className="adm-search"
              placeholder="Search by name, email, university..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="adm-count">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="adm-table-wrap">
            {loading ? (
              <div className="adm-loading">Loading applications...</div>
            ) : loadError ? (
              <div className="adm-empty">
                // could not load applications
                <div style={{ marginTop: 10, color: "#f87171" }}>{loadError}</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="adm-empty">// no applications found</div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>University</th>
                    <th>Year</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => {
                    const s = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                    return (
                      <tr
                        key={app.id}
                        className={selected?.id === app.id ? "row-selected" : ""}
                        onClick={() => setSelected(app)}
                      >
                        <td>
                          <div className="adm-name">{app.name || "—"}</div>
                          <div className="adm-email">{app.email}</div>
                        </td>
                        <td>{app.university || "—"}</td>
                        <td>{app.year || "—"}</td>
                        <td>{fmt(app.created_at)}</td>
                        <td>
                          <span className="adm-status-badge" style={{ "--sbg": s.bg, "--sc": s.color }}>
                            <span className="adm-status-dot" />
                            {s.label}
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="adm-actions">
                            <button
                              className="adm-action-btn btn-shortlist"
                              disabled={app.status === "shortlisted" || updating === app.id + "shortlisted"}
                              onClick={() => updateStatus(app.id, "shortlisted")}
                            >Shortlist</button>
                            <button
                              className="adm-action-btn btn-select"
                              disabled={app.status === "selected" || updating === app.id + "selected"}
                              onClick={() => updateStatus(app.id, "selected")}
                            >Select</button>
                            <button
                              className="adm-action-btn btn-reject"
                              disabled={app.status === "rejected" || updating === app.id + "rejected"}
                              onClick={() => updateStatus(app.id, "rejected")}
                            >Reject</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selected && (() => {
        const s = STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending;
        const isSelected = selected.status === "selected";
        return (
          <>
            <div className="adm-drawer-overlay" onClick={() => setSelected(null)} />
            <div className="adm-drawer">
              <button className="adm-drawer-close" onClick={() => setSelected(null)}>✕</button>

              <div className="adm-drawer-name">{selected.name || "—"}</div>
              <div className="adm-drawer-email">{selected.email}</div>

              <span className="adm-status-badge" style={{ "--sbg": s.bg, "--sc": s.color, marginBottom: "20px", display: "inline-flex" }}>
                <span className="adm-status-dot" />
                {s.label}
              </span>

              <div className="adm-drawer-section">
                <div className="adm-drawer-section-title">Personal</div>
                <div className="adm-drawer-row">
                  <span className="adm-drawer-key">Phone</span>
                  <span className="adm-drawer-val">{selected.phone || "—"}</span>
                </div>
                <div className="adm-drawer-row">
                  <span className="adm-drawer-key">Applied</span>
                  <span className="adm-drawer-val">{fmt(selected.created_at)}</span>
                </div>
              </div>

              <div className="adm-drawer-section">
                <div className="adm-drawer-section-title">Education</div>
                <div className="adm-drawer-row">
                  <span className="adm-drawer-key">University</span>
                  <span className="adm-drawer-val">{selected.university || "—"}</span>
                </div>
                <div className="adm-drawer-row">
                  <span className="adm-drawer-key">Degree</span>
                  <span className="adm-drawer-val">{selected.degree || "—"}</span>
                </div>
                <div className="adm-drawer-row">
                  <span className="adm-drawer-key">Year</span>
                  <span className="adm-drawer-val">{selected.year || "—"}</span>
                </div>
              </div>

              {selected.skills && (
                <div className="adm-drawer-section">
                  <div className="adm-drawer-section-title">Skills</div>
                  <div className="adm-drawer-val" style={{ textAlign: "left" }}>{selected.skills}</div>
                </div>
              )}

              {selected.motivation && (
                <div className="adm-drawer-section">
                  <div className="adm-drawer-section-title">Why this internship?</div>
                  <div className="adm-drawer-answer">{selected.motivation}</div>
                </div>
              )}

              {selected.resume_url && (
                <div className="adm-drawer-section">
                  <div className="adm-drawer-section-title">Resume</div>
                  <a href={selected.resume_url} target="_blank" rel="noopener noreferrer" className="adm-drawer-resume-btn">
                    ↗ View Resume (PDF)
                  </a>
                </div>
              )}

              <div className="adm-drawer-actions">
                <button className="adm-action-btn btn-shortlist" disabled={selected.status === "shortlisted" || !!updating} onClick={() => updateStatus(selected.id, "shortlisted")}>Shortlist</button>
                <button className="adm-action-btn btn-select"    disabled={selected.status === "selected"    || !!updating} onClick={() => updateStatus(selected.id, "selected")}>Select</button>
                <button className="adm-action-btn btn-reject"    disabled={selected.status === "rejected"    || !!updating} onClick={() => updateStatus(selected.id, "rejected")}>Reject</button>
              </div>

              <div className="adm-docs-divider">Documents</div>
              {(() => {
                const offerDoc = documents.find((d) => d.document_type === "offer_letter");
                const certDoc  = documents.find((d) => d.document_type === "certificate");
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        className="adm-action-btn btn-offer"
                        style={{ flex: 1 }}
                        disabled={!!sending}
                        onClick={() => handleGenerateDocument("offer")}
                      >
                        {sending === `${selected.id}:offer`
                          ? "Generating..."
                          : offerDoc ? "↺ Regenerate Offer Letter" : "Generate Offer Letter"}
                      </button>
                      {offerDoc && (
                        <a
                          href={offerDoc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="adm-action-btn"
                          style={{ background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa", textDecoration: "none", whiteSpace: "nowrap" }}
                        >↗ View</a>
                      )}
                    </div>
                    {offerDoc && (
                      <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#39ff14", paddingLeft: 2 }}>
                        ✓ Offer Letter generated
                      </div>
                    )}

                    {isSelected && (
                      <>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <button
                            className="adm-action-btn btn-certificate"
                            style={{ flex: 1 }}
                            disabled={!!sending}
                            onClick={() => handleGenerateDocument("certificate")}
                          >
                            {sending === `${selected.id}:certificate`
                              ? "Generating..."
                              : certDoc ? "↺ Regenerate Certificate" : "Generate Certificate"}
                          </button>
                          {certDoc && (
                            <a
                              href={certDoc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="adm-action-btn"
                              style={{ background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa", textDecoration: "none", whiteSpace: "nowrap" }}
                            >↗ View</a>
                          )}
                        </div>
                        {certDoc && (
                          <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#39ff14", paddingLeft: 2 }}>
                            ✓ Certificate generated
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          </>
        );
      })()}

      {toast && <div className="adm-toast">{toast}</div>}
    </>
  );
};

export default AdminDashboard;