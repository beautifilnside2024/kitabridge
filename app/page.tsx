"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const translations = {
  de: {
    nav: {
      howItWorks: "Wie es funktioniert",
      forKitas: "Für Arbeitgeber",
      forPros: "Für Fachkräfte",
      faq: "FAQ",
      login: "Anmelden",
      start: "Jetzt starten",
      startMobile: "Starten",
    },
    hero: {
      badge: "Die Plattform für Kitas, soziale Einrichtungen & pädagogische Fachkräfte",
      title1: "Die Brücke zwischen",
      title2: "Fachkräften und Kitas.",
      desc: "KitaBridge verbindet Erzieher/innen und pädagogische Fachkräfte mit Kitas und sozialen Einrichtungen in ganz Deutschland. Schnell, transparent und ohne versteckte Kosten.",
      tagline: "Kein Lebenslauf. Kein Anschreiben. Einfach Profil erstellen – Die Einrichtung meldet sich bei dir! 🎯",
      btnFind: "Fachkräfte finden",
      btnApply: "Als Fachkraft bewerben",
      badges: ["DSGVO-konform", "100% transparent", "Sofort starten"],
      profileLabel: "Beispiel-Profil",
      available: "Verfügbar",
      profileFields: [["Sprachen","Deutsch B2, Französisch"],["Erfahrung","4 Jahre Kita"],["Einsatz","Ab sofort"],["Ort","Hamburg"]],
      profileBtn: "Jetzt registrieren um Profile zu sehen →",
      newRequest: "Neue Anfrage",
    },
    how: {
      tag: "Einfach und schnell",
      title: "Wie KitaBridge funktioniert",
      sub: "In drei Schritten zur passenden Fachkraft",
      steps: [
        { num: "01", title: "Profil erstellen", desc: "Fachkräfte registrieren sich kostenlos und erstellen ein detailliertes Profil mit Qualifikationen und Erfahrung.", icon: "📝" },
        { num: "02", title: "Gefunden werden", desc: "Kitas und alle andere sozialen Einrichtungen suchen nach passenden Fachkräften und kontaktieren sie direkt ohne Vermittler.", icon: "🔍" },
        { num: "03", title: "Direkt einstellen", desc: "Kein Vermittler, keine Provision. Sie kommunizieren direkt und stellen die beste Fachkraft ein.", icon: "🤝" },
      ],
    },
    kitas: {
      tag: "Für Kitas und Krippen",
      title: "Ein Plan. Volle Kontrolle. Keine Provision.",
      desc: "Erhalten Sie direkten Zugang zu qualifizierten Fachkräften. Suchen, filtern und kontaktieren Sie passende Fachkräfte ohne Einschränkungen.",
      features: ["Alle Fachkräfte-Profile einsehen","Direkter Kontakt ohne Vermittler","Unbegrenzte Suche und Filter","Monatlich kündbar","Keine Provision bei Einstellung","Nachrichten verschicken auf der Platform"],
      btn: "Jetzt registrieren – 299 EUR/Monat",
      planLabel: "Hauptplan für alle Einrichtungen",
      perMonth: "pro Monat, zzgl. MwSt.",
      planFeatures: ["Alle Fachkräfte-Profile","Direktkontakt","Unbegrenzte Suche","Keine Provision","Monatlich kündbar","Nachrichten verschicken auf der Platform"],
      noFee: "Keine Einrichtungsgebühr – Keine Mindestlaufzeit",
    },
    pros: {
      tag: "Für internationale Fachkräfte",
      title: "Dein Weg in die Kita beginnt hier",
      desc: "Ob Erzieher, Kinderpfleger oder Sozialpädagoge – erstelle kostenlos dein Profil und werde von Kitas in ganz Deutschland gefunden.",
      freeLabel: "Kostenlos für Fachkräfte",
      freeDesc: "Die Registrierung und alle Funktionen sind für pädagogische Fachkräfte komplett kostenlos. Immer.",
      roles: ["Erzieherin / Erzieher","Kinderpflegerin / Kinderpfleger","Sozialpädagogin / Sozialpädagoge","Heilpädagogin / Heilpädagoge","Kindheitspädagogin / Kindheitspädagoge","Ergotherapeutin / Ergotherapeut","Logopädin / Logopäde","Sozialarbeiterin / Sozialarbeiter","Psychologin / Psychologe","Grundschullehrerin / Grundschullehrer","Sonderpädagogin / Sonderpädagoge","Schulbegleiterin / Schulbegleiter","Motopädagogin / Motopädagoge","Musiktherapeutin / Musiktherapeut","Betreuerin / Betreuer","Familienhelferin / Familienhelfer","Stellvertretende Kita-Leitung","Kinderkrankenpflegerin / Kinderkrankenpfleger","Physiotherapeutin / Physiotherapeut","Kita-Leitung"],
      btn: "Jetzt kostenlos registrieren",
      cards: [
        { icon: "📝", title: "Kostenlos registrieren", desc: "Erstelle dein Profil in 10 Minuten" },
        { icon: "🔍", title: "Gefunden werden", desc: "Kitas kontaktieren dich direkt" },
        { icon: "🇩🇪", title: "In Deutschland arbeiten", desc: "Finde deinen Traumjob in der Kita" },
        { icon: "💬", title: "Direkter Kontakt", desc: "Kein Vermittler dazwischen" },
      ],
    },
    why: {
      tag: "Warum KitaBridge",
      title: "Keine Vermittler. Kein Umweg.",
      cards: [
        { icon: "💰", title: "Keine Provision", desc: "Klassische Vermittler verlangen bis zu 3 Monatsgehälter. Bei KitaBridge zahlen Sie nur eine faire Monatsgebühr." },
        { icon: "⚡", title: "Schnell und direkt", desc: "Kontaktieren Sie Fachkräfte sofort. Keine Wartezeiten durch Zwischenhändler." },
        { icon: "🌍", title: "Internationale Talente", desc: "Zugang zu qualifizierten Fachkräften aus der ganzen Welt mit deutschen Sprachkenntnissen." },
      ],
    },
    faq: {
      tag: "Häufige Fragen",
      title: "Alles was Sie wissen müssen",
      moreQ: "Noch eine Frage?",
      contact: "Kontakt aufnehmen",
      items: [
        { q: "Was kostet KitaBridge für Arbeitgeber?", a: "Der Hauptplan kostet 299 EUR pro Monat zzgl. MwSt. Es gibt keine Einrichtungsgebühr, keine Provision und keine Mindestlaufzeit. Sie können monatlich kündigen." },
        { q: "Ist die Registrierung für Fachkräfte wirklich kostenlos?", a: "Ja, vollständig kostenlos. Fachkräfte erstellen ihr Profil kostenlos und werden von Kitas direkt kontaktiert. Es fallen keine Gebühren an." },
        { q: "Wie kann ich als Arbeitgeber kündigen?", a: "Sie können Ihr Abonnement jederzeit zum Ende des laufenden Monats kündigen. Kein Papierkram, keine Fristen. Einfach in Ihrem Account unter Einstellungen." },
        { q: "Welche Qualifikationen haben die Fachkräfte?", a: "Alle Fachkräfte auf KitaBridge sind ausgebildete Erzieherinnen und Erzieher, Kinderpfleger, Sozialpädagogen oder Heilpädagogen mit nachgewiesenen Deutschkenntnissen." },
        { q: "Wie schnell finde ich eine passende Fachkraft?", a: "Nach Ihrer Registrierung haben Sie sofort Zugang zu allen Profilen. Viele Kitas finden innerhalb weniger Tage passende Kandidaten." },
        { q: "Zahle ich Provision wenn ich jemanden einstelle?", a: "Nein. Bei KitaBridge zahlen Sie ausschließlich die monatliche Plattformgebühr. Keine Provision, egal wie viele Fachkräfte Sie einstellen." },
      ],
    },
    cta: {
      title: "Bereit loszulegen?",
      desc: "Ob Kita oder Fachkraft – bei KitaBridge finden Sie sich. Schnell, direkt und ohne Provision.",
      btnFind: "Fachkräfte finden",
      btnApply: "Als Fachkraft bewerben",
    },
    footer: {
      desc: "Die Plattform für pädagogische Fachkräfte in Deutschland.",
      links: [["Kontakt","/kontakt"],["Impressum","/impressum"],["Datenschutz","/datenschutz"],["AGB","/agb"]],
    },
  },
  en: {
    nav: {
      howItWorks: "How it works",
      forKitas: "For Daycare Centers",
      forPros: "For Professionals",
      faq: "FAQ",
      login: "Log in",
      start: "Get started",
      startMobile: "Start",
    },
    hero: {
      badge: "The platform for Daycare Centers & Childcare Professionals",
      title1: "The bridge between",
      title2: "professionals and daycares.",
      desc: "KitaBridge connects international childcare professionals with daycare centers and social institutions in Germany. Fast, transparent and without hidden costs.",
      tagline: "No CV. No cover letter. Just create your profile – The employer will contact you! 🎯",
      btnFind: "Find professionals",
      btnApply: "Apply as a professional",
      badges: ["GDPR-compliant", "100% transparent", "Start immediately"],
      profileLabel: "Example Profile",
      available: "Available",
      profileFields: [["Languages","German B2, French"],["Experience","4 years Daycare"],["Available","Immediately"],["Location","Hamburg"]],
      profileBtn: "Register now to view profiles →",
      newRequest: "New Request",
    },
    how: {
      tag: "Simple and fast",
      title: "How KitaBridge works",
      sub: "Three steps to find the right professional",
      steps: [
        { num: "01", title: "Create a profile", desc: "Professionals register for free and create a detailed profile with qualifications and daycare experience.", icon: "📝" },
        { num: "02", title: "Get discovered", desc: "Daycare centers search for suitable professionals and contact them directly without intermediaries.", icon: "🔍" },
        { num: "03", title: "Hire directly", desc: "No middleman, no commission. You communicate directly and hire the best professional.", icon: "🤝" },
      ],
    },
    kitas: {
      tag: "For Daycare Centers",
      title: "One plan. Full control. No commission.",
      desc: "Get direct access to qualified international professionals. Search, filter and contact suitable candidates without restrictions.",
      features: ["View all professional profiles","Direct contact without intermediaries","Unlimited search and filters","Cancel monthly","No commission on hiring","Send messages on the platform"],
      btn: "Register now – €299/month",
      planLabel: "Main Plan",
      perMonth: "per month, excl. VAT",
      planFeatures: ["All professional profiles","Direct contact","Unlimited search","No commission","Cancel monthly","Send messages on the platform"],
      noFee: "No setup fee – No minimum contract",
    },
    pros: {
      tag: "For international professionals",
      title: "Your path to a daycare starts here",
      desc: "Whether educator, childcare worker or social pedagogue – create your free profile and be found by daycare centers across Germany.",
      freeLabel: "Free for professionals",
      freeDesc: "Registration and all features are completely free for childcare professionals. Always.",
      roles: ["Educator (Erzieherin / Erzieher)","Childcare worker (Kinderpfleger)","Social pedagogue (Sozialpädagoge)","Special needs educator (Heilpädagoge)","Daycare manager (Kita-Leitung)"],
      btn: "Register for free now",
      cards: [
        { icon: "📝", title: "Register for free", desc: "Create your profile in 10 minutes" },
        { icon: "🔍", title: "Get discovered", desc: "Daycares contact you directly" },
        { icon: "🇩🇪", title: "Work in Germany", desc: "Find your dream job in childcare" },
        { icon: "💬", title: "Direct contact", desc: "No middleman involved" },
      ],
    },
    why: {
      tag: "Why KitaBridge",
      title: "No middlemen. No detours.",
      cards: [
        { icon: "💰", title: "No commission", desc: "Traditional agencies charge up to 3 monthly salaries. At KitaBridge you only pay a fair monthly fee." },
        { icon: "⚡", title: "Fast and direct", desc: "Contact professionals immediately. No waiting times through intermediaries." },
        { icon: "🌍", title: "International talent", desc: "Access to qualified professionals from around the world with German language skills." },
      ],
    },
    faq: {
      tag: "Frequently Asked Questions",
      title: "Everything you need to know",
      moreQ: "Still have a question?",
      contact: "Contact us",
      items: [
        { q: "How much does KitaBridge cost for employers?", a: "The main plan costs €299 per month plus VAT. There is no setup fee, no commission and no minimum contract. You can cancel monthly." },
        { q: "Is registration really free for professionals?", a: "Yes, completely free. Professionals create their profile for free and are contacted directly by daycare centers. No fees apply." },
        { q: "How can I cancel as an employer?", a: "You can cancel your subscription at any time at the end of the current month. No paperwork, no deadlines. Simply go to Settings in your account." },
        { q: "What qualifications do the professionals have?", a: "All professionals on KitaBridge are trained educators, childcare workers, social pedagogues or special needs educators with verified German language skills." },
        { q: "How quickly can I find a suitable professional?", a: "After registration you have immediate access to all profiles. Many daycares find suitable candidates within a few days." },
        { q: "Do I pay commission when I hire someone?", a: "No. At KitaBridge you only pay the monthly platform fee. No commission, no matter how many professionals you hire." },
      ],
    },
    cta: {
      title: "Ready to get started?",
      desc: "Whether daycare or professional – find each other on KitaBridge. Fast, direct and without commission.",
      btnFind: "Find professionals",
      btnApply: "Apply as a professional",
    },
    footer: {
      desc: "The platform for international childcare professionals in Germany.",
      links: [["Contact","/kontakt"],["Imprint","/impressum"],["Privacy","/datenschutz"],["Terms","/agb"]],
    },
  },
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState("de");
  const router = useRouter();
  const t = translations[lang];

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
        .lang-btn { background: none; border: 1.5px solid #E8EDF4; border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 0.8rem; font-weight: 700; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; transition: all 0.2s; color: #444; }
        .lang-btn:hover { border-color: #1A3F6F; }
        .lang-btn.active { border-color: #1A3F6F; background: #EEF2FF; color: #1A3F6F; }
        .flag-img { width: 20px; height: 14px; border-radius: 2px; display: inline-block; object-fit: cover; }
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
      <nav style={{ position: "sticky", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.96)" : "white", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: "1px solid #E8EDF4", transition: "all 0.3s", height: 68, display: "flex", alignItems: "center" }}>
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
            <a href="#wie-es-funktioniert" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>{t.nav.howItWorks}</a>
            <a href="#fuer-kitas" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>{t.nav.forKitas}</a>
            <a href="#fuer-fachkraefte" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>{t.nav.forPros}</a>
            <a href="#faq" style={{ color: "#6B7897", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>{t.nav.faq}</a>
          </div>
          <div className="nav-btns" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
              <button className={`lang-btn${lang === "de" ? " active" : ""}`} onClick={() => setLang("de")}><img className="flag-img" src="https://flagcdn.com/w20/de.png" alt="DE" />DE</button>
              <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}><img className="flag-img" src="https://flagcdn.com/w20/gb.png" alt="EN" />EN</button>
            </div>
            <a href="/login" className="btn-secondary" style={{ padding: "9px 22px", fontSize: "0.88rem" }}>{t.nav.login}</a>
            <a href="/Arbeitgeber" className="btn-primary" style={{ padding: "9px 22px", fontSize: "0.88rem" }}>{t.nav.start}</a>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 4 }}>
            <div style={{ width: 24, height: 2, background: NAVY, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}/>
            <div style={{ width: 24, height: 2, background: NAVY, borderRadius: 2, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }}/>
            <div style={{ width: 24, height: 2, background: NAVY, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }}/>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <div style={{ display: "flex", gap: 8, paddingBottom: 12, borderBottom: "1px solid #E8EDF4" }}>
          <button className={`lang-btn${lang === "de" ? " active" : ""}`} onClick={() => setLang("de")}><img className="flag-img" src="https://flagcdn.com/w20/de.png" alt="DE" />DE</button>
          <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}><img className="flag-img" src="https://flagcdn.com/w20/gb.png" alt="EN" />EN</button>
        </div>
        <a href="#wie-es-funktioniert" onClick={() => setMenuOpen(false)} style={{ color: NAVY, textDecoration: "none", fontWeight: 600, padding: "8px 0" }}>{t.nav.howItWorks}</a>
        <a href="#fuer-kitas" onClick={() => setMenuOpen(false)} style={{ color: NAVY, textDecoration: "none", fontWeight: 600, padding: "8px 0" }}>{t.nav.forKitas}</a>
        <a href="#fuer-fachkraefte" onClick={() => setMenuOpen(false)} style={{ color: NAVY, textDecoration: "none", fontWeight: 600, padding: "8px 0" }}>{t.nav.forPros}</a>
        <a href="#faq" onClick={() => setMenuOpen(false)} style={{ color: NAVY, textDecoration: "none", fontWeight: 600, padding: "8px 0" }}>{t.nav.faq}</a>
        <div style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: "1px solid #E8EDF4" }}>
          <a href="/login" className="btn-secondary" style={{ flex: 1, textAlign: "center", padding: "10px 16px", fontSize: "0.88rem" }}>{t.nav.login}</a>
          <a href="/Arbeitgeber" className="btn-primary" style={{ flex: 1, textAlign: "center", padding: "10px 16px", fontSize: "0.88rem" }}>{t.nav.startMobile}</a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero-section" style={{ minHeight: "100vh", background: "linear-gradient(160deg, #F0F4F9 0%, #E8F4FD 50%, #EAF7EF 100%)", display: "flex", alignItems: "center", padding: "100px 40px 60px", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(30,132,73,0.1)", borderRadius: 50, padding: "6px 16px", marginBottom: 24 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, flexShrink: 0 }}/>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1 }}>{t.hero.badge}</span>
              </div>
              <h1 className="hero-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.4rem", fontWeight: 900, color: NAVY, lineHeight: 1.15, marginBottom: 24 }}>
                {t.hero.title1}<br/><span style={{ color: GREEN }}>{t.hero.title2}</span>
              </h1>
              <p style={{ fontSize: "1.05rem", color: "#6B7897", lineHeight: 1.75, marginBottom: 20, maxWidth: 480 }}>
                {t.hero.desc}
              </p>

              {/* ── BOLD TAGLINE ── */}
              <p style={{
                fontSize: "1.2rem",
                fontWeight: 900,
                color: GREEN,
                marginBottom: 32,
                lineHeight: 1.5,
                borderLeft: `4px solid ${GREEN}`,
                paddingLeft: 16,
                maxWidth: 480,
              }}>
                {t.hero.tagline}
              </p>

              <div className="hero-btns" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button onClick={() => router.push("/Arbeitgeber")} className="btn-primary">{t.hero.btnFind}</button>
                <button onClick={() => router.push("/Registrieren")} className="btn-green">{t.hero.btnApply}</button>
              </div>
              <div className="hero-badges" style={{ display: "flex", gap: 20, marginTop: 40, flexWrap: "wrap" }}>
                {[{ icon: "🔒", text: t.hero.badges[0] }, { icon: "💎", text: t.hero.badges[1] }, { icon: "🚀", text: t.hero.badges[2] }].map(b => (
                  <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "1rem" }}>{b.icon}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B7897" }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hide-mobile" style={{ position: "relative" }}>
              <div style={{ background: "white", borderRadius: 24, padding: 32, boxShadow: "0 20px 60px rgba(26,63,111,0.15)", border: "1px solid #E8EDF4" }}>
                <div style={{ background: "#EEF2FF", borderRadius: 10, padding: "6px 12px", fontSize: "0.72rem", fontWeight: 700, color: "#4F46E5", display: "inline-block", marginBottom: 16 }}>{t.hero.profileLabel}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #1E8449, #27AE60)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem" }}>👩‍🍼</div>
                  <div>
                    <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.95rem" }}>Amara D.</div>
                    <div style={{ fontSize: "0.78rem", color: "#9BA8C0" }}>Erzieherin - Frühkindliche Bildung</div>
                  </div>
                  <div style={{ marginLeft: "auto", background: "#EAF7EF", borderRadius: 50, padding: "4px 12px", fontSize: "0.75rem", fontWeight: 700, color: GREEN }}>{t.hero.available}</div>
                </div>
                {t.hero.profileFields.map(([k,v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F0F4F9", fontSize: "0.83rem" }}>
                    <span style={{ color: "#9BA8C0", fontWeight: 600 }}>{k}</span>
                    <span style={{ color: NAVY, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
                <button onClick={() => router.push("/Arbeitgeber")} className="btn-primary" style={{ width: "100%", marginTop: 20, textAlign: "center", display: "block" }}>{t.hero.profileBtn}</button>
              </div>
              <div style={{ position: "absolute", top: -20, right: -20, background: "white", borderRadius: 16, padding: "12px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", border: "1px solid #E8EDF4" }}>
                <div style={{ fontSize: "0.75rem", color: "#9BA8C0", marginBottom: 2 }}>{t.hero.newRequest}</div>
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
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>{t.how.tag}</div>
            <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 800, color: NAVY, marginBottom: 16 }}>{t.how.title}</h2>
            <p style={{ color: "#6B7897", fontSize: "1rem", maxWidth: 500, margin: "0 auto" }}>{t.how.sub}</p>
          </div>
          <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {t.how.steps.map(item => (
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
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>{t.kitas.tag}</div>
              <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 800, color: NAVY, marginBottom: 20 }}>{t.kitas.title}</h2>
              <p style={{ color: "#6B7897", lineHeight: 1.8, marginBottom: 28 }}>{t.kitas.desc}</p>
              <div style={{ marginBottom: 32 }}>
                {t.kitas.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#EAF7EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: GREEN, fontSize: "0.75rem", fontWeight: 700 }}>+</span>
                    </div>
                    <span style={{ color: "#444", fontSize: "0.9rem" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="/Arbeitgeber" className="btn-primary">{t.kitas.btn}</a>
            </div>
            <div>
              <div className="price-box" style={{ background: "linear-gradient(135deg, #1A3F6F, #2471A3)", borderRadius: 24, padding: 36, color: "white", position: "relative" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t.kitas.planLabel}</div>
                <div className="price-num" style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 700, marginBottom: 4 }}>299 EUR</div>
                <div style={{ opacity: 0.7, fontSize: "0.85rem", marginBottom: 28 }}>{t.kitas.perMonth}</div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 20 }}>
                  {t.kitas.planFeatures.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: "0.88rem" }}>
                      <span style={{ color: "#27AE60" }}>+</span> {f}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 16px", fontSize: "0.8rem", opacity: 0.9 }}>{t.kitas.noFee}</div>
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
                {t.pros.cards.map(item => (
                  <div key={item.title} className="card">
                    <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{item.icon}</div>
                    <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.9rem", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ color: "#9BA8C0", fontSize: "0.8rem" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>{t.pros.tag}</div>
              <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 800, color: NAVY, marginBottom: 20 }}>{t.pros.title}</h2>
              <p style={{ color: "#6B7897", lineHeight: 1.8, marginBottom: 28 }}>{t.pros.desc}</p>
              <div style={{ background: "#EAF7EF", borderRadius: 16, padding: 20, marginBottom: 28 }}>
                <div style={{ fontWeight: 700, color: GREEN, marginBottom: 8, fontSize: "0.9rem" }}>{t.pros.freeLabel}</div>
                <div style={{ color: "#444", fontSize: "0.88rem", lineHeight: 1.7 }}>{t.pros.freeDesc}</div>
              </div>
              <div style={{ marginBottom: 28 }}>
                {t.pros.roles.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: "0.88rem", color: "#444" }}>
                    <span style={{ color: GREEN, fontWeight: 700 }}>+</span> {f}
                  </div>
                ))}
              </div>
              <a href="/Registrieren" className="btn-green">{t.pros.btn}</a>
            </div>
          </div>
        </div>
      </section>

      {/* WARUM KITABRIDGE */}
      <section className="section-pad" style={{ padding: "100px 40px", background: "#F8FAFF" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>{t.why.tag}</div>
            <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 800, color: NAVY }}>{t.why.title}</h2>
          </div>
          <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {t.why.cards.map(item => (
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
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>{t.faq.tag}</div>
            <h2 className="section-heading" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", fontWeight: 800, color: NAVY }}>{t.faq.title}</h2>
          </div>
          <div>
            {t.faq.items.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span style={{ fontSize: "0.95rem", paddingRight: 16 }}>{faq.q}</span>
                  <span style={{ fontSize: "1.4rem", color: BLUE, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block", flexShrink: 0 }}>+</span>
                </button>
                {openFaq === i && <div style={{ paddingBottom: 20, color: "#6B7897", fontSize: "0.92rem", lineHeight: 1.8 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ color: "#9BA8C0", fontSize: "0.9rem", marginBottom: 16 }}>{t.faq.moreQ}</p>
            <a href="/kontakt" className="btn-secondary">{t.faq.contact}</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: "100px 40px", background: "linear-gradient(135deg, #1A3F6F 0%, #2471A3 100%)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 className="cta-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.6rem", fontWeight: 800, color: "white", marginBottom: 20 }}>{t.cta.title}</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: 40 }}>{t.cta.desc}</p>
          <div className="cta-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/Arbeitgeber" className="btn-primary">{t.cta.btnFind}</a>
            <a href="/Registrieren" className="btn-green">{t.cta.btnApply}</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-pad" style={{ background: "#0D1B2A", color: "rgba(255,255,255,0.6)", padding: "40px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: 12 }}>
          <span style={{ color: "white" }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </div>
        <p style={{ fontSize: "0.82rem", marginBottom: 20 }}>{t.footer.desc}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          <a href="https://www.instagram.com/kitabridge" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="white" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61586408009889" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: 10, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
        </div>
        <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
          {t.footer.links.map(([label, href]) => (
            <a key={label} href={href} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", margin: "0 8px", fontSize: "0.82rem" }}>{label}</a>
          ))}
        </div>
        <p style={{ fontSize: "0.78rem", opacity: 0.5 }}>© 2026 KitaBridge · DSGVO-konform</p>
      </footer>
    </div>
  );
}