"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const C = {
  navy: "#0F2442", navyMid: "#1A3F6F", blue: "#2471A3",
  green: "#16A34A", red: "#DC2626",
  surface: "#F7F9FC", border: "#E4EAF4", muted: "#8A96B0", text: "#1C2B4A",
};

const STEPS = ["Einrichtung", "Adresse", "Ansprechpartner", "Zugangsdaten", "Abschluss"];

interface FormState {
  einrichtung_name: string; einrichtungstyp: string; traeger: string;
  beschreibung: string; stellen_anzahl: string; strasse: string;
  hausnummer: string; plz: string; ort: string; bundesland: string;
  ansprech_name: string; ansprech_rolle: string; telefon: string;
  email: string; passwort: string; agb: boolean; datenschutz: boolean;
}

export default function ArbeitgeberRegistrieren() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<FormState>({
    einrichtung_name: "", einrichtungstyp: "", traeger: "", beschreibung: "", stellen_anzahl: "",
    strasse: "", hausnummer: "", plz: "", ort: "", bundesland: "",
    ansprech_name: "", ansprech_rolle: "", telefon: "",
    email: "", passwort: "", agb: false, datenschutz: false,
  });

  const set = (key: keyof FormState, value: any) => setForm(f => ({ ...f, [key]: value }));

  const validateStep = () => {
    setError("");
    if (step === 0 && (!form.einrichtung_name || !form.einrichtungstyp)) { setError("Bitte fülle alle Pflichtfelder aus."); return false; }
    if (step === 1 && (!form.strasse || !form.plz || !form.ort || !form.bundesland)) { setError("Bitte fülle alle Pflichtfelder aus."); return false; }
    if (step === 2 && (!form.ansprech_name || !form.telefon)) { setError("Bitte fülle alle Pflichtfelder aus."); return false; }
    if (step === 3) {
      if (!form.email || !form.passwort) { setError("Bitte fülle alle Pflichtfelder aus."); return false; }
      if (form.passwort.length < 6) { setError("Passwort muss mindestens 6 Zeichen lang sein."); return false; }
    }
    return true;
  };

  const handleWeiter = () => { if (validateStep()) setStep(s => s + 1); };

  const handleSubmit = async () => {
    if (!form.agb || !form.datenschutz) { setError("Bitte stimme den AGB und der Datenschutzerklärung zu."); return; }
    setLoading(true); setError("");
    try {
      const createRes = await fetch("/api/create-user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, password: form.passwort, einrichtung_name: form.einrichtung_name }) });
      const createData = await createRes.json();
      if (createData.error && !createData.error.includes("already been registered")) { setError("Fehler: " + createData.error); setLoading(false); return; }
      const { data: ag, error: dbError } = await supabase.from("arbeitgeber").insert([{ einrichtung_name: form.einrichtung_name, einrichtungstyp: form.einrichtungstyp, traeger: form.traeger, beschreibung: form.beschreibung, stellen_anzahl: form.stellen_anzahl, strasse: form.strasse, hausnummer: form.hausnummer, plz: form.plz, ort: form.ort, bundesland: form.bundesland, ansprech_name: form.ansprech_name, ansprech_rolle: form.ansprech_rolle, telefon: form.telefon, email: form.email, status: "ausstehend" }]).select().single();
      if (dbError) { setError("Fehler: " + dbError.message); setLoading(false); return; }
      try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "willkommen_arbeitgeber", data: { ...form, id: ag.id } }) }); } catch {}
      router.push(`/bezahlung?id=${ag.id}&email=${encodeURIComponent(form.email)}&name=${encodeURIComponent(form.einrichtung_name)}`);
    } catch (e: any) { setError("Unerwarteter Fehler: " + e.message); setLoading(false); }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  const einrichtungstypen = ["Krippe (0-3 Jahre)", "Kindergarten (3-6 Jahre)", "Kita (0-6 Jahre)", "Hort (6-12 Jahre)", "Integrationskita", "Waldkita", "Montessori Kita", "Betriebskita"];
  const traegerListe = ["Öffentlich (kommunal)", "AWO", "Caritas", "Diakonie", "DRK", "Paritätischer Wohlfahrtsverband", "Privat / Eigenträger", "Sonstiger freier Träger"];
  const rollen = ["Kita-Leitung", "Stellv. Leitung", "Träger-Geschäftsführung", "HR / Personal", "Sonstiges"];
  const stellen = ["1 Stelle", "2-3 Stellen", "4-5 Stellen", "6-10 Stellen", "Mehr als 10 Stellen"];
  const bundeslaender = ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"];

  const fieldStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", border: `1.5px solid ${C.border}`, borderRadius: 11, fontSize: "0.9rem", color: C.text, background: "white", outline: "none", fontFamily: "'Sora', sans-serif" };
  const selectStyle: React.CSSProperties = { ...fieldStyle, appearance: "none" as any, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A96B0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 13px center", paddingRight: 38 };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.7rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 7 };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, #EEF2F8 0%, #F7F9FC 50%, #EAF0F8 100%)`, fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { -webkit-font-smoothing: antialiased; }
        input:focus, select:focus, textarea:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.12) !important; outline: none; }
        button { font-family: 'Sora', sans-serif; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .three-one { display: grid; grid-template-columns: 3fr 1fr; gap: 14px; }
        .one-two { display: grid; grid-template-columns: 1fr 2fr; gap: 14px; }
        @media (max-width: 560px) {
          .two-col, .three-one, .one-two { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ background: "rgba(247,249,252,0.9)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.navy }}>Kita</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.3rem", fontWeight: 800, color: C.green }}>Bridge</span>
        </a>
        <div style={{ fontSize: "0.78rem", color: C.muted, fontWeight: 600 }}>Schritt {step + 1} von {STEPS.length}</div>
      </header>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px" }}>

        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: "100%", height: 4, borderRadius: 99, background: i <= step ? C.navyMid : C.border, transition: "background 0.3s" }} />
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color: i === step ? C.navyMid : i < step ? C.green : C.muted, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "white", borderRadius: 22, padding: "32px 28px", border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(15,36,66,0.1)" }}>

          <div style={{ marginBottom: 26 }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Schritt {step + 1}</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 800, color: C.text }}>{STEPS[step]}</h2>
          </div>

          {/* STEP 0: Einrichtung */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Name der Einrichtung *</label>
                <input style={fieldStyle} value={form.einrichtung_name} onChange={e => set("einrichtung_name", e.target.value)} placeholder="z.B. Kita Sonnenschein" />
              </div>
              <div className="two-col">
                <div>
                  <label style={labelStyle}>Einrichtungstyp *</label>
                  <select style={selectStyle} value={form.einrichtungstyp} onChange={e => set("einrichtungstyp", e.target.value)}>
                    <option value="">– wählen –</option>
                    {einrichtungstypen.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Träger</label>
                  <select style={selectStyle} value={form.traeger} onChange={e => set("traeger", e.target.value)}>
                    <option value="">– wählen –</option>
                    {traegerListe.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Offene Stellen</label>
                <select style={selectStyle} value={form.stellen_anzahl} onChange={e => set("stellen_anzahl", e.target.value)}>
                  <option value="">– wählen –</option>
                  {stellen.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Kurzbeschreibung</label>
                <textarea style={{ ...fieldStyle, resize: "vertical" }} rows={3} value={form.beschreibung} onChange={e => set("beschreibung", e.target.value)} placeholder="Was macht Ihre Einrichtung besonders?" />
              </div>
            </div>
          )}

          {/* STEP 1: Adresse */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="three-one">
                <div>
                  <label style={labelStyle}>Straße *</label>
                  <input style={fieldStyle} value={form.strasse} onChange={e => set("strasse", e.target.value)} placeholder="Musterstraße" />
                </div>
                <div>
                  <label style={labelStyle}>Nr.</label>
                  <input style={fieldStyle} value={form.hausnummer} onChange={e => set("hausnummer", e.target.value)} placeholder="12" />
                </div>
              </div>
              <div className="one-two">
                <div>
                  <label style={labelStyle}>PLZ *</label>
                  <input style={fieldStyle} value={form.plz} onChange={e => set("plz", e.target.value)} placeholder="10115" />
                </div>
                <div>
                  <label style={labelStyle}>Ort *</label>
                  <input style={fieldStyle} value={form.ort} onChange={e => set("ort", e.target.value)} placeholder="Berlin" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bundesland *</label>
                <select style={selectStyle} value={form.bundesland} onChange={e => set("bundesland", e.target.value)}>
                  <option value="">– wählen –</option>
                  {bundeslaender.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Ansprechpartner */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Name des Ansprechpartners *</label>
                <input style={fieldStyle} value={form.ansprech_name} onChange={e => set("ansprech_name", e.target.value)} placeholder="Maria Mustermann" />
              </div>
              <div>
                <label style={labelStyle}>Rolle / Position</label>
                <select style={selectStyle} value={form.ansprech_rolle} onChange={e => set("ansprech_rolle", e.target.value)}>
                  <option value="">– wählen –</option>
                  {rollen.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Telefonnummer *</label>
                <input style={fieldStyle} type="tel" value={form.telefon} onChange={e => set("telefon", e.target.value)} placeholder="+49 123 456789" />
              </div>
            </div>
          )}

          {/* STEP 3: Zugangsdaten */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: "13px 16px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 11, fontSize: "0.82rem", color: C.blue, lineHeight: 1.65, fontWeight: 500 }}>
                ℹ️ Mit diesen Zugangsdaten melden Sie sich später im Dashboard an.
              </div>
              <div>
                <label style={labelStyle}>E-Mail-Adresse *</label>
                <input style={fieldStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="kita@example.de" autoComplete="email" />
              </div>
              <div>
                <label style={labelStyle}>Passwort * (min. 6 Zeichen)</label>
                <div style={{ position: "relative" }}>
                  <input style={{ ...fieldStyle, paddingRight: 44 }} type={showPassword ? "text" : "password"} value={form.passwort} onChange={e => set("passwort", e.target.value)} placeholder="••••••••" autoComplete="new-password" />
                  <button onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0, display: "flex" }}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                {form.passwort && (
                  <div style={{ marginTop: 8, display: "flex", gap: 4 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: form.passwort.length >= i * 3 ? (form.passwort.length >= 10 ? C.green : C.blue) : C.border, transition: "background 0.2s" }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Abschluss */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Summary */}
              <div style={{ background: C.surface, borderRadius: 16, padding: 20, border: `1.5px solid ${C.border}` }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>Zusammenfassung</div>
                {([
                  ["Einrichtung", form.einrichtung_name], ["Typ", form.einrichtungstyp],
                  ["Träger", form.traeger], ["Ort", `${form.plz} ${form.ort}`],
                  ["Bundesland", form.bundesland], ["Ansprechpartner", form.ansprech_name],
                  ["Telefon", form.telefon], ["E-Mail", form.email],
                  ["Offene Stellen", form.stellen_anzahl],
                ] as [string, string][]).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: "0.84rem", gap: 12 }}>
                    <span style={{ color: C.muted, fontWeight: 600, flexShrink: 0 }}>{k}</span>
                    <span style={{ color: C.text, textAlign: "right", wordBreak: "break-all" }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, #1B5E98 100%)`, borderRadius: 18, padding: "22px 24px", color: "white", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
                <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Nach der Registrierung</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 800, marginBottom: 2 }}>
                  299 € <span style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.6 }}>/ Monat</span>
                </div>
                <div style={{ fontSize: "0.75rem", opacity: 0.5, marginBottom: 16 }}>zzgl. MwSt. · Monatlich kündbar</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {["Zugang zur Fachkräfte-Datenbank", "Direktkontakt ohne Vermittler", "Keine Provision", "Monatlich kündbar"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "rgba(255,255,255,0.8)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { key: "agb" as keyof FormState, label: <span>Ich stimme den <a href="/agb" target="_blank" style={{ color: C.blue, fontWeight: 700, textDecoration: "none" }}>AGB</a> zu *</span> },
                  { key: "datenschutz" as keyof FormState, label: <span>Ich habe die <a href="/datenschutz" target="_blank" style={{ color: C.blue, fontWeight: 700, textDecoration: "none" }}>Datenschutzerklärung</a> gelesen *</span> },
                ].map(item => (
                  <label key={item.key} style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", padding: "12px 14px", background: (form[item.key] as boolean) ? "#ECFDF5" : C.surface, borderRadius: 11, border: `1.5px solid ${(form[item.key] as boolean) ? "#A7F3D0" : C.border}`, transition: "all 0.15s" }}>
                    <input type="checkbox" checked={form[item.key] as boolean} onChange={e => set(item.key, e.target.checked)} style={{ marginTop: 2, accentColor: C.green, width: 16, height: 16, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.84rem", color: C.text, lineHeight: 1.5 }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.84rem", fontWeight: 500 }}>
              {error}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, gap: 12 }}>
            {step > 0 ? (
              <button onClick={() => { setStep(s => s - 1); setError(""); }} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, border: `1.5px solid ${C.border}`, background: "white", color: C.muted, fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Zurück
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button onClick={handleWeiter} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 28px", borderRadius: 11, border: "none", background: C.navyMid, color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", boxShadow: "0 4px 14px rgba(26,63,111,0.25)", transition: "all 0.15s" }}>
                Weiter
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || !form.agb || !form.datenschutz} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 28px", borderRadius: 11, border: "none", background: loading || !form.agb || !form.datenschutz ? C.border : C.green, color: loading || !form.agb || !form.datenschutz ? C.muted : "white", fontWeight: 700, fontSize: "0.88rem", cursor: loading || !form.agb || !form.datenschutz ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
                {loading ? (
                  <>
                    <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Wird gespeichert...
                  </>
                ) : (
                  <>
                    Registrieren & Bezahlen
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.76rem", color: C.muted }}>
          Bereits registriert?{" "}
          <a href="/login?rolle=kita" style={{ color: C.navyMid, fontWeight: 700, textDecoration: "none" }}>Einloggen</a>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}