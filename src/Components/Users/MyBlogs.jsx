import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

const STATUS_CONFIG = {
  pending:  { label: "PENDING REVIEW", color: "#facc15", bg: "rgba(250,204,21,.08)", border: "rgba(250,204,21,.3)", dot: "#facc15" },
  approved: { label: "APPROVED",       color: "#39ff14", bg: "rgba(57,255,20,.08)",  border: "rgba(57,255,20,.3)",  dot: "#39ff14" },
  rejected: { label: "REJECTED",       color: "#ff4d4d", bg: "rgba(255,77,77,.08)",  border: "rgba(255,77,77,.3)",  dot: "#ff4d4d" },
};

const readTime = (content) =>
  Math.max(1, Math.ceil((content || "").trim().split(/\s+/).filter(Boolean).length / 200));

const MyBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate("/Login?redirect=/my-blogs"); return; }

      const { data: rows, error } = await supabase
        .from("blogs")
        .select("id,title,category,status,created_at,slug,content")
        .eq("author_id", data.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("MY BLOGS ERROR:", error);
      }

      setBlogs(rows || []);
      setLoading(false);
    };
    load();
  }, [navigate]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  const counts = {
    total:    blogs.length,
    approved: blogs.filter((b) => b.status === "approved").length,
    pending:  blogs.filter((b) => b.status === "pending").length,
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

        .mb-page{min-height:100vh;background:transparent;color:#fff;font-family:'Share Tech Mono',monospace;overflow-x:hidden;padding-top:80px;position:relative}
        .mb-page::before{content:'';position:fixed;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,rgba(57,255,20,.25),transparent);animation:scanline 6s linear infinite;pointer-events:none;z-index:100}

        .mb-hero{padding:clamp(3rem,6vw,5rem) clamp(1rem,5vw,3rem) clamp(2rem,4vw,3rem);background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(250,204,21,.07) 0%,transparent 70%),transparent;border-bottom:1px solid rgba(250,204,21,.10);text-align:center}
        .mb-tbar{display:inline-flex;align-items:center;gap:.5rem;background:rgba(57,255,20,.06);border:1px solid rgba(57,255,20,.25);border-radius:4px;padding:.35rem .85rem;margin-bottom:1.75rem;font-size:.68rem;color:#39ff14;letter-spacing:.12em}
        .mb-tdot{width:7px;height:7px;border-radius:50%}
        .mb-tcursor{display:inline-block;width:8px;height:13px;background:#39ff14;margin-left:2px;animation:termCursor 1s step-end infinite;vertical-align:middle}
        .mb-title{font-family:'Orbitron',monospace;font-size:clamp(1.6rem,4vw,3rem);font-weight:900;letter-spacing:3px;color:#fff;margin-bottom:.85rem;animation:glitchBlink 7s infinite}
        .mb-title .yl{color:#facc15;text-shadow:0 0 20px rgba(250,204,21,.5)}
        .mb-sub{font-size:clamp(.75rem,1.3vw,.88rem);color:rgba(255,255,255,.38);letter-spacing:.08em;line-height:1.7}

        .mb-wrap{max-width:1000px;margin:0 auto;padding:clamp(2rem,5vw,4rem) clamp(1rem,4vw,2.5rem)}

        .mb-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2.5rem}
        .mb-stat{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:1.1rem 1.25rem;text-align:center;transition:all .3s ease}
        .mb-stat:hover{transform:translateY(-3px)}
        .mb-stat-num{font-family:'Orbitron',monospace;font-size:1.6rem;font-weight:900;display:block;margin-bottom:.25rem}
        .mb-stat-label{font-size:.6rem;color:rgba(255,255,255,.3);letter-spacing:.12em;text-transform:uppercase}

        .mb-top-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:.75rem}
        .mb-section-tag{font-size:.62rem;color:#39ff14;letter-spacing:.2em;text-transform:uppercase}
        .mb-write-btn{padding:.6rem 1.5rem;background:#facc15;color:#000;border:none;border-radius:6px;font-family:'Orbitron',monospace;font-size:.68rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .25s ease}
        .mb-write-btn:hover{background:#fde047;transform:translateY(-2px);box-shadow:0 6px 20px rgba(250,204,21,.35)}

        .mb-list{display:flex;flex-direction:column;gap:1rem}

        .mb-card{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:1.4rem 1.75rem;display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:center;position:relative;overflow:hidden;transition:all .3s ease}
        .mb-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--sc,#facc15);opacity:.45;transition:opacity .3s}
        .mb-card:hover{border-color:rgba(255,255,255,.14);transform:translateX(4px)}
        .mb-card:hover::before{opacity:.85}

        .mb-card-cat{display:inline-block;padding:3px 10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4);border-radius:10px;font-size:.58rem;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.6rem}
        .mb-card-title{font-family:'Orbitron',monospace;font-size:clamp(.82rem,1.5vw,.95rem);font-weight:700;color:#fff;margin-bottom:.6rem;line-height:1.35}
        .mb-card-meta{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}
        .mb-card-date{font-size:.65rem;color:rgba(255,255,255,.3)}
        .mb-card-time{font-size:.65rem;color:rgba(57,255,20,.55)}

        .mb-status-badge{display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .85rem;border-radius:5px;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;font-weight:700;white-space:nowrap}
        .mb-status-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}

        .mb-card-actions{display:flex;flex-direction:column;gap:.6rem;align-items:flex-end}
        .mb-view-btn{padding:.45rem 1.1rem;background:transparent;color:rgba(255,255,255,.45);border:1px solid rgba(255,255,255,.12);border-radius:5px;font-family:'Share Tech Mono',monospace;font-size:.65rem;letter-spacing:.1em;cursor:pointer;transition:all .25s;white-space:nowrap}
        .mb-view-btn:hover{border-color:rgba(250,204,21,.4);color:#facc15}

        .mb-empty{text-align:center;padding:4rem 1rem;color:rgba(255,255,255,.2);font-size:.82rem;letter-spacing:.1em}
        .mb-empty-code{font-family:'Orbitron',monospace;font-size:2rem;color:rgba(250,204,21,.12);display:block;margin-bottom:1rem}

        .mb-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem;gap:1.25rem;color:rgba(255,255,255,.3);font-size:.75rem;letter-spacing:.12em}
        .mb-spinner{width:32px;height:32px;border:2px solid rgba(250,204,21,.15);border-top-color:#facc15;border-radius:50%;animation:spin .8s linear infinite}

        @media(max-width:640px){
          .mb-stats{grid-template-columns:repeat(2,1fr)}
          .mb-card{grid-template-columns:1fr}
          .mb-card-actions{align-items:flex-start;flex-direction:row;flex-wrap:wrap}
        }
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
      `}</style>

      <div className="mb-page">
        <section className="mb-hero">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="mb-tbar">
            <span className="mb-tdot" style={{background:"#ff5f57"}}/>
            <span className="mb-tdot" style={{background:"#facc15"}}/>
            <span className="mb-tdot" style={{background:"#39ff14"}}/>
            &nbsp;MY_BLOGS.SYS — USER PORTAL<span className="mb-tcursor"/>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.1}} className="mb-title">
            MY <span className="yl">ARTICLES</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.2}} className="mb-sub">
            // track your submitted articles and their review status
          </motion.p>
        </section>

        <div className="mb-wrap">
          {loading ? (
            <div className="mb-loading">
              <div className="mb-spinner"/>
              // loading your articles...
            </div>
          ) : (
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
              {/* Stats */}
              <div className="mb-stats">
                {[
                  { label: "Total",    num: counts.total,    color: "#fff" },
                  { label: "Approved", num: counts.approved, color: "#39ff14" },
                  { label: "Pending",  num: counts.pending,  color: "#facc15" },
                  { label: "Rejected", num: counts.rejected, color: "#ff4d4d" },
                ].map((s) => (
                  <div key={s.label} className="mb-stat"
                    style={{borderColor: s.num > 0 ? `${s.color}30` : undefined}}>
                    <span className="mb-stat-num" style={{color: s.color, textShadow:`0 0 16px ${s.color}50`}}>
                      {s.num}
                    </span>
                    <span className="mb-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* List header */}
              <div className="mb-top-bar">
                <p className="mb-section-tag">// articles.log — {blogs.length} record{blogs.length !== 1 ? "s" : ""}</p>
                <button className="mb-write-btn" onClick={() => navigate("/write-blog")}>
                  + WRITE ARTICLE
                </button>
              </div>

              {/* Cards */}
              {blogs.length === 0 ? (
                <div className="mb-empty">
                  <span className="mb-empty-code">EMPTY</span>
                  // no articles yet — write your first one
                </div>
              ) : (
                <div className="mb-list">
                  {blogs.map((blog, i) => {
                    const sc = STATUS_CONFIG[blog.status] || STATUS_CONFIG.pending;
                    return (
                      <motion.div key={blog.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                        transition={{delay: i * .06}} className="mb-card" style={{"--sc": sc.color}}>
                        <div>
                          <span className="mb-card-cat">{blog.category}</span>
                          <h3 className="mb-card-title">{blog.title}</h3>
                          <div className="mb-card-meta">
                            <span className="mb-card-date">{formatDate(blog.created_at)}</span>
                            <span className="mb-card-time">◷ {readTime(blog.content)} min</span>
                            <span className="mb-status-badge"
                              style={{background: sc.bg, border:`1px solid ${sc.border}`, color: sc.color}}>
                              <span className="mb-status-dot"
                                style={{background: sc.dot, boxShadow:`0 0 6px ${sc.dot}`,
                                  animationName: blog.status === "pending" ? "termCursor" : "none",
                                  animationDuration: "1.5s", animationIterationCount: "infinite"}}/>
                              {sc.label}
                            </span>
                          </div>
                        </div>
                        <div className="mb-card-actions">
                          {blog.status === "approved" && (
                            <button className="mb-view-btn"
                              onClick={() => navigate(`/blogs/${blog.slug}`)}>
                              VIEW LIVE →
                            </button>
                          )}
                          {blog.status === "rejected" && (
                            <button className="mb-view-btn" onClick={() => navigate("/write-blog")}>
                              RESUBMIT
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBlogs;