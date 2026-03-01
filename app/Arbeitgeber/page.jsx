"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const STEPS = ["Einrichtung", "Adresse", "Ansprechpartner", "Stellen", "Plan", "Passwort", "Abschluss"];

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

export default function Arbeitgeber() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    einrichtung_name: "", einrichtungstyp: "", traeger: "", beschreibung: "",
    strasse: "", hausnummer: "", plz: "", ort: "", bundesland: "",
    ansprech_name: "", ansprech_rolle: "", email: "", telefon: "",
    passwort: "", passwort2: "",
    stellen_anzahl: "", fachrichtungen: [], positionen: [], addons: [],
    agb: false, datenschutz: false
  });

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const toggleArr = (key, val) => {
    const arr = form[key];
    set(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleSubmit = async () => {
    if (!form.agb || !form.datenschutz) return;
    if (form.passwort !== form.passwort2) {
      alert("Passwörter stimmen nicht überein!");
      return;
    }
    if (form.passwort.length < 6) {
      alert("Passwort muss mindestens 6 Zeichen lang sein!");
      return;
    }
    setLoading(true);

    // 1. Supabase Auth Account erstellen
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.passwort,
      options: {
        data: { role: "arbeitgeber", einrichtung_name: form.einrichtung_name }
      }
    });

    if (authError && authError.message !== "User already registered") {
      setLoading(false);
      alert("Fehler: " + authError.message);
      return;
    }

    // 2. Arbeitgeber in Datenbank speichern
    const { data: insertedData, error } = await supabase
      .from("arbeitgeber")
      .insert([{
        einrichtung_name: form.einrichtung_name,
        einrichtungstyp: form.einrichtungstyp,
        traeger: form.traeger,
        beschreibung: form.beschreibung,
        strasse: form.strasse,
        hausnummer: form.hausnummer,
        plz: form.plz,
        ort: form.ort,
        bundesland: form.bundesland,
        ansprech_name: form.ansprech_name,
        ansprech_rolle: form.ansprech_rolle,
        email: form.email,
        telefon: form.telefon,
        stellen_anzahl: form.stellen_anzahl,
        fachrichtungen: form.fachrichtungen,
        positionen: form.positionen,
        addons: form.addons,
        status: "neu"
      }])
      .select()
      .single();

    if (error) {
      setLoading(false);
      alert("Fehler: " + error.message);
      return;
    }

    // 3. Admin-Benachrichtigung senden
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "arbeitgeber", data: form }),
    });

    // 4. Willkommens-E-Mail an Arbeitgeber senden
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "willkommen_arbeitgeber", data: { ...form, id: insertedData.id } }),
    });

    // 5. Arbeitgeber-Daten für Bezahlseite in URL-Parameter übergeben
    setLoading(false);
    router.push(`/bezahlung?id=${insertedData.id}&email=${encodeURIComponent(form.email)}&name=${encodeURIComponent(form.einrichtung_name)}`);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

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
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Name der Einrichtung *</label>
                <input style={inputStyle} value={form.einrichtung_name} onChange={e => set("einrichtung_name", e.target.value)} placeholder="Kita Sonnenschein"/>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Einrichtungstyp *</label>
                <select style={selectStyle} value={form.einrichtungstyp} onChange={e => set("einrichtungstyp", e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {["Krippe (0-3 Jahre)","Kindergarten (3-6 Jahre)","Kita (0-6 Jahre)","Hort (6-12 Jahre)","Integrationskita","Waldkita","Montessori Kita","Betriebskita"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Träger *</label>
                <select style={selectStyle} value={form.traeger} onChange={e => set("traeger", e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {["Öffentlich (kommunal)","AWO","Caritas","Diakonie","DRK","Paritätischer Wohlfahrtsverband","Privat / Eigenträger","Sonstiger freier Träger"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Kurzbeschreibung der Einrichtung</label>
                <textarea style={{ ...inputStyle, height: 100, resize: "vertical" }} value={form.beschreibung} onChange={e => set("beschreibung", e.target.value)} placeholder="Beschreiben Sie kurz Ihre Einrichtung..."/>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Straße *</label>
                  <input style={inputStyle} value={form.strasse} onChange={e => set("strasse", e.target.value)} placeholder="Musterstraße"/>
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
                  <option value="">Bitte wählen</option>
                  {["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Name des Ansprechpartners *</label>
                <input style={inputStyle} value={form.ansprech_name} onChange={e => set("ansprech_name", e.target.value)} placeholder="Maria Mustermann"/>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Rolle / Position</label>
                <select style={selectStyle} value={form.ansprech_rolle} onChange={e => set("ansprech_rolle", e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {["Kita-Leitung","Stellv. Leitung","Träger-Geschäftsführung","HR / Personal","Sonstiges"].map(r => <option key={r} value={r}>{r}</option>)}
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

          {step === 3 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Anzahl offener Stellen *</label>
                <select style={selectStyle} value={form.stellen_anzahl} onChange={e => set("stellen_anzahl", e.target.value)}>
                  <option value="">Bitte wählen</option>
                  {["1 Stelle","2-3 Stellen","4-5 Stellen","6-10 Stellen","Mehr als 10 Stellen"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Gesuchte Berufe</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {["Erzieherin / Erzieher","Kinderpflegerin / Kinderpfleger","Sozialpädagogin / Sozialpädagoge","Heilpädagogin / Heilpädagoge","Kita-Leitung","Praktikant / FSJ"].map(f => (
                    <label key={f} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: form.fachrichtungen.includes(f) ? "#EAF7EF" : "white" }}>
                      <input type="checkbox" checked={form.fachrichtungen.includes(f)} onChange={() => toggleArr("fachrichtungen", f)} style={{ accentColor: GREEN }}/>
                      {f}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Beschäftigungsart</label>
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

          {step === 4 && (
            <div>
              <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 20, padding: 28, color: "white", marginBottom: 16 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Hauptplan</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700 }}>299 EUR</div>
                <div style={{ opacity: 0.7, fontSize: "0.82rem", marginBottom: 16 }}>pro Monat, zzgl. MwSt.</div>
                {["Alle Fachkräfte-Profile","Direktkontakt","Unbegrenzte Suche","Keine Provision","Monatlich kündbar"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: "0.85rem" }}>
                    <span style={{ color: "#27AE60" }}>+</span> {f}
                  </div>
                ))}
              </div>
              <label style={labelStyle}>Optionale Zusatzleistungen</label>
              {[
                { key: "Profil-Boost", price: "49 EUR/Monat", desc: "Ihre Kita wird prominent hervorgehoben" },
                { key: "Bewerber-Matching", price: "79 EUR/Monat", desc: "KI-gestütztes Matching mit passenden Fachkräften" },
                { key: "Recruiting-Support", price: "99 EUR/Monat", desc: "Persönliche Unterstützung bei der Personalsuche" },
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
          )}

          {step === 5 && (
            <div>
              <div style={{ background: "#F0F4F9", borderRadius: 12, padding: 16, marginBottom: 20, fontSize: "0.85rem", color: "#6B7897" }}>
                Mit diesem Passwort können Sie sich später auf KitaBridge einloggen und Fachkräfte suchen.
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Passwort erstellen *</label>
                <input style={inputStyle} type="password" value={form.passwort} onChange={e => set("passwort", e.target.value)} placeholder="Mindestens 6 Zeichen"/>
              </div>
              <div>
                <label style={labelStyle}>Passwort wiederholen *</label>
                <input style={inputStyle} type="password" value={form.passwort2} onChange={e => set("passwort2", e.target.value)} placeholder="Passwort wiederholen"/>
              </div>
              {form.passwort && form.passwort2 && form.passwort !== form.passwort2 && (
                <div style={{ color: "#DC2626", fontSize: "0.82rem", marginTop: 8 }}>Passwörter stimmen nicht überein</div>
              )}
            </div>
          )}

          {step === 6 && (
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
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>Ich stimme den <a href="/agb" style={{ color: BLUE }}>Allgemeinen Geschäftsbedingungen</a> zu *</span>
                </label>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.datenschutz} onChange={e => set("datenschutz", e.target.checked)} style={{ marginTop: 2, accentColor: NAVY }}/>
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>Ich habe die <a href="/datenschutz" style={{ color: BLUE }}>Datenschutzerklärung</a> gelesen und stimme zu *</span>
                </label>
              </div>
              <div style={{ background: "#EBF4FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 16, marginBottom: 8 }}>
                <p style={{ color: NAVY, fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>
                  💳 Nach der Registrierung werden Sie zur sicheren Bezahlung weitergeleitet (299 EUR/Monat via Stripe).
                </p>
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
                {loading ? "Wird gespeichert..." : "Weiter zur Bezahlung →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
