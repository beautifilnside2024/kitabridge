"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const STEPS = [
  "Persönliche Daten",
  "Qualifikation",
  "Sprachkenntnisse",
  "Berufserfahrung",
  "Verfügbarkeit",
  "Abschluss"
];

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
  color: "#1a1a2e", background: "white", marginBottom: 4
};

const labelStyle = {
  display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#4A5568",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5
};

const selectStyle = { ...inputStyle, cursor: "pointer" };

export default function Registrieren() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vorname: "", nachname: "", email: "", passwort: "", telefon: "", wohnort: "",
    qualifikation: "", zusatzqualifikation: "", uniabschluss: "",
    deutsch: "", englisch: "", weitere_sprachen: "",
    erfahrung_jahre: "", kita_alter: [], beschreibung: "",
    verfuegbar_ab: "", arbeitszeit: "", bundesland: "",
    agb: false, datenschutz: false
  });

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const toggleArr = (key, val) => {
    const arr = form[key];
    set(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleSubmit = async () => {
    if (!form.agb || !form.datenschutz) return;
    if (!form.passwort || form.passwort.length < 8) {
      alert("Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.passwort,
    });

    if (authError) {
      setLoading(false);
      alert("Fehler beim Erstellen des Accounts: " + authError.message);
      return;
    }

    const { error: dbError } = await supabase.from("fachkraefte").insert([{
      vorname: form.vorname,
      nachname: form.nachname,
      email: form.email,
      telefon: form.telefon,
      wohnort: form.wohnort,
      qualifikation: form.qualifikation,
      zusatzqualifikation: form.zusatzqualifikation,
      uniabschluss: form.uniabschluss,
      deutsch: form.deutsch,
      englisch: form.englisch,
      weitere_sprachen: form.weitere_sprachen,
      erfahrung_jahre: form.erfahrung_jahre,
      kita_alter: form.kita_alter,
      beschreibung: form.beschreibung,
      verfuegbar_ab: form.verfuegbar_ab,
      arbeitszeit: form.arbeitszeit,
      bundesland: form.bundesland,
      status: "neu"
    }]);

    if (dbError) {
      setLoading(false);
      alert("Fehler: " + dbError.message);
      return;
    }

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: form.email,
        subject: "Deine Registrierung bei KitaBridge",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A3F6F;padding:24px 32px">
            <h1 style="color:white;margin:0;font-size:22px">KitaBridge</h1>
          </div>
          <div style="padding:32px;background:#fff">
            <h2 style="color:#1A3F6F">Hallo ${form.vorname}!</h2>
            <p style="color:#444;line-height:1.7">Vielen Dank für deine Registrierung bei KitaBridge! Wir haben dein Profil erhalten und werden es innerhalb von <strong>24 Stunden</strong> prüfen.</p>
            <div style="background:#EAF7EF;border-radius:12px;padding:20px;margin:24px 0">
              <p style="color:#1E8449;font-weight:700;margin:0 0 12px">Nächste Schritte:</p>
              <p style="color:#444;margin:0;line-height:1.8">
                1. Wir prüfen dein Profil sorgfältig<br/>
                2. Du erhältst eine E-Mail sobald dein Profil freigeschaltet ist<br/>
                3. Kitas in ganz Deutschland können dich dann direkt kontaktieren
              </p>
            </div>
            <div style="background:#F8FAFF;border-radius:12px;padding:20px;margin:24px 0">
              <p style="color:#1A3F6F;font-weight:700;margin:0 0 8px">Dein Login:</p>
              <p style="color:#444;font-size:14px;margin:0">E-Mail: ${form.email}<br/>Du kannst dich jederzeit unter <a href="https://kitabridge.vercel.app/login">kitabridge.vercel.app/login</a> einloggen.</p>
            </div>
            <p style="color:#444;line-height:1.7">Bei Fragen: <a href="mailto:kitabridge@protonmail.com" style="color:#2471A3">kitabridge@protonmail.com</a></p>
            <p style="color:#444">Viele Grüße,<br/><strong>Das KitaBridge-Team</strong></p>
          </div>
          <div style="background:#F8FAFF;padding:16px 32px;text-align:center">
            <p style="color:#9BA8C0;font-size:12px;margin:0">KitaBridge - Heusenstammer Weg 69 - 63071 Offenbach am Main</p>
          </div>
        </div>`
      })
    });

    setLoading(false);
    setSubmitted(true);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F0F4F9, #EAF7EF)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: "white", borderRadius: 24, padding: 48, maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(26,63,111,0.12)" }}>
          <div style={{ fontSize: "4rem", marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: NAVY, marginBottom: 16 }}>Registrierung erfolgreich!</h2>
          <p style={{ color: "#6B7897", lineHeight: 1.7, marginBottom: 28 }}>Vielen Dank, {form.vorname}! Wir haben dein Profil erhalten und melden uns innerhalb von 24 Stunden bei dir.</p>
          <div style={{ background: "#EAF7EF", borderRadius: 12, padding: 16, marginBottom: 28 }}>
            <div style={{ color: GREEN, fontWeight: 700, fontSize: "0.9rem" }}>📧 Bestätigungs-E-Mail gesendet!</div>
            <div style={{ color: "#444", fontSize: "0.85rem", marginTop: 8, lineHeight: 1.7 }}>
              Wir haben eine E-Mail an <strong>{form.email}</strong> geschickt.<br/>
              Bitte prüfe auch deinen Spam-Ordner.
            </div>
          </div>
          <div style={{ background: "#F8FAFF", borderRadius: 12, padding: 16, marginBottom: 28 }}>
            <div style={{ color: NAVY, fontWeight: 700, fontSize: "0.9rem", marginBottom: 8 }}>Nächste Schritte:</div>
            <div style={{ color: "#444", fontSize: "0.85rem", lineHeight: 1.7 }}>
              1. Wir prüfen dein Profil<br/>
              2. Du erhältst eine Bestätigung per E-Mail<br/>
              3. Kitas können dich direkt kontaktieren
            </div>
          </div>
          <a href="/login" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 50, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, textDecoration: "none" }}>Zum Login</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F0F4F9, #EAF7EF)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; } input:focus, select:focus, textarea:focus { border-color: ${BLUE} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.1); }`}</style>

      <div style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </a>
        <div style={{ fontSize: "0.85rem", color: "#6B7897" }}>Schritt {step + 1} von {STEPS.length}</div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
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

        <div style={{ background: "white", borderRadius: 24, padding: 40, boxShadow: "0 8px 40px rgba(26,63,111,0.1)", border: "1px solid #E8EDF4" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: NAVY, marginBottom: 8 }}>{STEPS[step]}</h2>
          <p style={{ color: "#9BA8C0", fontSize: "0.85rem", marginBottom: 28 }}>Bitte fülle alle Felder aus</p>

          {step === 0 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Vorname *</label>
                  <input style={inputStyle} value={form.vorname} onChange={e => set("vorname", e.target.value)} placeholder="Maria"/>
                </div>
                <div>
                  <label style={labelStyle}>Nachname *</label>
                  <input style={inputStyle} value={form.nachname} onChange={e => set("nachname", e.target.value)} placeholder="Mustermann"/>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>E-Mail Adresse *</label>
                <input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="maria@example.com"/>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Passwort * (mind. 8 Zeichen)</label>
                <input style={inputStyle} type="password" value={form.passwort} onChange={e => set("passwort", e.target.value)} placeholder="••••••••"/>
                <div style={{ fontSize: "0.78rem", color: "#9BA8C0", marginTop: 4 }}>Mit diesem Passwort kannst du dich später einloggen.</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Telefonnummer</label>
                <input style={inputStyle} value={form.telefon} onChange={e => set("telefon", e.target.value)} placeholder="+49 123 456789"/>
              </div>
              <div>
                <label style={labelStyle}>Aktueller Wohnort</label>
                <input style={inputStyle} value={form.wohnort} onChange={e => set("wohnort", e.target.value)} placeholder="Berlin"/>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Berufsabschluss *</label>
                <select style={selectStyle} value={form.qualifikation} onChange={e => set("qualifikation", e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {["Staatlich anerkannte Erzieherin / Erzieher","Kinderpflegerin / Kinderpfleger","Sozialpädagogin / Sozialpädagoge","Heilpädagogin / Heilpädagoge","Kindheitspädagogin / Kindheitspädagoge","Sonstige pädagogische Ausbildung"].map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Zusatzqualifikationen</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {["Montessori Zertifikat","Waldorf Ausbildung","Sprachförderung","Inklusionspädagogik","Musikpädagogik","Erste Hilfe Kind"].map(z => (
                    <label key={z} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: form.zusatzqualifikation.includes(z) ? "#EAF7EF" : "white" }}>
                      <input type="checkbox" checked={form.zusatzqualifikation.includes(z)} onChange={() => set("zusatzqualifikation", form.zusatzqualifikation.includes(z) ? form.zusatzqualifikation.replace(z, "").trim() : (form.zusatzqualifikation + " " + z).trim())} style={{ accentColor: GREEN }}/>
                      {z}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Hochschulabschluss (falls vorhanden)</label>
                <input style={inputStyle} value={form.uniabschluss} onChange={e => set("uniabschluss", e.target.value)} placeholder="z.B. Bachelor Pädagogik"/>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Deutschkenntnisse *</label>
                <select style={selectStyle} value={form.deutsch} onChange={e => set("deutsch", e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {["A1 – Anfänger","A2 – Grundlagen","B1 – Mittelstufe","B2 – Gute Kenntnisse","C1 – Fortgeschritten","C2 – Muttersprachlich"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Englischkenntnisse</label>
                <select style={selectStyle} value={form.englisch} onChange={e => set("englisch", e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {["Keine","A1 – Anfänger","A2 – Grundlagen","B1 – Mittelstufe","B2 – Gute Kenntnisse","C1 – Fortgeschritten","C2 – Muttersprachlich"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Weitere Sprachen</label>
                <input style={inputStyle} value={form.weitere_sprachen} onChange={e => set("weitere_sprachen", e.target.value)} placeholder="z.B. Französisch B2, Arabisch Muttersprache"/>
              </div>
              <div style={{ marginTop: 20, background: "#F0F4F9", borderRadius: 12, padding: 16, fontSize: "0.85rem", color: "#6B7897" }}>
                Hinweis: Mindestens Deutschkenntnisse auf B1-Niveau sind erforderlich.
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Jahre Berufserfahrung in der Kita *</label>
                <select style={selectStyle} value={form.erfahrung_jahre} onChange={e => set("erfahrung_jahre", e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {["Berufseinsteiger (0-1 Jahre)","1-2 Jahre","2-5 Jahre","5-10 Jahre","Mehr als 10 Jahre"].map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Erfahrung mit Altersgruppen</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {["Krippe (0-3 Jahre)","Kindergarten (3-6 Jahre)","Hort (6-12 Jahre)","Integrationskita","Familiengruppen","Ganztagesbetreuung"].map(a => (
                    <label key={a} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: form.kita_alter.includes(a) ? "#EAF7EF" : "white" }}>
                      <input type="checkbox" checked={form.kita_alter.includes(a)} onChange={() => toggleArr("kita_alter", a)} style={{ accentColor: GREEN }}/>
                      {a}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Kurze Beschreibung deiner Erfahrung</label>
                <textarea style={{ ...inputStyle, height: 100, resize: "vertical" }} value={form.beschreibung} onChange={e => set("beschreibung", e.target.value)} placeholder="Beschreibe kurz deine bisherige Erfahrung in der Kita..."/>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Verfügbar ab *</label>
                <input style={inputStyle} type="date" value={form.verfuegbar_ab} onChange={e => set("verfuegbar_ab", e.target.value)}/>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Gewünschte Arbeitszeit *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {["Vollzeit (38-40h)","Teilzeit (20-30h)","Minijob","Vertretung / Aushilfe"].map(a => (
                    <label key={a} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "12px 16px", borderRadius: 8, border: `1.5px solid ${form.arbeitszeit === a ? BLUE : "#E2E8F0"}`, background: form.arbeitszeit === a ? "#EBF4FF" : "white" }}>
                      <input type="radio" name="arbeitszeit" value={a} checked={form.arbeitszeit === a} onChange={() => set("arbeitszeit", a)} style={{ accentColor: BLUE }}/>
                      {a}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Gewünschtes Bundesland</label>
                <select style={selectStyle} value={form.bundesland} onChange={e => set("bundesland", e.target.value)}>
                  <option value="">Egal / Flexibel</option>
                  {["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div style={{ background: "#F8FAFF", borderRadius: 16, padding: 20, marginBottom: 24 }}>
                <h3 style={{ color: NAVY, fontSize: "0.95rem", fontWeight: 700, marginBottom: 12 }}>Zusammenfassung</h3>
                {[
                  ["Name", `${form.vorname} ${form.nachname}`],
                  ["E-Mail", form.email],
                  ["Qualifikation", form.qualifikation],
                  ["Deutsch", form.deutsch],
                  ["Erfahrung", form.erfahrung_jahre],
                  ["Verfügbar ab", form.verfuegbar_ab],
                  ["Arbeitszeit", form.arbeitszeit],
                  ["Bundesland", form.bundesland || "Flexibel"],
                ].map(([k, v]) => v ? (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #E8EDF4", fontSize: "0.85rem" }}>
                    <span style={{ color: "#9BA8C0", fontWeight: 600 }}>{k}</span>
                    <span style={{ color: NAVY }}>{v}</span>
                  </div>
                ) : null)}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 12 }}>
                  <input type="checkbox" checked={form.agb} onChange={e => set("agb", e.target.checked)} style={{ marginTop: 2, accentColor: NAVY }}/>
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>Ich stimme den <a href="/agb" style={{ color: BLUE }}>AGB</a> zu *</span>
                </label>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.datenschutz} onChange={e => set("datenschutz", e.target.checked)} style={{ marginTop: 2, accentColor: NAVY }}/>
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>Ich habe die <a href="/datenschutz" style={{ color: BLUE }}>Datenschutzerklärung</a> gelesen *</span>
                </label>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 28px", borderRadius: 50, border: `2px solid ${NAVY}`, background: "transparent", color: NAVY, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Zurück
              </button>
            ) : <div/>}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(26,63,111,0.28)" }}>
                Weiter
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!form.agb || !form.datenschutz || loading}
                style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: form.agb && form.datenschutz ? `linear-gradient(135deg, ${GREEN}, #27AE60)` : "#ccc", color: "white", fontWeight: 700, cursor: form.agb && form.datenschutz ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif" }}>
                {loading ? "Wird gespeichert..." : "Registrierung abschließen"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}