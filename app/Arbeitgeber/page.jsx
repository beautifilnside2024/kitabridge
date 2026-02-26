"use client";
import { useState } from "react";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const STEPS = [
  "Einrichtung",
  "Adresse",
  "Ansprechpartner",
  "Stellen",
  "Plan",
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

export default function Arbeitgeber() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    einrichtung_name: "", einrichtungstyp: "", traeger: "", beschreibung: "",
    strasse: "", hausnummer: "", plz: "", ort: "", bundesland: "",
    ansprech_name: "", ansprech_rolle: "", email: "", telefon: "",
    stellen_anzahl: "", fachrichtungen: [] as string[], positionen: [] as string[], tarif: "",
    addons: [] as string[],
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
          <p style={{ color: "#6B7897", lineHeight: 1.7, marginBottom: 28 }}>Vielen Dank! Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden.</p>
          <div style={{ background: "#EAF7EF", borderRadius: 12, padding: 16, marginBottom: 28 }}>
            <div style={{ color: GREEN, fontWeight: 700, fontSize: "0.9rem" }}>Naechste Schritte:</div>
            <div style={{ color: "#444", fontSize: "0.85rem", marginTop: 8, lineHeight: 1.7 }}>
              1. Wir pruefen Ihre Angaben<br/>
              2. Sie erhalten Zugangsdaten per E-Mail<br/>
              3. Sofort Fachkraefte suchen und kontaktieren
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

          {/* STEP 0 - Einrichtung */}
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Name der Einrichtung *</label>
                <input style={inputStyle} value={form.einrichtung_name} onChange={e => set("einrichtung_name", e.target.value)} placeholder="Kita Sonnenschein"/>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Einrichtungstyp *</label>
                <select style={selectStyle} value={form.einrichtungstyp} onChange={e => set("einrichtungstyp", e.target.value)}>
                  <option value="">Bitte waehlen</option>
                  {["Krippe (0-3 Jahre)","Kindergarten (3-6 Jahre)","Kita (0-6 Jahre)","Hort (6-12 Jahre)","Integrationskita","Waldkita","Montessori Kita","Betriebskita"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Traeger *</label>
                <select style={selectStyle} value={form.traeger} onChange={e => set("traeger", e.target.value)}>
                  <option value="">Bitte waehlen</option>
                  {["Oeffentlich (kommunal)","AWO","Caritas","Diakonie","DRK","Paritaet","Privat / Eigentraeger","Sonstiger freier Traeger"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Kurzbeschreibung der Einrichtung</label>
                <textarea style={{ ...inputStyle, height: 100, resize: "vertical" }} value={form.beschreibung} onChange={e => set("beschreibung", e.target.value)} placeholder="Beschreiben Sie kurz Ihre Einrichtung..."/>
              </div>
            </div>
          )}

          {/* STEP 1 - Adresse */}
          {step === 1 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Strasse *</label>
                  <input style={inputStyle} value={form.strasse} onChange={e => set("strasse", e.target.value)} placeholder="Musterstrasse"/>
                </div>
                <div>
                  <label style={labelStyle}>Hausnummer *</label>
                  <input style={inputStyle} value={form.hausnummer} onChange={e => set("hausnummer", e.target.value)} placeholder="12a"/>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>PLZ *</label>
                  <input style={inputStyle} value={form.plz} onChange={e => set("plz", e.target.value)} placeholder="10115"/>
                </div>
                <div>
                  <label style={labelStyle}>Ort *</label>
                  <input style={inputStyle} value={form.ort} onChange={e => set("ort", e.target.value)} placeholder="Berlin"/>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bundesland *</label>
                <select style={selectStyle} value={form.bundesland} onChange={e => set("bundesland", e.target.value)}>
                  <option value="">Bitte waehlen</option>
                  {["Baden-Wuerttemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thueringen"].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2 - Ansprechpartner */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Name des Ansprechpartners *</label>
                <input style={inputStyle} value={form.ansprech_name} onChange={e => set("ansprech_name", e.target.value)} placeholder="Maria Mustermann"/>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Rolle / Position</label>
                <select style={selectStyle} value={form.ansprech_rolle} onChange={e => set("ansprech_rolle", e.target.value)}>
                  <option value="">Bitte waehlen</option>
                  {["Kita-Leitung","Stellv. Leitung","Traeger-Geschaeftsfuehrung","HR / Personal","Sonstiges"].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>E-Mail Adresse *</label>
                <input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="leitung@kita-sonnenschein.de"/>
              </div>
              <div>
                <label style={labelStyle}>Telefonnummer</label>
                <input style={inputStyle} value={form.telefon} onChange={e => set("telefon", e.target.value)} placeholder="+49 30 123456"/>
              </div>
            </div>
          )}

          {/* STEP 3 - Stellen */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Anzahl offener Stellen *</label>
                <select style={selectStyle} value={form.stellen_anzahl} onChange={e => set("stellen_anzahl", e.target.value)}>
                  <option value="">Bitte waehlen</option>
                  {["1 Stelle","2-3 Stellen","4-5 Stellen","6-10 Stellen","Mehr als 10 Stellen"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Gesuchte Berufe</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {["Erzieherin / Erzieher","Kinderpflegerin","Sozialpaedagogin","Heilpaedagogin","Kita-Leitung","Praktikant / FSJ"].map(f => (
                    <label key={f} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: form.fachrichtungen.includes(f) ? "#EAF7EF" : "white" }}>
                      <input type="checkbox" checked={form.fachrichtungen.includes(f)} onChange={() => toggleArr("fachrichtungen", f)} style={{ accentColor: GREEN }}/>
                      {f}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Beschaeftigungsart</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {["Vollzeit","Teilzeit","Minijob","Vertretung"].map(p => (
                    <label key={p} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: form.positionen.includes(p) ? "#EAF7EF" : "white" }}>
                      <input type="checkbox" checked={form.positionen.includes(p)} onChange={() => toggleArr("positionen", p)} style={{ accentColor: GREEN }}/>
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 - Plan */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 20, padding: 28, color: "white", marginBottom: 16 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: 1 }}>Hauptplan</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700 }}>299 EUR</div>
                  <div style={{ opacity: 0.7, fontSize: "0.82rem", marginBottom: 16 }}>pro Monat, zzgl. MwSt.</div>
                  {["Alle Fachkraefte-Profile","Direktkontakt","Unbegrenzte Suche","Keine Provision","Monatlich kuendbar"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: "0.85rem" }}>
                      <span style={{ color: "#27AE60" }}>+</span> {f}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Optionale Zusatzleistungen</label>
                {[
                  { key: "Profil-Boost", price: "49 EUR/Monat", desc: "Ihre Kita wird prominent hervorgehoben" },
                  { key: "Bewerber-Matching", price: "79 EUR/Monat", desc: "KI-gestuetztes Matching mit passenden Fachkraeften" },
                  { key: "Recruiting-Support", price: "99 EUR/Monat", desc: "Persoenliche Unterstuetzung bei der Personalsuche" },
                ].map(addon => (
                  <label key={addon.key} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${form.addons.includes(addon.key) ? BLUE : "#E2E8F0"}`, background: form.addons.includes(addon.key) ? "#EBF4FF" : "white", marginBottom: 10 }}>
                    <input type="checkbox" checked={form.addons.includes(addon.key)} onChange={() => toggleArr("addons", addon.key)} style={{ accentColor: BLUE }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.9rem" }}>{addon.key}</div>
                      <div style={{ color: "#9BA8C0", fontSize: "0.8rem" }}>{addon.desc}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: BLUE, fontSize: "0.85rem" }}>{addon.price}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 - Abschluss */}
          {step === 5 && (
            <div>
              <div style={{ background: "#F8FAFF", borderRadius: 16, padding: 20, marginBottom: 24 }}>
                <h3 style={{ color: NAVY, fontSize: "0.95rem", fontWeight: 700, marginBottom: 12 }}>Zusammenfassung</h3>
                {[
                  ["Einrichtung", form.einrichtung_name],
                  ["Typ", form.einrichtungstyp],
                  ["Ort", `${form.plz} ${form.ort}`],
                  ["Ansprechpartner", form.ansprech_name],
                  ["E-Mail", form.email],
                  ["Offene Stellen", form.stellen_anzahl],
                  ["Plan", "299 EUR/Monat"],
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
              <button onClick={async () => { if (form.agb && form.datenschutz) { try { var m=await import('@supabase/supabase-js'); var sb=m.createClient('https://miftmpmfnotezloesaxh.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZnRtcG1mbm90ZXpsb2VzYXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTg4NjAsImV4cCI6MjA4NzU5NDg2MH0.YFFEljANfkpzPqQeCTSaqYcClPteDQrzjSTvLsU-QLA'); var r=await sb.from('arbeitgeber').insert([{einrichtung_name:form.einrichtung_name,einrichtungstyp:form.einrichtungstyp,traeger:form.traeger,beschreibung:form.beschreibung,strasse:form.strasse,hausnummer:form.hausnummer,plz:form.plz,ort:form.ort,bundesland:form.bundesland,ansprech_name:form.ansprech_name,ansprech_rolle:form.ansprech_rolle,email:form.email,telefon:form.telefon,stellen_anzahl:form.stellen_anzahl,fachrichtungen:form.fachrichtungen,positionen:form.positionen,addons:form.addons,status:'neu'}]); console.log('R:',JSON.stringify(r)); } catch(e){console.error('E:',e);} setSubmitted(true); } }} style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: form.agb && form.datenschutz ? `linear-gradient(135deg, ${GREEN}, #27AE60)` : "#ccc", color: "white", fontWeight: 700, cursor: form.agb && form.datenschutz ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif" }}>
                Registrierung abschliessen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
