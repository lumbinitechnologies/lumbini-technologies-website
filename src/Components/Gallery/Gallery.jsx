import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Download, Heart, Share2,
  Star, Camera, Users, Briefcase,
  Calendar, Code, Building, ChevronLeft, ChevronRight
} from 'lucide-react';

// Import your local images
import clientMeeting1 from '../../assets/clientmeeting1.jpeg';
import clientMeeting2 from '../../assets/clientmeeting2.jpeg';
import clientMeeting3 from '../../assets/clientmeeting3.jpeg';
import anniversary1 from '../../assets/oneyearanniversary1.jpeg';
import anniversary2 from '../../assets/oneyearanniversary2.jpeg';
import anniversary3 from '../../assets/oneyearanniversary3.jpeg';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

  @keyframes terminalCursor {
    0%,100% { opacity:1; } 50% { opacity:0; }
  }
  @keyframes glitchBlink {
    0%,93%,100% { opacity:1; text-shadow:0 0 10px #facc15; }
    94%  { opacity:0.15; text-shadow:6px 0 #facc15; }
    97%  { opacity:0.75; text-shadow:-4px 0 #facc15; }
  }
  @keyframes scanline {
    0%   { transform:translateY(-100%); }
    100% { transform:translateY(100vh); }
  }
  @keyframes warningPulse {
    0%,100% { opacity:0.5; }
    50%     { opacity:1; text-shadow:0 0 8px #39ff14; }
  }
  @keyframes float {
    0%,100% { transform:translateY(0); }
    50%     { transform:translateY(-8px); }
  }
  @keyframes fadeInImage {
    from { opacity:0; } to { opacity:1; }
  }
  @keyframes borderPulse {
    0%,100% { border-color:rgba(250,204,21,0.15); }
    50%     { border-color:rgba(250,204,21,0.4); box-shadow:0 0 24px rgba(250,204,21,0.06); }
  }
  @keyframes sectionIn {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── Page ── */
  .gal-page {
    min-height:100vh;
    background:#040404;
    color:#e2e8f0;
    font-family:'Share Tech Mono', monospace;
    position:relative; overflow-x:hidden;
  }
  .gal-page::before {
    content:''; position:fixed; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,rgba(57,255,20,0.35),transparent);
    animation:scanline 5s linear infinite;
    pointer-events:none; z-index:200;
  }
  .gal-page::after {
    content:''; position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(57,255,20,0.01) 1px,transparent 1px),
      linear-gradient(90deg,rgba(57,255,20,0.01) 1px,transparent 1px);
    background-size:40px 40px;
    pointer-events:none; z-index:0;
  }

  /* ── Hero ── */
  .gal-hero {
    position:relative; z-index:1;
    padding: clamp(5rem,12vw,9rem) clamp(1rem,5vw,3rem) clamp(3rem,7vw,5rem);
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(250,204,21,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(57,255,20,0.04) 0%, transparent 60%),
      transparent;
    text-align:center;
    border-bottom:1px solid rgba(250,204,21,0.1);
  }
  .gal-hero-inner { max-width:64rem; margin:0 auto; position:relative; z-index:1; }

  /* terminal bar in hero */
  .gal-tbar {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(57,255,20,0.05);
    border:1px solid rgba(57,255,20,0.2);
    border-radius:5px; padding:0.32rem 0.85rem;
    font-size:0.58rem; color:#39ff14; letter-spacing:0.12em;
    margin-bottom:1.75rem;
  }
  .gal-tbar-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  .gal-cursor {
    display:inline-block; width:5px; height:10px;
    background:#39ff14; margin-left:3px;
    animation:terminalCursor 1s step-end infinite;
    vertical-align:middle;
  }

  .gal-hero-icons {
    display:flex; justify-content:center; gap:1rem;
    margin-bottom:1.25rem; color:#facc15;
    animation:float 3s ease-in-out infinite;
  }

  .gal-hero-title {
    font-family:'Orbitron', monospace;
    font-size:clamp(1.6rem,5vw,3rem);
    font-weight:900; color:#fff;
    letter-spacing:2px; text-transform:uppercase;
    line-height:1.1; margin-bottom:1rem;
    animation:glitchBlink 9s infinite;
  }
  .gal-hero-title .yellow { color:#facc15; text-shadow:0 0 22px rgba(250,204,21,0.4); }

  .gal-hero-sub {
    font-size:clamp(0.72rem,1.6vw,0.85rem);
    color:rgba(255,255,255,0.35);
    line-height:1.75; letter-spacing:0.05em;
    max-width:520px; margin:0 auto;
  }

  /* ── Filters ── */
  .gal-filters {
    position:sticky; top:0; z-index:40;
    background:rgba(255,255,255,0.06);
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
    border-bottom:1px solid rgba(250,204,21,0.1);
    padding:clamp(0.75rem,2vw,1.25rem) clamp(1rem,4vw,2rem);
    position:relative; z-index:10;
  }
  .gal-filters-inner {
    max-width:72rem; margin:0 auto;
    display:flex; flex-direction:column; gap:0.85rem;
  }

  /* search */
  .gal-search-wrap { position:relative; max-width:28rem; margin:0 auto; width:100%; }
  .gal-search-icon {
    position:absolute; left:0.9rem; top:50%; transform:translateY(-50%);
    color:rgba(57,255,20,0.4); pointer-events:none; z-index:1;
    width:14px; height:14px;
  }
  .gal-search {
    width:100%; padding:0.65rem 1rem 0.65rem 2.5rem;
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(250,204,21,0.2);
    border-radius:7px; color:#fff;
    font-size:0.8rem; font-family:'Share Tech Mono', monospace;
    letter-spacing:0.04em; outline:none;
    transition:border-color 0.25s, box-shadow 0.25s;
    box-sizing:border-box;
  }
  .gal-search::placeholder { color:rgba(250,204,21,0.22); }
  .gal-search:focus {
    border-color:rgba(250,204,21,0.55);
    box-shadow:0 0 0 3px rgba(250,204,21,0.07);
  }

  /* category buttons */
  .gal-cats { display:flex; flex-wrap:wrap; gap:0.5rem; justify-content:center; }
  .gal-cat-btn {
    display:flex; align-items:center; gap:0.4rem;
    padding:0.4rem 1rem;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:6px;
    color:rgba(255,255,255,0.45);
    font-size:0.68rem; font-family:'Share Tech Mono', monospace;
    letter-spacing:0.1em; text-transform:uppercase;
    cursor:pointer; transition:all 0.25s; white-space:nowrap;
  }
  .gal-cat-btn:hover {
    border-color:rgba(250,204,21,0.35);
    color:rgba(250,204,21,0.8);
    background:rgba(250,204,21,0.04);
    transform:translateY(-1px);
  }
  .gal-cat-btn.active {
    background:#facc15; color:#000;
    border-color:#facc15; font-weight:700;
    box-shadow:0 4px 14px rgba(250,204,21,0.3);
    font-family:'Orbitron', monospace;
    transform:translateY(-1px);
  }

  /* ── Gallery Grid ── */
  .gal-section { padding:clamp(1.5rem,4vw,3rem) clamp(1rem,4vw,2rem); position:relative; z-index:1; }
  .gal-container { max-width:72rem; margin:0 auto; }
  .gal-grid {
    display:grid; gap:clamp(1rem,2.5vw,1.75rem);
    grid-template-columns:repeat(auto-fill, minmax(clamp(240px,28vw,320px),1fr));
  }

  /* ── Card ── */
  .gal-item {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.07);
    border-radius:12px; overflow:hidden;
    cursor:pointer; position:relative;
    transition:border-color 0.3s, box-shadow 0.3s;
    animation:borderPulse 4s ease-in-out infinite;
  }
  .gal-item:hover {
    border-color:rgba(250,204,21,0.45);
    box-shadow:0 20px 40px rgba(250,204,21,0.08);
  }

  .gal-img-wrap {
    position:relative; aspect-ratio:16/10;
    overflow:hidden; background:#000;
  }
  .gal-img {
    width:100%; height:100%; object-fit:cover;
    transition:transform 0.6s cubic-bezier(0.4,0,0.2,1);
  }
  .gal-item:hover .gal-img { transform:scale(1.07); }

  .gal-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity 0.3s;
  }
  .gal-item:hover .gal-overlay { opacity:1; }

  .gal-overlay-btns { display:flex; gap:0.75rem; }
  .gal-overlay-btn {
    display:flex; align-items:center; justify-content:center;
    width:2.4rem; height:2.4rem;
    background:#facc15; border:none; border-radius:50%;
    color:#000; cursor:pointer;
    transition:all 0.25s;
    box-shadow:0 4px 14px rgba(250,204,21,0.35);
  }
  .gal-overlay-btn:hover { background:#fde047; transform:scale(1.12) rotate(5deg); }
  .gal-overlay-btn.favorited { background:#ef4444; color:#fff; }

  .gal-card-body { padding:clamp(0.85rem,2vw,1.25rem); }

  .gal-card-cat {
    display:flex; align-items:center; gap:0.4rem;
    font-size:0.6rem; color:#39ff14;
    letter-spacing:0.15em; text-transform:uppercase;
    margin-bottom:0.5rem; animation:warningPulse 3s ease-in-out infinite;
  }

  .gal-card-title {
    font-family:'Orbitron', monospace;
    font-size:clamp(0.82rem,1.6vw,1rem);
    font-weight:700; color:#fff;
    margin-bottom:0.5rem; letter-spacing:0.5px;
    text-transform:uppercase;
  }

  .gal-card-desc {
    color:rgba(255,255,255,0.35);
    font-size:clamp(0.68rem,1.2vw,0.76rem);
    line-height:1.7; margin-bottom:0.75rem;
    display:-webkit-box; -webkit-line-clamp:2;
    -webkit-box-orient:vertical; overflow:hidden;
    letter-spacing:0.03em;
  }

  .gal-card-tags { display:flex; flex-wrap:wrap; gap:0.35rem; }
  .gal-tag {
    padding:0.22rem 0.6rem;
    background:rgba(57,255,20,0.05);
    border:1px solid rgba(57,255,20,0.12);
    border-radius:4px;
    font-size:0.6rem; color:rgba(57,255,20,0.45);
    letter-spacing:0.07em; transition:all 0.2s;
  }
  .gal-tag:hover { background:rgba(57,255,20,0.09); color:#39ff14; }

  /* ── No results ── */
  .gal-empty {
    text-align:center; padding:clamp(2.5rem,8vw,5rem) 2rem;
    color:rgba(255,255,255,0.2);
  }
  .gal-empty svg { margin:0 auto 1rem; color:rgba(57,255,20,0.25); display:block; }
  .gal-empty h3 {
    font-family:'Orbitron', monospace;
    font-size:clamp(0.9rem,2vw,1.2rem);
    color:rgba(255,255,255,0.4);
    margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:1px;
  }
  .gal-empty p { font-size:0.72rem; letter-spacing:0.05em; }

  /* ── Modal overlay ── */
  .gal-modal-overlay {
    position:fixed; inset:0;
    background:rgba(4,4,4,0.92);
    display:flex; align-items:center; justify-content:center;
    padding:clamp(0.5rem,2vw,1rem); z-index:9999; cursor:pointer;
  }

  .gal-modal {
    background:rgba(255,255,255,0.07);
    backdrop-filter:blur(18px);
    -webkit-backdrop-filter:blur(18px);
    border-radius:14px; width:100%;
    max-width:clamp(300px,92vw,58rem);
    max-height:95vh; overflow-y:auto;
    border:1px solid rgba(250,204,21,0.2);
    display:flex; flex-direction:column;
    box-shadow:0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(250,204,21,0.05);
    cursor:default; position:relative;
  }
  .gal-modal::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,#facc15,rgba(57,255,20,0.5),transparent);
    opacity:0.45; border-radius:14px 14px 0 0;
  }

  /* modal scrollbar */
  .gal-modal::-webkit-scrollbar { width:5px; }
  .gal-modal::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
  .gal-modal::-webkit-scrollbar-thumb { background:rgba(250,204,21,0.4); border-radius:3px; }

  .gal-modal-close {
    position:absolute; top:0.85rem; right:0.85rem;
    background:#facc15; border:none; border-radius:50%;
    width:2.2rem; height:2.2rem;
    display:flex; align-items:center; justify-content:center;
    color:#000; cursor:pointer; z-index:10;
    transition:all 0.25s;
    box-shadow:0 4px 14px rgba(250,204,21,0.4);
  }
  .gal-modal-close:hover { background:#fde047; transform:scale(1.1) rotate(90deg); }

  .gal-modal-img-wrap {
    position:relative; aspect-ratio:16/9;
    overflow:hidden; background:#000;
  }
  .gal-modal-img {
    width:100%; height:100%; object-fit:contain;
    animation:fadeInImage 0.3s ease;
  }

  /* nav bar */
  .gal-modal-nav {
    display:flex; align-items:center; justify-content:space-between;
    padding:0.75rem 1.25rem;
    background:rgba(255,255,255,0.03);
    border-top:1px solid rgba(255,255,255,0.05);
    border-bottom:1px solid rgba(255,255,255,0.05);
    gap:0.5rem;
  }
  .gal-nav-btn {
    display:flex; align-items:center; gap:0.3rem;
    padding:0.45rem 1rem;
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(250,204,21,0.18);
    border-radius:6px;
    color:rgba(255,255,255,0.5);
    font-size:0.68rem; font-family:'Share Tech Mono', monospace;
    letter-spacing:0.1em; text-transform:uppercase;
    cursor:pointer; transition:all 0.25s; white-space:nowrap;
  }
  .gal-nav-btn:hover { border-color:#facc15; color:#facc15; background:rgba(250,204,21,0.05); }

  .gal-dots { display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap; justify-content:center; }
  .gal-dot {
    width:8px; height:8px; border-radius:50%;
    background:rgba(255,255,255,0.15); cursor:pointer;
    transition:all 0.25s;
  }
  .gal-dot:hover { background:rgba(250,204,21,0.4); transform:scale(1.2); }
  .gal-dot.active {
    background:#facc15; width:10px; height:10px;
    box-shadow:0 0 10px rgba(250,204,21,0.5);
  }

  /* modal content */
  .gal-modal-content { padding:clamp(1rem,3vw,1.75rem); }
  .gal-modal-cat {
    display:flex; align-items:center; gap:0.4rem;
    font-size:0.58rem; color:#39ff14; letter-spacing:0.18em;
    text-transform:uppercase; margin-bottom:0.6rem;
    animation:warningPulse 3s ease-in-out infinite;
  }
  .gal-modal-title {
    font-family:'Orbitron', monospace;
    font-size:clamp(1rem,2.5vw,1.5rem);
    font-weight:700; color:#fff;
    text-transform:uppercase; letter-spacing:1.5px;
    margin-bottom:0.85rem;
  }
  .gal-modal-desc {
    color:rgba(255,255,255,0.35);
    font-size:clamp(0.7rem,1.3vw,0.78rem);
    line-height:1.8; letter-spacing:0.03em;
    margin-bottom:1rem;
  }
  .gal-modal-tags { display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.25rem; }
  .gal-modal-tag {
    padding:0.25rem 0.7rem;
    background:rgba(57,255,20,0.04);
    border:1px solid rgba(57,255,20,0.12);
    border-radius:4px;
    font-size:0.6rem; color:rgba(57,255,20,0.45); letter-spacing:0.07em;
    transition:all 0.2s;
  }
  .gal-modal-tag:hover { background:rgba(57,255,20,0.08); color:#39ff14; }

  .gal-modal-actions {
    display:flex; gap:0.65rem; flex-wrap:wrap;
    padding-top:1rem; border-top:1px solid rgba(255,255,255,0.06);
  }
  .gal-modal-action-btn {
    display:flex; align-items:center; gap:0.4rem;
    padding:0.55rem 1.1rem;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(250,204,21,0.18);
    border-radius:7px;
    color:rgba(255,255,255,0.45);
    font-size:0.65rem; font-family:'Share Tech Mono', monospace;
    letter-spacing:0.1em; text-transform:uppercase;
    cursor:pointer; transition:all 0.25s; white-space:nowrap;
  }
  .gal-modal-action-btn:hover {
    border-color:#facc15; color:#facc15;
    background:rgba(250,204,21,0.05); transform:translateY(-2px);
  }
  .gal-modal-action-btn.favorited { background:rgba(239,68,68,0.1); border-color:#ef4444; color:#f87171; }
  .gal-modal-action-btn.favorited:hover { background:rgba(239,68,68,0.15); }

  /* ── Responsive ── */
  @media (max-width:480px) {
    .gal-filters { position:relative; }
    .gal-cats { flex-wrap:nowrap; overflow-x:auto; justify-content:flex-start; padding-bottom:0.4rem; }
    .gal-modal-actions { flex-direction:column; }
    .gal-modal-action-btn { justify-content:center; width:100%; }
  }
  @media (prefers-reduced-motion:reduce) {
    *{ animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
  }
`;

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    if (selectedItem) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (selectedItem.images) selectedItem.images.forEach(src => { const i = new Image(); i.src = src; });
      const onKey = (e) => { if (e.key === 'Escape') setSelectedItem(null); };
      document.addEventListener('keydown', onKey);
      return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
    }
  }, [selectedItem]);

  const categories = ['All', 'Events'];

  const galleryItems = [
    {
      id: 1, title: "Client Meeting", category: "Events",
      images: [clientMeeting1, clientMeeting2, clientMeeting3],
      description: "Snapshots from our recent client meeting.",
      tags: ["client", "meeting", "business"]
    },
    {
      id: 2, title: "1-Year Anniversary", category: "Events",
      images: [anniversary1, anniversary2, anniversary3],
      description: "Celebrating our first anniversary milestone.",
      tags: ["anniversary", "milestone", "celebration"]
    }
  ];

  const filteredItems = galleryItems.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const toggleFavorite = (id) => {
    const n = new Set(favorites);
    n.has(id) ? n.delete(id) : n.add(id);
    setFavorites(n);
  };

  const getCategoryIcon = (cat) => {
    const sz = { width: 13, height: 13 };
    switch (cat) {
      case 'Team':       return <Users {...sz} />;
      case 'Technology': return <Code {...sz} />;
      case 'Projects':   return <Briefcase {...sz} />;
      case 'Events':     return <Calendar {...sz} />;
      case 'Office':     return <Building {...sz} />;
      default:           return <Camera {...sz} />;
    }
  };

  /* ── Card ── */
  const GalleryItem = ({ item }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      whileHover={{ y: -8 }}
      className="gal-item"
      onClick={() => { setSelectedItem(item); setSlideIndex(0); }}
    >
      <div className="gal-img-wrap">
        <img src={item.images?.[0] ?? item.image} alt={item.title} className="gal-img" />
        <div className="gal-overlay">
          <div className="gal-overlay-btns">
            <button className={`gal-overlay-btn${favorites.has(item.id) ? ' favorited' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}>
              <Heart width={14} height={14} />
            </button>
            <button className="gal-overlay-btn" onClick={(e) => e.stopPropagation()}>
              <Share2 width={14} height={14} />
            </button>
            <button className="gal-overlay-btn" onClick={(e) => e.stopPropagation()}>
              <Download width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="gal-card-body">
        <div className="gal-card-cat">{getCategoryIcon(item.category)}<span>{item.category}</span></div>
        <h3 className="gal-card-title">{item.title}</h3>
        <p className="gal-card-desc">{item.description}</p>
        <div className="gal-card-tags">
          {item.tags.slice(0, 3).map((tag, i) => <span key={i} className="gal-tag">#{tag}</span>)}
        </div>
      </div>
    </motion.div>
  );

  /* ── Modal ── */
  const ImageModal = ({ item, index, onPrev, onNext, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="gal-modal-overlay" onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        className="gal-modal" onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="gal-modal-close"><X width={16} height={16} /></button>

        <div className="gal-modal-img-wrap">
          <img src={item.images?.[index] ?? item.image} alt={item.title} className="gal-modal-img" />
        </div>

        {item.images?.length > 1 && (
          <div className="gal-modal-nav">
            <button className="gal-nav-btn" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
              <ChevronLeft width={14} height={14} /> Prev
            </button>
            <div className="gal-dots">
              {item.images.map((_, i) => (
                <span key={i} className={`gal-dot${i === index ? ' active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSlideIndex(i); }} />
              ))}
            </div>
            <button className="gal-nav-btn" onClick={(e) => { e.stopPropagation(); onNext(); }}>
              Next <ChevronRight width={14} height={14} />
            </button>
          </div>
        )}

        <div className="gal-modal-content">
          <div className="gal-modal-cat">{getCategoryIcon(item.category)}<span>{item.category}</span></div>
          <h2 className="gal-modal-title">{item.title}</h2>
          <p className="gal-modal-desc">{item.description}</p>
          <div className="gal-modal-tags">
            {item.tags.map((tag, i) => <span key={i} className="gal-modal-tag">#{tag}</span>)}
          </div>
          <div className="gal-modal-actions">
            <button className={`gal-modal-action-btn${favorites.has(item.id) ? ' favorited' : ''}`}
              onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}>
              <Heart width={13} height={13} />
              {favorites.has(item.id) ? 'Favorited' : 'Favorite'}
            </button>
            <button className="gal-modal-action-btn" onClick={(e) => e.stopPropagation()}>
              <Share2 width={13} height={13} /> Share
            </button>
            <button className="gal-modal-action-btn" onClick={(e) => e.stopPropagation()}>
              <Download width={13} height={13} /> Download
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="gal-page">

        {/* Hero */}
        <section className="gal-hero">
          <div className="gal-hero-inner">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="gal-tbar">
              <span className="gal-tbar-dot" style={{ background: '#ff5f57' }} />
              <span className="gal-tbar-dot" style={{ background: '#facc15' }} />
              <span className="gal-tbar-dot" style={{ background: '#39ff14' }} />
              &nbsp;GALLERY.SYS — MEDIA ARCHIVE<span className="gal-cursor" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="gal-hero-icons">
              <Camera width={22} height={22} />
              <Star width={16} height={16} />
              <Camera width={18} height={18} />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="gal-hero-title">
              OUR <span className="yellow">GALLERY</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="gal-hero-sub">
              // discover our team, projects, and company culture through our media archive
            </motion.p>
          </div>
        </section>

        {/* Filters */}
        <section className="gal-filters">
          <div className="gal-filters-inner">
            <div className="gal-search-wrap">
              <Search className="gal-search-icon" />
              <input type="text" placeholder="search_gallery..." className="gal-search"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="gal-cats">
              {categories.map(cat => (
                <button key={cat} className={`gal-cat-btn${selectedCategory === cat ? ' active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}>
                  {cat !== 'All' && getCategoryIcon(cat)}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="gal-section">
          <div className="gal-container">
            <motion.div layout className="gal-grid">
              <AnimatePresence>
                {filteredItems.map(item => <GalleryItem key={item.id} item={item} />)}
              </AnimatePresence>
            </motion.div>
            {filteredItems.length === 0 && (
              <div className="gal-empty">
                <Camera width={48} height={48} />
                <h3>// no_results_found</h3>
                <p>try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        <AnimatePresence>
          {selectedItem && (
            <ImageModal
              item={selectedItem} index={slideIndex}
              onPrev={() => setSlideIndex(p => (p - 1 + selectedItem.images.length) % selectedItem.images.length)}
              onNext={() => setSlideIndex(p => (p + 1) % selectedItem.images.length)}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Gallery;