import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../services/supabase";

/* ─── Category theming ──────────────────────────────────────── */
const categoryAccent = {
  AI: "#facc15",
  "Web Development": "#39ff14",
  Cybersecurity: "#ff4d4d",
  Research: "#a78bfa",
  "Intern Experience": "#38bdf8",
};

const categoryTag = {
  AI: "AI.SYS",
  "Web Development": "WEB.EXE",
  Cybersecurity: "SEC.SYS",
  Research: "RES.EXE",
  "Intern Experience": "LOG.TXT",
};

/* ─── Tiny rich-text renderer ───────────────────────────────── */
/*
  Supports the following lightweight Markdown-like syntax:
    # H1  ## H2  ### H3
    **bold**  *italic*  `code`
    > blockquote
    - bullet   1. ordered
    ```code block```
    ![alt](url)  — inline image
    [text](url)  — link
    ---  — horizontal rule
    blank line → paragraph break
*/
const renderContent = (raw = "") => {
  const lines = raw.split("\n");
  const elements = [];
  let i = 0;
  let key = 0;

  const inlineStyles = (text) => {
    // images first so links don't eat them
    const parts = [];
    const re = /!\[([^\]]*)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      if (m[1] !== undefined) {
        // inline image
        parts.push(
          <img key={key++} src={m[2]} alt={m[1]}
               style={{maxWidth:"100%",borderRadius:"10px",margin:"0.5rem 0",display:"block"}} />
        );
      } else if (m[3]) {
        parts.push(<code key={key++} className="bd-inline-code">{m[3]}</code>);
      } else if (m[4]) {
        parts.push(<strong key={key++}>{m[4]}</strong>);
      } else if (m[5]) {
        parts.push(<em key={key++}>{m[5]}</em>);
      } else if (m[6]) {
        parts.push(<a key={key++} href={m[7]} target="_blank" rel="noopener noreferrer" className="bd-link">{m[6]}</a>);
      }
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  };

  while (i < lines.length) {
    const line = lines[i];

    // fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={key++} className="bd-code-block">
          {lang && <span className="bd-code-lang">{lang}</span>}
          <pre><code>{codeLines.join("\n")}</code></pre>
        </div>
      );
      i++;
      continue;
    }

    // horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(<div key={key++} className="bd-divider" />);
      i++;
      continue;
    }

    // headings
    const hMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const Tag = `h${level}`;
      elements.push(
        <Tag key={key++} className={`bd-h${level}`}>{inlineStyles(hMatch[2])}</Tag>
      );
      i++;
      continue;
    }

    // blockquote
    if (line.startsWith(">")) {
      const qLines = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        qLines.push(lines[i].slice(1).trim());
        i++;
      }
      elements.push(
        <blockquote key={key++} className="bd-blockquote">
          {qLines.map((l, j) => <p key={j}>{inlineStyles(l)}</p>)}
        </blockquote>
      );
      continue;
    }

    // unordered list
    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={key++} className="bd-ul">
          {items.map((item, j) => <li key={j}>{inlineStyles(item)}</li>)}
        </ul>
      );
      continue;
    }

    // ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="bd-ol">
          {items.map((item, j) => <li key={j}>{inlineStyles(item)}</li>)}
        </ol>
      );
      continue;
    }

    // standalone image line  ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      elements.push(
        <figure key={key++} className="bd-figure">
          <img src={imgMatch[2]} alt={imgMatch[1]} className="bd-content-img" />
          {imgMatch[1] && <figcaption className="bd-figcap">{imgMatch[1]}</figcaption>}
        </figure>
      );
      i++;
      continue;
    }

    // blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // paragraph — collect consecutive non-special lines
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("```") &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) {
      elements.push(
        <p key={key++} className="bd-p">{inlineStyles(paraLines.join(" "))}</p>
      );
    }
  }

  return elements;
};

/* ─── Component ─────────────────────────────────────────────── */
const BlogDetails = () => {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const [blog, setBlog]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "approved")
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setBlog(data);
        supabase
          .from("blogs")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", data.id)
          .then(() => {});
      }
      setLoading(false);
    };
    loadBlog();
  }, [slug]);

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');
          @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
          .bd-loading{min-height:100vh;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;font-family:'Share Tech Mono',monospace;color:rgba(255,255,255,.25);font-size:.75rem;letter-spacing:.12em}
          .bd-spinner{width:36px;height:36px;border:2px solid rgba(250,204,21,.15);border-top-color:#facc15;border-radius:50%;animation:spin .8s linear infinite}
        `}</style>
        <div className="bd-loading">
          <div className="bd-spinner" />
          // fetching article…
        </div>
      </>
    );
  }

  /* ── 404 ─────────────────────────────────────────────────── */
  if (notFound || !blog) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');
          .bd-404{min-height:100vh;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:'Share Tech Mono',monospace;text-align:center;padding:2rem}
          .bd-404-code{font-family:'Orbitron',monospace;font-size:5rem;font-weight:900;color:rgba(250,204,21,.12);line-height:1}
          .bd-404-msg{color:rgba(255,255,255,.4);font-size:.85rem;letter-spacing:.1em;margin:1rem 0 2rem}
          .bd-back-btn{padding:.7rem 2rem;background:#facc15;color:#000;border:none;border-radius:6px;font-family:'Orbitron',monospace;font-size:.75rem;font-weight:700;letter-spacing:2px;cursor:pointer;transition:all .25s}
          .bd-back-btn:hover{background:#fde047;transform:translateY(-2px)}
        `}</style>
        <div className="bd-404">
          <span className="bd-404-code">404</span>
          <p className="bd-404-msg">// article not found — it may have been removed or the link is incorrect</p>
          <button className="bd-back-btn" onClick={() => navigate("/Blogs")}>← BACK TO BLOGS</button>
        </div>
      </>
    );
  }

  /* ── Article ─────────────────────────────────────────────── */
  const accent   = categoryAccent[blog.category] || "#facc15";
  const tag      = categoryTag[blog.category]    || "ART.EXE";
  const wordCount = (blog.content || "").trim().split(/\s+/).filter(Boolean).length;
  const readTime  = Math.max(1, Math.ceil(wordCount / 200));
  const displayDate = new Date(blog.published_at || blog.created_at)
    .toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  const authorName = blog.author_name || "Lumbini Team";
  const authorRole = blog.author_role || "Contributor";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        /* ── Animations ── */
        @keyframes glitchBlink{
          0%,90%,100%{opacity:1;text-shadow:0 0 14px color-mix(in srgb,var(--acc) 45%,transparent)}
          92%{opacity:.25;text-shadow:4px 0 var(--acc),-2px 0 rgba(57,255,20,.6)}
          96%{opacity:.85;text-shadow:-3px 0 var(--acc),2px 0 rgba(57,255,20,.4)}
        }
        @keyframes scanPass{
          0%{transform:translateY(-100%)}
          100%{transform:translateY(100vh)}
        }
        @keyframes pulseAcc{
          0%,100%{opacity:.5}
          50%{opacity:1}
        }

        /* ── Page shell ── */
        *,*::before,*::after{box-sizing:border-box}
        .bd-page{
          min-height:100vh;
          background:transparent;
          color:#fff;
          font-family:'Plus Jakarta Sans', sans-serif;
          overflow-x:hidden;
          padding-top:80px;
          position:relative;
          --acc:${accent};
        }
        /* scanline sweep */
        .bd-page::before{
          content:'';
          position:fixed;
          top:0;left:0;right:0;
          height:2px;
          background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--acc) 35%,transparent),transparent);
          animation:scanPass 8s linear infinite;
          pointer-events:none;
          z-index:100;
        }
        /* ambient glow */
        .bd-page::after{
          content:'';
          position:fixed;
          top:0;left:50%;
          transform:translateX(-50%);
          width:min(900px,100%);
          height:400px;
          background:radial-gradient(ellipse at top,color-mix(in srgb,var(--acc) 6%,transparent),transparent 70%);
          pointer-events:none;
          z-index:0;
        }

        /* ── Layout containers ── */
        /* outer: full bleed background sections */
        .bd-hero-outer{
          position:relative;
          z-index:1;
          border-bottom:1px solid rgba(255,255,255,.06);
          background:radial-gradient(ellipse 80% 60% at 50% -10%,color-mix(in srgb,var(--acc) 8%,transparent),transparent 70%);
          padding:clamp(2.5rem,5vw,4.5rem) clamp(1rem,4vw,2.5rem) 0;
        }
        /* inner: caps content width */
        .bd-wrap{
          max-width:1400px;
          width:100%;
          margin:0 auto;
        }
        .bd-article-wrap{
          max-width:1400px;
          width:100%;
          margin:0 auto;
          padding:0 clamp(1rem,4vw,2.5rem);
        }

        /* ── Back button ── */
        .bd-back{
          display:inline-flex;
          align-items:center;
          gap:.5rem;
          background:none;
          border:1px solid rgba(255,255,255,.1);
          color:rgba(255,255,255,.4);
          font-family:'Share Tech Mono',monospace;
          font-size:.7rem;
          letter-spacing:.12em;
          padding:.4rem 1rem;
          border-radius:5px;
          cursor:pointer;
          transition:border-color .2s,color .2s;
          margin-bottom:2rem;
        }
        .bd-back:hover{border-color:var(--acc);color:var(--acc)}

        /* ── Category / tag row ── */
        .bd-tag-row{
          display:flex;
          align-items:center;
          gap:.75rem;
          margin-bottom:1.1rem;
          flex-wrap:wrap;
        }
        .bd-sys-tag{
          font-size:.58rem;
          color:var(--acc);
          letter-spacing:.22em;
          text-transform:uppercase;
          opacity:.65;
          animation:pulseAcc 3s ease-in-out infinite;
        }
        .bd-cat{
          display:inline-block;
          padding:3px 13px;
          background:color-mix(in srgb,var(--acc) 10%,transparent);
          border:1px solid color-mix(in srgb,var(--acc) 28%,transparent);
          color:var(--acc);
          border-radius:20px;
          font-size:.6rem;
          font-weight:600;
          text-transform:uppercase;
          letter-spacing:.12em;
        }

        /* ── Title ── */
        .bd-title{
          font-family:'Orbitron', sans-serif;
          font-size:clamp(1.5rem,3.8vw,2.8rem);
          font-weight:900;
          color:#fff;
          letter-spacing:1px;
          line-height:1.18;
          margin:0 0 1.6rem;
          animation:glitchBlink 10s infinite;
        }

        /* ── Meta bar ── */
        .bd-meta{
          display:flex;
          align-items:center;
          gap:1.25rem;
          flex-wrap:wrap;
          padding:1.2rem 0;
          border-top:1px solid rgba(255,255,255,.07);
          border-bottom:1px solid rgba(255,255,255,.07);
          font-family: 'Share Tech Mono', monospace;
        }
        .bd-author-name{font-size:.78rem;color:#fff;display:block;margin-bottom:.18rem;font-weight:600}
        .bd-author-role{font-size:.62rem;color:rgba(255,255,255,.3);letter-spacing:.09em}
        .bd-meta-sep{width:1px;height:30px;background:rgba(255,255,255,.1);flex-shrink:0}
        .bd-meta-item{font-size:.66rem;letter-spacing:.09em;white-space:nowrap}
        .bd-meta-item.green{color:rgba(57,255,20,.75)}
        .bd-meta-item.dim{color:rgba(255,255,255,.3)}
        .bd-views{font-size:.63rem;color:rgba(255,255,255,.2);letter-spacing:.07em;white-space:nowrap}

        /* ── Cover image ── */
        .bd-cover-outer{
          position:relative;z-index:1;
          padding:2.5rem clamp(1rem,4vw,2.5rem) 0;
        }
        .bd-cover{
          width:100%;
          max-width:1400px;
          max-height:520px;
          object-fit:cover;
          border-radius:16px;
          display:block;
          margin:0 auto;
          border:1px solid rgba(255,255,255,.08);
          box-shadow:0 24px 80px rgba(0,0,0,.6);
        }

        /* ── Divider ── */
        .bd-divider{
          height:1px;
          background:linear-gradient(90deg,var(--acc),color-mix(in srgb,var(--acc) 25%,rgba(57,255,20,.3)),transparent);
          opacity:.3;
          margin:2.75rem 0;
          border:none;
        }

        /* ── Article body ── */
        .bd-body{
          position:relative;z-index:1;
          padding:3rem 0 5rem;
          max-width:900px;     /* optimal reading width within the wider wrap */
          margin:0 auto;
        }

        /* ── Paragraph ── */
        .bd-p{
          color:rgba(255,255,255,.72);
          font-size:clamp(.88rem,1.35vw,1rem);
          line-height:2;
          margin:0 0 1.6rem;
          letter-spacing:.025em;
        }
        .bd-p:first-child{
          color:rgba(255,255,255,.88);
          font-size:clamp(.92rem,1.5vw,1.08rem);
        }
        .bd-p:last-child{margin-bottom:0}

        /* ── Headings inside body ── */
        .bd-h1,.bd-h2,.bd-h3{
          font-family:'Orbitron', sans-serif;
          color:#fff;
          margin:2.5rem 0 1rem;
          line-height:1.25;
          letter-spacing:.5px;
        }
        .bd-h1{font-size:clamp(1.3rem,2.5vw,1.9rem);font-weight:900}
        .bd-h2{
          font-size:clamp(1.1rem,2vw,1.55rem);
          font-weight:700;
          color:var(--acc);
          border-bottom:1px solid color-mix(in srgb,var(--acc) 20%,transparent);
          padding-bottom:.5rem;
        }
        .bd-h3{font-size:clamp(.95rem,1.6vw,1.2rem);font-weight:700;color:rgba(255,255,255,.75)}

        /* ── Lists ── */
        .bd-ul,.bd-ol{
          color:rgba(255,255,255,.7);
          font-size:clamp(.85rem,1.3vw,.97rem);
          line-height:1.9;
          margin:0 0 1.6rem 0;
          padding-left:1.6rem;
          letter-spacing:.025em;
        }
        .bd-ul li,.bd-ol li{margin-bottom:.5rem}
        .bd-ul li::marker{color:var(--acc)}
        .bd-ol li::marker{color:var(--acc);font-weight:700}

        /* ── Blockquote ── */
        .bd-blockquote{
          margin:0 0 1.6rem;
          padding:1.2rem 1.6rem;
          border-left:3px solid var(--acc);
          background:color-mix(in srgb,var(--acc) 5%,rgba(255,255,255,.02));
          border-radius:0 8px 8px 0;
        }
        .bd-blockquote p{
          color:rgba(255,255,255,.6);
          font-size:.9rem;
          line-height:1.8;
          margin:0;
          font-style:italic;
        }

        /* ── Inline code ── */
        .bd-inline-code{
          font-family:'Share Tech Mono',monospace;
          background:rgba(255,255,255,.07);
          border:1px solid rgba(255,255,255,.1);
          color:var(--acc);
          padding:1px 7px;
          border-radius:4px;
          font-size:.85em;
        }

        /* ── Code block ── */
        .bd-code-block{
          position:relative;
          background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.09);
          border-left:3px solid var(--acc);
          border-radius:8px;
          margin:0 0 1.6rem;
          overflow:hidden;
        }
        .bd-code-lang{
          display:block;
          font-size:.6rem;
          letter-spacing:.15em;
          text-transform:uppercase;
          color:var(--acc);
          padding:.6rem 1.2rem .4rem;
          opacity:.7;
          border-bottom:1px solid rgba(255,255,255,.06);
        }
        .bd-code-block pre{
          margin:0;
          padding:1.2rem;
          overflow-x:auto;
          font-size:.82rem;
          line-height:1.75;
          color:rgba(255,255,255,.7);
          font-family:'Share Tech Mono',monospace;
        }
        .bd-code-block pre::-webkit-scrollbar{height:4px}
        .bd-code-block pre::-webkit-scrollbar-track{background:transparent}
        .bd-code-block pre::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px}

        /* ── Content images ── */
        .bd-figure{margin:2rem 0;text-align:center}
        .bd-content-img{
          max-width:100%;
          border-radius:12px;
          border:1px solid rgba(255,255,255,.08);
          display:inline-block;
        }
        .bd-figcap{
          margin-top:.6rem;
          font-size:.65rem;
          color:rgba(255,255,255,.3);
          letter-spacing:.08em;
          font-style:italic;
        }

        /* ── Links ── */
        .bd-link{
          color:var(--acc);
          text-decoration:none;
          border-bottom:1px solid color-mix(in srgb,var(--acc) 40%,transparent);
          transition:border-color .2s,opacity .2s;
        }
        .bd-link:hover{opacity:.8;border-color:var(--acc)}

        /* ── Footer bar ── */
        .bd-footer-bar{
          background:rgba(255,255,255,.025);
          border:1px solid rgba(255,255,255,.08);
          border-radius:14px;
          padding:1.5rem 2rem;
          display:flex;
          align-items:center;
          justify-content:space-between;
          flex-wrap:wrap;
          gap:1rem;
          margin-top:3rem;
        }
        .bd-footer-label{
          font-size:.6rem;
          color:rgba(255,255,255,.28);
          letter-spacing:.14em;
          text-transform:uppercase;
          margin-bottom:.35rem;
        }
        .bd-footer-val{
          font-size:.78rem;
          color:rgba(255,255,255,.55);
        }
        .bd-footer-btn{
          padding:.65rem 1.75rem;
          background:var(--acc);
          color:#000;
          border:none;
          border-radius:7px;
          font-family:'Orbitron',monospace;
          font-size:.7rem;
          font-weight:700;
          letter-spacing:2px;
          text-transform:uppercase;
          cursor:pointer;
          transition:filter .2s,transform .2s,box-shadow .2s;
          white-space:nowrap;
        }
        .bd-footer-btn:hover{
          filter:brightness(1.1);
          transform:translateY(-2px);
          box-shadow:0 8px 28px color-mix(in srgb,var(--acc) 35%,transparent);
        }

        /* ── Progress bar (reading indicator) ── */
        .bd-progress{
          position:fixed;
          top:0;left:0;
          height:3px;
          background:var(--acc);
          width:var(--progress,0%);
          z-index:200;
          transition:width .1s linear;
          box-shadow:0 0 10px color-mix(in srgb,var(--acc) 60%,transparent);
        }

        /* ── Responsive ── */
        @media(max-width:768px){
          .bd-meta-sep{display:none}
          .bd-body{padding:2rem 0 4rem}
          .bd-footer-bar{flex-direction:column;text-align:center;align-items:center}
        }
        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
        }
      `}</style>

      {/* Reading progress bar */}
      <ReadingProgress />

      <div className="bd-page">
        {/* ── Hero / header ────────────────────────────── */}
        <section className="bd-hero-outer">
          <div className="bd-wrap">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <button className="bd-back" onClick={() => navigate("/Blogs")}>
                ← BACK TO BLOGS
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}>
              <div className="bd-tag-row">
                <span className="bd-sys-tag">{tag}</span>
                <span className="bd-cat">{blog.category}</span>
              </div>
              <h1 className="bd-title">{blog.title}</h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }} className="bd-meta">
              <div>
                <span className="bd-author-name">{authorName}</span>
                <span className="bd-author-role">// {authorRole}</span>
              </div>
              <div className="bd-meta-sep" />
              <span className="bd-meta-item green">◷ {readTime} min read</span>
              <div className="bd-meta-sep" />
              <span className="bd-meta-item dim">{displayDate}</span>
              {blog.views > 0 && (
                <>
                  <div className="bd-meta-sep" />
                  <span className="bd-views">👁 {blog.views.toLocaleString()} views</span>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* ── Cover image ──────────────────────────────── */}
        {blog.cover_image && (
          <motion.div
            className="bd-cover-outer"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28 }}>
            <img className="bd-cover" src={blog.cover_image} alt={blog.title} />
          </motion.div>
        )}

        {/* ── Body ─────────────────────────────────────── */}
        <div className="bd-article-wrap">
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .38 }}
            className="bd-body"
          >
            <div className="bd-divider" />
            {renderContent(blog.content)}
            <div className="bd-divider" />

            <div className="bd-footer-bar">
              <div>
                <div className="bd-footer-label">// written by</div>
                <div className="bd-footer-val">{authorName} · {authorRole}</div>
              </div>
              <button className="bd-footer-btn" onClick={() => navigate("/Blogs")}>
                ← ALL ARTICLES
              </button>
            </div>
          </motion.article>
        </div>
      </div>
    </>
  );
};

/* ── Reading progress indicator ────────────────────────────── */
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total    = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.round((scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="bd-progress"
      style={{ "--progress": `${progress}%` }}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};

export default BlogDetails;