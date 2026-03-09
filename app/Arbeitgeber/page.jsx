"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const translations = {
  de: {
    steps: ["Einrichtung","Adresse","Ansprechpartner","Stellen","Plan","Passwort","Abschluss"],
    stepOf: (s, t) => `Schritt ${s} von ${t}`,
    fillAll: "Bitte fülle alle Felder aus",
    back: "Zurück",
    next: "Weiter",
    saving: "Wird gespeichert...",
    toPayment: "Weiter zur Bezahlung →",
    step0: {
      title: "Einrichtung",
      nameLabel: "Name der Einrichtung *", namePlaceholder: "Kita Sonnenschein",
      typeLabel: "Einrichtungstyp *",
      types: ["Krippe (0-3 Jahre)","Kindergarten (3-6 Jahre)","Kita (0-6 Jahre)","Hort (6-12 Jahre)","Integrationskita","Waldkita","Montessori Kita","Betriebskita"],
      traegerLabel: "Träger *",
      traegers: ["Öffentlich (kommunal)","AWO","Caritas","Diakonie","DRK","Paritätischer Wohlfahrtsverband","Privat / Eigenträger","Sonstiger freier Träger"],
      descLabel: "Kurzbeschreibung der Einrichtung", descPlaceholder: "Beschreiben Sie kurz Ihre Einrichtung...",
      select: "Bitte wählen",
    },
    step1: {
      title: "Adresse",
      streetLabel: "Straße *", streetPlaceholder: "Musterstraße",
      numLabel: "Hausnummer *", numPlaceholder: "12a",
      plzLabel: "PLZ *", plzPlaceholder: "10115",
      cityLabel: "Ort *", cityPlaceholder: "Berlin",
      stateLabel: "Bundesland *",
      states: ["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"],
      select: "Bitte wählen",
    },
    step2: {
      title: "Ansprechpartner",
      nameLabel: "Name des Ansprechpartners *", namePlaceholder: "Maria Mustermann",
      roleLabel: "Rolle / Position",
      roles: ["Kita-Leitung","Stellv. Leitung","Träger-Geschäftsführung","HR / Personal","Sonstiges"],
      emailLabel: "E-Mail Adresse *", emailPlaceholder: "leitung@kita-sonnenschein.de",
      phoneLabel: "Telefonnummer", phonePlaceholder: "+49 30 123456",
      select: "Bitte wählen",
    },
    step3: {
      title: "Stellen",
      anzahlLabel: "Anzahl offener Stellen *",
      anzahls: ["1 Stelle","2-3 Stellen","4-5 Stellen","6-10 Stellen","Mehr als 10 Stellen"],
      jobsLabel: "Gesuchte Berufe",
      jobs: ["Erzieherin / Erzieher","Kinderpflegerin / Kinderpfleger","Sozialpädagogin / Sozialpädagoge","Heilpädagogin / Heilpädagoge","Kita-Leitung","Praktikant / FSJ"],
      typeLabel: "Beschäftigungsart",
      types: ["Vollzeit","Teilzeit","Minijob","Vertretung"],
      select: "Bitte wählen",
    },
    step4: {
      title: "Plan",
      planLabel: "Hauptplan",
      perMonth: "pro Monat, zzgl. MwSt.",
      features: ["Alle Fachkräfte-Profile","Direktkontakt","Unbegrenzte Suche","Keine Provision","Monatlich kündbar"],
      note: "✓ Keine versteckten Kosten. Keine Provision. Monatlich kündbar.",
    },
    step5: {
      title: "Passwort",
      hint: "Mit diesem Passwort können Sie sich später auf KitaBridge einloggen und Fachkräfte suchen.",
      passLabel: "Passwort erstellen *", passPlaceholder: "Mindestens 6 Zeichen",
      pass2Label: "Passwort wiederholen *", pass2Placeholder: "Passwort wiederholen",
      mismatch: "Passwörter stimmen nicht überein",
    },
    step6: {
      title: "Abschluss",
      summary: "Zusammenfassung",
      fields: ["Einrichtung","Typ","Ort","Ansprechpartner","E-Mail","Offene Stellen","Plan"],
      agbText: (a) => <>Ich stimme den <a href="/agb" style={{ color: BLUE }}>{a}</a> zu *</>,
      agbLabel: "Allgemeinen Geschäftsbedingungen",
      dsgvoText: (a) => <>Ich habe die <a href="/datenschutz" style={{ color: BLUE }}>{a}</a> gelesen und stimme zu *</>,
      dsgvoLabel: "Datenschutzerklärung",
      paymentNote: "💳 Nach der Registrierung werden Sie zur sicheren Bezahlung weitergeleitet (299 EUR/Monat via Stripe).",
    },
    errors: {
      passMatch: "Passwörter stimmen nicht überein!",
      passLength: "Passwort muss mindestens 6 Zeichen lang sein!",
      authError: "Fehler: ",
    },
  },
  en: {
    steps: ["Facility","Address","Contact","Positions","Plan","Password","Summary"],
    stepOf: (s, t) => `Step ${s} of ${t}`,
    fillAll: "Please fill in all fields",
    back: "Back",
    next: "Next",
    saving: "Saving...",
    toPayment: "Proceed to Payment →",
    step0: {
      title: "Facility",
      nameLabel: "Facility Name *", namePlaceholder: "Sunshine Daycare",
      typeLabel: "Facility Type *",
      types: ["Nursery (0-3 years)","Kindergarten (3-6 years)","Daycare (0-6 years)","After-school care (6-12 years)","Integration daycare","Forest kindergarten","Montessori daycare","Company daycare"],
      traegerLabel: "Provider *",
      traegers: ["Public (municipal)","AWO","Caritas","Diakonie","DRK","Paritätischer Wohlfahrtsverband","Private","Other provider"],
      descLabel: "Brief description of your facility", descPlaceholder: "Briefly describe your facility...",
      select: "Please select",
    },
    step1: {
      title: "Address",
      streetLabel: "Street *", streetPlaceholder: "Example Street",
      numLabel: "Number *", numPlaceholder: "12a",
      plzLabel: "Postal Code *", plzPlaceholder: "10115",
      cityLabel: "City *", cityPlaceholder: "Berlin",
      stateLabel: "Federal State *",
      states: ["Baden-Württemberg","Bavaria","Berlin","Brandenburg","Bremen","Hamburg","Hesse","Mecklenburg-Vorpommern","Lower Saxony","North Rhine-Westphalia","Rhineland-Palatinate","Saarland","Saxony","Saxony-Anhalt","Schleswig-Holstein","Thuringia"],
      select: "Please select",
    },
    step2: {
      title: "Contact Person",
      nameLabel: "Contact Person Name *", namePlaceholder: "Maria Smith",
      roleLabel: "Role / Position",
      roles: ["Daycare Manager","Deputy Manager","Provider CEO","HR / Personnel","Other"],
      emailLabel: "Email Address *", emailPlaceholder: "manager@sunshine-daycare.de",
      phoneLabel: "Phone Number", phonePlaceholder: "+49 30 123456",
      select: "Please select",
    },
    step3: {
      title: "Open Positions",
      anzahlLabel: "Number of Open Positions *",
      anzahls: ["1 position","2-3 positions","4-5 positions","6-10 positions","More than 10 positions"],
      jobsLabel: "Sought Professions",
      jobs: ["Educator (Erzieherin/Erzieher)","Childcare worker (Kinderpfleger)","Social pedagogue","Special needs educator","Daycare manager","Intern / Volunteer"],
      typeLabel: "Employment Type",
      types: ["Full-time","Part-time","Mini-job","Substitute"],
      select: "Please select",
    },
    step4: {
      title: "Plan",
      planLabel: "Main Plan",
      perMonth: "per month, excl. VAT",
      features: ["All professional profiles","Direct contact","Unlimited search","No commission","Cancel monthly"],
      note: "✓ No hidden costs. No commission. Cancel monthly.",
    },
    step5: {
      title: "Password",
      hint: "You will use this password to log in to KitaBridge and search for professionals.",
      passLabel: "Create Password *", passPlaceholder: "At least 6 characters",
      pass2Label: "Repeat Password *", pass2Placeholder: "Repeat password",
      mismatch: "Passwords do not match",
    },
    step6: {
      title: "Summary",
      summary: "Summary",
      fields: ["Facility","Type","Location","Contact","Email","Open Positions","Plan"],
      agbText: (a) => <>I agree to the <a href="/agb" style={{ color: BLUE }}>{a}</a> *</>,
      agbLabel: "Terms and Conditions",
      dsgvoText: (a) => <>I have read and agree to the <a href="/datenschutz" style={{ color: BLUE }}>{a}</a> *</>,
      dsgvoLabel: "Privacy Policy",
      paymentNote: "💳 After registration you will be redirected to secure payment (€299/month via Stripe).",
    },
    errors: {
      passMatch: "Passwords do not match!",
      passLength: "Password must be at least 6 characters!",
      authError: "Error: ",
    },
  },
};

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
  color: "#1a1a2e", background: "white", marginBottom: 4, boxSizing: "border-box"
};
const labelStyle = { display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#4A5568", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 };
const selectStyle = { ...inputStyle, cursor: "pointer" };

export default function Arbeitgeber() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("de");
  const t = translations[lang];
  const STEPS = t.steps;

  const [form, setForm] = useState({
    einrichtung_name: "", einrichtungstyp: "", traeger: "", beschreibung: "",
    strasse: "", hausnummer: "", plz: "", ort: "", bundesland: "",
    ansprech_name: "", ansprech_rolle: "", email: "", telefon: "",
    passwort: "", passwort2: "",
    stellen_anzahl: "", fachrichtungen: [], positionen: [],
    agb: false, datenschutz: false
  });

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const toggleArr = (key, val) => {
    const arr = form[key];
    set(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleSubmit = async () => {
    if (!form.agb || !form.datenschutz) return;
    if (form.passwort !== form.passwort2) { alert(t.errors.passMatch); return; }
    if (form.passwort.length < 6) { alert(t.errors.passLength); return; }
    setLoading(true);

    // User server-seitig erstellen (sofort bestätigt, kein Email-Confirm nötig)
    const createRes = await fetch("/api/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.passwort,
        einrichtung_name: form.einrichtung_name
      })
    });
    const createData = await createRes.json();

    if (createData.error) {
      setLoading(false);
      alert(t.errors.authError + createData.error);
      return;
    }

    // Sofort einloggen
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.passwort
    });

    if (loginError) {
      setLoading(false);
      alert(t.errors.authError + loginError.message);
      return;
    }

    // Arbeitgeber-Daten speichern
    const { data: insertedData, error } = await supabase.from("arbeitgeber").insert([{
      einrichtung_name: form.einrichtung_name, einrichtungstyp: form.einrichtungstyp,
      traeger: form.traeger, beschreibung: form.beschreibung,
      strasse: form.strasse, hausnummer: form.hausnummer, plz: form.plz, ort: form.ort,
      bundesland: form.bundesland, ansprech_name: form.ansprech_name,
      ansprech_rolle: form.ansprech_rolle, email: form.email, telefon: form.telefon,
      stellen_anzahl: form.stellen_anzahl, fachrichtungen: form.fachrichtungen,
      positionen: form.positionen, status: "neu"
    }]).select().single();

    if (error) { setLoading(false); alert(t.errors.authError + error.message); return; }

    await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "arbeitgeber", data: form }) });
    await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "willkommen_arbeitgeber", data: { ...form, id: insertedData.id } }) });

    setLoading(false);
    router.push(`/bezahlung?id=${insertedData.id}&email=${encodeURIComponent(form.email)}&name=${encodeURIComponent(form.einrichtung_name)}`);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F0F4F9, #EAF7EF)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: ${BLUE} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.1); }
        .lang-btn { background: none; border: 1.5px solid #E8EDF4; border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 0.8rem; font-weight: 700; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 6px; transition: all 0.2s; color: #444; }
        .lang-btn:hover { border-color: #1A3F6F; }
        .lang-btn.active { border-color: #1A3F6F; background: #EEF2FF; color: #1A3F6F; }
        .flag-img { width: 20px; height: 14px; border-radius: 2px; object-fit: cover; }
        @media (max-width: 600px) {
          .ag-header { padding: 14px 16px !important; }
          .ag-container { padding: 24px 16px !important; }
          .ag-card { padding: 24px 18px !important; }
          .three-one-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .one-two-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .checkbox-grid { grid-template-columns: 1fr !important; }
          .nav-btns-row { flex-direction: column !important; gap: 10px !important; }
          .nav-btns-row button { width: 100% !important; }
          .price-num { font-size: 2.2rem !important; }
        }
      `}</style>

      <div className="ag-header" style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button className={`lang-btn${lang === "de" ? " active" : ""}`} onClick={() => setLang("de")}>
              <img className="flag-img" src="https://flagcdn.com/w20/de.png" alt="DE" /> DE
            </button>
            <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>
              <img className="flag-img" src="https://flagcdn.com/w20/gb.png" alt="EN" /> EN
            </button>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#6B7897" }}>{t.stepOf(step + 1, STEPS.length)}</div>
        </div>
      </div>

      <div className="ag-container" style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY }}>{STEPS[step]}</span>
            <span style={{ fontSize: "0.8rem", color: "#9BA8C0" }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 6, background: "#E8EDF4", borderRadius: 10 }}>
            <div style={{ height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${NAVY}, ${BLUE})`, width: `${progress}%`, transition: "width 0.4s" }}/>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 10, background: i <= step ? NAVY : "#E8EDF4", transition: "background 0.3s" }}/>
            ))}
          </div>
        </div>

        <div className="ag-card" style={{ background: "white", borderRadius: 24, padding: 36, boxShadow: "0 8px 40px rgba(26,63,111,0.1)", border: "1px solid #E8EDF4" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: NAVY, marginBottom: 8 }}>{STEPS[step]}</h2>
          <p style={{ color: "#9BA8C0", fontSize: "0.85rem", marginBottom: 28 }}>{t.fillAll}</p>

          {step === 0 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{t.step0.nameLabel}</label>
                <input style={inputStyle} value={form.einrichtung_name} onChange={e => set("einrichtung_name", e.target.value)} placeholder={t.step0.namePlaceholder}/>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{t.step0.typeLabel}</label>
                <select style={selectStyle} value={form.einrichtungstyp} onChange={e => set("einrichtungstyp", e.target.value)}>
                  <option value="">{t.step0.select}</option>
                  {t.step0.types.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{t.step0.traegerLabel}</label>
                <select style={selectStyle} value={form.traeger} onChange={e => set("traeger", e.target.value)}>
                  <option value="">{t.step0.select}</option>
                  {t.step0.traegers.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t.step0.descLabel}</label>
                <textarea style={{ ...inputStyle, height: 100, resize: "vertical" }} value={form.beschreibung} onChange={e => set("beschreibung", e.target.value)} placeholder={t.step0.descPlaceholder}/>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="three-one-grid" style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>{t.step1.streetLabel}</label>
                  <input style={inputStyle} value={form.strasse} onChange={e => set("strasse", e.target.value)} placeholder={t.step1.streetPlaceholder}/>
                </div>
                <div>
                  <label style={labelStyle}>{t.step1.numLabel}</label>
                  <input style={inputStyle} value={form.hausnummer} onChange={e => set("hausnummer", e.target.value)} placeholder={t.step1.numPlaceholder}/>
                </div>
              </div>
              <div className="one-two-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>{t.step1.plzLabel}</label>
                  <input style={inputStyle} value={form.plz} onChange={e => set("plz", e.target.value)} placeholder={t.step1.plzPlaceholder}/>
                </div>
                <div>
                  <label style={labelStyle}>{t.step1.cityLabel}</label>
                  <input style={inputStyle} value={form.ort} onChange={e => set("ort", e.target.value)} placeholder={t.step1.cityPlaceholder}/>
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t.step1.stateLabel}</label>
                <select style={selectStyle} value={form.bundesland} onChange={e => set("bundesland", e.target.value)}>
                  <option value="">{t.step1.select}</option>
                  {t.step1.states.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{t.step2.nameLabel}</label>
                <input style={inputStyle} value={form.ansprech_name} onChange={e => set("ansprech_name", e.target.value)} placeholder={t.step2.namePlaceholder}/>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{t.step2.roleLabel}</label>
                <select style={selectStyle} value={form.ansprech_rolle} onChange={e => set("ansprech_rolle", e.target.value)}>
                  <option value="">{t.step2.select}</option>
                  {t.step2.roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{t.step2.emailLabel}</label>
                <input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder={t.step2.emailPlaceholder}/>
              </div>
              <div>
                <label style={labelStyle}>{t.step2.phoneLabel}</label>
                <input style={inputStyle} value={form.telefon} onChange={e => set("telefon", e.target.value)} placeholder={t.step2.phonePlaceholder}/>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{t.step3.anzahlLabel}</label>
                <select style={selectStyle} value={form.stellen_anzahl} onChange={e => set("stellen_anzahl", e.target.value)}>
                  <option value="">{t.step3.select}</option>
                  {t.step3.anzahls.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{t.step3.jobsLabel}</label>
                <div className="checkbox-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {t.step3.jobs.map(f => (
                    <label key={f} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: form.fachrichtungen.includes(f) ? "#EAF7EF" : "white" }}>
                      <input type="checkbox" checked={form.fachrichtungen.includes(f)} onChange={() => toggleArr("fachrichtungen", f)} style={{ accentColor: GREEN }}/>
                      {f}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t.step3.typeLabel}</label>
                <div className="checkbox-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {t.step3.types.map(p => (
                    <label key={p} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: form.positionen.includes(p) ? "#EAF7EF" : "white" }}>
                      <input type="checkbox" checked={form.positionen.includes(p)} onChange={() => toggleArr("positionen", p)} style={{ accentColor: GREEN }}/>
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 20, padding: 28, color: "white", marginBottom: 16 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.step4.planLabel}</div>
                <div className="price-num" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700 }}>299 EUR</div>
                <div style={{ opacity: 0.7, fontSize: "0.82rem", marginBottom: 16 }}>{t.step4.perMonth}</div>
                {t.step4.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: "0.85rem" }}>
                    <span style={{ color: "#27AE60" }}>+</span> {f}
                  </div>
                ))}
              </div>
              <div style={{ background: "#EAF7EF", borderRadius: 12, padding: 16, fontSize: "0.85rem", color: "#1E8449", fontWeight: 600 }}>
                {t.step4.note}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div style={{ background: "#F0F4F9", borderRadius: 12, padding: 16, marginBottom: 20, fontSize: "0.85rem", color: "#6B7897" }}>
                {t.step5.hint}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{t.step5.passLabel}</label>
                <input style={inputStyle} type="password" value={form.passwort} onChange={e => set("passwort", e.target.value)} placeholder={t.step5.passPlaceholder}/>
              </div>
              <div>
                <label style={labelStyle}>{t.step5.pass2Label}</label>
                <input style={inputStyle} type="password" value={form.passwort2} onChange={e => set("passwort2", e.target.value)} placeholder={t.step5.pass2Placeholder}/>
              </div>
              {form.passwort && form.passwort2 && form.passwort !== form.passwort2 && (
                <div style={{ color: "#DC2626", fontSize: "0.82rem", marginTop: 8 }}>{t.step5.mismatch}</div>
              )}
            </div>
          )}

          {step === 6 && (
            <div>
              <div style={{ background: "#F8FAFF", borderRadius: 16, padding: 20, marginBottom: 24 }}>
                <h3 style={{ color: NAVY, fontSize: "0.95rem", fontWeight: 700, marginBottom: 12 }}>{t.step6.summary}</h3>
                {[
                  [t.step6.fields[0], form.einrichtung_name],
                  [t.step6.fields[1], form.einrichtungstyp],
                  [t.step6.fields[2], `${form.plz} ${form.ort}`],
                  [t.step6.fields[3], form.ansprech_name],
                  [t.step6.fields[4], form.email],
                  [t.step6.fields[5], form.stellen_anzahl],
                  [t.step6.fields[6], "299 EUR/Monat"],
                ].map(([k, v]) => v ? (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #E8EDF4", fontSize: "0.85rem", gap: 8 }}>
                    <span style={{ color: "#9BA8C0", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                    <span style={{ color: NAVY, textAlign: "right" }}>{v}</span>
                  </div>
                ) : null)}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 12 }}>
                  <input type="checkbox" checked={form.agb} onChange={e => set("agb", e.target.checked)} style={{ marginTop: 2, accentColor: NAVY, flexShrink: 0 }}/>
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>{t.step6.agbText(t.step6.agbLabel)}</span>
                </label>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.datenschutz} onChange={e => set("datenschutz", e.target.checked)} style={{ marginTop: 2, accentColor: NAVY, flexShrink: 0 }}/>
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>{t.step6.dsgvoText(t.step6.dsgvoLabel)}</span>
                </label>
              </div>
              <div style={{ background: "#EBF4FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 16, marginBottom: 8 }}>
                <p style={{ color: NAVY, fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>{t.step6.paymentNote}</p>
              </div>
            </div>
          )}

          <div className="nav-btns-row" style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 28px", borderRadius: 50, border: `2px solid ${NAVY}`, background: "transparent", color: NAVY, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                {t.back}
              </button>
            ) : <div/>}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(26,63,111,0.28)" }}>
                {t.next}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!form.agb || !form.datenschutz || loading}
                style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: form.agb && form.datenschutz ? `linear-gradient(135deg, ${GREEN}, #27AE60)` : "#ccc", color: "white", fontWeight: 700, cursor: form.agb && form.datenschutz ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif" }}>
                {loading ? t.saving : t.toPayment}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}