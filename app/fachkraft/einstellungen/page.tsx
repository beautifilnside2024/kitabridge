"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const faqs = [
  { q: "Was kostet KitaBridge für Arbeitgeber?", a: "Der Hauptplan kostet 299 EUR pro Monat zzgl. MwSt. Es gibt keine Einrichtungsgebühr, keine Provision und keine Mindestlaufzeit. Sie können monatlich kündigen." },
  { q: "Ist die Registrierung für Fachkräfte wirklich kostenlos?", a: "Ja, vollständig kostenlos. Fachkräfte erstellen ihr Profil kostenlos und werden von Kitas direkt kontaktiert. Es fallen keine Gebühren an." },
  { q: "Wie kann ich als Arbeitgeber kündigen?", a: "Sie können Ihr Abonnement jederzeit zum Ende des laufenden Monats kündigen. Kein Papierkram, keine Fristen. Einfach in Ihrem Account unter Einstellungen." },
  { q: "Welche Qualifikationen haben die Fachkräfte?", a: "Alle Fachkräfte auf KitaBridge sind ausgebildete Erzieherinnen und Erzieher, Kinderpfleger, Sozialpädagogen oder Heilpädagogen mit nachgewiesenen Deutschkenntnissen." },
  { q: "Wie schnell finde ich eine passende Fachkraft?", a: "Nach Ihrer Registrierung haben Sie sofort Zugang zu allen Profilen. Viele Kitas finden innerhalb weniger Tage passende Kandidaten." },
  { q: "Zahle ich Provision wenn ich jemanden einstelle?", a: "Nein. Bei KitaBridge zahlen Sie ausschließlich die monatliche Plattformgebühr. Keine Provision, egal wie viele Fachkräfte Sie einstellen." },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "white", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .btn-primary { display: inline-block; padding: 14px 32px; border-radius: 50px; background: linear-gradient(135deg, #1A3F6F, #2471A3); color: white; font-weight: 700; font-size: 0.95rem; text-decoration: none; transition: all 0.3s; box-shadow: 0 6px 24px rgba(26,63,111,0.28); font-family: 'DM Sans', sans-serif; border: none; cursor: pointer; position: relative; z-index: 2; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(26,63,111,0.36); }
        .btn-secondary { display: inline-block; padding: 13px 32px; border-radius: 50px; background: transparent; color: #1A3F6F; font-weight: 700; font-size: 0.95rem; text-decoration: none; transition: all 0.3s; border: 2px solid #1A3F6F; font-family: 'DM Sans', sans-serif; cursor: pointer; }
        .btn-secondary:hover { background: #1A3F6F; color: white; }
        .btn-green { display: inline-block; padding: 14px 32px; border-radius: 50px; background: linear-gradient(135deg, #1E8449, #27AE60); color: white; font-weight: 700; font-size: 0.95rem; text-decoration: none; transition: all 0.3s; box-shadow: 0 6px 24px rgba(30,132,73,0.28); font-family: 'DM Sans', sans-serif; border: none; cursor: pointer; position: relative; z-index: 2; }
        .btn-green:hover { transform: translateY(-2px); }
        .card { background: white; border-radius: 20px; padding: 32px; border: 1px solid #E8EDF4; transition: all 0.3s; box-shadow: 0 4px 20px rgba(26,63,111,0.06); }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(26,63,111,0.14); }
        .faq-item { border-bottom: 1px solid #E8EDF4; }
        .faq-btn { width: 100%; text-align: left; background: none; border: none; padding: 20px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; color: #1A3F6F; }
        .faq-btn:hover { color: #2471A3; }
        .mobile-menu { display: none; position: fixed; top: 68px; left: 0; right: 0; background: white; border-bottom: 1px solid #E8EDF4; padding: 16px 24px; z-index: 99; flex-direction: column; gap: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .mobile-menu.open { display: flex; }
        @media (max-width: 768px) {
          .hero-title { font-size: 2rem !important; }
          .hero-section { padding: 90px 20px 50px !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .cards-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hide-mobile { display: none !important; }
          .nav-links { display: none !important; }
          .nav-btns { display: none !important; }
          .hamburger { display: flex !important; }
          .section-pad { padding: 60px 20px !important; }
          .cta-section { padding: 60px 20px !important; }
          .cta-title { font-size: 1.8rem !important; }
          .footer-pad { padding: 32px 20px !important; }
          .price-box { padding: 24px !important; }
          .price-num { font-size: 2.2rem !important; }
          .hero-badges { gap: 12px !important; }
          .hero-btns { flex-direction: column !important; }
          .hero-btns a, .hero-btns button { text-align: center !important; width: 100% !important; }
          .cta-btns { flex-direction: column !important; align-items: center !important; }
          .cta-btns a { text-align: center !important; width: 100% !important; max-width: 280px !important; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 1.7rem !important; }
          .section-heading { font-size: 1.7rem !important; }
          .card { padding: 20px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, left: 0, right: 0, zIndex: 10,
        background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #E8EDF4" : "none",
        transition: "all 0.3s", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1A3F6F, #2471A3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M4 21 Q14 6 24 21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="2" y1="21" x2="26" y2="21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="8" y1="21" x2="8" y2="16" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="21" x2="14" y2="10" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="20" y1="21" x2="20" y2="16" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="14" cy="7" r="3" fill="#27AE60"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700 }}>
              <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
            </span>
          </a>

          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="#wie-es-funktioniert" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Wie es funktioniert</a>
            <a href="#fuer-kitas" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Für Kitas</a>
            <a href="#fuer-fachkraefte" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Für Fachkräfte</a>
            <a href="#faq" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>FAQ</a>
          </div>

          <div className="nav-btns" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="/login" className="btn-secondary" style={{ padding: "9px 22px", fontSize: "0.88rem" }}>Anmelden</a>
            <a href="/Arbeitgeber" className="btn-primary" style={{ padding: "9px 22px", fontSize: "0.88rem" }}>Jetzt starten</a>
          </div>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 4 }}>
            <div style={{ width: 24, height: 2, background: NAVY, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}/>
            <div style={{ width: 24, height: 2, background: NAVY, borderRadius: 2, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }}/>
            <div style={{ width: 24, height: 2, background: NAVY, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }}/>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <a href="#wie-es-funktioniert" onClick={() => setMenuOpen(false)} style={{ color: NAVY, textDecoration: "none", fontWeight: 600, padding: "8px 0" }}>Wie es funktioniert</a>
        <a href="#fuer-kitas" onClick={() => setMenuOpen(false)} style={{ color: NAVY, textDecoration: "none", fontWeight: 600, padding: "8px 0" }}>Für Kitas</a>
        <a href="#fuer-fachkraefte" onClick={() => setMenuOpen(false)} style={{ color: NAVY, textDecoration: "none", fontWeight: 600, padding: "8px 0" }}>Für Fachkräfte</a>
        <a href="#faq" onClick={() => setMenuOpen(false)} style={{ color: NAVY, textDecoration: "none", fontWeight: 600, padding: "8px 0" }}>FAQ</a>
        <div style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: "1px solid #E8EDF4" }}>
          <a href="/login" className="btn-secondary" style={{ flex: 1, textAlign: "center", padding: "10px 16px", fontSize: "0.88rem" }}>Anmelden</a>
          <a href="/Arbeitgeber" className="btn-primary" style={{ flex: 1, textAlign: "center", padding: "10px 16px", fontSize: "0.88rem" }}>Starten</a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero-section" style={{ minHeight: "100vh", background: "linear-gradient(160deg, #F0F4F9 0%, #E8F4FD 50%, #EAF7EF 100%)", display: "flex", alignItems: "center", padding: "140px 40px 60px", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(30,132,73,0.1)", borderRadius: 50, padding: "6px 16px", marginBottom: 24 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, flexShrink: 0 }}/>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1 }}>Die Plattform für Kita-Fachkräfte</span>
              </div>
              <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.4rem", fontWeight: 900, color: NAVY, lineHeight: 1.15, marginBottom: 24 }}>
                Die Brücke zwischen<br/>
                <span style={{ color: GREEN }}>Fachkräften und Kitas.</span>
              </h1>
              <p style={{ fontSize: "1.05rem", color: "#6B7897", lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
                KitaBridge verbindet internationale Erziehungsfachkräfte mit Kitas und Krippen in Deutschland. Schnell, transparent und ohne versteckte Kosten.
              </p>
              <div className="hero-btns" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button onClick={() => router.push("/login")} className="btn-primary">Fachkräfte finden</button>
                <button onClick={() => router.push("/Registrieren")} className="btn-green">Als Fachkraft bewerben</button>
              </div>
              <div className="hero-badges" style={{ display: "flex", gap: 20, marginTop: 40, flexWrap: "wrap" }}>
                {[{ icon: "🔒", text: "DSGVO-konform" }, { icon: "💳", text: "Monatlich kündbar" }, { icon: "🚀", text: "Sofort starten" }].map(b => (
                  <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "1rem" }}>{b.icon}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B7897" }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hide-mobile" style={{ position: "relative" }}>
              <div style={{ background: "white", borderRadius: 24, padding: 32, boxShadow: "0 20px 60px rgba(26,63,111,0.15)", border: "1px solid #E8EDF4" }}>
                <div style={{ background: "#EEF2FF", borderRadius: 10, padding: "6px 12px", fontSize: "0.72rem", fontWeight: 700, color: "#4F46E5", display: "inline-block", marginBottom: 16 }}>Beispiel-Profil</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #1E8449, #27AE60)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem" }}>👩‍🍼</div>
                  <div>
                    <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.95rem" }}>Amara D.</div>
                    <div style={{ fontSize: "0.78rem", color: "#9BA8C0" }}>Erzieherin - Frühkindliche Bildung</div>
                  </div>
                  <div style={{ marginLeft: "auto", background: "#EAF7EF", borderRadius: 50, padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700, color: GREEN }}>Verfügbar</div>
                </div>
                {[["Sprachen","Deutsch B2, Französisch"],["Erfahrung","4 Jahre Kita"],["Einsatz","Ab sofort"],["Ort","Hamburg"]].map(([k,v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0F4F9", fontSize: "0.83rem" }}>
                    <span style={{ color: "#9BA8C0", fontWeight: 600 }}>{k}</span>
                    <span style={{ color: NAVY, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
                <button onClick={() => router.push("/Arbeitgeber")} className="btn-primary" style={{ width: "100%", marginTop: 20, textAlign: "center", display: "block" }}>
                  Jetzt registrieren um Profile zu sehen →
                </button>
              </div>
              <div style={{ position: "absolute", top: -20, right: -20, background: "white", borderRadius: 16, padding: "12px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: "1px solid #E8EDF4" }}>
                <div style={{ fontSize: "0.75rem", color: "#9BA8C0", marginBottom: 2 }}>Neue Anfrage</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: NAVY }}>Kita Sonnenschein Hamburg</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WIE ES FUNKTIONIERT */}
      <section id="wie-es-funktioniert" className="section-pad" style={{ padding: "100px 40px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Einfach und schnell</div>
            <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 800, color: NAVY, marginBottom: 16 }}>Wie KitaBridge funktioniert</h2>
            <p style={{ color: "#6B7897", fontSize: "1rem", maxWidth: 500, margin: "0 auto" }}>In drei Schritten zur passenden Fachkraft</p>
          </div>
          <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { num: "01", title: "Profil erstellen", desc: "Fachkräfte registrieren sich kostenlos und erstellen ein detailliertes Profil mit Qualifikationen und Kita-Erfahrung.", icon: "📝" },
              { num: "02", title: "Gefunden werden", desc: "Kitas und Krippen suchen nach passenden Fachkräften und kontaktieren sie direkt ohne Vermittler.", icon: "🔍" },
              { num: "03", title: "Direkt einstellen", desc: "Kein Vermittler, keine Provision. Sie kommunizieren direkt und stellen die beste Fachkraft ein.", icon: "🤝" },
            ].map(item => (
              <div key={item.num} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{item.icon}</div>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{item.num}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: NAVY, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: "#6B7897", fontSize: "0.88rem", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUER KITAS */}
      <section id="fuer-kitas" className="section-pad" style={{ padding: "100px 40px", background: "#F8FAFF" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Für Kitas und Krippen</div>
              <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 800, color: NAVY, marginBottom: 20 }}>Ein Plan. Volle Kontrolle. Keine Provision.</h2>
              <p style={{ color: "#6B7897", lineHeight: 1.8, marginBottom: 28 }}>Erhalten Sie direkten Zugang zu qualifizierten internationalen Fachkräften. Suchen, filtern und kontaktieren Sie passende Fachkräfte ohne Einschränkungen.</p>
              <div style={{ marginBottom: 32 }}>
                {["Alle Fachkräfte-Profile einsehen","Direkter Kontakt ohne Vermittler","Unbegrenzte Suche und Filter","Monatlich kündbar","Keine Provision bei Einstellung","Kita-Profil für Bewerber sichtbar"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#EAF7EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: GREEN, fontSize: "0.75rem", fontWeight: 700 }}>+</span>
                    </div>
                    <span style={{ color: "#444", fontSize: "0.9rem" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="/Arbeitgeber" className="btn-primary">Jetzt registrieren – 299 EUR/Monat</a>
            </div>
            <div>
              <div className="price-box" style={{ background: "linear-gradient(135deg, #1A3F6F, #2471A3)", borderRadius: 24, padding: 36, color: "white", position: "relative", overflow: "visible" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Hauptplan</div>
                <div className="price-num" style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 700, marginBottom: 4 }}>299 EUR</div>
                <div style={{ opacity: 0.7, fontSize: "0.85rem", marginBottom: 28 }}>pro Monat, zzgl. MwSt.</div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 20 }}>
                  {["Alle Fachkräfte-Profile","Direktkontakt","Unbegrenzte Suche","Keine Provision","Monatlich kündbar","Kita-Profil sichtbar"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: "0.88rem" }}>
                      <span style={{ color: "#27AE60" }}>+</span> {f}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 16px", fontSize: "0.8rem", opacity: 0.9 }}>
                  Keine Einrichtungsgebühr – Keine Mindestlaufzeit
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUER FACHKRAEFTE */}
      <section id="fuer-fachkraefte" className="section-pad" style={{ padding: "100px 40px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div className="hide-mobile">
              <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { icon: "📝", title: "Kostenlos registrieren", desc: "Erstelle dein Profil in 10 Minuten" },
                  { icon: "🔍", title: "Gefunden werden", desc: "Kitas kontaktieren dich direkt" },
                  { icon: "🇩🇪", title: "In Deutschland arbeiten", desc: "Finde deinen Traumjob in der Kita" },
                  { icon: "💬", title: "Direkter Kontakt", desc: "Kein Vermittler dazwischen" },
                ].map(item => (
                  <div key={item.title} className="card">
                    <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{item.icon}</div>
                    <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.9rem", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ color: "#9BA8C0", fontSize: "0.8rem" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Für internationale Fachkräfte</div>
              <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 800, color: NAVY, marginBottom: 20 }}>Dein Weg in die Kita beginnt hier</h2>
              <p style={{ color: "#6B7897", lineHeight: 1.8, marginBottom: 28 }}>
                Ob Erzieher, Kinderpfleger oder Sozialpädagoge – erstelle kostenlos dein Profil und werde von Kitas in ganz Deutschland gefunden.
              </p>
              <div style={{ background: "#EAF7EF", borderRadius: 16, padding: 20, marginBottom: 28 }}>
                <div style={{ fontWeight: 700, color: GREEN, marginBottom: 8, fontSize: "0.9rem" }}>Kostenlos für Fachkräfte</div>
                <div style={{ color: "#444", fontSize: "0.88rem", lineHeight: 1.7 }}>Die Registrierung und alle Funktionen sind für pädagogische Fachkräfte komplett kostenlos. Immer.</div>
              </div>
              <div style={{ marginBottom: 28 }}>
                {["Erzieherin / Erzieher","Kinderpflegerin / Kinderpfleger","Sozialpädagogin / Sozialpädagoge","Heilpädagogin / Heilpädagoge","Kita-Leitung"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: "0.88rem", color: "#444" }}>
                    <span style={{ color: GREEN, fontWeight: 700 }}>+</span> {f}
                  </div>
                ))}
              </div>
              <a href="/Registrieren" className="btn-green">Jetzt kostenlos registrieren</a>
            </div>
          </div>
        </div>
      </section>

      {/* WARUM KITABRIDGE */}
      <section className="section-pad" style={{ padding: "100px 40px", background: "#F8FAFF" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Warum KitaBridge</div>
            <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 800, color: NAVY }}>Keine Vermittler. Kein Umweg.</h2>
          </div>
          <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "💰", title: "Keine Provision", desc: "Klassische Vermittler verlangen bis zu 3 Monatsgehälter. Bei KitaBridge zahlen Sie nur eine faire Monatsgebühr." },
              { icon: "⚡", title: "Schnell und direkt", desc: "Kontaktieren Sie Fachkräfte sofort. Keine Wartezeiten durch Zwischenhändler." },
              { icon: "🌍", title: "Internationale Talente", desc: "Zugang zu qualifizierten Fachkräften aus der ganzen Welt mit deutschen Sprachkenntnissen." },
            ].map(item => (
              <div key={item.title} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: NAVY, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: "#6B7897", fontSize: "0.88rem", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-pad" style={{ padding: "100px 40px", background: "white" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Häufige Fragen</div>
            <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 800, color: NAVY }}>Alles was Sie wissen müssen</h2>
          </div>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span style={{ fontSize: "0.95rem", paddingRight: 16 }}>{faq.q}</span>
                  <span style={{ fontSize: "1.4rem", color: BLUE, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block", flexShrink: 0 }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ paddingBottom: 20, color: "#6B7897", fontSize: "0.92rem", lineHeight: 1.8 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ color: "#9BA8C0", fontSize: "0.9rem", marginBottom: 16 }}>Noch eine Frage?</p>
            <a href="mailto:kitabridge@protonmail.com" className="btn-secondary">Kontakt aufnehmen</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: "100px 40px", background: "linear-gradient(135deg, #1A3F6F 0%, #2471A3 100%)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 className="cta-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6rem", fontWeight: 800, color: "white", marginBottom: 20 }}>Bereit loszulegen?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: 40 }}>Ob Kita oder Fachkraft – bei KitaBridge finden Sie sich. Schnell, direkt und ohne Provision.</p>
          <div className="cta-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/login" className="btn-primary" style={{ background: "linear-gradient(135deg, #1A3F6F, #2471A3)" }}>Fachkräfte finden</a>
            <a href="/Registrieren" className="btn-green">Als Fachkraft bewerben</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-pad" style={{ background: "#0D1B2A", color: "rgba(255,255,255,0.6)", padding: "40px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: 12 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </div>
        <p style={{ fontSize: "0.82rem", marginBottom: 20 }}>Die Plattform für internationale Kita-Fachkräfte in Deutschland.</p>
        <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
          {[["Kontakt","/kontakt"],["Impressum","/impressum"],["Datenschutz","/datenschutz"],["AGB","/agb"]].map(([label, href]) => (
            <a key={label} href={href} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", margin: "0 8px", fontSize: "0.82rem" }}>{label}</a>
          ))}
        </div>
        <p style={{ fontSize: "0.78rem", opacity: 0.5 }}>© 2026 KitaBridge · DSGVO-konform</p>
      </footer>
    </div>
  );
}