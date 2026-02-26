"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const EINRICHTUNGSTYPEN = ["Grundschule","Sekundarschule (Sek. I)","Gymnasium","Gesamtschule","Foerderschule","Berufsschule","Kindertagesstaette (Kita)","Kinderkrippe (0-3 Jahre)","Hort / Ganztagsbetreuung","Freier Traeger","Schulamt / Jugendamt","Andere"];
const BUNDESLAENDER = ["Baden-Wuerttemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thueringen"];
const TRAEGER = ["Oeffentlich / Kommunal","Kirchlich (Caritas / Diakonie)","AWO","DRK","Paritaetischer Wohlfahrtsverband","Privat / Kommerziell","Elterninitiative","Andere"];
const FACHRICHTUNGEN = ["Mathematik","Deutsch","Englisch","Franzoesisch","Spanisch","Physik","Chemie","Biologie","Geschichte","Geografie","Sport","Kunst","Musik","Informatik","Sachkunde","DaF / DaZ","Fruehkindliche Bildung","Sonderpaedagogik","Soziale Arbeit","Andere"];
const STELLEN_ANZ = ["1","2-3","4-5","6-10","Mehr als 10"];
const POSITIONEN = ["Klassenlehrerin / -lehrer","Fachlehrerin / -lehrer","Vertretungslehrerin / -lehrer","Erzieherin / Erzieher","Gruppenleitung","Kita-Leitung","Schulbegleitung","Andere"];

const ADDONS = [
  { id: "hervorgehoben", title: "Hervorgehobenes Arbeitgeberprofil", desc: "Ihr Profil erscheint ganz oben in der Suchliste.", price: "49 EUR / Monat", priceNum: 49 },
  { id: "topplatzierung", title: "Stellenanzeige Top-Platzierung", desc: "Ihre Stellenanzeige wird 30 Tage lang ganz oben angezeigt.", price: "79 EUR / 30 Tage", priceNum: 79 },
  { id: "schnellantworten", title: "Direktkontakt-Markierung Schnell antworten", desc: "Steigert die Bewerbungsrate erheblich.", price: "29 EUR / Monat", priceNum: 29 },
];

const steps = [
  { num: 1, label: "Einrichtung", icon: "1" },
  { num: 2, label: "Adresse", icon: "2" },
  { num: 3, label: "Kontakt", icon: "3" },
  { num: 4, label: "Stellen", icon: "4" },
  { num: 5, label: "Tarif", icon: "5" },
  { num: 6, label: "Fertig", icon: "6" },
];

interface FormState {
  einrichtungName: string; einrichtungstyp: string; traeger: string; beschreibung: string;
  strasse: string; hausnummer: string; plz: string; ort: string; bundesland: string;
  ansprechName: string; ansprechRolle: string; email: string; telefon: string; passwort: string; passwort2: string;
  stellenAnzahl: string; fachrichtungen: string[]; positionen: string[];
  kartenname: string; kartennummer: string; ablauf: string; cvv: string;
}

function ArbeitgeberPage() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [payStep, setPayStep] = useState(false);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState<FormState>({
    einrichtungName: "", einrichtungstyp: "", traeger: "", beschreibung: "",
    strasse: "", hausnummer: "", plz: "", ort: "", bundesland: "",
    ansprechName: "", ansprechRolle: "", email: "", telefon: "", passwort: "", passwort2: "",
    stellenAnzahl: "", fachrichtungen: [], positionen: [],
    kartenname: "", kartennummer: "", ablauf: "", cvv: "",
  });

  const upd = (f: string, v: string | string[]) => {
    setForm((p: FormState) => ({ ...p, [f]: v }));
    setErrors((p: Record<string, string>) => ({ ...p, [f]: "" }));
  };

  const toggleArr = (field: string, val: string) => {
    setForm((p: FormState) => {
      const arr = p[field as keyof FormState] as string[];
      return { ...p, [field]: arr.includes(val) ? arr.filter((x: string) => x !== val) : [...arr, val] };
    });
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((p: string[]) => p.includes(id) ? p.filter((x: string) => x !== id) : [...p, id]);
  };

  const totalMonthly = 299 + selectedAddons.reduce((sum: number, id: string) => {
    const a = ADDONS.find((x) => x.id === id);
    return sum + (a ? a.priceNum : 0);
  }, 0);

  const validate = () => {
    const e: Record<string, string> = {};
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
      if (!form.email.includes("@")) e.email = "Bitte gueltige E-Mail eingeben";
      if (form.passwort.length < 6) e.passwort = "Mindestens 6 Zeichen";
      if (form.passwort !== form.passwort2) e.passwort2 = "Passwoerter stimmen nicht ueberein";
    }
    if (step === 4) {
      if (!form.stellenAnzahl) e.stellenAnzahl = "Pflichtfeld";
      if (form.fachrichtungen.length === 0) e.fachrichtungen = "Bitte mindestens eine Fachrichtung waehlen";
    }
    if (step === 5 && payStep) {
      if (!form.kartenname.trim()) e.kartenname = "Pflichtfeld";
      if (form.kartennummer.replace(/\s/g, "").length < 16) e.kartennummer = "Bitte gueltige Kartennummer eingeben";
      if (!form.ablauf.trim()) e.ablauf = "Pflichtfeld";
      if (form.cvv.length < 3) e.cvv = "Bitte gueltigen CVV eingeben";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s: number) => s + 1); };
  const back = () => { setPayStep(false); setStep((s: number) => s - 1); };
  const handlePay = () => {
    if (!payStep) { setPayStep(true); return; }
    if (!validate()) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); setDone(true); }, 2200);
  };

  const formatKarte = (val: string) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatAblauf = (val: string) => {
    const c = val.replace(/\D/g, "").slice(0, 4);
    return c.length >= 2 ? c.slice(0, 2) + "/" + c.slice(2) : c;
  };

  const inp = (f: string) => ({
    width: "100%", padding: "12px 15px", borderRadius: 11,
    border: `1.5px solid ${errors[f] ? "#E74C3C" : "#E8EDF4"}`,
    fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif",
    outline: "none", color: "#1a1a2e", background: "white", transition: "border-color 0.2s",
  });
  const sel = (f: string) => ({ ...inp(f), appearance: "none" as const, cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7897' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat" as const, backgroundPosition: "right 14px center" });
  const lbl: React.CSSProperties = { fontSize: "0.8rem", fontWeight: 700, color: NAVY, marginBottom: 5, display: "block", letterSpacing: 0.3 };
  const errEl = (f: string) => errors[f] ? <div style={{ fontSize: "0.73rem", color: "#E74C3C", marginTop: 3 }}>Fehler: {errors[f]}</div> : null;
  const fw = { marginBottom: 18 };
  const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 };

  if (done) return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, #0D3B2E, ${GREEN})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div style={{ background: "white", borderRadius: 28, padding: "52px 44px", textAlign: "center", maxWidth: 520, width: "100%", boxShadow: "0 30px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", color: NAVY, marginBottom: 10 }}>Willkommen bei KitaBridge!</div>
        <p style={{ color: "#6B7897", fontSize: "0.92rem", lineHeight: 1.75, marginBottom: 24 }}>
          <strong>{form.einrichtungName}</strong> ist jetzt aktiv. Sie haben sofort Zugang zu allen Fachkraft-Profilen.
        </p>
        <div style={{ background: "#EAF7EF", borderRadius: 14, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
          <div style={{ fontSize: "0.83rem", color: "#333", marginBottom: 5 }}>Einrichtung: {form.einrichtungName}</div>
          <div style={{ fontSize: "0.83rem", color: "#333", marginBottom: 5 }}>Ort: {form.ort}, {form.bundesland}</div>
          <div style={{ fontSize: "0.83rem", color: "#333", marginBottom: 5 }}>Kontakt: {form.ansprechName}</div>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: NAVY, marginTop: 8, borderTop: "1px solid #D5F5E3", paddingTop: 8 }}>
            Gesamt: {totalMonthly} EUR / Monat (zzgl. MwSt.)
          </div>
        </div>
        <a href="/" style={{ padding: "12px 24px", borderRadius: 50, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>Zur Homepage</a>
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
        .addon-card { border-radius: 16px; padding: 18px; border: 2px solid #E8EDF4; background: white; cursor: pointer; transition: all 0.25s; display: flex; gap: 14px; align-items: flex-start; margin-bottom: 12px; }
        .addon-card:hover { border-color: ${BLUE}; }
        .addon-card.on { border-color: ${GREEN}; background: #F0FBF4; }
        @media (max-width: 600px) { .form-wrap { padding: 24px 18px !important; } }
      `}</style>

      <div style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "0 32px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, textDecoration: "none" }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </a>
        <div style={{ fontSize: "0.82rem", color: "#6B7897" }}>
          Bereits registriert? <a href="#" style={{ color: BLUE, fontWeight: 600 }}>Anmelden</a>
        </div>
      </div>

      <div style={{ height: 3, background: "#E8EDF4" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${NAVY}, ${GREEN})`, transition: "width 0.4s ease" }}/>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 16px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 800, color: NAVY, marginBottom: 6 }}>Arbeitgeber-Registrierung</h1>
          <p style={{ color: "#6B7897", fontSize: "0.88rem" }}>Schritt {step} von {steps.length} - {steps[step - 1].label}</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, marginBottom: 32 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: step > s.num ? GREEN : step === s.num ? NAVY : "#E8EDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", color: step >= s.num ? "white" : "#9BA8C0", fontWeight: 700, transition: "all 0.3s" }}>
                  {step > s.num ? "✓" : s.icon}
                </div>
                <span style={{ fontSize: "0.62rem", fontWeight: 600, color: step === s.num ? NAVY : "#B0BAD0", whiteSpace: "nowrap" }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 24, height: 2, background: step > s.num ? GREEN : "#E8EDF4", margin: "0 3px", marginBottom: 18, transition: "background 0.3s" }}/>}
            </div>
          ))}
        </div>

        <div className="form-wrap" style={{ background: "white", borderRadius: 22, padding: "32px 32px", boxShadow: "0 8px 40px rgba(26,63,111,0.09)", border: "1px solid #E8EDF4" }}>

          {step === 1 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>Ihre Einrichtung</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Grunddaten Ihrer Schule, Kita oder Ihres Traegers.</p>
            <div style={fw}><label style={lbl}>Name der Einrichtung *</label><input style={inp("einrichtungName")} value={form.einrichtungName} onChange={(e) => upd("einrichtungName", e.target.value)} placeholder="z.B. Grundschule Am Stadtpark"/>{errEl("einrichtungName")}</div>
            <div style={grid2}>
              <div><label style={lbl}>Einrichtungstyp *</label><select style={sel("einrichtungstyp")} value={form.einrichtungstyp} onChange={(e) => upd("einrichtungstyp", e.target.value)}><option value="">Bitte waehlen</option>{EINRICHTUNGSTYPEN.map((t) => <option key={t}>{t}</option>)}</select>{errEl("einrichtungstyp")}</div>
              <div><label style={lbl}>Traegerschaft *</label><select style={sel("traeger")} value={form.traeger} onChange={(e) => upd("traeger", e.target.value)}><option value="">Bitte waehlen</option>{TRAEGER.map((t) => <option key={t}>{t}</option>)}</select>{errEl("traeger")}</div>
            </div>
            <div style={fw}><label style={lbl}>Kurzbeschreibung (optional)</label><textarea style={{ ...inp("beschreibung"), resize: "vertical", minHeight: 90 }} maxLength={400} value={form.beschreibung} onChange={(e) => upd("beschreibung", e.target.value)} placeholder="z.B. Offene Ganztagesgrundschule..."/><div style={{ fontSize: "0.72rem", color: "#9BA8C0", marginTop: 3 }}>{form.beschreibung.length}/400</div></div>
            <button className="btn-next" onClick={next}>Weiter</button>
          </>}

          {step === 2 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>Adresse</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Wo befindet sich Ihre Einrichtung?</p>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 18 }}>
              <div><label style={lbl}>Strasse *</label><input style={inp("strasse")} value={form.strasse} onChange={(e) => upd("strasse", e.target.value)} placeholder="z.B. Hauptstrasse"/>{errEl("strasse")}</div>
              <div><label style={lbl}>Nr.</label><input style={inp("hausnummer")} value={form.hausnummer} onChange={(e) => upd("hausnummer", e.target.value)} placeholder="12a"/></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14, marginBottom: 18 }}>
              <div><label style={lbl}>PLZ *</label><input style={inp("plz")} value={form.plz} onChange={(e) => upd("plz", e.target.value.slice(0,5))} placeholder="10115" maxLength={5}/>{errEl("plz")}</div>
              <div><label style={lbl}>Ort *</label><input style={inp("ort")} value={form.ort} onChange={(e) => upd("ort", e.target.value)} placeholder="z.B. Berlin"/>{errEl("ort")}</div>
            </div>
            <div style={fw}><label style={lbl}>Bundesland *</label><select style={sel("bundesland")} value={form.bundesland} onChange={(e) => upd("bundesland", e.target.value)}><option value="">Bundesland waehlen</option>{BUNDESLAENDER.map((b) => <option key={b}>{b}</option>)}</select>{errEl("bundesland")}</div>
            <button className="btn-next" onClick={next}>Weiter</button>
            <button className="btn-back" onClick={back}>Zurueck</button>
          </>}

          {step === 3 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>Ansprechpartner und Account</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Mit diesen Daten koennen Sie sich spaeter anmelden.</p>
            <div style={grid2}>
              <div><label style={lbl}>Name *</label><input style={inp("ansprechName")} value={form.ansprechName} onChange={(e) => upd("ansprechName", e.target.value)} placeholder="z.B. Maria Mueller"/>{errEl("ansprechName")}</div>
              <div><label style={lbl}>Rolle</label><input style={inp("ansprechRolle")} value={form.ansprechRolle} onChange={(e) => upd("ansprechRolle", e.target.value)} placeholder="z.B. Schulleiterin"/></div>
            </div>
            <div style={grid2}>
              <div><label style={lbl}>E-Mail *</label><input style={inp("email")} type="email" value={form.email} onChange={(e) => upd("email", e.target.value)} placeholder="schule@email.de"/>{errEl("email")}</div>
              <div><label style={lbl}>Telefon</label><input style={inp("telefon")} value={form.telefon} onChange={(e) => upd("telefon", e.target.value)} placeholder="030 12345678"/></div>
            </div>
            <div style={grid2}>
              <div><label style={lbl}>Passwort * (min. 6)</label><input style={inp("passwort")} type="password" value={form.passwort} onChange={(e) => upd("passwort", e.target.value)} placeholder=""/>{errEl("passwort")}</div>
              <div><label style={lbl}>Wiederholen *</label><input style={inp("passwort2")} type="password" value={form.passwort2} onChange={(e) => upd("passwort2", e.target.value)} placeholder=""/>{errEl("passwort2")}</div>
            </div>
            <button className="btn-next" onClick={next}>Weiter</button>
            <button className="btn-back" onClick={back}>Zurueck</button>
          </>}

          {step === 4 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>Gesuchte Stellen</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 24 }}>Welche Fachkraefte suchen Sie?</p>
            <div style={fw}>
              <label style={lbl}>Anzahl *</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {STELLEN_ANZ.map((a) => <button key={a} className={`pill-btn ${form.stellenAnzahl === a ? "on" : ""}`} onClick={() => upd("stellenAnzahl", a)}>{a}</button>)}
              </div>{errEl("stellenAnzahl")}
            </div>
            <div style={fw}>
              <label style={lbl}>Fachrichtungen * (Mehrfachwahl)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {FACHRICHTUNGEN.map((f) => <button key={f} className={`pill-btn ${form.fachrichtungen.includes(f) ? "on" : ""}`} onClick={() => toggleArr("fachrichtungen", f)}>{form.fachrichtungen.includes(f) ? "✓ " : ""}{f}</button>)}
              </div>{errEl("fachrichtungen")}
            </div>
            <div style={fw}>
              <label style={lbl}>Positionen (optional)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {POSITIONEN.map((p) => <button key={p} className={`pill-btn ${form.positionen.includes(p) ? "on" : ""}`} onClick={() => toggleArr("positionen", p)}>{form.positionen.includes(p) ? "✓ " : ""}{p}</button>)}
              </div>
            </div>
            <button className="btn-next" onClick={next}>Weiter</button>
            <button className="btn-back" onClick={back}>Zurueck</button>
          </>}

          {step === 5 && <>
            {!payStep ? (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>Ihr Tarif</h2>
                <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 20 }}>Ein Plan. Volle Kontrolle. Keine Provision.</p>
                <div style={{ borderRadius: 18, border: `2px solid ${GREEN}`, background: "linear-gradient(135deg, #F0FBF4, #FFFFFF)", padding: "24px", marginBottom: 24, position: "relative" }}>
                  <div style={{ position: "absolute", top: -13, left: 24, background: GREEN, color: "white", padding: "4px 16px", borderRadius: 50, fontSize: "0.75rem", fontWeight: 700 }}>Hauptplan</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: NAVY, marginBottom: 4 }}>Monatlicher Zugang</div>
                      <div style={{ fontSize: "0.83rem", color: "#6B7897", marginBottom: 14, lineHeight: 1.6 }}>Direkter Zugang zu qualifizierten Fachkraeften ohne Provision.</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 16px" }}>
                        {["Alle Fachkraefte-Profile","Unbegrenzte Suche","Direktkontakt","Nachrichtenfunktion","Keine Provision","Monatlich kuendbar","Rechnung mit MwSt.","Keine Einrichtungsgebuehr"].map((f) => (
                          <div key={f} style={{ fontSize: "0.77rem", color: "#333", display: "flex", gap: 5 }}>
                            <span style={{ color: GREEN, fontWeight: 700 }}>+</span>{f}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: NAVY }}>299 EUR</div>
                      <div style={{ fontSize: "0.77rem", color: "#9BA8C0" }}>/ Monat zzgl. MwSt.</div>
                    </div>
                  </div>
                </div>
                <label style={{ ...lbl, marginBottom: 12 }}>Optionale Add-ons</label>
                {ADDONS.map((addon) => (
                  <div key={addon.id} className={`addon-card ${selectedAddons.includes(addon.id) ? "on" : ""}`} onClick={() => toggleAddon(addon.id)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.86rem", color: NAVY, marginBottom: 2 }}>{addon.title}</div>
                      <div style={{ fontSize: "0.77rem", color: "#6B7897", lineHeight: 1.5 }}>{addon.desc}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.86rem", color: selectedAddons.includes(addon.id) ? GREEN : NAVY }}>{addon.price}</div>
                      <div style={{ marginTop: 6, width: 22, height: 22, borderRadius: 6, border: `2px solid ${selectedAddons.includes(addon.id) ? GREEN : "#C0C8D8"}`, background: selectedAddons.includes(addon.id) ? GREEN : "white", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto" }}>
                        {selectedAddons.includes(addon.id) && <span style={{ color: "white", fontSize: "0.7rem", fontWeight: 700 }}>✓</span>}
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ background: "#F0F4F9", borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, color: NAVY }}>Gesamt: {totalMonthly} EUR / Monat</div>
                  <div style={{ fontSize: "0.75rem", color: "#9BA8C0" }}>zzgl. MwSt.</div>
                </div>
                <button className="btn-next" onClick={() => { if (validate()) setPayStep(true); }}>Weiter zur Zahlung</button>
                <button className="btn-back" onClick={back}>Zurueck</button>
              </>
            ) : (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>Zahlungsdaten</h2>
                <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 16 }}>Monatlicher Zugang - <strong>{totalMonthly} EUR / Monat</strong> (zzgl. MwSt.)</p>
                <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 16, padding: "20px 22px", marginBottom: 22 }}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", marginBottom: 16 }}>KREDITKARTE</div>
                  <div style={{ color: "white", fontSize: "1.1rem", fontWeight: 600, letterSpacing: 3, marginBottom: 16 }}>{form.kartennummer || ".... .... .... ...."}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem" }}>KARTENINHABER</div><div style={{ color: "white", fontSize: "0.85rem" }}>{form.kartenname || "-"}</div></div>
                    <div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem" }}>GUELTIG BIS</div><div style={{ color: "white", fontSize: "0.85rem" }}>{form.ablauf || "MM/JJ"}</div></div>
                  </div>
                </div>
                <div style={fw}><label style={lbl}>Name auf der Karte *</label><input style={inp("kartenname")} value={form.kartenname} onChange={(e) => upd("kartenname", e.target.value.toUpperCase())} placeholder="MARIA MUELLER"/>{errEl("kartenname")}</div>
                <div style={fw}><label style={lbl}>Kartennummer *</label><input style={inp("kartennummer")} value={form.kartennummer} onChange={(e) => upd("kartennummer", formatKarte(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19}/>{errEl("kartennummer")}</div>
                <div style={grid2}>
                  <div><label style={lbl}>Ablaufdatum *</label><input style={inp("ablauf")} value={form.ablauf} onChange={(e) => upd("ablauf", formatAblauf(e.target.value))} placeholder="MM/JJ" maxLength={5}/>{errEl("ablauf")}</div>
                  <div><label style={lbl}>CVV *</label><input style={inp("cvv")} value={form.cvv} onChange={(e) => upd("cvv", e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="123" maxLength={4} type="password"/>{errEl("cvv")}</div>
                </div>
                <button className="btn-next" style={{ background: `linear-gradient(135deg, ${GREEN}, #27AE60)` }} onClick={handlePay} disabled={paying}>
                  {paying ? "Wird verarbeitet..." : `Jetzt ${totalMonthly} EUR / Monat starten`}
                </button>
                <button className="btn-back" onClick={() => setPayStep(false)}>Zurueck zur Tarifauswahl</button>
              </>
            )}
          </>}

          {step === 6 && <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: NAVY, marginBottom: 4 }}>Zusammenfassung</h2>
            <p style={{ color: "#6B7897", fontSize: "0.83rem", marginBottom: 20 }}>Bitte ueberpruefen Sie Ihre Angaben.</p>
            {[
              ["Einrichtung", form.einrichtungName],
              ["Typ", form.einrichtungstyp],
              ["Traeger", form.traeger],
              ["Adresse", `${form.strasse} ${form.hausnummer}, ${form.plz} ${form.ort}`],
              ["Bundesland", form.bundesland],
              ["Ansprechpartner", form.ansprechName],
              ["E-Mail", form.email],
              ["Stellen", form.stellenAnzahl],
              ["Fachrichtungen", form.fachrichtungen.join(", ")],
              ["Plan", "299 EUR / Monat"],
              ["Add-ons", selectedAddons.length > 0 ? selectedAddons.map((id) => ADDONS.find((a) => a.id === id)?.title).join(", ") : "Keine"],
              ["Gesamt", `${totalMonthly} EUR / Monat (zzgl. MwSt.)`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", padding: "9px 0", borderBottom: "1px solid #F0F4F9", gap: 10 }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#6B7897", minWidth: 160, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: "0.82rem", color: "#1a1a2e" }}>{val || "-"}</span>
              </div>
            ))}
            <button className="btn-next" style={{ background: `linear-gradient(135deg, ${GREEN}, #27AE60)`, marginTop: 16 }} onClick={() => setDone(true)}>
              Registrierung abschliessen
            </button>
            <button className="btn-back" onClick={back}>Zurueck</button>
          </>}

        </div>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.78rem", color: "#9BA8C0" }}>
          DSGVO-konform - Monatlich kuendbar - Keine Einrichtungsgebuehr
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ArbeitgeberPage), { ssr: false });