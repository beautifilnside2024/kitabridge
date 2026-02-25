"use client";
import { supabase } from '../../lib/supabase';
import { useState } from "react";
import dynamic from "next/dynamic";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const BUNDESLAENDER = ["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"];

const LAENDER = ["Deutschland","Afghanistan","Ägypten","Albanien","Algerien","Angola","Argentinien","Armenien","Äthiopien","Australien","Bangladesch","Belgien","Bolivien","Bosnien-Herzegowina","Brasilien","Bulgarien","Chile","China","Ecuador","Eritrea","Frankreich","Georgien","Ghana","Griechenland","Guatemala","Guinea","Indien","Indonesien","Irak","Iran","Italien","Jordanien","Kambodscha","Kamerun","Kasachstan","Kenia","Kolumbien","Kongo","Kosovo","Kroatien","Kuba","Libanon","Libyen","Litauen","Marokko","Mazedonien","Mexiko","Moldova","Mongolei","Montenegro","Mozambique","Myanmar","Nepal","Nicaragua","Niederlande","Nigeria","Nordmazedonien","Österreich","Pakistan","Palästina","Paraguay","Peru","Philippinen","Polen","Portugal","Rumänien","Russland","Saudi-Arabien","Senegal","Serbien","Sierra Leone","Simbabwe","Slowakei","Slowenien","Somalia","Spanien","Sri Lanka","Südafrika","Sudan","Syrien","Tansania","Tschechien","Tunesien","Türkei","Uganda","Ukraine","Ungarn","Uruguay","Usbekistan","Venezuela","Vietnam","Weißrussland","Andere"];

const SPRACHEN = ["Deutsch","Englisch","Französisch","Spanisch","Arabisch","Türkisch","Russisch","Polnisch","Rumänisch","Ukrainisch","Vietnamesisch","Chinesisch","Hindi","Urdu","Tagalog","Portugiesisch","Italienisch","Niederländisch","Griechisch","Schwedisch","Andere"];

const NIVEAUS = ["A1","A2","B1","B2","C1","C2","Muttersprache"];

const BERUFE = ["Grundschullehrerin / -lehrer","Sekundarstufenlehrerin / -lehrer (Sek. I)","Sekundarstufenlehrerin / -lehrer (Sek. II)","Gymnasiallehrerin / -lehrer","Förderschullehrerin / -lehrer","Berufsschullehrerin / -lehrer","Erzieherin / Erzieher","Kinderpflegerin / -pfleger","Sozialpädagogin / -pädagoge","Heilpädagogin / -pädagoge","Heilerziehungspflegerin / -pfleger","Sozialassistentin / -assistent","Quereinsteiger*in mit Hochschulabschluss","Andere"];

const ABSCHLUESSE = ["Kein Abschluss","Hauptschulabschluss","Mittlere Reife","Abitur","Ausbildungsabschluss","Bachelor of Education","Master of Education","Staatsexamen (Lehramt)","Bachelor (anderes Fach)","Master (anderes Fach)","Diplom","Promotion","Andere"];

const FACHRICHTUNGEN = ["Mathematik","Deutsch / Germanistik","Englisch","Französisch","Spanisch","Physik","Chemie","Biologie","Geschichte","Geografie","Sport","Kunst","Musik","Informatik","Sachkunde","Ethik / Religion","Wirtschaft / Politik","DaF / DaZ","Frühkindliche Bildung","Sonderpädagogik / Inklusion","Soziale Arbeit","Andere"];

const POSITIONEN = ["Klassenlehrerin / -lehrer","Fachlehrerin / -lehrer","Vertretungslehrerin / -lehrer","Erzieherin / Erzieher (Kita)","Erzieherin / Erzieher (Hort)","Gruppenleitung Kita","Stellv. Kita-Leitung","Kita-Leitung","Schulbegleitung / Integrationshelfer*in","Sozialassistenz","Andere"];

const ERFAHRUNG = ["Noch keine Erfahrung","Unter 1 Jahr","1–2 Jahre","3–5 Jahre","6–10 Jahre","Über 10 Jahre"];

const AUFENTHALT = ["Deutsch / EU-Bürger*in","Niederlassungserlaubnis","Aufenthaltserlaubnis (Arbeit)","Aufenthaltserlaubnis (Studium)","Blaue Karte EU","Duldung","Asylbewerber*in","Noch nicht in Deutschland","Andere"];

const ARBEITSERLAUBNIS = ["Ja, uneingeschränkt","Ja, mit Einschränkungen","Nein, noch nicht","Nicht zutreffend (EU-Bürger*in)","Noch nicht bekannt"];

const EINTRITTSTERMINE = ["Ab sofort","Ab Juli 2026","Ab August 2026","Ab September 2026","Ab Oktober 2026","Ab November 2026","Ab Januar 2027","Ab April 2027","Nach Vereinbarung"];

const steps = [
  { num: 1, label: "Persönlich", icon: "👤" },
  { num: 2, label: "Sprachen", icon: "🌍" },
  { num: 3, label: "Beruf", icon: "🎓" },
  { num: 4, label: "Position", icon: "💼" },
  { num: 5, label: "Status", icon: "📋" },
  { num: 6, label: "Profil", icon: "✍️" },
  { num: 7, label: "Fertig", icon: "✅" },
];

function RegistrierungPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Step 1
    vorname: "", nachname: "", email: "", passwort: "", passwort2: "",
    wohnortStadt: "", wohnortLand: "Deutschland",
    staatsangehoerigkeit: "", muttersprache: "",
    // Step 2
    weitereSpachen: [{ sprache: "", niveau: "B1" }],
    // Step 3
    beruf: "", abschluss: "", fachrichtung: "", erfahrung: "",
    // Step 4
    position: "", beschaeftigung: [], eintrittstermin: "",
    // Step 5
    aufenthalt: "", arbeitserlaubnis: "",
    // Step 6
    kurzprofil: "", qualifikationen: "",
    profilSichtbar: true, kontaktErlaubt: true, agb: false, datenschutz: false,
  });

  const upd = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: "" })); };

  const toggleBeschaeftigung = (val) => {
    setForm(p => ({
      ...p,
      beschaeftigung: p.beschaeftigung.includes(val)
        ? p.beschaeftigung.filter(b => b !== val)
        : [...p.beschaeftigung, val]
    }));
  };

  const addSprache = () => {
    if (form.weitereSpachen.length < 6)
      setForm(p => ({ ...p, weitereSpachen: [...p.weitereSpachen, { sprache: "", niveau: "B1" }] }));
  };

  const updSprache = (i, f, v) => {
    const arr = [...form.weitereSpachen];
    arr[i][f] = v; setForm(p => ({ ...p, weitereSpachen: arr }));
  };

  const delSprache = (i) => setForm(p => ({ ...p, weitereSpachen: p.weitereSpachen.filter((_, j) => j !== i) }));

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.vorname.trim()) e.vorname = "Pflichtfeld";
      if (!form.nachname.trim()) e.nachname = "Pflichtfeld";
      if (!form.email.includes("@")) e.email = "Bitte gültige E-Mail eingeben";
      if (form.passwort.length < 6) e.passwort = "Mindestens 6 Zeichen";
      if (form.passwort !== form.passwort2) e.passwort2 = "Passwörter stimmen nicht überein";
      if (!form.wohnortStadt.trim()) e.wohnortStadt = "Pflichtfeld";
      if (!form.staatsangehoerigkeit) e.staatsangehoerigkeit = "Pflichtfeld";
      if (!form.muttersprache) e.muttersprache = "Pflichtfeld";
    }
    if (step === 3) {
      if (!form.beruf) e.beruf = "Pflichtfeld";
      if (!form.abschluss) e.abschluss = "Pflichtfeld";
      if (!form.fachrichtung) e.fachrichtung = "Pflichtfeld";
      if (!form.erfahrung) e.erfahrung = "Pflichtfeld";
    }
    if (step === 4) {
      if (!form.position) e.position = "Pflichtfeld";
      if (form.beschaeftigung.length === 0) e.beschaeftigung = "Bitte mindestens eine Art wählen";
      if (!form.eintrittstermin) e.eintrittstermin = "Pflichtfeld";
    }
    if (step === 5) {
      if (!form.aufenthalt) e.aufenthalt = "Pflichtfeld";
      if (!form.arbeitserlaubnis) e.arbeitserlaubnis = "Pflichtfeld";
    }
    if (step === 6) {
      if (!form.kurzprofil.trim()) e.kurzprofil = "Bitte kurze Beschreibung eingeben";
      if (!form.agb) e.agb = "Bitte AGB akzeptieren";
      if (!form.datenschutz) e.datenschutz = "Bitte Datenschutzerklärung akzeptieren";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);
  const submit = async () => {
  if (!validateStep()) return;
  const { error } = await supabase.from('fachkraefte').insert({
    vorname: form.vorname,
    nachname: form.nachname,
    email: form.email,
    wohnort_stadt: form.wohnortStadt,
    wohnort_land: form.wohnortLand,
    staatsangehoerigkeit: form.staatsangehoerigkeit,
    muttersprache: form.muttersprache,
    beruf: form.beruf,
    abschluss: form.abschluss,
    fachrichtung: form.fachrichtung,
    erfahrung: form.erfahrung,
    position: form.position,
    beschaeftigung: form.beschaeftigung,
    eintrittstermin: form.eintrittstermin,
    aufenthalt: form.aufenthalt,
    arbeitserlaubnis: form.arbeitserlaubnis,
    kurzprofil: form.kurzprofil,
    qualifikationen: form.qualifikationen,
  });
  if (error) { alert('Fehler: ' + error.message); return; }
  setDone(true);
};

  // Styles
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

  const Logo = () => (
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
  );

  if (done) return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, #0D2137, ${NAVY})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div style={{ background: "white", borderRadius: 28, padding: "52px 44px", textAlign: "center", maxWidth: 500, width: "100%", boxShadow: "0 30px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 18 }}>🎉</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", color: NAVY, marginBottom: 10 }}>Willkommen, {form.vorname}!</h2>
        <p style={{ color: "#6B7897", fontSize: "0.92rem", lineHeight: 1.75, marginBottom: 28 }}>
          Dein Profil wurde erfolgreich erstellt und wird nun von unserem Team geprüft.<br/>
          Du erhältst eine Bestätigung an <strong>{form.email}</strong> — normalerweise innerhalb von 24 Stunden.
        </p>
        <div style={{ background: "#EAF7EF", borderRadius: 14, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: GREEN, marginBottom: 10 }}>✅ Dein Profil auf einen Blick:</div>
          {[
            ["👤", `${form.vorname} ${form.nachname}`],
            ["🎓", form.beruf],
            ["📚", form.fachrichtung],
            ["💼", form.position],
            ["🗓", form.eintrittstermin],
            ["🌍", `${form.wohnortStadt}, ${form.wohnortLand}`],
          ].map(([icon, val]) => val && (
            <div key={icon} style={{ fontSize: "0.83rem", color: "#333", marginBottom: 5 }}>{icon} {val}</div>
          ))}
        </div>
        <a href="/" style={{ display: "inline-block", padding: "13px 32px", borderRadius: 50, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none" }}>
          Zurück zur Homepage
        </a>
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
        .toggle-btn { padding: 9px 18px; border-radius: 50px; border: 1.5px solid #E8EDF4; background: white; font-size: 0.83rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #444; font-family: 'DM Sans', sans-serif; }
        .toggle-btn:hover { border-color: ${BLUE}; color: ${BLUE}; }
        .toggle-btn.on { background: ${NAVY}; color: white; border-color: ${NAVY}; }
        .btn-next { width: 100%; padding: 14px; border-radius: 50px; background: linear-gradient(135deg, ${NAVY}, ${BLUE}); color: white; border: none; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.97rem; cursor: pointer; transition: all 0.25s; box-shadow: 0 6px 20px rgba(26,63,111,0.28); margin-top: 10px; }
        .btn-next:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(26,63,111,0.38); }
        .btn-back { width: 100%; padding: 13px; border-radius: 50px; background: transparent; color: #6B7897; border: 1.5px solid #E8EDF4; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.92rem; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
        .btn-back:hover { border-color: ${NAVY}; color: ${NAVY}; }
        .check-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border-radius: 12px; border: 1.5px solid #E8EDF4; background: white; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
        .check-row:hover { border-color: ${BLUE}; background: #F8FBFF; }
        .check-row.checked { border-color: ${GREEN}; background: #EAF7EF; }
        @media (max-width: 600px) { .grid2 { grid-template-columns: 1fr !important; } .form-wrap { padding: 24px 18px !important; } }
      `}</style>

      {/* Nav */}
      <div style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "0 32px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo/>
        <div style={{ fontSize: "0.82rem", color: "#6B7897" }}>
          Bereits registriert? <a href="#" style={{ color: BLUE, fontWeight: 600 }}>Anmelden</a>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#E8EDF4" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${NAVY}, ${GREEN})`, transition: "width 0.4s ease" }}/>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "40px 16px 60px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: "0.74rem", fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>✦ Kostenlos registrieren</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 800, color: NAVY, marginBottom: 6 }}>Dein Fachkräfte-Profil</h1>
          <p style={{ color: "#6B7897", fontSize: "0.88rem" }}>Schritt {step} von {steps.length} — {steps[step - 1].label}</p>
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, marginBottom: 32 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: step > s.num ? GREEN : step === s.num ? NAVY : "#E8EDF4",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: step > s.num ? "0.9rem" : "0.85rem",
                  color: step >= s.num ? "white" : "#9BA8C0",
                  fontWeight: 700, transition: "all 0.3s",
                  boxShadow: step === s.num ? `0 4px 12px rgba(26,63,111,0.28)` : "none",
                }}>
                  {step > s.num ? "✓" : s.icon}
                </div>
                <span style={{ fontSize: "0.62rem", fontWeight: 600, color: step === s.num ? NAVY : "#B0BAD0", whiteSpace: "nowrap" }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 28, height: 2, background: step > s.num ? GREEN : "#E8EDF4", margin: "0 3px", marginBottom: 18, transition: "background 0.3s" }}/>}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="form-wrap" style={{ background: "white", borderRadius: 22, padding: "32px 32px", boxShadow: "0 8px 40px rgba(26,63,111,0.09)", border: "1px solid #E8EDF4" }}>

          {/* ══ STEP 1: Persönliche Daten ══ */}
          {step === 1 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>👤 Persönliche Daten</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Deine Grunddaten für deinen Account.</p>

            <div className="grid2" style={grid2}>
              <div><label style={lbl}>Vorname *</label><input style={inp("vorname")} value={form.vorname} onChange={e => upd("vorname", e.target.value)} placeholder="z.B. Priya"/>{err("vorname")}</div>
              <div><label style={lbl}>Nachname *</label><input style={inp("nachname")} value={form.nachname} onChange={e => upd("nachname", e.target.value)} placeholder="z.B. Sharma"/>{err("nachname")}</div>
            </div>

            <div style={fw}><label style={lbl}>E-Mail-Adresse *</label><input style={inp("email")} type="email" value={form.email} onChange={e => upd("email", e.target.value)} placeholder="deine@email.com"/>{err("email")}</div>

            <div className="grid2" style={grid2}>
              <div><label style={lbl}>Passwort * (min. 6 Zeichen)</label><input style={inp("passwort")} type="password" value={form.passwort} onChange={e => upd("passwort", e.target.value)} placeholder="••••••••"/>{err("passwort")}</div>
              <div><label style={lbl}>Passwort wiederholen *</label><input style={inp("passwort2")} type="password" value={form.passwort2} onChange={e => upd("passwort2", e.target.value)} placeholder="••••••••"/>{err("passwort2")}</div>
            </div>

            <div className="grid2" style={grid2}>
              <div><label style={lbl}>Wohnort (Stadt) *</label><input style={inp("wohnortStadt")} value={form.wohnortStadt} onChange={e => upd("wohnortStadt", e.target.value)} placeholder="z.B. Berlin"/>{err("wohnortStadt")}</div>
              <div><label style={lbl}>Wohnort (Land) *</label>
                <select style={sel("wohnortLand")} value={form.wohnortLand} onChange={e => upd("wohnortLand", e.target.value)}>
                  {LAENDER.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="grid2" style={grid2}>
              <div><label style={lbl}>Staatsangehörigkeit *</label>
                <select style={sel("staatsangehoerigkeit")} value={form.staatsangehoerigkeit} onChange={e => upd("staatsangehoerigkeit", e.target.value)}>
                  <option value="">— Bitte wählen —</option>
                  {LAENDER.map(l => <option key={l}>{l}</option>)}
                </select>{err("staatsangehoerigkeit")}
              </div>
              <div><label style={lbl}>Muttersprache *</label>
                <select style={sel("muttersprache")} value={form.muttersprache} onChange={e => upd("muttersprache", e.target.value)}>
                  <option value="">— Bitte wählen —</option>
                  {SPRACHEN.map(s => <option key={s}>{s}</option>)}
                </select>{err("muttersprache")}
              </div>
            </div>

            <button className="btn-next" onClick={next}>Weiter →</button>
          </>}

          {/* ══ STEP 2: Weitere Sprachen ══ */}
          {step === 2 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>🌍 Weitere Sprachen</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Welche Sprachen sprichst du zusätzlich zu deiner Muttersprache?</p>

            {form.weitereSpachen.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 120px 36px", gap: 10, marginBottom: 12, alignItems: "flex-end" }}>
                <div>
                  {i === 0 && <label style={lbl}>Sprache</label>}
                  <select style={sel("")} value={s.sprache} onChange={e => updSprache(i, "sprache", e.target.value)}>
                    <option value="">— Sprache wählen —</option>
                    {SPRACHEN.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  {i === 0 && <label style={lbl}>Niveau</label>}
                  <select style={sel("")} value={s.niveau} onChange={e => updSprache(i, "niveau", e.target.value)}>
                    {NIVEAUS.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div style={{ paddingBottom: 1 }}>
                  {i === 0 && <label style={{ ...lbl, opacity: 0 }}>X</label>}
                  <button onClick={() => delSprache(i)} style={{ width: 36, height: 40, borderRadius: 9, border: "1.5px solid #FADBD8", background: "#FEF9F9", cursor: "pointer", color: "#E74C3C", fontSize: "0.85rem" }}>✕</button>
                </div>
              </div>
            ))}

            {form.weitereSpachen.length < 6 && (
              <button onClick={addSprache} style={{ padding: "9px 20px", borderRadius: 50, border: `1.5px dashed ${BLUE}`, background: "transparent", color: BLUE, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.83rem", cursor: "pointer", marginBottom: 20, marginTop: 4 }}>
                + Weitere Sprache
              </button>
            )}

            <div style={{ background: "#EBF5FB", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: "0.77rem", fontWeight: 700, color: BLUE, marginBottom: 4 }}>💡 Hinweis</div>
              <div style={{ fontSize: "0.8rem", color: "#444", lineHeight: 1.6 }}>Für eine Stelle in Deutschland wird mindestens <strong>Deutsch B2</strong> benötigt. C1 erhöht deine Chancen erheblich.</div>
            </div>

            <button className="btn-next" onClick={next}>Weiter →</button>
            <button className="btn-back" onClick={back}>← Zurück</button>
          </>}

          {/* ══ STEP 3: Beruf & Ausbildung ══ */}
          {step === 3 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>🎓 Beruf & Ausbildung</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Deine Qualifikation und Berufserfahrung.</p>

            <div style={fw}><label style={lbl}>Berufsbezeichnung *</label>
              <select style={sel("beruf")} value={form.beruf} onChange={e => upd("beruf", e.target.value)}>
                <option value="">— Bitte wählen —</option>
                {BERUFE.map(b => <option key={b}>{b}</option>)}
              </select>{err("beruf")}
            </div>

            <div style={fw}><label style={lbl}>Höchster Bildungsabschluss *</label>
              <select style={sel("abschluss")} value={form.abschluss} onChange={e => upd("abschluss", e.target.value)}>
                <option value="">— Bitte wählen —</option>
                {ABSCHLUESSE.map(a => <option key={a}>{a}</option>)}
              </select>{err("abschluss")}
            </div>

            <div style={fw}><label style={lbl}>Fachrichtung / Einsatzbereich *</label>
              <select style={sel("fachrichtung")} value={form.fachrichtung} onChange={e => upd("fachrichtung", e.target.value)}>
                <option value="">— Bitte wählen —</option>
                {FACHRICHTUNGEN.map(f => <option key={f}>{f}</option>)}
              </select>{err("fachrichtung")}
            </div>

            <div style={fw}><label style={lbl}>Berufserfahrung *</label>
              <select style={sel("erfahrung")} value={form.erfahrung} onChange={e => upd("erfahrung", e.target.value)}>
                <option value="">— Bitte wählen —</option>
                {ERFAHRUNG.map(e => <option key={e}>{e}</option>)}
              </select>{err("erfahrung")}
            </div>

            <button className="btn-next" onClick={next}>Weiter →</button>
            <button className="btn-back" onClick={back}>← Zurück</button>
          </>}

          {/* ══ STEP 4: Position ══ */}
          {step === 4 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>💼 Gesuchte Position</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Welche Stelle suchst du und wann kannst du anfangen?</p>

            <div style={fw}><label style={lbl}>Gesuchte Position *</label>
              <select style={sel("position")} value={form.position} onChange={e => upd("position", e.target.value)}>
                <option value="">— Bitte wählen —</option>
                {POSITIONEN.map(p => <option key={p}>{p}</option>)}
              </select>{err("position")}
            </div>

            <div style={fw}>
              <label style={lbl}>Beschäftigungsart * (Mehrfachwahl)</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                {["Vollzeit", "Teilzeit", "Minijob", "Vertretung / Befristet"].map(b => (
                  <button key={b} className={`toggle-btn ${form.beschaeftigung.includes(b) ? "on" : ""}`} onClick={() => toggleBeschaeftigung(b)}>
                    {form.beschaeftigung.includes(b) ? "✓ " : ""}{b}
                  </button>
                ))}
              </div>
              {err("beschaeftigung")}
            </div>

            <div style={fw}><label style={lbl}>Frühester Eintrittstermin *</label>
              <select style={sel("eintrittstermin")} value={form.eintrittstermin} onChange={e => upd("eintrittstermin", e.target.value)}>
                <option value="">— Bitte wählen —</option>
                {EINTRITTSTERMINE.map(t => <option key={t}>{t}</option>)}
              </select>{err("eintrittstermin")}
            </div>

            <button className="btn-next" onClick={next}>Weiter →</button>
            <button className="btn-back" onClick={back}>← Zurück</button>
          </>}

          {/* ══ STEP 5: Aufenthalt & Arbeitserlaubnis ══ */}
          {step === 5 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>📋 Rechtlicher Status</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Diese Angaben helfen Arbeitgebern, die Einstellung zu planen.</p>

            <div style={fw}><label style={lbl}>Aufenthaltsstatus in Deutschland *</label>
              <select style={sel("aufenthalt")} value={form.aufenthalt} onChange={e => upd("aufenthalt", e.target.value)}>
                <option value="">— Bitte wählen —</option>
                {AUFENTHALT.map(a => <option key={a}>{a}</option>)}
              </select>{err("aufenthalt")}
            </div>

            <div style={fw}><label style={lbl}>Arbeitserlaubnis in Deutschland *</label>
              <select style={sel("arbeitserlaubnis")} value={form.arbeitserlaubnis} onChange={e => upd("arbeitserlaubnis", e.target.value)}>
                <option value="">— Bitte wählen —</option>
                {ARBEITSERLAUBNIS.map(a => <option key={a}>{a}</option>)}
              </select>{err("arbeitserlaubnis")}
            </div>

            <div style={{ background: "#FEF9E7", borderRadius: 12, padding: "12px 16px", marginBottom: 20, border: "1px solid #FAD7A0" }}>
              <div style={{ fontSize: "0.77rem", fontWeight: 700, color: "#B7770D", marginBottom: 4 }}>ℹ️ Hinweis</div>
              <div style={{ fontSize: "0.8rem", color: "#7D6608", lineHeight: 1.6 }}>Diese Angaben sind vertraulich und werden nur für die Vermittlung genutzt. Sie sind für Arbeitgeber nicht öffentlich sichtbar.</div>
            </div>

            <button className="btn-next" onClick={next}>Weiter →</button>
            <button className="btn-back" onClick={back}>← Zurück</button>
          </>}

          {/* ══ STEP 6: Profil & Einwilligung ══ */}
          {step === 6 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>✍️ Dein Profil</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Beschreibe dich kurz — das sehen Arbeitgeber als erstes.</p>

            <div style={fw}>
              <label style={lbl}>Kurzprofil / Über mich * (max. 500 Zeichen)</label>
              <textarea style={{ ...inp("kurzprofil"), resize: "vertical", minHeight: 100 }} maxLength={500} value={form.kurzprofil} onChange={e => upd("kurzprofil", e.target.value)} placeholder="z.B. Erfahrene Grundschullehrerin mit Schwerpunkt Mathematik, motiviert für eine neue Herausforderung in Deutschland..."/>
              <div style={{ fontSize: "0.72rem", color: "#9BA8C0", marginTop: 4 }}>{form.kurzprofil.length}/500 Zeichen</div>
              {err("kurzprofil")}
            </div>

            <div style={fw}>
              <label style={lbl}>Besondere Qualifikationen (optional)</label>
              <textarea style={{ ...inp("qualifikationen"), resize: "vertical", minHeight: 80 }} value={form.qualifikationen} onChange={e => upd("qualifikationen", e.target.value)} placeholder="z.B. Montessori-Diplom, DaZ-Zertifikat, Erste-Hilfe-Kurs..."/>
            </div>

            {/* Toggles */}
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Einstellungen</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className={`toggle-btn ${form.profilSichtbar ? "on" : ""}`} onClick={() => upd("profilSichtbar", !form.profilSichtbar)}>
                  {form.profilSichtbar ? "✓ " : ""}Profil sichtbar für Arbeitgeber
                </button>
                <button className={`toggle-btn ${form.kontaktErlaubt ? "on" : ""}`} onClick={() => upd("kontaktErlaubt", !form.kontaktErlaubt)}>
                  {form.kontaktErlaubt ? "✓ " : ""}Kontaktaufnahme erlaubt
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div
              className={`check-row ${form.agb ? "checked" : ""}`}
              onClick={() => { upd("agb", !form.agb); }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${form.agb ? GREEN : "#C0C8D8"}`, background: form.agb ? GREEN : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                {form.agb && <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.5 }}>
                Ich akzeptiere die <a href="#" style={{ color: BLUE }} onClick={e => e.stopPropagation()}>Allgemeinen Geschäftsbedingungen</a> von KitaBridge. *
              </div>
            </div>
            {err("agb")}

            <div
              className={`check-row ${form.datenschutz ? "checked" : ""}`}
              onClick={() => upd("datenschutz", !form.datenschutz)}
              style={{ marginTop: 4 }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${form.datenschutz ? GREEN : "#C0C8D8"}`, background: form.datenschutz ? GREEN : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                {form.datenschutz && <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.5 }}>
                Ich habe die <a href="#" style={{ color: BLUE }} onClick={e => e.stopPropagation()}>Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Daten zu. *
              </div>
            </div>
            {err("datenschutz")}

            <button className="btn-next" onClick={next} style={{ marginTop: 20 }}>Profil überprüfen →</button>
            <button className="btn-back" onClick={back}>← Zurück</button>
          </>}

          {/* ══ STEP 7: Übersicht ══ */}
          {step === 7 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>✅ Alles korrekt?</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 20 }}>Bitte überprüfe deine Angaben vor der Registrierung.</p>

            {[
              ["👤 Name", `${form.vorname} ${form.nachname}`],
              ["📧 E-Mail", form.email],
              ["🏠 Wohnort", `${form.wohnortStadt}, ${form.wohnortLand}`],
              ["🌍 Staatsang.", form.staatsangehoerigkeit],
              ["🗣 Muttersprache", form.muttersprache],
              ["🌐 Weitere Sprachen", form.weitereSpachen.filter(s=>s.sprache).map(s=>`${s.sprache} (${s.niveau})`).join(", ") || "—"],
              ["🎓 Beruf", form.beruf],
              ["📜 Abschluss", form.abschluss],
              ["📚 Fachrichtung", form.fachrichtung],
              ["⏱ Erfahrung", form.erfahrung],
              ["💼 Position", form.position],
              ["🕐 Beschäftigung", form.beschaeftigung.join(", ")],
              ["🗓 Eintrittstermin", form.eintrittstermin],
              ["📋 Aufenthalt", form.aufenthalt],
              ["✅ Arbeitserlaubnis", form.arbeitserlaubnis],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", padding: "9px 0", borderBottom: "1px solid #F0F4F9", gap: 10 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6B7897", minWidth: 150, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: "0.82rem", color: "#1a1a2e" }}>{val || "—"}</span>
              </div>
            ))}

            <div style={{ marginTop: 16, marginBottom: 4, fontSize: "0.75rem", color: "#9BA8C0", textAlign: "center", lineHeight: 1.6 }}>
              Nach der Registrierung wird dein Profil von unserem Team geprüft und innerhalb von 24h freigeschaltet.
            </div>

            <button className="btn-next" style={{ background: `linear-gradient(135deg, ${GREEN}, #27AE60)`, boxShadow: "0 6px 20px rgba(30,132,73,0.32)", marginTop: 16 }} onClick={submit}>
              🚀 Jetzt kostenlos registrieren
            </button>
            <button className="btn-back" onClick={back}>← Zurück & bearbeiten</button>
          </>}

        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.78rem", color: "#9BA8C0" }}>
          🔒 Deine Daten sind sicher — DSGVO-konform gespeichert.
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(RegistrierungPage), { ssr: false });