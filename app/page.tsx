"use client";
import { useState, useEffect } from "react";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

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
        .btn-primary { display: inline-block; padding: 14px 32px; border-radius: 50px; background: linear-gradient(135deg, ${NAVY}, ${BLUE}); color: white; font-weight: 700; font-size: 0.95rem; text-decoration: none; transition: all 0.3s; box-shadow: 0 6px 24px rgba(26,63,111,0.28); font-family: 'DM Sans', sans-serif; border: none; cursor: pointer; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(26,63,111,0.36); }
        .btn-secondary { display: inline-block; padding: 13px 32px; border-radius: 50px; background: transparent; color: ${NAVY}; font-weight: 700; font-size: 0.95rem; text-decoration: none; transition: all 0.3s; border: 2px solid ${NAVY}; font-family: 'DM Sans', sans-serif; cursor: pointer; }
        .btn-secondary:hover { background: ${NAVY}; color: white; }
        .btn-green { display: inline-block; padding: 14px 32px; border-radius: 50px; background: linear-gradient(135deg, ${GREEN}, #27AE60); color: white; font-weight: 700; font-size: 0.95rem; text-decoration: none; transition: all 0.3s; box-shadow: 0 6px 24px rgba(30,132,73,0.28); font-family: 'DM Sans', sans-serif; border: none; cursor: pointer; }
        .btn-green:hover { transform: translateY(-2px); }
        .card { background: white; border-radius: 20px; padding: 32px; border: 1px solid #E8EDF4; transition: all 0.3s; box-shadow: 0 4px 20px rgba(26,63,111,0.06); }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(26,63,111,0.14); }
        @media (max-width: 768px) {
          .hero-title { font-size: 2.2rem !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .cards-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #E8EDF4" : "none",
        transition: "all 0.3s", padding: "0 40px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          <a href="#fuer-kitas" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Fuer Kitas</a>
          <a href="#fuer-fachkraefte" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Fuer Fachkraefte</a>
          <a href="#preise" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Preise</a>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/login" className="btn-secondary" style={{ padding: "9px 22px", fontSize: "0.88rem" }}>Anmelden</a>
          <a href="/Arbeitgeber" className="btn-primary" style={{ padding: "9px 22px", fontSize: "0.88rem" }}>Jetzt starten</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", background: `linear-gradient(160deg, #F0F4F9 0%, #E8F4FD 50%, #EAF7EF 100%)`, display: "flex", alignItems: "center", padding: "100px 40px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(36,113,163,0.08) 0%, transparent 70%)` }}/>
        <div style={{ position: "absolute", bottom: -50, left: -50, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, rgba(30,132,73,0.06) 0%, transparent 70%)` }}/>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(30,132,73,0.1)", borderRadius: 50, padding: "6px 16px", marginBottom: 24 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }}/>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1 }}>Die Plattform fuer Kita-Fachkraefte</span>
              </div>
              <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.4rem", fontWeight: 900, color: NAVY, lineHeight: 1.15, marginBottom: 24 }}>
                Qualifizierte Erzieherinnen.<br/>
                <span style={{ color: GREEN }}>Direkt. Ohne Provision.</span>
              </h1>
              <p style={{ fontSize: "1.1rem", color: "#6B7897", lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
                KitaBridge verbindet internationale Erziehungsfachkraefte mit Kitas und Krippen in Deutschland. Schnell, transparent und ohne versteckte Kosten.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a href="/Arbeitgeber" className="btn-primary">Fachkraefte finden</a>
                <a href="/Registrieren" className="btn-green">Als Fachkraft bewerben</a>
              </div>
              <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
                {[["500+","Fachkraefte"],["200+","Kitas"],["0","Provision"]].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: NAVY }}>{n}</div>
                    <div style={{ fontSize: "0.8rem", color: "#9BA8C0", fontWeight: 500 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hide-mobile" style={{ position: "relative" }}>
              <div style={{ background: "white", borderRadius: 24, padding: 32, boxShadow: "0 20px 60px rgba(26,63,111,0.15)", border: "1px solid #E8EDF4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${GREEN}, #27AE60)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem" }}>👩‍🍼</div>
                  <div>
                    <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.95rem" }}>Amara Diallo</div>
                    <div style={{ fontSize: "0.78rem", color: "#9BA8C0" }}>Erzieherin - Fruehkindliche Bildung</div>
                  </div>
                  <div style={{ marginLeft: "auto", background: "#EAF7EF", borderRadius: 50, padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700, color: GREEN }}>Verfuegbar</div>
                </div>
                {[["Sprachen","Deutsch B2, Franzoesisch"],["Erfahrung","4 Jahre Kita"],["Einsatz","Ab sofort"],["Ort","Hamburg"]].map(([k,v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0F4F9", fontSize: "0.83rem" }}>
                    <span style={{ color: "#9BA8C0", fontWeight: 600 }}>{k}</span>
                    <span style={{ color: NAVY, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
                <button className="btn-primary" style={{ width: "100%", marginTop: 20, textAlign: "center" }}>Profil ansehen</button>
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
      <section id="wie-es-funktioniert" style={{ padding: "100px 40px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Einfach und schnell</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 800, color: NAVY, marginBottom: 16 }}>Wie KitaBridge funktioniert</h2>
            <p style={{ color: "#6B7897", fontSize: "1rem", maxWidth: 500, margin: "0 auto" }}>In drei Schritten zur passenden Erzieherin</p>
          </div>
          <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { num: "01", title: "Profil erstellen", desc: "Fachkraefte registrieren sich kostenlos und erstellen ein detailliertes Profil mit Qualifikationen und Kita-Erfahrung.", icon: "📝" },
              { num: "02", title: "Gefunden werden", desc: "Kitas und Krippen suchen nach passenden Kandidatinnen und kontaktieren sie direkt ohne Vermittler.", icon: "🔍" },
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
      <section id="fuer-kitas" style={{ padding: "100px 40px", background: "#F8FAFF" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Fuer Kitas und Krippen</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 800, color: NAVY, marginBottom: 20 }}>Ein Plan. Volle Kontrolle. Keine Provision.</h2>
              <p style={{ color: "#6B7897", lineHeight: 1.8, marginBottom: 28 }}>Erhalten Sie direkten Zugang zu qualifizierten internationalen Erziehungsfachkraeften. Suchen, filtern und kontaktieren Sie Kandidatinnen ohne Einschraenkungen.</p>
              <div style={{ marginBottom: 32 }}>
                {[
                  "Alle Fachkraefte-Profile einsehen",
                  "Direkter Kontakt ohne Vermittler",
                  "Unbegrenzte Suche und Filter nach Qualifikation",
                  "Monatlich kuendbar - keine Bindung",
                  "Keine Provision bei Einstellung",
                  "Profil Ihrer Kita fuer Bewerber sichtbar"
                ].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#EAF7EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: GREEN, fontSize: "0.75rem", fontWeight: 700 }}>+</span>
                    </div>
                    <span style={{ color: "#444", fontSize: "0.9rem" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="/Arbeitgeber" className="btn-primary">Jetzt registrieren - 299 EUR/Monat</a>
            </div>
            <div>
              <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 24, padding: 36, color: "white", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}/>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Hauptplan</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 700, marginBottom: 4 }}>299 EUR</div>
                <div style={{ opacity: 0.7, fontSize: "0.85rem", marginBottom: 28 }}>pro Monat, zzgl. MwSt.</div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 20 }}>
                  {[
                    "Alle Fachkraefte-Profile",
                    "Direktkontakt",
                    "Unbegrenzte Suche",
                    "Keine Provision",
                    "Monatlich kuendbar",
                    "Kita-Profil sichtbar fuer Bewerber"
                  ].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: "0.88rem" }}>
                      <span style={{ color: "#27AE60" }}>+</span> {f}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 16px", fontSize: "0.8rem", opacity: 0.9 }}>
                  Keine Einrichtungsgebuehr - Keine Mindestlaufzeit
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUER FACHKRAEFTE */}
      <section id="fuer-fachkraefte" style={{ padding: "100px 40px", background: "white" }}>
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
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Fuer internationale Fachkraefte</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 800, color: NAVY, marginBottom: 20 }}>Dein Weg in die Kita beginnt hier</h2>
              <p style={{ color: "#6B7897", lineHeight: 1.8, marginBottom: 28 }}>
                Ob Erzieherin, Kinderpflegerin oder Sozialpaedagogin — erstelle kostenlos dein Profil und werde von Kitas in ganz Deutschland gefunden. Transparent, sicher und ohne versteckte Kosten.
              </p>
              <div style={{ background: "#EAF7EF", borderRadius: 16, padding: 20, marginBottom: 28 }}>
                <div style={{ fontWeight: 700, color: GREEN, marginBottom: 8, fontSize: "0.9rem" }}>Kostenlos fuer Fachkraefte</div>
                <div style={{ color: "#444", fontSize: "0.88rem", lineHeight: 1.7 }}>Die Registrierung und alle Funktionen sind fuer Erzieherinnen und Kinderpflegerinnen komplett kostenlos. Immer.</div>
              </div>
              <div style={{ marginBottom: 28 }}>
                {[
                  "Erzieherin / Erzieher",
                  "Kinderpflegerin / Kinderpfleger",
                  "Sozialpaedagogin / Sozialpaedagoge",
                  "Heilpaedagogin / Heilpaedagoge",
                  "Kita-Leitung"
                ].map(f => (
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
      <section style={{ padding: "100px 40px", background: "#F8FAFF" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Warum KitaBridge</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 800, color: NAVY }}>Keine Vermittler. Kein Umweg.</h2>
          </div>
          <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "💰", title: "Keine Provision", desc: "Klassische Vermittler verlangen bis zu 3 Monatsgehaelter. Bei KitaBridge zahlen Sie nur eine faire Monatsgebuehr." },
              { icon: "⚡", title: "Schnell und direkt", desc: "Kontaktieren Sie Fachkraefte sofort. Keine Wartezeiten durch Zwischenhaendler." },
              { icon: "🌍", title: "Internationale Talente", desc: "Zugang zu qualifizierten Fachkraeften aus der ganzen Welt mit deutschen Sprachkenntnissen." },
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

      {/* CTA */}
      <section style={{ padding: "100px 40px", background: `linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%)` }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6rem", fontWeight: 800, color: "white", marginBottom: 20 }}>Bereit loszulegen?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: 40 }}>Ob Kita oder Fachkraft - bei KitaBridge finden Sie sich. Schnell, direkt und ohne Provision.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/Arbeitgeber" style={{ padding: "14px 32px", borderRadius: 50, background: "white", color: NAVY, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>Fachkraefte finden</a>
            <a href="/Registrieren" style={{ padding: "14px 32px", borderRadius: 50, background: "rgba(255,255,255,0.15)", color: "white", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", border: "2px solid rgba(255,255,255,0.4)" }}>Als Fachkraft bewerben</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0D1B2A", color: "rgba(255,255,255,0.6)", padding: "40px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: 12 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </div>
        <p style={{ fontSize: "0.82rem" }}>Die Plattform fuer internationale Kita-Fachkraefte in Deutschland.</p>
        <p style={{ fontSize: "0.78rem", marginTop: 16, opacity: 0.5 }}>2025 KitaBridge - DSGVO-konform</p>
      </footer>
    </div>
  );
}