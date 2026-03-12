"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const inputStyle: any = {
  width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
  color: "#1a1a2e", background: "white", marginBottom: 4, boxSizing: "border-box"
};
const labelStyle: any = {
  display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#4A5568",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5
};
const selectStyle = { ...inputStyle, cursor: "pointer" };

const STEPS = ["Einrichtung", "Adresse", "Ansprechpartner", "Zugangsdaten", "Abschluss"];

export default function ArbeitgeberRegistrieren() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    einrichtung_name: "", einrichtungstyp: "", traeger: "", beschreibung: "", stellen_anzahl: "",
    strasse: "", hausnummer: "", plz: "", ort: "", bundesland: "",
    ansprech_name: "", ansprech_rolle: "", telefon: "",
    email: "", passwort: "",
    agb: false, datenschutz: false,
  });

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const validateStep = () => {
    setError("");
    if (step === 0 && (!form.einrichtung_name || !form.einrichtungstyp)) {
      setError("Bitte fülle alle Pflichtfelder aus."); return false;
    }
    if (step === 1 && (!form.strasse || !form.plz || !form.ort || !form.bundesland)) {
      setError("Bitte fülle alle Pflichtfelder aus."); return false;
    }
    if (step === 2 && (!form.ansprech_name || !form.telefon)) {
      setError("Bitte fülle alle Pflichtfelder aus."); return false;
    }
    if (step === 3) {
      if (!form.email || !form.passwort) { setError("Bitte fülle alle Pflichtfelder aus."); return false; }
      if (form.passwort.length < 6) { setError("Passwort muss mindestens 6 Zeichen lang sein."); return false; }
    }
    return true;
  };

  const handleWeiter = () => { if (validateStep()) setStep(s => s + 1); };

  const handleSubmit = async () => {
    if (!form.agb || !form.datenschutz) { setError("Bitte stimme den AGB und der Datenschutzerklärung zu."); return; }
    setLoading(true);
    setError("");

    try {
      // 1. Auth-User erstellen
      const createRes = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.passwort, einrichtung_name: form.einrichtung_name }),
      });
      const createData = await createRes.json();
      if (createData.error && !createData.error.includes("already been registered")) {
        setError("Fehler bei der Registrierung: " + createData.error);
        setLoading(false); return;
      }

      // 2. Arbeitgeber in DB speichern
      const { data: ag, error: dbError } = await supabase.from("arbeitgeber").insert([{
        einrichtung_name: form.einrichtung_name,
        einrichtungstyp: form.einrichtungstyp,
        traeger: form.traeger,
        beschreibung: form.beschreibung,
        stellen_anzahl: form.stellen_anzahl,
        strasse: form.strasse,
        hausnummer: form.hausnummer,
        plz: form.plz,
        ort: form.ort,
        bundesland: form.bundesland,
        ansprech_name: form.ansprech_name,
        ansprech_rolle: form.ansprech_rolle,
        telefon: form.telefon,
        email: form.email,
        status: "ausstehend",
      }]).select().single();

      if (dbError) { setError("Fehler beim Speichern: " + dbError.message); setLoading(false); return; }

      // 3. Willkommens-E-Mail
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "willkommen_arbeitgeber", data: { ...form, id: ag.id } }),
        });
      } catch (e) {}

      // 4. Zur Bezahlung weiterleiten
      router.push(`/bezahlung?id=${ag.id}&email=${encodeURIComponent(form.email)}&name=${encodeURIComponent(form.einrichtung_name)}`);

    } catch (e: any) {
      setError("Ein unerwarteter Fehler ist aufgetreten: " + e.message);
      setLoading(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  const einrichtungstypen = ["Krippe (0-3 Jahre)", "Kindergarten (3-6 Jahre)", "Kita (0-6 Jahre)", "Hort (6-12 Jahre)", "Integrationskita", "Waldkita", "Montessori Kita", "Betriebskita"];
  const traeger = ["Öffentlich (kommunal)", "AWO", "Caritas", "Diakonie", "DRK", "Paritätischer Wohlfahrtsverband", "Privat / Eigenträger", "Sonstiger freier Träger"];
  const rollen = ["Kita-Leitung", "Stellv. Leitung", "Träger-Geschäftsführung", "HR / Personal", "Sonstiges"];
  const stellen = ["1 Stelle", "2-3 Stellen", "4-5 Stellen", "6-10 Stellen", "Mehr als 10 Stellen"];
  const bundeslaender = ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F0F4F9, #EBF4FF)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: ${BLUE} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.1); outline: none; }
        @media (max-width: 600px) {
          .reg-card { padding: 24px 18px !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .nav-btns { flex-direction: column !important; }
          .nav-btns button { width: 100% !important; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: "#4ADE80" }}>Bridge</span>
        </a>
        <div style={{ fontSize: "0.85rem", color: "#9BA8C0" }}>Schritt {step + 1} von {STEPS.length}</div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>

        {/* PROGRESS */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY }}>{STEPS[step]}</span>
            <span style={{ fontSize: "0.8rem", color: "#9BA8C0" }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 6, background: "#E8EDF4", borderRadius: 10 }}>
            <div style={{ height: "100%", borderRadius: 10, background: `linear-gradient(90deg, ${NAVY}, ${BLUE})`, width: `${progress}%`, transition: "width 0.4s" }} />
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 10, background: i <= step ? NAVY : "#E8EDF4", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        <div className="reg-card" style={{ background: "white", borderRadius: 24, padding: 36, boxShadow: "0 8px 40px rgba(26,63,111,0.1)", border: "1px solid #E8EDF4" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: NAVY, marginBottom: 24, marginTop: 0 }}>{STEPS[step]}</h2>

          {/* STEP 0: Einrichtung */}
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Name der Einrichtung *</label>
                <input style={inputStyle} value={form.einrichtung_name} onChange={e => set("einrichtung_name", e.target.value)} placeholder="z.B. Kita Sonnenschein" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="two-col">
                <div>
                  <label style={labelStyle}>Einrichtungstyp *</label>
                  <select style={selectStyle} value={form.einrichtungstyp} onChange={e => set("einrichtungstyp", e.target.value)}>
                    <option value="">– bitte wählen –</option>
                    {einrichtungstypen.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Träger</label>
                  <select style={selectStyle} value={form.traeger} onChange={e => set("traeger", e.target.value)}>
                    <option value="">– bitte wählen –</option>
                    {traeger.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Offene Stellen</label>
                <select style={selectStyle} value={form.stellen_anzahl} onChange={e => set("stellen_anzahl", e.target.value)}>
                  <option value="">– bitte wählen –</option>
                  {stellen.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Kurzbeschreibung</label>
                <textarea style={{ ...inputStyle, height: 90, resize: "vertical" }} value={form.beschreibung} onChange={e => set("beschreibung", e.target.value)} placeholder="Was macht Ihre Einrichtung besonders?" />
              </div>
            </div>
          )}

          {/* STEP 1: Adresse */}
          {step === 1 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 16, marginBottom: 16 }} className="two-col">
                <div>
                  <label style={labelStyle}>Straße *</label>
                  <input style={inputStyle} value={form.strasse} onChange={e => set("strasse", e.target.value)} placeholder="Musterstraße" />
                </div>
                <div>
                  <label style={labelStyle}>Nr. *</label>
                  <input style={inputStyle} value={form.hausnummer} onChange={e => set("hausnummer", e.target.value)} placeholder="12" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }} className="two-col">
                <div>
                  <label style={labelStyle}>PLZ *</label>
                  <input style={inputStyle} value={form.plz} onChange={e => set("plz", e.target.value)} placeholder="10115" />
                </div>
                <div>
                  <label style={labelStyle}>Ort *</label>
                  <input style={inputStyle} value={form.ort} onChange={e => set("ort", e.target.value)} placeholder="Berlin" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bundesland *</label>
                <select style={selectStyle} value={form.bundesland} onChange={e => set("bundesland", e.target.value)}>
                  <option value="">– bitte wählen –</option>
                  {bundeslaender.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Ansprechpartner */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Name des Ansprechpartners *</label>
                <input style={inputStyle} value={form.ansprech_name} onChange={e => set("ansprech_name", e.target.value)} placeholder="Maria Mustermann" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Rolle / Position</label>
                <select style={selectStyle} value={form.ansprech_rolle} onChange={e => set("ansprech_rolle", e.target.value)}>
                  <option value="">– bitte wählen –</option>
                  {rollen.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Telefonnummer *</label>
                <input style={inputStyle} value={form.telefon} onChange={e => set("telefon", e.target.value)} placeholder="+49 123 456789" />
              </div>
            </div>
          )}

          {/* STEP 3: Zugangsdaten */}
          {step === 3 && (
            <div>
              <div style={{ background: "#F0F7FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 14, marginBottom: 20, fontSize: "0.85rem", color: BLUE, lineHeight: 1.6 }}>
                ℹ️ Mit diesen Zugangsdaten melden Sie sich später im Dashboard an.
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>E-Mail-Adresse *</label>
                <input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="kita@example.de" />
              </div>
              <div>
                <label style={labelStyle}>Passwort * (min. 6 Zeichen)</label>
                <input style={inputStyle} type="password" value={form.passwort} onChange={e => set("passwort", e.target.value)} placeholder="••••••••" />
              </div>
            </div>
          )}

          {/* STEP 4: Abschluss */}
          {step === 4 && (
            <div>
              {/* Zusammenfassung */}
              <div style={{ background: "#F8FAFF", borderRadius: 16, padding: 20, marginBottom: 24 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: BLUE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Zusammenfassung</div>
                {[
                  ["Einrichtung", form.einrichtung_name],
                  ["Typ", form.einrichtungstyp],
                  ["Träger", form.traeger],
                  ["Ort", `${form.plz} ${form.ort}`],
                  ["Bundesland", form.bundesland],
                  ["Ansprechpartner", form.ansprech_name],
                  ["Telefon", form.telefon],
                  ["E-Mail", form.email],
                  ["Offene Stellen", form.stellen_anzahl],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #E8EDF4", fontSize: "0.85rem", gap: 8 }}>
                    <span style={{ color: "#9BA8C0", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                    <span style={{ color: NAVY, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Preis */}
              <div style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, borderRadius: 16, padding: 20, marginBottom: 24, color: "white" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, opacity: 0.7, marginBottom: 8 }}>Nach der Registrierung</div>
                <div style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 4 }}>299 € <span style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.7 }}>/ Monat</span></div>
                <div style={{ fontSize: "0.78rem", opacity: 0.6, marginBottom: 14 }}>zzgl. MwSt. · Monatlich kündbar</div>
                {["Zugang zur Fachkräfte-Datenbank", "Direktkontakt", "Keine Provision", "Monatlich kündbar"].map(f => (
                  <div key={f} style={{ fontSize: "0.85rem", marginBottom: 6, display: "flex", gap: 8 }}>
                    <span style={{ color: "#4ADE80" }}>✓</span> {f}
                  </div>
                ))}
              </div>

              {/* AGB */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 12 }}>
                  <input type="checkbox" checked={form.agb} onChange={e => set("agb", e.target.checked)} style={{ marginTop: 3, accentColor: NAVY, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>Ich stimme den <a href="/agb" style={{ color: BLUE }}>AGB</a> zu *</span>
                </label>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.datenschutz} onChange={e => set("datenschutz", e.target.checked)} style={{ marginTop: 3, accentColor: NAVY, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: "#444" }}>Ich habe die <a href="/datenschutz" style={{ color: BLUE }}>Datenschutzerklärung</a> gelesen *</span>
                </label>
              </div>
            </div>
          )}

          {/* FEHLER */}
          {error && (
            <div style={{ marginTop: 12, padding: "12px 16px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.88rem" }}>
              ⚠️ {error}
            </div>
          )}

          {/* NAVIGATION */}
          <div className="nav-btns" style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 28px", borderRadius: 50, border: `2px solid ${NAVY}`, background: "transparent", color: NAVY, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                ← Zurück
              </button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <button onClick={handleWeiter} style={{ padding: "12px 32px", borderRadius: 50, border: "none", background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(26,63,111,0.28)" }}>
                Weiter →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || !form.agb || !form.datenschutz} style={{ padding: "12px 32px", borderRadius: 50, border: "none", background: loading || !form.agb || !form.datenschutz ? "#ccc" : `linear-gradient(135deg, ${GREEN}, #27AE60)`, color: "white", fontWeight: 700, cursor: loading || !form.agb || !form.datenschutz ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                {loading ? "Wird gespeichert..." : "Registrieren & Bezahlen →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
