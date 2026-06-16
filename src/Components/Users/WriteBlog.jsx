import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

const CATEGORIES = ["AI", "Web Development", "Cybersecurity", "Research", "Intern Experience"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const WriteBlog = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", category: "", excerpt: "", content: "" });
  const [coverImage, setCoverImage]     = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [toast, setToast]               = useState({ msg: "", type: "" });
  const [accessChecked, setAccessChecked] = useState(false);

  // ── Auth + permission guard ─────────────────────────────────
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/Login?redirect=/write-blog", { replace: true }); return; }

      const { data: admin } = await supabase
        .from("admins").select("id").eq("email", user.email).maybeSingle();
      if (admin) { setAccessChecked(true); return; }

      const { data: intern } = await supabase
        .from("interns").select("id").eq("user_id", user.id).maybeSingle();
      if (intern) { setAccessChecked(true); return; }

      navigate("/Blogs", { replace: true });
    };
    checkAccess();
  }, [navigate]);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), type === "success" ? 5000 : 4000);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const wordCount     = form.content.trim().split(/\s+/).filter(Boolean).length;
  const estimatedRead = Math.max(1, Math.ceil(wordCount / 200));

  // ── Image validation ────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) { setCoverImage(null); setCoverPreview(null); return; }

    if (file.size > MAX_IMAGE_SIZE) {
      showToast("Image must be smaller than 5 MB.", "error");
      e.target.value = "";
      return;
    }

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setCoverImage(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category || !form.excerpt.trim() || !form.content.trim()) {
      showToast("Please fill all required fields.", "error");
      return;
    }
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/Login?redirect=/write-blog"); return; }

      // ── Resolve author ─────────────────────────────────────
      let authorName = "Lumbini Team";
      let authorRole = "Contributor";

      const { data: admin } = await supabase
        .from("admins").select("name").eq("email", user.email).maybeSingle();
      if (admin?.name) { authorName = admin.name; authorRole = "Administrator"; }

      const { data: intern } = await supabase
        .from("interns").select("name").eq("user_id", user.id).maybeSingle();
      if (intern?.name) { authorName = intern.name; authorRole = "Intern"; }

      // ── Upload cover image ─────────────────────────────────
      let coverImageUrl = null;

      if (coverImage) {
        const fileExt  = coverImage.name.split(".").pop().toLowerCase();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, coverImage, { contentType: coverImage.type });

        if (uploadError) {
          console.error("IMAGE UPLOAD ERROR:", uploadError);
          showToast("Image upload failed: " + uploadError.message, "error");
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(fileName);

        coverImageUrl = urlData.publicUrl;
      }

      // ── Insert blog ────────────────────────────────────────
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const { error } = await supabase.from("blogs").insert([{
        title:        form.title.trim(),
        slug,
        category:     form.category,
        excerpt:      form.excerpt.trim(),
        content:      form.content.trim(),
        author_id:    user.id,
        author_name:  authorName,
        author_role:  authorRole,
        author_email: user.email,
        cover_image:  coverImageUrl,
        status:       "pending",
        created_at:   new Date().toISOString(),
      }]);

      if (error) {
        console.error("BLOG INSERT ERROR:", error);
        showToast(error.message, "error");
        return;
      }

      showToast("Article submitted! It's now pending admin review.", "success");
      setTimeout(() => navigate("/my-blogs"), 2500);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!accessChecked) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        @keyframes glitchBlink{0%,93%,100%{opacity:1;text-shadow:0 0 12px #facc15}94%{opacity:.2;text-shadow:4px 0 #facc15}97%{opacity:.8;text-shadow:-3px 0 #facc15}}
        @keyframes termCursor{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes slideIn{from{opacity:0;transform:translate(-50%,-8px) scale(.97)}to{opacity:1;transform:translate(-50%,0) scale(1)}}

        .wb-page{min-height:100vh;background:transparent;color:#fff;font-family:'Share Tech Mono',monospace;overflow-x:hidden;padding-top:80px;position:relative}
        .wb-page::before{content:'';position:fixed;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,rgba(57,255,20,.25),transparent);animation:scanline 6s linear infinite;pointer-events:none;z-index:100}

        .wb-toast{position:fixed;top:5.5rem;left:50%;transform:translateX(-50%);z-index:99999;width:min(calc(100vw - 2rem),420px);animation:slideIn .3s cubic-bezier(.34,1.56,.64,1) forwards}
        .wb-toast-inner{display:flex;align-items:flex-start;gap:.75rem;padding:1rem 1.25rem;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.5);backdrop-filter:blur(16px);width:100%;box-sizing:border-box}
        .wb-toast-inner.err{border:1px solid rgba(239,68,68,.4);background:rgba(20,5,5,.95)}
        .wb-toast-inner.ok{border:1px solid rgba(57,255,20,.4);background:rgba(5,20,10,.95)}
        .wb-toast-label{font-weight:700;font-size:.78rem;margin-bottom:.2rem;font-family:'Share Tech Mono',monospace;letter-spacing:.08em}
        .wb-toast-label.err{color:#f87171}
        .wb-toast-label.ok{color:#39ff14}
        .wb-toast-msg{font-size:.75rem;color:rgba(255,255,255,.7);font-family:'Share Tech Mono',monospace;line-height:1.5;word-break:break-word}
        .wb-toast-x{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:1rem;padding:0;line-height:1;flex-shrink:0;transition:color .15s}
        .wb-toast-x:hover{color:#fff}

        .wb-hero{padding:clamp(3rem,6vw,5rem) clamp(1rem,5vw,3rem) clamp(2rem,4vw,3rem);background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(250,204,21,.07) 0%,transparent 70%),transparent;border-bottom:1px solid rgba(250,204,21,.10);text-align:center}
        .wb-tbar{display:inline-flex;align-items:center;gap:.5rem;background:rgba(57,255,20,.06);border:1px solid rgba(57,255,20,.25);border-radius:4px;padding:.35rem .85rem;margin-bottom:1.75rem;font-size:.68rem;color:#39ff14;letter-spacing:.12em}
        .wb-tdot{width:7px;height:7px;border-radius:50%}
        .wb-tcursor{display:inline-block;width:8px;height:13px;background:#39ff14;margin-left:2px;animation:termCursor 1s step-end infinite;vertical-align:middle}
        .wb-title{font-family:'Orbitron',monospace;font-size:clamp(1.6rem,4vw,3rem);font-weight:900;letter-spacing:3px;color:#fff;margin-bottom:.85rem;animation:glitchBlink 7s infinite}
        .wb-title .yl{color:#facc15;text-shadow:0 0 20px rgba(250,204,21,.5)}
        .wb-sub{font-size:clamp(.75rem,1.3vw,.88rem);color:rgba(255,255,255,.38);letter-spacing:.08em;line-height:1.7}

        .wb-wrap{max-width:800px;margin:0 auto;padding:clamp(2rem,5vw,4rem) clamp(1rem,4vw,2.5rem)}

        .wb-status-banner{display:flex;align-items:flex-start;gap:.7rem;background:rgba(250,204,21,.04);border:1px solid rgba(250,204,21,.2);border-left:3px solid #facc15;border-radius:6px;padding:.85rem 1.1rem;margin-bottom:2rem}
        .wb-status-icon{color:#facc15;font-size:.85rem;flex-shrink:0;margin-top:2px}
        .wb-status-text{font-size:.72rem;color:rgba(255,255,255,.5);line-height:1.65;letter-spacing:.03em}
        .wb-status-text strong{color:rgba(255,255,255,.8)}

        .wb-form{display:flex;flex-direction:column;gap:1.5rem}
        .wb-field{display:flex;flex-direction:column;gap:.5rem}
        .wb-label{font-size:.65rem;color:#39ff14;letter-spacing:.2em;text-transform:uppercase}
        .wb-input,.wb-select,.wb-textarea{width:100%;padding:13px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(250,204,21,.25);border-radius:8px;color:#fff;font-family:'Share Tech Mono',monospace;font-size:.88rem;letter-spacing:.04em;outline:none;box-sizing:border-box;transition:border-color .25s,box-shadow .25s}
        .wb-input::placeholder,.wb-textarea::placeholder{color:rgba(250,204,21,.25)}
        .wb-input:focus,.wb-select:focus,.wb-textarea:focus{border-color:#facc15;box-shadow:0 0 0 2px rgba(250,204,21,.10),0 0 20px rgba(250,204,21,.07)}
        .wb-select{appearance:none;cursor:pointer;color:rgba(255,255,255,.8)}
        .wb-select option{background:#1a1a1a;color:#fff}
        .wb-textarea{resize:vertical;min-height:80px;line-height:1.7}
        .wb-textarea.tall{min-height:280px}

        .wb-row{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}

        .wb-hint{font-size:.65rem;color:rgba(255,255,255,.28);letter-spacing:.06em;margin-top:.25rem}
        .wb-hint.green{color:rgba(57,255,20,.55)}

        .wb-word-count{display:flex;justify-content:space-between;align-items:center}
        .wb-word-count span{font-size:.65rem;color:rgba(255,255,255,.3);letter-spacing:.06em}
        .wb-word-count .wc-val{color:rgba(57,255,20,.6)}

        .wb-divider{height:1px;background:linear-gradient(90deg,rgba(250,204,21,.2),rgba(57,255,20,.1),transparent)}

        /* ── Cover image upload ── */
        .wb-img-upload{position:relative;width:100%;border:2px dashed rgba(250,204,21,.25);border-radius:10px;overflow:hidden;transition:border-color .25s,background .25s;cursor:pointer;background:rgba(250,204,21,.02)}
        .wb-img-upload:hover{border-color:rgba(250,204,21,.5);background:rgba(250,204,21,.04)}
        .wb-img-upload input[type="file"]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}

        .wb-img-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.6rem;padding:2rem 1rem;pointer-events:none}
        .wb-img-placeholder-icon{font-size:1.75rem;opacity:.35}
        .wb-img-placeholder-text{font-size:.7rem;color:rgba(255,255,255,.3);letter-spacing:.1em;text-align:center}
        .wb-img-placeholder-sub{font-size:.62rem;color:rgba(255,255,255,.18);letter-spacing:.06em}

        .wb-img-preview{position:relative;width:100%}
        .wb-img-preview img{width:100%;height:200px;object-fit:cover;display:block;border-radius:8px}
        .wb-img-preview-bar{display:flex;align-items:center;justify-content:space-between;padding:.6rem .85rem;background:rgba(0,0,0,.5);position:absolute;bottom:0;left:0;right:0;border-radius:0 0 8px 8px}
        .wb-img-preview-name{font-size:.65rem;color:rgba(255,255,255,.55);letter-spacing:.05em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px}
        .wb-img-remove{background:rgba(255,77,77,.15);border:1px solid rgba(255,77,77,.3);color:#ff6b6b;border-radius:4px;font-family:'Share Tech Mono',monospace;font-size:.6rem;letter-spacing:.1em;padding:.25rem .65rem;cursor:pointer;transition:all .2s;pointer-events:all;position:relative;z-index:2}
        .wb-img-remove:hover{background:rgba(255,77,77,.25);border-color:#ff4d4d}

        .wb-actions{display:flex;gap:1rem;flex-wrap:wrap}
        .wb-submit{padding:.8rem 2.25rem;background:#facc15;color:#000;border:none;border-radius:6px;font-family:'Orbitron',monospace;font-size:.75rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .25s ease;flex:1}
        .wb-submit:hover{background:#fde047;transform:translateY(-2px);box-shadow:0 6px 24px rgba(250,204,21,.4)}
        .wb-submit:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
        .wb-cancel{padding:.8rem 1.5rem;background:transparent;color:rgba(255,255,255,.45);border:1px solid rgba(255,255,255,.15);border-radius:6px;font-family:'Share Tech Mono',monospace;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .25s ease}
        .wb-cancel:hover{border-color:rgba(255,255,255,.3);color:rgba(255,255,255,.7)}

        @media(max-width:640px){.wb-row{grid-template-columns:1fr}.wb-actions{flex-direction:column}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
      `}</style>

      {toast.msg && (
        <div className="wb-toast">
          <div className={`wb-toast-inner ${toast.type === "success" ? "ok" : "err"}`}>
            <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
            <div>
              <div className={`wb-toast-label ${toast.type === "success" ? "ok" : "err"}`}>
                {toast.type === "success" ? "// SUCCESS" : "// ERROR"}
              </div>
              <div className="wb-toast-msg">{toast.msg}</div>
            </div>
            <button className="wb-toast-x" onClick={() => setToast({ msg: "", type: "" })}>✕</button>
          </div>
        </div>
      )}

      <div className="wb-page">
        <section className="wb-hero">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="wb-tbar">
            <span className="wb-tdot" style={{background:"#ff5f57"}}/>
            <span className="wb-tdot" style={{background:"#facc15"}}/>
            <span className="wb-tdot" style={{background:"#39ff14"}}/>
            &nbsp;BLOG_EDITOR.EXE — COMPOSE MODE<span className="wb-tcursor"/>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.1}} className="wb-title">
            WRITE AN <span className="yl">ARTICLE</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.2}} className="wb-sub">
            // share your knowledge with the Lumbini community
          </motion.p>
        </section>

        <div className="wb-wrap">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2}}>
            <div className="wb-status-banner">
              <span className="wb-status-icon">⚑</span>
              <span className="wb-status-text">
                Articles are submitted for <strong>admin review</strong> before going live.
                You'll be able to track status in <strong>My Blogs</strong>. Average review time: 24–48 hours.
              </span>
            </div>

            <form className="wb-form" onSubmit={handleSubmit}>

              {/* Title */}
              <div className="wb-field">
                <label className="wb-label">Article Title *</label>
                <input className="wb-input" type="text"
                  placeholder="e.g. How We Built a Real-Time Dashboard with Supabase"
                  value={form.title} onChange={set("title")} required/>
              </div>

              {/* Category + Read time */}
              <div className="wb-row">
                <div className="wb-field">
                  <label className="wb-label">Category *</label>
                  <select className="wb-select" value={form.category} onChange={set("category")} required>
                    <option value="">select_category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="wb-field">
                  <label className="wb-label">Est. Read Time</label>
                  <input className="wb-input" type="text" placeholder="auto-calculated"
                    value={`~${estimatedRead} min`} readOnly
                    style={{color:"rgba(57,255,20,.7)",cursor:"default"}}/>
                  <span className="wb-hint green">// based on word count ({wordCount} words)</span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="wb-field">
                <label className="wb-label">Cover Image <span style={{color:"rgba(255,255,255,.25)",letterSpacing:".04em",textTransform:"none",fontSize:".62rem"}}>(optional · jpg/png/webp · max 5 MB)</span></label>
                <div className="wb-img-upload">
                  {coverPreview ? (
                    <div className="wb-img-preview">
                      <img src={coverPreview} alt="Cover preview"/>
                      <div className="wb-img-preview-bar">
                        <span className="wb-img-preview-name">{coverImage?.name}</span>
                        <button type="button" className="wb-img-remove" onClick={removeImage}>✕ REMOVE</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input type="file" accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}/>
                      <div className="wb-img-placeholder">
                        <span className="wb-img-placeholder-icon">🖼</span>
                        <span className="wb-img-placeholder-text">Click to upload cover image</span>
                        <span className="wb-img-placeholder-sub">JPG / PNG / WebP — max 5 MB</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              <div className="wb-field">
                <label className="wb-label">Short Excerpt *</label>
                <textarea className="wb-textarea" rows={3}
                  placeholder="A 1–2 sentence summary shown on the blog listing page..."
                  value={form.excerpt} onChange={set("excerpt")} required/>
                <span className="wb-hint">// keep it under 200 characters for best display</span>
              </div>

              <div className="wb-divider"/>

              {/* Content */}
              <div className="wb-field">
                <label className="wb-label">Article Content *</label>
                <textarea className="wb-textarea tall"
                  placeholder="Write your article here. Use blank lines to separate paragraphs. Plain text only — formatting support coming in Phase 2."
                  value={form.content} onChange={set("content")} required/>
                <div className="wb-word-count">
                  <span className="wb-hint">// plain text. blank line = new paragraph.</span>
                  <span><span className="wc-val">{wordCount}</span> words</span>
                </div>
              </div>

              <div className="wb-divider"/>

              <div className="wb-actions">
                <button type="submit" className="wb-submit" disabled={loading}>
                  {loading ? "SUBMITTING..." : "SUBMIT FOR REVIEW"}
                </button>
                <button type="button" className="wb-cancel" onClick={() => navigate("/Blogs")}>
                  CANCEL
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default WriteBlog;