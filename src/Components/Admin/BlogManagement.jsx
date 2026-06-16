import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

const STATUS_CFG = {
  pending:  { label: "PENDING",  color: "#facc15", bg: "rgba(250,204,21,.08)", border: "rgba(250,204,21,.3)" },
  approved: { label: "APPROVED", color: "#39ff14", bg: "rgba(57,255,20,.08)",  border: "rgba(57,255,20,.3)"  },
  rejected: { label: "REJECTED", color: "#ff4d4d", bg: "rgba(255,77,77,.08)",  border: "rgba(255,77,77,.3)"  },
};

const TABS = ["pending", "approved", "rejected"];

const readTime = (content = "") =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200));

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// ── Preview Modal ─────────────────────────────────────────────
const PreviewModal = ({ blog, onClose }) => {
  if (!blog) return null;
  return (
    <motion.div className="bm-modal-backdrop"
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      onClick={onClose}>
      <motion.div className="bm-modal"
        initial={{opacity:0,y:32,scale:.97}}
        animate={{opacity:1,y:0,scale:1}}
        exit={{opacity:0,y:16,scale:.97}}
        transition={{type:"spring",stiffness:340,damping:28}}
        onClick={(e) => e.stopPropagation()}>

        {/* Cover image inside modal */}
        {blog.cover_image && (
          <img src={blog.cover_image} alt={blog.title} className="bm-modal-cover"/>
        )}

        <div className="bm-modal-head">
          <div>
            <span className="bm-modal-cat">{blog.category}</span>
            <h2 className="bm-modal-title">{blog.title}</h2>
            <div className="bm-modal-meta">
              {blog.author_name && <span>{blog.author_name} · {blog.author_role || "Contributor"}</span>}
              {blog.author_name && <span>•</span>}
              <span>◷ {readTime(blog.content)} min read</span>
              <span>•</span>
              <span>{fmtDate(blog.created_at)}</span>
            </div>
          </div>
          <button className="bm-modal-close" onClick={onClose}>✕</button>
        </div>
        {blog.excerpt && <p className="bm-modal-excerpt">{blog.excerpt}</p>}
        <div className="bm-modal-divider"/>
        <div className="bm-modal-body">
          {(blog.content || "").split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Toast ─────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => {
  if (!toast.msg) return null;
  const ok = toast.type === "success";
  return (
    <motion.div className="bm-toast"
      initial={{opacity:0,y:-8,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8}}>
      <div className={`bm-toast-inner ${ok ? "ok" : "err"}`}>
        <span>{ok ? "✅" : "⚠️"}</span>
        <div>
          <div className={`bm-toast-label ${ok ? "ok" : "err"}`}>{ok ? "// SUCCESS" : "// ERROR"}</div>
          <div className="bm-toast-msg">{toast.msg}</div>
        </div>
        <button className="bm-toast-x" onClick={onClose}>✕</button>
      </div>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────────────
const BlogManagement = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [preview, setPreview]     = useState(null);
  const [toast, setToast]         = useState({ msg: "", type: "" });
  const [acting, setActing]       = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), type === "success" ? 4000 : 5000);
  };

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs").select("*").order("created_at", { ascending: false });
    if (error) { console.error("BLOG MANAGEMENT LOAD ERROR:", error); showToast(error.message, "error"); }
    else setBlogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/Login?redirect=/admin/blogs", { replace: true }); return; }
      const { data: admin } = await supabase
        .from("admins").select("id").eq("email", user.email).maybeSingle();
      if (!admin) { navigate("/", { replace: true }); return; }
      setAdminUser(user);
      loadBlogs();
    };
    init();
  }, [navigate, loadBlogs]);

  const logReview = async (blogId, action) => {
    if (!adminUser) return;
    await supabase.from("blog_reviews").insert({
      blog_id: blogId, admin_email: adminUser.email,
      action, created_at: new Date().toISOString(),
    });
  };

  const approveBlog = async (id) => {
    setActing(id);
    const { error } = await supabase
      .from("blogs").update({ status: "approved", published_at: new Date().toISOString() }).eq("id", id);
    if (error) { showToast(error.message, "error"); }
    else { await logReview(id, "approved"); showToast("Blog approved and published."); loadBlogs(); }
    setActing(null);
  };

  const rejectBlog = async (id) => {
    setActing(id);
    const { error } = await supabase.from("blogs").update({ status: "rejected" }).eq("id", id);
    if (error) { showToast(error.message, "error"); }
    else { await logReview(id, "rejected"); showToast("Blog rejected.", "error"); loadBlogs(); }
    setActing(null);
  };

  const deleteBlog = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setActing(id);
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) { showToast(error.message, "error"); }
    else { showToast("Blog deleted."); loadBlogs(); }
    setActing(null);
  };

  const filteredBlogs = blogs.filter((b) => b.status === activeTab);
  const counts = {
    total:    blogs.length,
    pending:  blogs.filter((b) => b.status === "pending").length,
    approved: blogs.filter((b) => b.status === "approved").length,
    rejected: blogs.filter((b) => b.status === "rejected").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        @keyframes glitchBlink{0%,93%,100%{opacity:1;text-shadow:0 0 12px #facc15}94%{opacity:.2;text-shadow:4px 0 #facc15}97%{opacity:.8;text-shadow:-3px 0 #facc15}}
        @keyframes termCursor{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 4px #facc15}50%{opacity:.4;box-shadow:none}}

        .bm-page{min-height:100vh;background:transparent;color:#fff;font-family:'Share Tech Mono',monospace;overflow-x:hidden;padding-top:80px;position:relative}
        .bm-page::before{content:'';position:fixed;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,rgba(57,255,20,.25),transparent);animation:scanline 6s linear infinite;pointer-events:none;z-index:50}

        .bm-toast{position:fixed;top:5.5rem;left:50%;transform:translateX(-50%);z-index:9999;width:min(calc(100vw - 2rem),420px)}
        .bm-toast-inner{display:flex;align-items:flex-start;gap:.75rem;padding:1rem 1.25rem;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.5);backdrop-filter:blur(16px);width:100%;box-sizing:border-box}
        .bm-toast-inner.err{border:1px solid rgba(239,68,68,.4);background:rgba(20,5,5,.95)}
        .bm-toast-inner.ok{border:1px solid rgba(57,255,20,.4);background:rgba(5,20,10,.95)}
        .bm-toast-label{font-weight:700;font-size:.75rem;margin-bottom:.2rem;letter-spacing:.08em}
        .bm-toast-label.err{color:#f87171}.bm-toast-label.ok{color:#39ff14}
        .bm-toast-msg{font-size:.73rem;color:rgba(255,255,255,.7);line-height:1.5}
        .bm-toast-x{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:1rem;padding:0;flex-shrink:0;transition:color .15s}
        .bm-toast-x:hover{color:#fff}

        .bm-hero{padding:clamp(3rem,6vw,5rem) clamp(1rem,5vw,3rem) clamp(2rem,4vw,3rem);background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(250,204,21,.07) 0%,transparent 70%);border-bottom:1px solid rgba(250,204,21,.10);text-align:center}
        .bm-tbar{display:inline-flex;align-items:center;gap:.5rem;background:rgba(57,255,20,.06);border:1px solid rgba(57,255,20,.25);border-radius:4px;padding:.35rem .85rem;margin-bottom:1.75rem;font-size:.68rem;color:#39ff14;letter-spacing:.12em}
        .bm-tdot{width:7px;height:7px;border-radius:50%}
        .bm-tcursor{display:inline-block;width:8px;height:13px;background:#39ff14;margin-left:2px;animation:termCursor 1s step-end infinite;vertical-align:middle}
        .bm-hero-title{font-family:'Orbitron',monospace;font-size:clamp(1.6rem,4vw,3rem);font-weight:900;letter-spacing:3px;color:#fff;margin-bottom:.75rem;animation:glitchBlink 7s infinite}
        .bm-hero-title span{color:#facc15;text-shadow:0 0 20px rgba(250,204,21,.5)}
        .bm-hero-sub{font-size:clamp(.72rem,1.2vw,.85rem);color:rgba(255,255,255,.35);letter-spacing:.1em}

        .bm-wrap{max-width:1100px;margin:0 auto;padding:clamp(2rem,5vw,4rem) clamp(1rem,4vw,2.5rem)}

        .bm-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2.5rem}
        .bm-stat{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:1.1rem 1.25rem;text-align:center;transition:transform .25s,border-color .25s}
        .bm-stat:hover{transform:translateY(-3px)}
        .bm-stat-num{font-family:'Orbitron',monospace;font-size:1.8rem;font-weight:900;display:block;margin-bottom:.3rem;line-height:1}
        .bm-stat-label{font-size:.58rem;color:rgba(255,255,255,.3);letter-spacing:.15em;text-transform:uppercase}

        .bm-tabs{display:flex;gap:.5rem;margin-bottom:1.75rem;border-bottom:1px solid rgba(255,255,255,.07);padding-bottom:0}
        .bm-tab{padding:.65rem 1.4rem;background:transparent;border:none;border-bottom:2px solid transparent;color:rgba(255,255,255,.3);font-family:'Share Tech Mono',monospace;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:.5rem;margin-bottom:-1px}
        .bm-tab:hover{color:rgba(255,255,255,.6)}
        .bm-tab.active{color:#facc15;border-bottom-color:#facc15}
        .bm-tab-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;background:rgba(250,204,21,.12);border:1px solid rgba(250,204,21,.3);border-radius:4px;font-size:.6rem;color:#facc15}
        .bm-tab.active .bm-tab-badge{background:rgba(250,204,21,.2)}

        .bm-list{display:flex;flex-direction:column;gap:.85rem}

        .bm-card{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:12px;overflow:hidden;display:grid;grid-template-columns:1fr auto;position:relative;transition:border-color .25s,transform .25s}
        .bm-card::after{content:'';position:absolute;top:0;left:0;bottom:0;width:3px;background:var(--accent,#facc15);opacity:.5;transition:opacity .25s}
        .bm-card:hover{border-color:rgba(255,255,255,.12);transform:translateX(3px)}
        .bm-card:hover::after{opacity:1}

        /* thumbnail strip in card */
        .bm-card-thumb{width:100%;height:140px;object-fit:cover;display:block;border-bottom:1px solid rgba(255,255,255,.06)}
        .bm-card-thumb-placeholder{display:none}

        .bm-card-inner{padding:1.4rem 1.75rem;grid-column:1}
        .bm-card-top{display:flex;align-items:center;gap:.6rem;margin-bottom:.6rem;flex-wrap:wrap}
        .bm-card-cat{padding:3px 10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4);border-radius:10px;font-size:.58rem;text-transform:uppercase;letter-spacing:.08em}
        .bm-card-status{display:inline-flex;align-items:center;gap:.35rem;padding:3px 10px;border-radius:10px;font-size:.58rem;letter-spacing:.1em;font-weight:700}
        .bm-status-dot{width:6px;height:6px;border-radius:50%}
        .bm-status-dot.pulse{animation:pulse 1.8s ease-in-out infinite}

        .bm-card-title{font-family:'Orbitron',monospace;font-size:clamp(.85rem,1.5vw,1rem);font-weight:700;color:#fff;margin-bottom:.7rem;line-height:1.3}
        .bm-card-excerpt{font-size:.72rem;color:rgba(255,255,255,.35);line-height:1.65;margin-bottom:.85rem;max-width:620px}

        .bm-card-meta{display:flex;gap:1.25rem;flex-wrap:wrap}
        .bm-meta-item{display:flex;flex-direction:column;gap:.2rem}
        .bm-meta-key{font-size:.55rem;color:rgba(255,255,255,.25);letter-spacing:.15em;text-transform:uppercase}
        .bm-meta-val{font-size:.7rem;color:rgba(255,255,255,.55)}
        .bm-meta-val.green{color:rgba(57,255,20,.7)}

        .bm-actions{display:flex;flex-direction:column;gap:.5rem;min-width:120px;padding:1.4rem 1.75rem 1.4rem 0;justify-content:flex-start}
        .bm-btn{padding:.55rem 1rem;border-radius:5px;font-family:'Share Tech Mono',monospace;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .2s;border:1px solid;white-space:nowrap;text-align:center;width:100%}
        .bm-btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}

        .bm-btn-approve{background:rgba(57,255,20,.08);border-color:rgba(57,255,20,.3);color:#39ff14}
        .bm-btn-approve:not(:disabled):hover{background:rgba(57,255,20,.15);border-color:#39ff14;box-shadow:0 0 12px rgba(57,255,20,.2)}

        .bm-btn-reject{background:rgba(255,77,77,.06);border-color:rgba(255,77,77,.25);color:#ff6b6b}
        .bm-btn-reject:not(:disabled):hover{background:rgba(255,77,77,.12);border-color:#ff4d4d;box-shadow:0 0 12px rgba(255,77,77,.2)}

        .bm-btn-preview{background:rgba(250,204,21,.05);border-color:rgba(250,204,21,.2);color:rgba(250,204,21,.7)}
        .bm-btn-preview:not(:disabled):hover{background:rgba(250,204,21,.1);border-color:#facc15;color:#facc15}

        .bm-btn-delete{background:transparent;border-color:rgba(255,255,255,.08);color:rgba(255,255,255,.25)}
        .bm-btn-delete:not(:disabled):hover{background:rgba(255,77,77,.06);border-color:rgba(255,77,77,.3);color:#ff6b6b}

        .bm-empty{text-align:center;padding:5rem 1rem;color:rgba(255,255,255,.18)}
        .bm-empty-glyph{font-family:'Orbitron',monospace;font-size:2.5rem;color:rgba(250,204,21,.1);display:block;margin-bottom:1rem;letter-spacing:.1em}
        .bm-empty-text{font-size:.75rem;letter-spacing:.1em}

        .bm-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem;gap:1.25rem;color:rgba(255,255,255,.25);font-size:.72rem;letter-spacing:.12em}
        .bm-spinner{width:32px;height:32px;border:2px solid rgba(250,204,21,.15);border-top-color:#facc15;border-radius:50%;animation:spin .8s linear infinite}

        /* ── modal ── */
        .bm-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem}
        .bm-modal{background:#0d0d0d;border:1px solid rgba(250,204,21,.2);border-radius:14px;width:min(700px,100%);max-height:85vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.7),0 0 0 1px rgba(250,204,21,.05)}
        .bm-modal-cover{width:100%;max-height:280px;object-fit:cover;border-radius:14px 14px 0 0;display:block}
        .bm-modal-head{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;padding:1.75rem 1.75rem 1.25rem;border-bottom:1px solid rgba(255,255,255,.06)}
        .bm-modal-cat{display:inline-block;padding:3px 10px;background:rgba(250,204,21,.08);border:1px solid rgba(250,204,21,.2);color:rgba(250,204,21,.7);border-radius:10px;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.6rem}
        .bm-modal-title{font-family:'Orbitron',monospace;font-size:clamp(1rem,2vw,1.3rem);font-weight:900;color:#fff;line-height:1.3;margin-bottom:.5rem}
        .bm-modal-meta{display:flex;gap:.75rem;font-size:.65rem;color:rgba(255,255,255,.3);flex-wrap:wrap}
        .bm-modal-close{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4);border-radius:6px;width:32px;height:32px;cursor:pointer;font-size:.9rem;flex-shrink:0;transition:all .2s;display:flex;align-items:center;justify-content:center}
        .bm-modal-close:hover{background:rgba(255,77,77,.12);border-color:rgba(255,77,77,.3);color:#ff6b6b}
        .bm-modal-excerpt{padding:1.1rem 1.75rem;font-size:.8rem;color:rgba(255,255,255,.45);line-height:1.7;border-bottom:1px solid rgba(255,255,255,.06);font-style:italic}
        .bm-modal-divider{height:0}
        .bm-modal-body{padding:1.5rem 1.75rem;font-size:.82rem;color:rgba(255,255,255,.65);line-height:1.85}
        .bm-modal-body p{margin:0 0 1.1rem}
        .bm-modal-body p:last-child{margin:0}

        @media(max-width:720px){
          .bm-stats{grid-template-columns:repeat(2,1fr)}
          .bm-card{grid-template-columns:1fr}
          .bm-actions{flex-direction:row;flex-wrap:wrap;min-width:unset;padding:0 1.4rem 1.4rem}
          .bm-btn{width:auto;flex:1}
        }
        @media(max-width:440px){.bm-tabs{overflow-x:auto;padding-bottom:.5rem}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
      `}</style>

      <AnimatePresence>
        {toast.msg && <Toast key="toast" toast={toast} onClose={() => setToast({ msg: "", type: "" })}/>}
      </AnimatePresence>
      <AnimatePresence>
        {preview && <PreviewModal key="preview" blog={preview} onClose={() => setPreview(null)}/>}
      </AnimatePresence>

      <div className="bm-page">
        <section className="bm-hero">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="bm-tbar">
            <span className="bm-tdot" style={{background:"#ff5f57"}}/>
            <span className="bm-tdot" style={{background:"#facc15"}}/>
            <span className="bm-tdot" style={{background:"#39ff14"}}/>
            &nbsp;ADMIN_CONSOLE.EXE — BLOG MODERATION<span className="bm-tcursor"/>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.1}} className="bm-hero-title">
            BLOG <span>MANAGEMENT</span>
          </motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}} className="bm-hero-sub">
            // review, approve, and moderate submitted articles
          </motion.p>
        </section>

        <div className="bm-wrap">
          {loading ? (
            <div className="bm-loading">
              <div className="bm-spinner"/>
              // fetching all submissions...
            </div>
          ) : (
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.1}}>

              {/* Stats */}
              <div className="bm-stats">
                {[
                  { label: "Total",    num: counts.total,    color: "#fff",    shadow: "rgba(255,255,255,.2)" },
                  { label: "Pending",  num: counts.pending,  color: "#facc15", shadow: "rgba(250,204,21,.4)"  },
                  { label: "Approved", num: counts.approved, color: "#39ff14", shadow: "rgba(57,255,20,.4)"   },
                  { label: "Rejected", num: counts.rejected, color: "#ff4d4d", shadow: "rgba(255,77,77,.4)"   },
                ].map((s, i) => (
                  <motion.div key={s.label} className="bm-stat"
                    initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.15+i*.05}}
                    style={{borderColor: s.num > 0 ? `${s.color}25` : undefined}}>
                    <span className="bm-stat-num" style={{color:s.color,textShadow:`0 0 20px ${s.shadow}`}}>
                      {s.num.toString().padStart(2,"0")}
                    </span>
                    <span className="bm-stat-label">{s.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Tabs */}
              <div className="bm-tabs">
                {TABS.map((tab) => (
                  <button key={tab} className={`bm-tab${activeTab===tab?" active":""}`}
                    onClick={() => setActiveTab(tab)}>
                    {tab}
                    <span className="bm-tab-badge">{counts[tab]}</span>
                  </button>
                ))}
              </div>

              {/* Cards */}
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-8}}
                  transition={{duration:.18}}>
                  {filteredBlogs.length === 0 ? (
                    <div className="bm-empty">
                      <span className="bm-empty-glyph">
                        {activeTab==="pending"?"QUEUE_EMPTY":activeTab==="approved"?"NONE_YET":"ALL_CLEAR"}
                      </span>
                      <p className="bm-empty-text">
                        {activeTab==="pending"  && "// no articles awaiting review"}
                        {activeTab==="approved" && "// no approved articles yet"}
                        {activeTab==="rejected" && "// no rejected articles"}
                      </p>
                    </div>
                  ) : (
                    <div className="bm-list">
                      {filteredBlogs.map((blog, i) => {
                        const sc     = STATUS_CFG[blog.status] || STATUS_CFG.pending;
                        const busy   = acting === blog.id;
                        const isPend = blog.status === "pending";
                        const isAppr = blog.status === "approved";
                        const isRej  = blog.status === "rejected";
                        return (
                          <motion.div key={blog.id}
                            initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
                            transition={{delay:i*.05}}
                            className="bm-card" style={{"--accent":sc.color}}>

                            {/* Cover thumbnail */}
                            {blog.cover_image && (
                              <img src={blog.cover_image} alt={blog.title} className="bm-card-thumb"
                                style={{gridColumn:"1/-1"}}/>
                            )}

                            {/* Info */}
                            <div className="bm-card-inner">
                              <div className="bm-card-top">
                                <span className="bm-card-cat">{blog.category}</span>
                                <span className="bm-card-status"
                                  style={{background:sc.bg,border:`1px solid ${sc.border}`,color:sc.color}}>
                                  <span className={`bm-status-dot${isPend?" pulse":""}`}
                                    style={{background:sc.color,boxShadow:`0 0 5px ${sc.color}`}}/>
                                  {sc.label}
                                </span>
                              </div>
                              <h3 className="bm-card-title">{blog.title}</h3>
                              {blog.excerpt && <p className="bm-card-excerpt">{blog.excerpt}</p>}
                              <div className="bm-card-meta">
                                {blog.author_name && (
                                  <div className="bm-meta-item">
                                    <span className="bm-meta-key">Author</span>
                                    <span className="bm-meta-val">{blog.author_name} · {blog.author_role || "Contributor"}</span>
                                  </div>
                                )}
                                <div className="bm-meta-item">
                                  <span className="bm-meta-key">Submitted</span>
                                  <span className="bm-meta-val">{fmtDate(blog.created_at)}</span>
                                </div>
                                {blog.published_at && (
                                  <div className="bm-meta-item">
                                    <span className="bm-meta-key">Published</span>
                                    <span className="bm-meta-val green">{fmtDate(blog.published_at)}</span>
                                  </div>
                                )}
                                <div className="bm-meta-item">
                                  <span className="bm-meta-key">Read time</span>
                                  <span className="bm-meta-val">◷ {readTime(blog.content)} min</span>
                                </div>
                                {blog.cover_image && (
                                  <div className="bm-meta-item">
                                    <span className="bm-meta-key">Cover</span>
                                    <span className="bm-meta-val green">✓ attached</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="bm-actions">
                              <button className="bm-btn bm-btn-preview" disabled={busy}
                                onClick={() => setPreview(blog)}>PREVIEW</button>
                              {(isPend||isRej) && (
                                <button className="bm-btn bm-btn-approve" disabled={busy}
                                  onClick={() => approveBlog(blog.id)}>
                                  {busy?"...":"APPROVE"}
                                </button>
                              )}
                              {(isPend||isAppr) && (
                                <button className="bm-btn bm-btn-reject" disabled={busy}
                                  onClick={() => rejectBlog(blog.id)}>
                                  {busy?"...":"REJECT"}
                                </button>
                              )}
                              <button className="bm-btn bm-btn-delete" disabled={busy}
                                onClick={() => deleteBlog(blog.id, blog.title)}>
                                {busy?"...":"DELETE"}
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogManagement;