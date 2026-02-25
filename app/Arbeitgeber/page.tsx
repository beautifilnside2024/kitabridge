"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const EINRICHTUNGSTYPEN = [
  "Grundschule", "Sekundarschule (Sek. I)", "Gymnasium", "Gesamtschule",
  "Förderschule", "Berufsschule", "Kindertagesstätte (Kita)",
  "Kinderkrippe (0–3 Jahre)", "Hort / Ganztagsbetreuung",
  "Freier Träger / Wohlfahrtsverband", "Schulamt / Jugendamt", "Andere",
];

const BUNDESLAENDER = [
  "Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen",
  "Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen",
  "Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen",
  "Sachsen-Anhalt","Schleswig-Holstein","Thüringen",
];

const TRAEGER = [
  "Öffentlich / Kommunal", "Kirchlich (Caritas / Diakonie)",
  "AWO", "DRK", "Paritätischer Wohlfahrtsverband",
  "Privat / Kommerziell", "Elterninitiative", "Andere",
];

const FACHRICHTUNGEN = [
  "Mathematik", "Deutsch", "Englisch", "Französisch", "Spanisch",
  "Physik", "Chemie", "Biologie", "Geschichte", "Geografie",
  "Sport", "Kunst", "Musik", "Informatik", "Sachkunde",
  "DaF / DaZ", "Frühkindliche Bildung", "Sonderpädagogik",
  "Soziale Arbeit", "Andere",
];

const STELLEN_ANZ = ["1", "2–3", "4–5", "6–10", "Mehr als 10"];

const POSITIONEN = [
  "Klassenlehrerin / -lehrer", "Fachlehrerin / -lehrer",
  "Vertretungslehrerin / -lehrer", "Erzieherin / Erzieher",
  "Gruppenleitung", "Kita-Leitung", "Schulbegleitung", "Andere",
];

const steps = [
  { num: 1, label: "Einrichtung", icon: "🏫" },
  { num: 2, label: "Adresse", icon: "📍" },
  { num: 3, label: "Kontakt", icon: "👤" },
  { num: 4, label: "Stellen", icon: "💼" },
  { num: 5, label: "Tarif", icon: "💳" },
  { num: 6, label: "Fertig", icon: "✅" },
];

const TARIFE = [
  {
    id: "basis", name: "Basis", price: "99", period: "Monat",
    badge: "", color: NAVY,
    features: ["Bis zu 3 Stellenanzeigen", "Zugang zu allen Fachkraft-Profilen", "Direktnachrichten", "E-Mail Support"],
  },
  {
    id: "professional", name: "Professional", price: "249", period: "Monat",
    badge: "⭐ Empfohlen", color: GREEN,
    features: ["Unbegrenzte Stellenanzeigen", "KI-Matching & Empfehlungen", "Compliance-Dashboard", "Prioritäts-Support", "Detaillierte Statistiken"],
  },
  {
    id: "traeger", name: "Träger / Netzwerk", price: "499", period: "Monat",
    badge: "", color: BLUE,
    features: ["Alles aus Professional", "Unbegrenzte Nutzer", "Persönlicher Account Manager", "API-Zugang", "Individuelle Auswertungen"],
  },
];

function ArbeitgeberPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedTarif, setSelectedTarif] = useState("professional");
  const [payStep, setPayStep] = useState(false);
  const [paying, setPaying] = useState(false);

  const [form, setForm] = useState({
    // Step 1
    einrichtungName: "", einrichtungstyp: "", traeger: "", beschreibung: "",
    // Step 2
    strasse: "", hausnummer: "", plz: "", ort: "", bundesland: "",
    // Step 3
    ansprechName: "", ansprechRolle: "", email: "", telefon: "", passwort: "", passwort2: "",
    // Step 4
    stellenAnzahl: "", fachrichtungen: [], positionen: [], eintrittstermin: "",
    // Step 5 (Stripe simulation)
    kartenname: "", kartennummer: "", ablauf: "", cvv: "",
  });

  const upd = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: "" })); };

  const toggleArr = (field, val, max = 99) => {
    setForm(p => ({
      ...p,
      [field]: p[field].includes(val)
        ? p[field].filter(x => x !== val)
        : p[field].length < max ? [...p[field], val] : p[field],
    }));
  };

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.einrichtungName.trim()) e.einrichtungName = "Pflichtfeld";
      if (!form.einrichtungstyp) e.einrichtungstyp = "Pflichtfeld";
      if (!form.traeger) e.traeger = "Pflichtfeld";
    }
    if (step === 2) {
      if (!form.strasse.trim()) e.strasse = "Pflichtfeld";
      if (!form.plz.trim()) e.plz = "Pflichtfeld";
      if (!form.ort.trim()) e.ort = "Pflichtfeld";
      if (!form.bundesland) e.bundesland = "Pflichtfeld";
    }
    if (step === 3) {
      if (!form.ansprechName.trim()) e.ansprechName = "Pflichtfeld";
      if (!form.email.includes("@")) e.email = "Bitte gültige E-Mail eingeben";
      if (form.passwort.length < 6) e.passwort = "Mindestens 6 Zeichen";
      if (form.passwort !== form.passwort2) e.passwort2 = "Passwörter stimmen nicht überein";
    }
    if (step === 4) {
      if (!form.stellenAnzahl) e.stellenAnzahl = "Pflichtfeld";
      if (form.fachrichtungen.length === 0) e.fachrichtungen = "Bitte mindestens eine Fachrichtung wählen";
    }
    if (step === 5 && payStep) {
      if (!form.kartenname.trim()) e.kartenname = "Pflichtfeld";
      if (form.kartennummer.replace(/\s/g,"").length < 16) e.kartennummer = "Bitte gültige Kartennummer eingeben";
      if (!form.ablauf.trim()) e.ablauf = "Pflichtfeld";
      if (form.cvv.length < 3) e.cvv = "Bitte gültigen CVV eingeben";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => { setPayStep(false); setStep(s => s - 1); };

  const handlePay = () => {
    if (!payStep) { setPayStep(true); return; }
    if (!validate()) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); setDone(true); }, 2200);
  };

  const formatKarte = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 16);
    return clean.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatAblauf = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    if (clean.length >= 2) return clean.slice(0, 2) + "/" + clean.slice(2);
    return clean;
  };

  const inp = (f) => ({
    width: "100%", padding: "12px 15px", borderRadius: 11,
    border: `1.5px solid ${errors[f] ? "#E74C3C" : "#E8EDF4"}`,
    fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif",
    outline: "none", color: "#1a1a2e", background: "white", transition: "border-color 0.2s",
  });
  const sel = (f) => ({ ...inp(f), appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7897' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" });
  const lbl = { fontSize: "0.8rem", fontWeight: 700, color: NAVY, marginBottom: 5, display: "block", letterSpacing: 0.3 };
  const err = (f) => errors[f] ? <div style={{ fontSize: "0.73rem", color: "#E74C3C", marginTop: 3 }}>⚠ {errors[f]}</div> : null;
  const fw = { marginBottom: 18 };
  const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 };

  const tarif = TARIFE.find(t => t.id === selectedTarif);

  if (done) return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, #0D3B2E, ${GREEN})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div style={{ background: "white", borderRadius: 28, padding: "52px 44px", textAlign: "center", maxWidth: 520, width: "100%", boxShadow: "0 30px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 18 }}>🎊</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", color: NAVY, marginBottom: 10 }}>
          Willkommen bei KitaBridge!
        </h2>
        <p style={{ color: "#6B7897", fontSize: "0.92rem", lineHeight: 1.75, marginBottom: 24 }}>
          <strong>{form.einrichtungName}</strong> ist jetzt registriert.<br/>
          Deine Mitgliedschaft <strong>{tarif.name}</strong> ist aktiv — du hast sofort Zugang zu allen Fachkraft-Profilen.
        </p>
        <div style={{ background: "#EAF7EF", borderRadius: 14, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: GREEN, marginBottom: 10 }}>✅ Deine Mitgliedschaft:</div>
          {[
            ["🏫", form.einrichtungName],
            ["📍", `${form.ort}, ${form.bundesland}`],
            ["👤", form.ansprechName],
            ["📧", form.email],
            ["💳", `${tarif.name} — ${tarif.price} €/Monat`],
            ["💼", `${form.stellenAnzahl} Stelle(n) gesucht`],
          ].map(([icon, val]) => val && (
            <div key={icon} style={{ fontSize: "0.83rem", color: "#333", marginBottom: 5 }}>{icon} {val}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/" style={{ padding: "12px 24px", borderRadius: 50, border: `1.5px solid ${NAVY}`, color: NAVY, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
            Zur Homepage
          </a>
          <a href="#" style={{ padding: "12px 24px", borderRadius: 50, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
            Zum Dashboard →
          </a>
        </div>
      </div>
    </div>
  );

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4F9", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus, textarea:focus { border-color: ${BLUE} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.1); }
        .pill-btn { padding: 8px 14px; border-radius: 50px; border: 1.5px solid #E8EDF4; background: white; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #444; font-family: 'DM Sans', sans-serif; }
        .pill-btn:hover { border-color: ${BLUE}; color: ${BLUE}; }
        .pill-btn.on { background: ${NAVY}; color: white; border-color: ${NAVY}; }
        .btn-next { width: 100%; padding: 14px; border-radius: 50px; background: linear-gradient(135deg, ${NAVY}, ${BLUE}); color: white; border: none; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.97rem; cursor: pointer; transition: all 0.25s; box-shadow: 0 6px 20px rgba(26,63,111,0.28); margin-top: 10px; }
        .btn-next:hover { transform: translateY(-2px); }
        .btn-next:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .btn-back { width: 100%; padding: 13px; border-radius: 50px; background: transparent; color: #6B7897; border: 1.5px solid #E8EDF4; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.92rem; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
        .btn-back:hover { border-color: ${NAVY}; color: ${NAVY}; }
        .tarif-card { border-radius: 18px; padding: 24px; border: 2px solid #E8EDF4; background: white; cursor: pointer; transition: all 0.25s; position: relative; }
        .tarif-card:hover { border-color: ${BLUE}; box-shadow: 0 8px 24px rgba(26,63,111,0.1); }
        .tarif-card.selected { border-color: ${GREEN}; box-shadow: 0 8px 28px rgba(30,132,73,0.18); }
        @media (max-width: 600px) { .grid2 { grid-template-columns: 1fr !important; } .form-wrap { padding: 24px 18px !important; } .tarife-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Nav */}
      <div style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "0 32px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <path d="M4 21 Q14 6 24 21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="2" y1="21" x2="26" y2="21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="8" y1="21" x2="8" y2="16" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="14" y1="21" x2="14" y2="10" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="20" y1="21" x2="20" y2="16" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="14" cy="7" r="3" fill="#27AE60"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700 }}>
            <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
          </span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: "0.82rem", color: "#6B7897" }}>
            Bereits registriert? <a href="#" style={{ color: BLUE, fontWeight: 600 }}>Anmelden</a>
          </div>
          <div style={{ background: "#EAF7EF", color: GREEN, padding: "5px 14px", borderRadius: 50, fontSize: "0.78rem", fontWeight: 700 }}>
            30 Tage gratis testen
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#E8EDF4" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${NAVY}, ${GREEN})`, transition: "width 0.4s ease" }}/>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 16px 60px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: "0.74rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>✦ 30 Tage kostenlos testen</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 800, color: NAVY, marginBottom: 6 }}>Arbeitgeber-Registrierung</h1>
          <p style={{ color: "#6B7897", fontSize: "0.88rem" }}>Schritt {step} von {steps.length} — {steps[step - 1].label}</p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, marginBottom: 32 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: step > s.num ? GREEN : step === s.num ? NAVY : "#E8EDF4",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", color: step >= s.num ? "white" : "#9BA8C0",
                  fontWeight: 700, transition: "all 0.3s",
                  boxShadow: step === s.num ? `0 4px 12px rgba(26,63,111,0.28)` : "none",
                }}>
                  {step > s.num ? "✓" : s.icon}
                </div>
                <span style={{ fontSize: "0.62rem", fontWeight: 600, color: step === s.num ? NAVY : "#B0BAD0", whiteSpace: "nowrap" }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 24, height: 2, background: step > s.num ? GREEN : "#E8EDF4", margin: "0 3px", marginBottom: 18, transition: "background 0.3s" }}/>}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="form-wrap" style={{ background: "white", borderRadius: 22, padding: "32px 32px", boxShadow: "0 8px 40px rgba(26,63,111,0.09)", border: "1px solid #E8EDF4" }}>

          {/* ══ STEP 1: Einrichtung ══ */}
          {step === 1 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>🏫 Ihre Einrichtung</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Grunddaten Ihrer Schule, Kita oder Ihres Trägers.</p>

            <div style={fw}>
              <label style={lbl}>Name der Einrichtung *</label>
              <input style={inp("einrichtungName")} value={form.einrichtungName} onChange={e => upd("einrichtungName", e.target.value)} placeholder="z.B. Grundschule Am Stadtpark"/>
              {err("einrichtungName")}
            </div>

            <div className="grid2" style={grid2}>
              <div>
                <label style={lbl}>Einrichtungstyp *</label>
                <select style={sel("einrichtungstyp")} value={form.einrichtungstyp} onChange={e => upd("einrichtungstyp", e.target.value)}>
                  <option value="">— Bitte wählen —</option>
                  {EINRICHTUNGSTYPEN.map(t => <option key={t}>{t}</option>)}
                </select>{err("einrichtungstyp")}
              </div>
              <div>
                <label style={lbl}>Trägerschaft *</label>
                <select style={sel("traeger")} value={form.traeger} onChange={e => upd("traeger", e.target.value)}>
                  <option value="">— Bitte wählen —</option>
                  {TRAEGER.map(t => <option key={t}>{t}</option>)}
                </select>{err("traeger")}
              </div>
            </div>

            <div style={fw}>
              <label style={lbl}>Kurzbeschreibung der Einrichtung (optional)</label>
              <textarea style={{ ...inp("beschreibung"), resize: "vertical", minHeight: 90 }} maxLength={400} value={form.beschreibung} onChange={e => upd("beschreibung", e.target.value)} placeholder="z.B. Wir sind eine offene Ganztagesgrundschule mit 320 Schüler*innen in Berlin-Mitte..."/>
              <div style={{ fontSize: "0.72rem", color: "#9BA8C0", marginTop: 3 }}>{form.beschreibung.length}/400 Zeichen</div>
            </div>

            <button className="btn-next" onClick={next}>Weiter →</button>
          </>}

          {/* ══ STEP 2: Adresse ══ */}
          {step === 2 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>📍 Adresse</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Wo befindet sich Ihre Einrichtung?</p>

            <div className="grid2" style={{ ...grid2, gridTemplateColumns: "2fr 1fr" }}>
              <div>
                <label style={lbl}>Straße *</label>
                <input style={inp("strasse")} value={form.strasse} onChange={e => upd("strasse", e.target.value)} placeholder="z.B. Hauptstraße"/>
                {err("strasse")}
              </div>
              <div>
                <label style={lbl}>Hausnummer</label>
                <input style={inp("hausnummer")} value={form.hausnummer} onChange={e => upd("hausnummer", e.target.value)} placeholder="z.B. 12a"/>
              </div>
            </div>

            <div className="grid2" style={{ ...grid2, gridTemplateColumns: "1fr 2fr" }}>
              <div>
                <label style={lbl}>PLZ *</label>
                <input style={inp("plz")} value={form.plz} onChange={e => upd("plz", e.target.value.slice(0,5))} placeholder="z.B. 10115" maxLength={5}/>
                {err("plz")}
              </div>
              <div>
                <label style={lbl}>Ort *</label>
                <input style={inp("ort")} value={form.ort} onChange={e => upd("ort", e.target.value)} placeholder="z.B. Berlin"/>
                {err("ort")}
              </div>
            </div>

            <div style={fw}>
              <label style={lbl}>Bundesland *</label>
              <select style={sel("bundesland")} value={form.bundesland} onChange={e => upd("bundesland", e.target.value)}>
                <option value="">— Bundesland wählen —</option>
                {BUNDESLAENDER.map(b => <option key={b}>{b}</option>)}
              </select>{err("bundesland")}
            </div>

            <button className="btn-next" onClick={next}>Weiter →</button>
            <button className="btn-back" onClick={back}>← Zurück</button>
          </>}

          {/* ══ STEP 3: Kontakt & Account ══ */}
          {step === 3 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>👤 Ansprechpartner & Account</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Mit diesen Daten können Sie sich später anmelden.</p>

            <div className="grid2" style={grid2}>
              <div>
                <label style={lbl}>Name Ansprechpartner*in *</label>
                <input style={inp("ansprechName")} value={form.ansprechName} onChange={e => upd("ansprechName", e.target.value)} placeholder="z.B. Maria Müller"/>
                {err("ansprechName")}
              </div>
              <div>
                <label style={lbl}>Rolle / Funktion</label>
                <input style={inp("ansprechRolle")} value={form.ansprechRolle} onChange={e => upd("ansprechRolle", e.target.value)} placeholder="z.B. Schulleiterin"/>
              </div>
            </div>

            <div className="grid2" style={grid2}>
              <div>
                <label style={lbl}>E-Mail-Adresse *</label>
                <input style={inp("email")} type="email" value={form.email} onChange={e => upd("email", e.target.value)} placeholder="schule@email.de"/>
                {err("email")}
              </div>
              <div>
                <label style={lbl}>Telefon (optional)</label>
                <input style={inp("telefon")} value={form.telefon} onChange={e => upd("telefon", e.target.value)} placeholder="z.B. 030 12345678"/>
              </div>
            </div>

            <div className="grid2" style={grid2}>
              <div>
                <label style={lbl}>Passwort * (min. 6 Zeichen)</label>
                <input style={inp("passwort")} type="password" value={form.passwort} onChange={e => upd("passwort", e.target.value)} placeholder="••••••••"/>
                {err("passwort")}
              </div>
              <div>
                <label style={lbl}>Passwort wiederholen *</label>
                <input style={inp("passwort2")} type="password" value={form.passwort2} onChange={e => upd("passwort2", e.target.value)} placeholder="••••••••"/>
                {err("passwort2")}
              </div>
            </div>

            <button className="btn-next" onClick={next}>Weiter →</button>
            <button className="btn-back" onClick={back}>← Zurück</button>
          </>}

          {/* ══ STEP 4: Stellen ══ */}
          {step === 4 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>💼 Gesuchte Stellen</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Welche Fachkräfte suchen Sie?</p>

            <div style={fw}>
              <label style={lbl}>Anzahl gesuchter Stellen *</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {STELLEN_ANZ.map(a => (
                  <button key={a} className={`pill-btn ${form.stellenAnzahl === a ? "on" : ""}`} onClick={() => upd("stellenAnzahl", a)}>
                    {a}
                  </button>
                ))}
              </div>
              {err("stellenAnzahl")}
            </div>

            <div style={fw}>
              <label style={lbl}>Gesuchte Fachrichtungen * (Mehrfachwahl)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {FACHRICHTUNGEN.map(f => (
                  <button key={f} className={`pill-btn ${form.fachrichtungen.includes(f) ? "on" : ""}`} onClick={() => toggleArr("fachrichtungen", f)}>
                    {form.fachrichtungen.includes(f) ? "✓ " : ""}{f}
                  </button>
                ))}
              </div>
              {err("fachrichtungen")}
            </div>

            <div style={fw}>
              <label style={lbl}>Gesuchte Positionen (optional)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {POSITIONEN.map(p => (
                  <button key={p} className={`pill-btn ${form.positionen.includes(p) ? "on" : ""}`} onClick={() => toggleArr("positionen", p)}>
                    {form.positionen.includes(p) ? "✓ " : ""}{p}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-next" onClick={next}>Weiter →</button>
            <button className="btn-back" onClick={back}>← Zurück</button>
          </>}

          {/* ══ STEP 5: Tarif & Zahlung ══ */}
          {step === 5 && <>
            {!payStep ? (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>💳 Tarif wählen</h2>
                <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 20 }}>30 Tage kostenlos testen — danach monatlich kündbar.</p>

                <div className="tarife-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
                  {TARIFE.map(t => (
                    <div key={t.id} className={`tarif-card ${selectedTarif === t.id ? "selected" : ""}`} onClick={() => setSelectedTarif(t.id)}>
                      {t.badge && (
                        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: GREEN, color: "white", padding: "3px 12px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                          {t.badge}
                        </div>
                      )}
                      <div style={{ fontWeight: 700, color: t.color, fontSize: "0.95rem", marginBottom: 6 }}>{t.name}</div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 700, color: NAVY, marginBottom: 2 }}>
                        {t.price} €
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#9BA8C0", marginBottom: 14 }}>/ {t.period}</div>
                      {t.features.map(f => (
                        <div key={f} style={{ fontSize: "0.75rem", color: "#444", marginBottom: 5, display: "flex", gap: 6, alignItems: "flex-start" }}>
                          <span style={{ color: GREEN, flexShrink: 0 }}>✓</span>{f}
                        </div>
                      ))}
                      {selectedTarif === t.id && (
                        <div style={{ marginTop: 12, background: "#EAF7EF", borderRadius: 8, padding: "6px 10px", fontSize: "0.73rem", color: GREEN, fontWeight: 700, textAlign: "center" }}>
                          ✓ Ausgewählt
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ background: "#EBF5FB", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
                  <div style={{ fontSize: "0.77rem", fontWeight: 700, color: BLUE, marginBottom: 4 }}>🎁 30 Tage kostenlos</div>
                  <div style={{ fontSize: "0.8rem", color: "#444", lineHeight: 1.6 }}>
                    Kein Risiko — Sie werden erst nach 30 Tagen belastet und können jederzeit kündigen.
                  </div>
                </div>

                <button className="btn-next" onClick={() => { if(validate()) setPayStep(true); }}>
                  Weiter zur Zahlung →
                </button>
                <button className="btn-back" onClick={back}>← Zurück</button>
              </>
            ) : (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>💳 Zahlungsdaten</h2>
                <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 4 }}>
                  Tarif: <strong>{tarif.name}</strong> — {tarif.price} €/Monat (nach 30 Tagen)
                </p>

                {/* Stripe-style card */}
                <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 16, padding: "20px 22px", marginBottom: 22, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }}/>
                  <div style={{ position: "absolute", right: 20, bottom: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }}/>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", marginBottom: 16, letterSpacing: 1 }}>KREDITKARTE / DEBITKARTE</div>
                  <div style={{ color: "white", fontSize: "1.1rem", fontWeight: 600, letterSpacing: 3, marginBottom: 16 }}>
                    {form.kartennummer || "•••• •••• •••• ••••"}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem" }}>KARTENINHABER</div>
                      <div style={{ color: "white", fontSize: "0.85rem", fontWeight: 600 }}>{form.kartenname || "—"}</div>
                    </div>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem" }}>GÜLTIG BIS</div>
                      <div style={{ color: "white", fontSize: "0.85rem", fontWeight: 600 }}>{form.ablauf || "MM/JJ"}</div>
                    </div>
                  </div>
                </div>

                <div style={fw}>
                  <label style={lbl}>Name auf der Karte *</label>
                  <input style={inp("kartenname")} value={form.kartenname} onChange={e => upd("kartenname", e.target.value.toUpperCase())} placeholder="z.B. MARIA MÜLLER"/>
                  {err("kartenname")}
                </div>

                <div style={fw}>
                  <label style={lbl}>Kartennummer *</label>
                  <input style={inp("kartennummer")} value={form.kartennummer} onChange={e => upd("kartennummer", formatKarte(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19}/>
                  {err("kartennummer")}
                </div>

                <div className="grid2" style={grid2}>
                  <div>
                    <label style={lbl}>Ablaufdatum *</label>
                    <input style={inp("ablauf")} value={form.ablauf} onChange={e => upd("ablauf", formatAblauf(e.target.value))} placeholder="MM/JJ" maxLength={5}/>
                    {err("ablauf")}
                  </div>
                  <div>
                    <label style={lbl}>CVV *</label>
                    <input style={inp("cvv")} value={form.cvv} onChange={e => upd("cvv", e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="123" maxLength={4} type="password"/>
                    {err("cvv")}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, background: "#F8FAFF", borderRadius: 10, padding: "10px 14px" }}>
                  <span style={{ fontSize: "1.1rem" }}>🔒</span>
                  <span style={{ fontSize: "0.78rem", color: "#6B7897" }}>Ihre Zahlungsdaten werden SSL-verschlüsselt übertragen und sicher verarbeitet.</span>
                </div>

                <button className="btn-next" style={{ background: `linear-gradient(135deg, ${GREEN}, #27AE60)`, boxShadow: "0 6px 20px rgba(30,132,73,0.32)" }} onClick={handlePay} disabled={paying}>
                  {paying ? "⏳ Zahlung wird verarbeitet..." : `🚀 Jetzt ${tarif.price} €/Monat starten`}
                </button>
                <button className="btn-back" onClick={() => setPayStep(false)}>← Zurück zur Tarifauswahl</button>
              </>
            )}
          </>}

          {/* ══ STEP 6: Übersicht ══ */}
          {step === 6 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>✅ Zusammenfassung</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 20 }}>Bitte überprüfen Sie Ihre Angaben.</p>

            {[
              ["🏫 Einrichtung", form.einrichtungName],
              ["📋 Typ", form.einrichtungstyp],
              ["🏛️ Träger", form.traeger],
              ["📍 Adresse", `${form.strasse} ${form.hausnummer}, ${form.plz} ${form.ort}`],
              ["🗺️ Bundesland", form.bundesland],
              ["👤 Ansprechpartner", form.ansprechName],
              ["📧 E-Mail", form.email],
              ["📞 Telefon", form.telefon || "—"],
              ["💼 Stellen", form.stellenAnzahl],
              ["📚 Fachrichtungen", form.fachrichtungen.join(", ")],
              ["💳 Tarif", `${tarif.name} — ${tarif.price} €/Monat`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", padding: "9px 0", borderBottom: "1px solid #F0F4F9", gap: 10 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6B7897", minWidth: 160, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: "0.82rem", color: "#1a1a2e" }}>{val || "—"}</span>
              </div>
            ))}

            <div style={{ marginTop: 16, fontSize: "0.75rem", color: "#9BA8C0", textAlign: "center", lineHeight: 1.6, marginBottom: 4 }}>
              Mit der Registrierung stimmen Sie unseren <a href="#" style={{ color: BLUE }}>AGB</a> und der <a href="#" style={{ color: BLUE }}>Datenschutzerklärung</a> zu.
            </div>

            <button className="btn-next" style={{ background: `linear-gradient(135deg, ${GREEN}, #27AE60)`, boxShadow: "0 6px 20px rgba(30,132,73,0.32)", marginTop: 16 }} onClick={() => setDone(true)}>
              🎊 Registrierung abschließen
            </button>
            <button className="btn-back" onClick={back}>← Zurück</button>
          </>}

        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.78rem", color: "#9BA8C0" }}>
          🔒 DSGVO-konform — Ihre Daten werden sicher verarbeitet.
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ArbeitgeberPage), { ssr: false });