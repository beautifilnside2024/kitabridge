"use client";
import { useState } from "react";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const STEPS = [
  "Persoenliche Daten",
  "Qualifikation",
  "Sprachkenntnisse",
  "Berufserfahrung",
  "Verfuegbarkeit",
  "Dokumente",
  "Abschluss"
];

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
  color: "#1a1a2e", background: "white", marginBottom: 4
};

const labelStyle = {
  display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#4A5568",
  marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: 0.5
};

const selectStyle = {
  ...inputStyle, cursor: "pointer", appearance: "none" as const
};

export default function Registrieren() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    vorname: "", nachname: "", email: "", telefon: "", geburtsland: "", wohnort: "",
    qualifikation: "", zusatzqualifikation: "", uniabschluss: "",
    deutsch: "", englisch: "", weitere_sprachen: "",
    erfahrung_jahre: "", kita_alter: [] as string[], beschreibung: "",
    verfuegbar_ab: "", arbeitszeit: "", bundesland: "",
    lebenslauf: false, zeugnisse: false, sprachnachweis: false,
    agb: false, datenschutz: false
  });

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const toggleArr = (key: string, val: string) => {
    const arr = (form as any)[key] as string[];
    set(key, arr.includes(val) ? arr.filter((x: string) => x !== val) : [...arr, val]);
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
            <div style={{ color: GREEN, fontWeight: 700, fontSize: "0.9rem" }}>Naechste Schritte:</div>
            <div style={{ color: "#444", fontSize: "0.85rem", marginTop: 8, lineHeight: 1.7 }}>
              1. Wir pruefen dein Profil<br/>
              2. Du erhaeltst eine Bestaetigung per E-Mail<br/>
              3. Kitas koennen dich direkt kontaktieren
            </div>
          </div>
          <a href="/" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 50, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, textDecoration: "none" }}>Zur Startseite</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F0F4F9, #EAF7EF)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; } input:focus, select:focus, textarea:focus { border-color: ${BLUE} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.1); }`}</style>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </a>
        <div style={{ fontSize: "0.85rem", color: "#6B7897" }}>Schritt {step + 1} von {STEPS.length}</div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
        {/* Progress */}
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

        {/* Card */}
        <div style={{ background: "white", borderRadius: 24, padding: 40, boxShadow: "0 8px 40px rgba(26,63,111,0.1)", border: "1px solid #E8EDF4" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: NAVY, marginBottom: 8 }}>{STEPS[step]}</h2>
          <p style={{ color: "#9BA8C0", fontSize: "0.85rem", marginBottom: 28 }}>Bitte fulle alle Felder aus</p>

          {/* STEP 0 - Persoenliche Daten */}
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
                <label style={labelStyle}>Telefonnummer</label>
                <input style={inputStyle} value={form.telefon} onChange={e => set("telefon", e.target.value)} placeholder="+49 123 456789"/>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Geburtsland *</label>
                  <select style={selectStyle} value={form.geburtsland} onChange={e => set("geburtsland", e.target.value)}>
                    <option value="">Bitte waehlen</option>
                    {["Deutschland","Indien","Pakistan","Nigeria","Kenia","Philippinen","Brasilien","Mexiko","Ukraine","Polen","Rumaenien","Tuerkei","Sonstiges"].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Aktueller Wohnort</label>
                  <input style={inputStyle} value={form.wohnort} onChange={e => set("wohnort", e.target.value)} placeholder="Berlin"/>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 - Qualifikation */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Berufsabschluss *</label>
                <select style={selectStyle} value={form.qualifikation} onChange={e => set("qualifikation", e.target.value)}>
                  <option value="">Bitte waehlen</option>
                  {["Staatlich anerkannte Erzieherin / Erzieher","Kinderpflegerin / Kinderpfleger","Sozialpaedagogin / Sozialpaedagoge","Heilpaedagogin / Heilpaedagoge","Kindheitpaedagogin / Kindheitspaedagoge","Sonstige paedagogische Ausbildung"].map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Zusatzqualifikationen</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {["Montessori Zertifikat","Waldorf Ausbildung","Sprachfoerderung","Inklusionspaedagogik","Musikpaedagogik","Erste Hilfe Kind"].map(z => (
                    <label key={z} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: form.zusatzqualifikation.includes(z) ? "#EAF7EF" : "white" }}>
                      <input type="checkbox" checked={form.zusatzqualifikation.includes(z)} onChange={() => set("zusatzqualifikation", form.zusatzqualifikation.includes(z) ? form.zusatzqualifikation.replace(z, "").trim() : form.zusatzqualifikation + " " + z)} style={{ accentColor: GREEN }}/>
                      {z}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Hochschulabschluss (falls vorhanden)</label>
                <input style={inputStyle} value={form.uniabschluss} onChange={e => set("uniabschluss", e.target.value)} placeholder="z.B. Bachelor Paedagogik"/>
              </div>
            </div>
          )}

          {/* STEP 2 - Sprachkenntnisse */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Deutschkenntnisse *</label>
                <select style={selectStyle} value={form.deutsch} onChange={e => set("deutsch", e.target.value)}>
                  <option value="">Bitte waehlen</option>
                  {["A1 - Anfaenger","A2 - Grundlagen","B1 - Mittelstufe","B2 - Gute Kenntnisse","C1 - Fortgeschritten","C2 - Muttersprachlich"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Englischkenntnisse</label>
                <select style={selectStyle} value={form.englisch} onChange={e => set("englisch", e.target.value)}>
                  <option value="">Bitte waehlen</option>
                  {["Keine","A1 - Anfaenger","A2 - Grundlagen","B1 - Mittelstufe","B2 - Gute Kenntnisse","C1 - Fortgeschritten","C2 - Muttersprachlich"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Weitere Sprachen</label>
                <input style={inputStyle} value={form.weitere_sprachen} onChange={e => set("weitere_sprachen", e.target.value)} placeholder="z.B. Franzoesisch B2, Arabisch Muttersprache"/>
              </div>
              <div style={{ marginTop: 20, background: "#F0F4F9", borderRadius: 12, padding: 16, fontSize: "0.85rem", color: "#6B7897" }}>
                Hinweis: Mindestens Deutschkenntnisse auf B1-Niveau sind erforderlich um in deutschen Kitas arbeiten zu koennen.
              </div>
            </div>
          )}

          {/* STEP 3 - Berufserfahrung */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Jahre Berufserfahrung in der Kita *</label>
                <select style={selectStyle} value={form.erfahrung_jahre} onChange={e => set("erfahrung_jahre", e.target.value)}>
                  <option value="">Bitte waehlen</option>
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

          {/* STEP 4 - Verfuegbarkeit */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Verfuegbar ab *</label>
                <input style={inputStyle} type="date" value={form.verfuegbar_ab} onChange={e => set("verfuegbar_ab", e.target.value)}/>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Gewuenschte Arbeitszeit *</label>
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
                <label style={labelStyle}>Gewuenschtes Bundesland</label>
                <select style={selectStyle} value={form.bundesland} onChange={e => set("bundesland", e.target.value)}>
                  <option value="">Egal / Flexibel</option>
                  {["Baden-Wuerttemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thueringen"].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* STEP 5 - Dokumente */}
          {step === 5 && (
            <div>
              <p style={{ color: "#6B7897", fontSize: "0.88rem", marginBottom: 24, lineHeight: 1.7 }}>
                Bitte lade die folgenden Dokumente hoch. Dies hilft Kitas dein Profil besser einzuschaetzen.
              </p>
              {[
                { key: "lebenslauf", title: "Lebenslauf", desc: "Aktueller Lebenslauf (PDF oder Word)", required: true },
                { key: "zeugnisse", title: "Abschlusszeugnis", desc: "Berufsabschluss oder Studienabschluss", required: true },
                { key: "sprachnachweis", title: "Sprachnachweis", desc: "Deutschzertifikat (Goethe, TestDaF, etc.)", required: false },
              ].map(doc => (
                <div key={doc.key} style={{ border: "2px dashed #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 16, background: (form as any)[doc.key] ? "#EAF7EF" : "white" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.9rem" }}>{doc.title} {doc.required && <span style={{ color: "red" }}>*</span>}</div>
                      <div style={{ color: "#9BA8C0", fontSize: "0.8rem", marginTop: 2 }}>{doc.desc}</div>
                    </div>
                    <label style={{ cursor: "pointer", background: (form as any)[doc.key] ? GREEN : NAVY, color: "white", padding: "8px 16px", borderRadius: 8, fontSize: "0.8rem", fontWeight: 700 }}>
                      <input type="file" style={{ display: "none" }} onChange={() => set(doc.key, true)}/>
                      {(form as any)[doc.key] ? "Hochgeladen" : "Hochladen"}
                    </label>
                  </div>
                </div>
              ))}
              <div style={{ background: "#F0F4F9", borderRadius: 12, padding: 14, fontSize: "0.8rem", color: "#6B7897" }}>
                Erlaubte Formate: PDF, DOC, DOCX, JPG, PNG - Max. 5 MB pro Datei
              </div>
            </div>
          )}

          {/* STEP 6 - Abschluss */}
          {step === 6 && (
            <div>
              <div style={{ background: "#F8FAFF", borderRadius: 16, padding: 20, marginBottom: 24 }}>
                <h3 style={{ color: NAVY, fontSize: "0.95rem", fontWeight: 700, marginBottom: 12 }}>Zusammenfassung</h3>
                {[
                  ["Name", `${form.vorname} ${form.nachname}`],
                  ["E-Mail", form.email],
                  ["Qualifikation", form.qualifikation],
                  ["Deutsch", form.deutsch],
                  ["Erfahrung", form.erfahrung_jahre],
                  ["Verfuegbar ab", form.verfuegbar_ab],
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
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>Ich stimme den <a href="#" style={{ color: BLUE }}>Allgemeinen Geschaeftsbedingungen</a> zu *</span>
                </label>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.datenschutz} onChange={e => set("datenschutz", e.target.checked)} style={{ marginTop: 2, accentColor: NAVY }}/>
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>Ich habe die <a href="#" style={{ color: BLUE }}>Datenschutzerklaerung</a> gelesen und stimme zu *</span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 28px", borderRadius: 50, border: `2px solid ${NAVY}`, background: "transparent", color: NAVY, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Zurueck
              </button>
            ) : <div/>}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(26,63,111,0.28)" }}>
                Weiter
              </button>
            ) : (
              <button onClick={async () => { if (form.agb && form.datenschutz) { try { const {createClient} = await import('@supabase/supabase-js'); const sb = createClient('https://miftmpmfnotezloesaxh.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZnRtcG1mbm90ZXpsb2VzYXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTg4NjAsImV4cCI6MjA4NzU5NDg2MH0.YFFEljANfkpzPqQeCTSaqYcClPteDQrzjSTvLsU-QLA'); const result = await sb.from('fachkraefte').insert([{vorname:form.vorname,nachname:form.nachname,email:form.email,wohnort_stadt:form.wohnort,wohnort_land:form.geburtsland,staatsangehoerigkeit:form.geburtsland,beruf:form.qualifikation,abschluss:form.qualifikation,erfahrung:form.erfahrung_jahre,beschaeftigung:form.arbeitszeit,eintrittstermin:form.verfuegbar_ab,kurzprofil:form.beschreibung,status:'neu'}]); console.log('Supabase result:', JSON.stringify(result)); } catch(e) { console.error('Supabase error:', e); } setSubmitted(true); } }} style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: form.agb && form.datenschutz ? `linear-gradient(135deg, ${GREEN}, #27AE60)` : "#ccc", color: "white", fontWeight: 700, cursor: form.agb && form.datenschutz ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif" }}>
                Registrierung abschliessen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
