"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const educators = [
  {
    emoji: "👩‍🏫", name: "Priya Sharma", role: "Grundschullehrerin",
    country: "🇮🇳 Indien", rating: "4.97", tag: "Voll anerkannt", tagColor: "#1E8449",
    subjects: ["Mathe", "Sachkunde", "Deutsch B2"], avail: "Ab August 2026",
  },
  {
    emoji: "👨‍🎨", name: "Arjun Patel", role: "Erzieher / Frühpädagoge",
    country: "🇮🇳 Indien", rating: "5.00", tag: "Sofort verfügbar", tagColor: "#1E8449",
    subjects: ["Montessori", "Musik", "0–6 Jahre"], avail: "Ab sofort",
  },
  {
    emoji: "👩‍🔬", name: "Maria Santos", role: "MINT-Lehrerin Sek. I & II",
    country: "🇵🇭 Philippinen", rating: "4.94", tag: "Voll anerkannt", tagColor: "#1E8449",
    subjects: ["Physik", "Chemie", "Biologie"], avail: "Ab September 2026",
  },
  {
    emoji: "👩‍🎓", name: "Ana Kovačević", role: "Deutschlehrerin DaF/DaZ",
    country: "🇷🇸 Serbien", rating: "4.99", tag: "Sofort verfügbar", tagColor: "#1E8449",
    subjects: ["DaF", "DaZ", "Integrationsklassen"], avail: "Ab sofort",
  },
];

const steps = [
  { icon: "🔍", num: "01", title: "Profil suchen", desc: "Durchsuche verifizierte Fachkraftprofile nach Qualifikation, Region und Verfügbarkeit — kostenlos." },
  { icon: "💬", num: "02", title: "Direkt kontaktieren", desc: "Sende der Fachkraft eine Nachricht und lade sie zum Vorstellungsgespräch ein." },
  { icon: "✅", num: "03", title: "Einstellen & starten", desc: "Wir unterstützen bei Anerkennung und Onboarding — damit die Fachkraft schnell startet." },
];

const stats = [
  { num: "2.400+", label: "Fachkräfte" },
  { num: "580+", label: "Schulen & Kitas" },
  { num: "16", label: "Bundesländer" },
  { num: "94%", label: "Erfolgsquote" },
];

function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [liked, setLiked] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    setTimeout(() => setVisible(true), 100);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLike = (i) => setLiked((p) => ({ ...p, [i]: !p[i] }));

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFBFC", color: "#1a1a2e", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: #1A3F6F22; }

        .nav-link { color: #6B7897; font-size: 0.9rem; font-weight: 500; cursor: pointer; text-decoration: none; transition: color 0.2s; padding: 6px 0; border-bottom: 2px solid transparent; }
        .nav-link:hover { color: #1A3F6F; border-bottom-color: #1E8449; }

        .btn-primary {
          background: linear-gradient(135deg, #1A3F6F, #2471A3);
          color: white; border: none; border-radius: 50px;
          font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer;
          transition: all 0.25s; box-shadow: 0 4px 16px rgba(26,63,111,0.3);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,63,111,0.4); }

        .btn-green {
          background: linear-gradient(135deg, #1E8449, #27AE60);
          color: white; border: none; border-radius: 50px;
          font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer;
          transition: all 0.25s; box-shadow: 0 4px 16px rgba(30,132,73,0.35);
        }
        .btn-green:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(30,132,73,0.45); }

        .btn-outline {
          background: transparent; color: #1A3F6F;
          border: 1.5px solid #E8EDF4; border-radius: 50px;
          font-family: 'DM Sans', sans-serif; font-weight: 500; cursor: pointer;
          transition: all 0.2s;
        }
        .btn-outline:hover { border-color: #1A3F6F; background: #1A3F6F; color: white; }

        .card {
          background: white; border-radius: 20px; overflow: hidden;
          border: 1px solid #E8EDF4; transition: all 0.3s; cursor: pointer;
        }
        .card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(26,63,111,0.14); }

        .step-card {
          background: white; border-radius: 20px; padding: 36px 28px;
          border: 1px solid #E8EDF4; transition: all 0.3s; text-align: center;
        }
        .step-card:hover { box-shadow: 0 16px 48px rgba(26,63,111,0.1); transform: translateY(-4px); }

        .heart-btn {
          position: absolute; top: 14px; right: 14px;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.92); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; transition: transform 0.2s; backdrop-filter: blur(4px);
        }
        .heart-btn:hover { transform: scale(1.2); }

        .pill {
          display: inline-block; padding: 4px 12px; border-radius: 50px;
          font-size: 0.74rem; font-weight: 600;
        }

        .search-input {
          flex: 1; border: none; outline: none; background: transparent;
          font-family: 'DM Sans', sans-serif; font-size: 0.92rem; color: #444;
          width: 100%;
        }

        .hero-in { opacity: 0; transform: translateY(28px); transition: all 0.7s ease; }
        .hero-in.show { opacity: 1; transform: translateY(0); }
        .hero-in.d1 { transition-delay: 0.1s; }
        .hero-in.d2 { transition-delay: 0.25s; }
        .hero-in.d3 { transition-delay: 0.4s; }
        .hero-in.d4 { transition-delay: 0.55s; }

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

        .floating { animation: float 4s ease-in-out infinite; }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-col { flex-direction: column !important; }
          .mobile-full { width: 100% !important; }
          .hero-title { font-size: 2.2rem !important; }
          .cards-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .stats-row { flex-wrap: wrap !important; }
          .search-bar-inner { flex-direction: column !important; border-radius: 20px !important; }
          .search-divider { display: none !important; }
          .nav-center { display: none !important; }
        }
      `}</style>

      {/* ══════════════ NAVBAR ══════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? "#E8EDF4" : "transparent"}`,
        boxShadow: scrolled ? "0 2px 20px rgba(26,63,111,0.08)" : "none",
        transition: "all 0.3s", padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 72,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #1A3F6F, #2471A3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M4 21 Q14 6 24 21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="2" y1="21" x2="26" y2="21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="8" y1="21" x2="8" y2="16" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="14" y1="21" x2="14" y2="10" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="20" y1="21" x2="20" y2="16" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="14" cy="7" r="3" fill="#27AE60"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", fontWeight: 700 }}>
            <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
          </span>
        </div>

        {/* Center links */}
        <div className="nav-center" style={{ display: "flex", gap: 32 }}>
          {["Lehrkräfte", "Erzieher*innen", "International", "Arbeitgeber"].map((l) => (
            <a key={l} className="nav-link">{l}</a>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn-outline" style={{ padding: "8px 20px", fontSize: "0.88rem" }}>Anmelden</button>
          <button className="btn-primary" style={{ padding: "9px 22px", fontSize: "0.88rem" }}>Registrieren</button>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #0D2137 0%, #1A3F6F 45%, #1B5E9E 75%, #2471A3 100%)",
        padding: "100px 40px 120px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.035,
          backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
          backgroundSize: "28px 28px",
        }}/>
        <div style={{
          position: "absolute", top: "20%", left: "10%", width: 400, height: 400,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(30,132,73,0.18), transparent 70%)",
          filter: "blur(60px)",
        }}/>
        <div style={{
          position: "absolute", bottom: "10%", right: "8%", width: 350, height: 350,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(93,173,226,0.15), transparent 70%)",
          filter: "blur(60px)",
        }}/>

        {/* Floating emoji cards */}
        <div className="floating hide-mobile" style={{
          position: "absolute", left: "7%", top: "30%",
          background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
          borderRadius: 16, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.15)",
          animationDelay: "0s",
        }}>
          <div style={{ fontSize: "1.6rem" }}>👩‍🏫</div>
          <div style={{ color: "white", fontSize: "0.75rem", fontWeight: 600, marginTop: 4 }}>Lehrerin</div>
          <div style={{ color: "#52D68A", fontSize: "0.7rem" }}>⭐ 4.97</div>
        </div>

        <div className="floating hide-mobile" style={{
          position: "absolute", right: "7%", top: "25%",
          background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
          borderRadius: 16, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.15)",
          animationDelay: "1.5s",
        }}>
          <div style={{ fontSize: "1.6rem" }}>👨‍🎨</div>
          <div style={{ color: "white", fontSize: "0.75rem", fontWeight: 600, marginTop: 4 }}>Erzieher</div>
          <div style={{ color: "#52D68A", fontSize: "0.7rem" }}>✅ Verfügbar</div>
        </div>

        <div className="floating hide-mobile" style={{
          position: "absolute", left: "6%", bottom: "22%",
          background: "rgba(30,132,73,0.25)", backdropFilter: "blur(12px)",
          borderRadius: 16, padding: "12px 16px", border: "1px solid rgba(30,132,73,0.3)",
          animationDelay: "0.8s",
        }}>
          <div style={{ color: "#52D68A", fontSize: "0.8rem", fontWeight: 700 }}>2.400+</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7rem" }}>Fachkräfte</div>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>

          <div className={`hero-in d1 ${visible ? "show" : ""}`} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
            color: "white", padding: "7px 18px", borderRadius: 50,
            fontSize: "0.82rem", fontWeight: 500, marginBottom: 28,
            backdropFilter: "blur(8px)",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#52D68A", display: "inline-block", animation: "pulse 2s infinite" }}/>
            Über 2.400 verifizierte Fachkräfte — jetzt verfügbar
          </div>

          <h1 className={`hero-title hero-in d2 ${visible ? "show" : ""}`} style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "3.6rem", fontWeight: 800, color: "white",
            lineHeight: 1.15, marginBottom: 22,
          }}>
            Die Brücke zwischen<br/>
            <span style={{ color: "#52D68A" }}>Fachkräften</span> &{" "}
            <span style={{
              background: "linear-gradient(90deg, #5DADE2, #AED6F1)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Bildungseinrichtungen</span>
          </h1>

          <p className={`hero-in d3 ${visible ? "show" : ""}`} style={{
            color: "rgba(255,255,255,0.72)", fontSize: "1.12rem",
            fontWeight: 300, marginBottom: 48, lineHeight: 1.7,
          }}>
            Deutschlands erste Plattform, die Lehrkräfte & Erzieher*innen aus aller Welt
            mit Schulen und Kitas verbindet — schnell, sicher und rechtssicher.
          </p>

          {/* Search bar */}
          <div className={`hero-in d4 ${visible ? "show" : ""}`} style={{
            background: "white", borderRadius: 80,
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)", maxWidth: 720, margin: "0 auto",
            border: "1.5px solid rgba(255,255,255,0.2)",
          }}>
            <div className="search-bar-inner" style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1, padding: "18px 24px" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Stelle / Fachrichtung</div>
                <input className="search-input" placeholder="z.B. Erzieherin, Grundschullehrerin..."/>
              </div>
              <div className="search-divider" style={{ width: 1, height: 40, background: "#E8EDF4" }}/>
              <div style={{ flex: 1, padding: "18px 24px" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Bundesland</div>
                <input className="search-input" placeholder="z.B. NRW, Bayern, Berlin..."/>
              </div>
              <div className="search-divider" style={{ width: 1, height: 40, background: "#E8EDF4" }}/>
              <div style={{ flex: 1, padding: "18px 24px" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Verfügbarkeit</div>
                <input className="search-input" placeholder="z.B. Ab sofort..."/>
              </div>
              <button className="btn-green" style={{ margin: 8, padding: "13px 26px", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span>🔍</span> Suchen
              </button>
            </div>
          </div>

          {/* Quick filters */}
          <div className={`hero-in d4 ${visible ? "show" : ""}`} style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["⚡ Sofort verfügbar", "🎓 Grundschule", "🧒 Kita / Erzieher", "🌍 International", "🔬 MINT-Fächer"].map((f) => (
              <button key={f} style={{
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                color: "white", padding: "7px 16px", borderRadius: 50,
                fontSize: "0.82rem", fontWeight: 500, cursor: "pointer",
                backdropFilter: "blur(8px)", fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              >{f}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <div style={{ background: "white", borderBottom: "1px solid #E8EDF4" }}>
        <div className="stats-row" style={{ display: "flex", maxWidth: 900, margin: "0 auto" }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: "24px 16px", textAlign: "center",
              borderRight: i < stats.length - 1 ? "1px solid #E8EDF4" : "none",
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: NAVY }}>{s.num}</div>
              <div style={{ fontSize: "0.8rem", color: "#6B7897", fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ EDUCATOR CARDS ══════════════ */}
      <section style={{ padding: "72px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              ✦ Empfohlen diese Woche
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: NAVY }}>
              Top-Fachkräfte für<br/>Ihre Einrichtung
            </h2>
          </div>
          <a style={{ color: BLUE, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", textDecoration: "underline" }}>
            Alle anzeigen →
          </a>
        </div>

        <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {educators.map((ed, i) => (
            <div key={i} className="card">
              {/* Card image area */}
              <div style={{
                height: 190, position: "relative",
                background: `linear-gradient(135deg, ${i % 2 === 0 ? "#1A3F6F, #2471A3" : "#0D3B2E, #1E8449"})`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "4.5rem" }}>{ed.emoji}</span>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }}/>

                {/* Status badge */}
                <div style={{
                  position: "absolute", top: 13, left: 13,
                  background: "white", borderRadius: 50, padding: "4px 12px",
                  fontSize: "0.72rem", fontWeight: 700, color: ed.tagColor,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: ed.tagColor, display: "inline-block" }}/>
                  {ed.tag}
                </div>

                {/* Heart */}
                <button className="heart-btn" onClick={() => toggleLike(i)}>
                  {liked[i] ? "❤️" : "🤍"}
                </button>

                {/* Country */}
                <div style={{ position: "absolute", bottom: 12, left: 14, color: "white", fontSize: "0.82rem", fontWeight: 600 }}>
                  📍 {ed.country}
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: NAVY }}>{ed.name}</div>
                  <div style={{ fontSize: "0.84rem", fontWeight: 600, color: NAVY, display: "flex", alignItems: "center", gap: 3 }}>
                    ⭐ {ed.rating}
                  </div>
                </div>
                <div style={{ fontSize: "0.82rem", color: BLUE, fontWeight: 500, marginBottom: 12 }}>{ed.role}</div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {ed.subjects.map((s, j) => (
                    <span key={j} className="pill" style={{ background: j === 0 ? "#EAF7EF" : "#EBF5FB", color: j === 0 ? GREEN : BLUE, fontSize: "0.73rem" }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #E8EDF4", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.78rem", color: GREEN, fontWeight: 600 }}>🗓 {ed.avail}</span>
                  <button className="btn-primary" style={{ padding: "7px 16px", fontSize: "0.78rem" }}>Anfrage</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section style={{ background: "#F0F4F9", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
              ✦ So funktioniert es
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: NAVY }}>
              In 3 Schritten zur perfekten Fachkraft
            </h2>
          </div>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} className="step-card">
                <div style={{
                  width: 64, height: 64, borderRadius: 20, margin: "0 auto 20px",
                  background: i === 1 ? "linear-gradient(135deg, #1E8449, #27AE60)" : "linear-gradient(135deg, #1A3F6F, #2471A3)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem",
                  boxShadow: i === 1 ? "0 8px 24px rgba(30,132,73,0.3)" : "0 8px 24px rgba(26,63,111,0.25)",
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6B7897", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
                  Schritt {s.num}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: NAVY, marginBottom: 12 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: "0.88rem", color: "#6B7897", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA SPLIT ══════════════ */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="mobile-col" style={{ display: "flex", gap: 24 }}>

          {/* Educator CTA */}
          <div style={{
            flex: 1, borderRadius: 24, padding: "48px 40px",
            background: "linear-gradient(135deg, #0D2137, #1A3F6F)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", right: -20, top: -20, fontSize: "8rem", opacity: 0.07 }}>👩‍🏫</div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#52D68A", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
                Für Fachkräfte — Kostenlos
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "white", fontWeight: 700, marginBottom: 14, lineHeight: 1.3 }}>
                Du bist Lehrerin<br/>oder Erzieherin?
              </h3>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: 28 }}>
                Erstelle dein kostenloses Profil, lade deine Zeugnisse hoch und werde von Schulen und Kitas in ganz Deutschland gefunden.
              </p>
              <ul style={{ listStyle: "none", marginBottom: 32 }}>
                {["✅ Kostenlos & immer kostenlos", "✅ Profil in 10 Minuten erstellt", "✅ Direkte Anfragen von Arbeitgebern"].map((item) => (
                  <li key={item} style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.88rem", marginBottom: 8 }}>{item}</li>
                ))}
              </ul>
              <button className="btn-green" style={{ padding: "14px 32px", fontSize: "0.95rem" }}>
                Jetzt kostenlos registrieren →
              </button>
            </div>
          </div>

          {/* Employer CTA */}
          <div style={{
            flex: 1, borderRadius: 24, padding: "48px 40px",
            background: "linear-gradient(135deg, #0D3B2E, #1E8449)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", right: -20, top: -20, fontSize: "8rem", opacity: 0.07 }}>🏫</div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#AED6F1", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
                Für Schulen & Kitas — Ab 99 €/Monat
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "white", fontWeight: 700, marginBottom: 14, lineHeight: 1.3 }}>
                Du suchst qualifiziertes<br/>Personal?
              </h3>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: 28 }}>
                Erhalte unbegrenzten Zugang zu verifizierten Fachkräften aus Deutschland und 38 Ländern weltweit — für eine fixe Monatsgebühr.
              </p>
              <ul style={{ listStyle: "none", marginBottom: 32 }}>
                {["✅ Zugang zu 2.400+ Profilen", "✅ Keine Provision pro Vermittlung", "✅ 30 Tage kostenlos testen"].map((item) => (
                  <li key={item} style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.88rem", marginBottom: 8 }}>{item}</li>
                ))}
              </ul>
              <button className="btn-primary" style={{ padding: "14px 32px", fontSize: "0.95rem" }}>
                30 Tage gratis testen →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TRUST BAR ══════════════ */}
      <section style={{ background: "#F0F4F9", padding: "48px 40px", textAlign: "center" }}>
        <div style={{ fontSize: "0.82rem", color: "#6B7897", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 28 }}>
          Vertrauen von Einrichtungen deutschlandweit
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", alignItems: "center" }}>
          {["🏫 Grundschule Mitte Berlin", "🧒 Kita Sonnenschein NRW", "📚 Gesamtschule München", "🏛️ Schulamt Hamburg", "🌱 KiTa Regenbogen Frankfurt"].map((s) => (
            <div key={s} style={{ color: "#9BA8C0", fontSize: "0.9rem", fontWeight: 500 }}>{s}</div>
          ))}
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ background: "#0D2137", color: "rgba(255,255,255,0.5)", padding: "56px 40px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="mobile-col" style={{ display: "flex", justifyContent: "space-between", gap: 40, marginBottom: 48 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "white", marginBottom: 12 }}>
                Kita<span style={{ color: "#27AE60" }}>Bridge</span>
              </div>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.7, marginBottom: 16 }}>
                Die digitale Fachkräfteplattform für Lehrkräfte & Erzieher*innen in Deutschland.
              </p>
              <div style={{ color: "#52D68A", fontSize: "0.82rem", fontWeight: 600 }}>
                Bildung. Betreuung. Brücken bauen.
              </div>
            </div>
            {[
              { title: "Fachkräfte", links: ["Profil erstellen", "Jobs finden", "Anerkennungshilfe", "Premium Badge"] },
              { title: "Arbeitgeber", links: ["Mitgliedschaft", "Profile suchen", "Stelle ausschreiben", "Preise"] },
              { title: "Unternehmen", links: ["Über uns", "Kontakt", "Presse", "Datenschutz", "Impressum"] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", marginBottom: 16 }}>{col.title}</div>
                {col.links.map((l) => (
                  <div key={l} style={{ fontSize: "0.85rem", marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "white"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                  >{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: "0.8rem" }}>
            <span>© 2026 KitaBridge GmbH — Alle Rechte vorbehalten</span>
            <span>info@kitabridge.de</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default dynamic(() => Promise.resolve(HomePage), { ssr: false });