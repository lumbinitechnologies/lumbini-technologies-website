import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

const categories = ["All", "AI", "Web Development", "Cybersecurity", "Research", "Intern Experience"];

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

const readTime = (content = "") =>
  Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200));

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

const Blogs = () => {
  const [blogsData, setBlogsData]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select(
          "id,title,slug,excerpt,content,cover_image,category,author_id,author_name,author_role,featured,published_at,created_at"
        )
        .eq("status", "approved")
        .order("published_at", { ascending: false });

      if (error) console.error("BLOGS LOAD ERROR:", error);
      else setBlogsData(data || []);
      setLoading(false);
    };
    loadBlogs();
  }, []);

  const featured = blogsData.find((b) => b.featured);

  const filtered = blogsData
    .filter((b) => !b.featured)
    .filter((b) => {
      const matchCat    = activeCategory === "All" || b.category === activeCategory;
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        (b.excerpt || "").toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        @keyframes glitchBlink{0%,93%,100%{opacity:1;text-shadow:0 0 12px #facc15}94%{opacity:.2;text-shadow:4px 0 #facc15}97%{opacity:.8;text-shadow:-3px 0 #facc15}}
        @keyframes termCursor{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes featGlow{0%,100%{box-shadow:0 0 0 1px rgba(250,204,21,.22),0 0 40px rgba(250,204,21,.06)}50%{box-shadow:0 0 0 1px rgba(250,204,21,.55),0 0 60px rgba(250,204,21,.14)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

        .bp{min-height:100vh;background:transparent;color:#fff;font-family:'Plus Jakarta Sans', sans-serif;overflow-x:hidden;padding-top:80px;position:relative}
        .bp::before{content:'';position:fixed;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,rgba(57,255,20,.25),transparent);animation:scanline 6s linear infinite;pointer-events:none;z-index:100}

        .bp-hero{padding:clamp(4rem,8vw,7rem) clamp(1rem,5vw,3rem) clamp(2.5rem,5vw,4rem);background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(250,204,21,.07) 0%,transparent 70%),radial-gradient(ellipse 50% 40% at 80% 80%,rgba(57,255,20,.04) 0%,transparent 60%),transparent;border-bottom:1px solid rgba(250,204,21,.10);text-align:center}

        .tbar{display:inline-flex;align-items:center;gap:.5rem;background:rgba(57,255,20,.06);border:1px solid rgba(57,255,20,.25);border-radius:4px;padding:.35rem .85rem;margin-bottom:2rem;font-size:.68rem;color:#39ff14;letter-spacing:.12em}
        .tdot{width:7px;height:7px;border-radius:50%}
        .tcursor{display:inline-block;width:8px;height:13px;background:#39ff14;margin-left:2px;animation:termCursor 1s step-end infinite;vertical-align:middle}

        .bp-title{font-family:'Orbitron', sans-serif;font-size:clamp(1.8rem,5vw,3.6rem);font-weight:900;letter-spacing:3px;color:#fff;margin-bottom:1rem;animation:glitchBlink 7s infinite}
        .bp-title .yl{color:#facc15;text-shadow:0 0 20px rgba(250,204,21,.5)}
        .bp-title .gr{color:#39ff14;text-shadow:0 0 16px rgba(57,255,20,.5)}
        .bp-sub{font-size:clamp(.75rem,1.4vw,.92rem);color:rgba(255,255,255,.4);letter-spacing:.08em;line-height:1.7;max-width:560px;margin:0 auto 2.5rem;font-family:'Share Tech Mono',monospace}

        .bp-controls{max-width:1400px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:1.2rem}
        .bp-sw{position:relative;width:100%;max-width:680px}
        .bp-si{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(250,204,21,.45);font-size:.9rem;pointer-events:none}
        .bp-search{width:100%;padding:12px 16px 12px 40px;background:rgba(255,255,255,.05);border:1px solid rgba(250,204,21,.25);border-radius:8px;color:#fff;font-family:'Share Tech Mono',monospace;font-size:.85rem;letter-spacing:.05em;outline:none;box-sizing:border-box;transition:border-color .25s,box-shadow .25s}
        .bp-search::placeholder{color:rgba(250,204,21,.28)}
        .bp-search:focus{border-color:#facc15;box-shadow:0 0 0 2px rgba(250,204,21,.10),0 0 20px rgba(250,204,21,.08)}

        .bp-cats{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center}
        .cat-btn{padding:6px 16px;border-radius:20px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.45);font-family:'Share Tech Mono',monospace;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .25s ease}
        .cat-btn:hover{border-color:rgba(250,204,21,.4);color:#facc15}
        .cat-btn.active{background:rgba(250,204,21,.1);border-color:#facc15;color:#facc15}

        .bp-wrap{max-width:1440px;margin:0 auto;padding:clamp(2.5rem,5vw,4rem) clamp(1rem,4vw,2.5rem)}
        .s-tag{font-size:.62rem;color:#39ff14;letter-spacing:.2em;text-transform:uppercase;margin-bottom:.6rem}
        .s-title{font-family:'Orbitron',monospace;font-size:clamp(1rem,2.2vw,1.4rem);font-weight:900;color:#fff;letter-spacing:2px;text-transform:uppercase;margin-bottom:1.75rem}

        /* ── featured ── */
        .feat-card{background:rgba(5, 5, 10, 0.45);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(250,204,21,.22);border-radius:14px;overflow:hidden;cursor:pointer;position:relative;animation:featGlow 4s ease-in-out infinite;transition:transform .3s ease;margin-bottom:clamp(2.5rem,5vw,4rem)}
        .feat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#facc15,#39ff14,#facc15);opacity:.7;z-index:1}
        .feat-card:hover{transform:translateY(-4px)}

        .feat-cover{width:100%;height:260px;object-fit:cover;display:block}
        .feat-cover-placeholder{width:100%;height:260px;background:linear-gradient(135deg,rgba(250,204,21,.04),rgba(57,255,20,.04));display:flex;align-items:center;justify-content:center;font-size:.65rem;color:rgba(255,255,255,.15);letter-spacing:.15em}

        .feat-body{padding:clamp(1.5rem,3vw,2.5rem);display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:center}
        .feat-card::after{content:'';position:absolute;bottom:0;right:0;width:180px;height:180px;background:radial-gradient(circle at bottom right,rgba(250,204,21,.08),transparent 70%);pointer-events:none}

        .feat-badge{display:inline-flex;align-items:center;gap:.4rem;background:rgba(250,204,21,.12);border:1px solid rgba(250,204,21,.35);border-radius:4px;padding:.3rem .7rem;font-size:.6rem;color:#facc15;letter-spacing:.2em;text-transform:uppercase;margin-bottom:1rem}
        .feat-badge-dot{width:6px;height:6px;border-radius:50%;background:#facc15;box-shadow:0 0 6px #facc15;animation:termCursor 1.5s ease-in-out infinite}
        .feat-cat{display:inline-block;padding:4px 12px;background:rgba(250,204,21,.08);color:#facc15;border-radius:12px;font-size:.62rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.85rem}
        .feat-title{font-family:'Orbitron', sans-serif;font-size:clamp(1.1rem,2.5vw,1.75rem);font-weight:900;color:#fff;letter-spacing:1px;margin-bottom:1rem;line-height:1.25}
        .feat-excerpt{color:rgba(255,255,255,.5);font-size:clamp(.76rem,1.2vw,.85rem);line-height:1.75;margin-bottom:1.4rem;max-width:560px}
        .feat-meta{display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap}
        .meta-sep{color:rgba(255,255,255,.2)}
        .meta-time{font-size:.68rem;color:rgba(57,255,20,.7);letter-spacing:.08em;font-family:'Share Tech Mono',monospace}
        .meta-date{font-size:.66rem;color:rgba(255,255,255,.3);font-family:'Share Tech Mono',monospace}
        .feat-author{font-size:.7rem;color:rgba(255,255,255,.45);margin-top:.75rem;letter-spacing:.04em}
        .feat-author strong{color:rgba(255,255,255,.75);font-weight:600}
        .feat-btn{padding:.7rem 1.75rem;background:#facc15;color:#000;border:none;border-radius:6px;font-family:'Orbitron',monospace;font-size:.72rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .25s ease;white-space:nowrap;align-self:flex-start;margin-top:.5rem}
        .feat-btn:hover{background:#fde047;transform:translateY(-2px);box-shadow:0 6px 24px rgba(250,204,21,.4)}

        /* ── grid ── */
        .bp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}
        .blog-card{background:rgba(5, 5, 10, 0.45);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.08);border-radius:12px;overflow:hidden;cursor:pointer;position:relative;transition:all .3s ease;display:flex;flex-direction:column}
        .blog-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--ca,#facc15);opacity:.5;transition:opacity .3s ease;z-index:1}
        .blog-card:hover{transform:translateY(-6px);border-color:var(--ca,rgba(250,204,21,.4));box-shadow:0 12px 40px rgba(0,0,0,.4),0 0 0 1px var(--ca,rgba(250,204,21,.2))}
        .blog-card:hover::before{opacity:1}

        .card-image{width:100%;height:180px;object-fit:cover;display:block}
        .card-image-placeholder{width:100%;height:120px;background:linear-gradient(135deg,rgba(255,255,255,.02),rgba(255,255,255,.01));border-bottom:1px solid rgba(255,255,255,.05)}

        .card-body{padding:1.25rem 1.5rem;display:flex;flex-direction:column;flex:1}

        .card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
        .card-tag{font-size:.58rem;color:var(--ca,#facc15);letter-spacing:.2em;text-transform:uppercase;opacity:.7}
        .card-cat{display:inline-block;padding:3px 10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:var(--ca,#facc15);border-radius:10px;font-size:.58rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em}
        .card-title{font-family:'Orbitron', sans-serif;font-size:clamp(.82rem,1.5vw,.95rem);font-weight:700;color:#fff;letter-spacing:.5px;margin-bottom:.75rem;line-height:1.4}
        .card-excerpt{color:rgba(255,255,255,.38);font-size:.75rem;line-height:1.7;margin-bottom:.75rem;flex:1}
        .card-author{font-size:.68rem;color:rgba(255,255,255,.4);margin-bottom:1rem;letter-spacing:.03em}
        .card-author strong{color:rgba(255,255,255,.65)}
        .card-div{height:1px;background:linear-gradient(90deg,var(--ca,rgba(250,204,21,.2)),transparent);margin-bottom:1rem}
        .card-foot{display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap}
        .card-time{font-size:.65rem;color:rgba(57,255,20,.65);letter-spacing:.06em}
        .card-date{font-size:.63rem;color:rgba(255,255,255,.25)}
        .card-link{font-size:.68rem;color:var(--ca,#facc15);background:none;border:none;cursor:pointer;font-family:'Share Tech Mono',monospace;letter-spacing:.06em;transition:opacity .2s}
        .card-link:hover{opacity:.75}

        /* ── loading / empty ── */
        .bp-loading{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6rem;gap:1.25rem;color:rgba(255,255,255,.25);font-size:.75rem;letter-spacing:.12em}
        .bp-spinner{width:32px;height:32px;border:2px solid rgba(250,204,21,.15);border-top-color:#facc15;border-radius:50%;animation:spin .8s linear infinite}
        .bp-empty{text-align:center;padding:4rem 1rem;color:rgba(255,255,255,.2);font-size:.85rem;letter-spacing:.1em}
        .bp-empty-code{font-family:'Orbitron',monospace;font-size:2rem;color:rgba(250,204,21,.15);display:block;margin-bottom:1rem}

        @media(max-width:768px){
          .feat-body{grid-template-columns:1fr}
          .feat-btn{align-self:stretch;text-align:center}
          .bp-grid{grid-template-columns:1fr}
          .feat-cover,.feat-cover-placeholder{height:180px}
        }
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
      `}</style>

      <div className="bp">
        {/* ── Hero ── */}
        <section className="bp-hero">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="tbar">
            <span className="tdot" style={{background:"#ff5f57"}}/>
            <span className="tdot" style={{background:"#facc15"}}/>
            <span className="tdot" style={{background:"#39ff14"}}/>
            &nbsp;BLOG_ENGINE.EXE — INSIGHTS LOADED<span className="tcursor"/>
          </motion.div>

          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.1}} className="bp-title">
            INSIGHTS &amp; <span className="yl">RESEARCH</span> <span className="gr">LOGS</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2}} className="bp-sub">
            // articles, project breakdowns, and field notes from our interns and engineering team
          </motion.p>

          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.3}} className="bp-controls">
            <div className="bp-sw">
              <span className="bp-si">⌕</span>
              <input className="bp-search" type="text" placeholder="search_articles..."
                value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
            <div className="bp-cats">
              {categories.map((cat) => (
                <button key={cat} className={`cat-btn${activeCategory === cat ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat)}>{cat}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Content ── */}
        <div className="bp-wrap">
          {loading ? (
            <div className="bp-loading">
              <div className="bp-spinner"/>
              // loading articles...
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && activeCategory === "All" && !search && (
                <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
                  <p className="s-tag">// featured.exe — editor's pick</p>
                  <h2 className="s-title">FEATURED ARTICLE</h2>
                  <div className="feat-card" onClick={() => navigate(`/blogs/${featured.slug}`)}>
                    {featured.cover_image
                      ? <img className="feat-cover" src={featured.cover_image} alt={featured.title}/>
                      : <div className="feat-cover-placeholder">// NO COVER IMAGE</div>
                    }
                    <div className="feat-body">
                      <div>
                        <div className="feat-badge"><span className="feat-badge-dot"/>FEATURED</div>
                        <div className="feat-cat">{featured.category}</div>
                        <h2 className="feat-title">{featured.title}</h2>
                        <p className="feat-excerpt">{featured.excerpt}</p>
                        <div className="feat-meta">
                          <span className="meta-time">◷ {readTime(featured.content)} min read</span>
                          <span className="meta-sep">|</span>
                          <span className="meta-date">
                            {formatDate(featured.published_at || featured.created_at)}
                          </span>
                        </div>
                        {featured.author_name && (
                          <p className="feat-author">
                            By <strong>{featured.author_name}</strong>
                            {featured.author_role ? ` · ${featured.author_role}` : ""}
                          </p>
                        )}
                      </div>
                      <button className="feat-btn"
                        onClick={(e) => { e.stopPropagation(); navigate(`/blogs/${featured.slug}`); }}>
                        Read Article →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              <p className="s-tag">// articles.sys — {filtered.length} post{filtered.length !== 1 ? "s" : ""} found</p>
              <h2 className="s-title">LATEST ARTICLES</h2>

              {filtered.length === 0 ? (
                <div className="bp-empty">
                  <span className="bp-empty-code">{blogsData.length === 0 ? "EMPTY" : "404"}</span>
                  {blogsData.length === 0
                    ? "// no articles published yet — check back soon"
                    : "// no articles match your query — try adjusting your search or filter"}
                </div>
              ) : (
                <div className="bp-grid">
                  {filtered.map((blog, i) => {
                    const accent = categoryAccent[blog.category] || "#facc15";
                    const tag    = categoryTag[blog.category]    || "ART.EXE";
                    return (
                      <motion.div key={blog.id}
                        initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}}
                        viewport={{once:true}} transition={{delay: i * .07}}
                        className="blog-card" style={{"--ca": accent}}
                        onClick={() => navigate(`/blogs/${blog.slug}`)}>

                        {blog.cover_image
                          ? <img className="card-image" src={blog.cover_image} alt={blog.title}/>
                          : <div className="card-image-placeholder"/>
                        }

                        <div className="card-body">
                          <div className="card-top">
                            <span className="card-tag">{tag}</span>
                            <span className="card-cat">{blog.category}</span>
                          </div>
                          <h3 className="card-title">{blog.title}</h3>
                          <p className="card-excerpt">{blog.excerpt || ""}</p>
                          {blog.author_name && (
                            <p className="card-author">
                              By <strong>{blog.author_name}</strong>
                              {blog.author_role ? ` · ${blog.author_role}` : ""}
                            </p>
                          )}
                          <div className="card-div"/>
                          <div className="card-foot">
                            <span className="card-date">
                              {formatDate(blog.published_at || blog.created_at)}
                            </span>
                            <div style={{display:"flex",alignItems:"center",gap:".75rem"}}>
                              <span className="card-time">◷ {readTime(blog.content)} min</span>
                              <button className="card-link"
                                onClick={(e) => { e.stopPropagation(); navigate(`/blogs/${blog.slug}`); }}>
                                Read More →
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Blogs;