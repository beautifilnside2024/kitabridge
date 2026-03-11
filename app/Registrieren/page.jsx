"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const t = {
  de: {
    steps: ["Persönliche Daten","Qualifikation","Sprachkenntnisse","Berufserfahrung","Verfügbarkeit","Abschluss"],
    step: "Schritt", of: "von",
    fillFields: "Bitte fülle alle Pflichtfelder aus",
    next: "Weiter", back: "Zurück", submit: "Registrierung abschließen", saving: "Wird gespeichert...",
    errorRequired: "Bitte fülle alle Pflichtfelder aus.",
    errorPassword: "Das Passwort muss mindestens 6 Zeichen lang sein.",
    errorAuth: "Fehler bei der Registrierung: ", errorDb: "Fehler beim Speichern: ",
    profileMode: "Wie möchtest du dich vorstellen?",
    profileModeDesc: "Du kannst deinen echten Namen angeben oder anonym bleiben. Dein Name wird erst sichtbar, wenn du eine Anfrage einer Kita annimmst.",
    modeReal: "Mit echtem Namen",
    modeRealDesc: "Vor- und Nachname sind nach Anfrage-Annahme sichtbar",
    modeAnon: "Anonym (Benutzername)",
    modeAnonDesc: "Nur dein Benutzername ist sichtbar – nie dein echter Name",
    firstName: "Vorname *", lastName: "Nachname *", email: "E-Mail-Adresse *",
    username: "Benutzername *", usernamePh: "z.B. Erzieher_Hamburg",
    password: "Passwort * (mind. 6 Zeichen)", phone: "Telefonnummer", city: "Aktueller Wohnort",
    firstNamePh: "Maria", lastNamePh: "Mustermann", emailPh: "maria@example.com",
    passwordPh: "••••••••", phonePh: "+49 123 456789", cityPh: "Berlin",
    qualification: "Berufsabschluss *", pleaseSelect: "Bitte wählen",
    qualifications: [
      "Staatlich anerkannte Erzieherin / Erzieher",
      "Kinderpflegerin / Kinderpfleger",
      "Sozialpädagogin / Sozialpädagoge",
      "Heilpädagogin / Heilpädagoge",
      "Kindheitspädagogin / Kindheitspädagoge",
      "Ergotherapeutin / Ergotherapeut",
      "Logopädin / Logopäde",
      "Sozialarbeiterin / Sozialarbeiter",
      "Psychologin / Psychologe",
      "Grundschullehrerin / Grundschullehrer",
      "Sonderpädagogin / Sonderpädagoge",
      "Schulbegleiterin / Schulbegleiter",
      "Motopädagogin / Motopädagoge",
      "Musiktherapeutin / Musiktherapeut",
      "Betreuerin / Betreuer",
      "Familienhelferin / Familienhelfer",
      "Stellvertretende Kita-Leitung",
      "Kinderkrankenpflegerin / Kinderkrankenpfleger",
      "Physiotherapeutin / Physiotherapeut",
      "Praktikantin / Praktikant",
      "Anerkennungspraktikantin / Anerkennungspraktikant",
      "Auszubildende / Auszubildender",
      "Studierende / Studierender",
      "Kita-Leitung",
      "Sonstige pädagogische Ausbildung"
    ],
    additionalQual: "Zusatzqualifikationen",
    additionalQuals: ["Montessori Zertifikat","Waldorf Ausbildung","Sprachförderung","Inklusionspädagogik","Musikpädagogik","Erste Hilfe Kind"],
    university: "Hochschulabschluss (falls vorhanden)", universityPh: "z.B. Bachelor Pädagogik",
    german: "Deutschkenntnisse *", english: "Englischkenntnisse", otherLangs: "Weitere Sprachen",
    none: "Keine", otherLangsPh: "z.B. Französisch B2, Arabisch Muttersprache",
    langLevels: ["A1 – Anfänger","A2 – Grundlagen","B1 – Mittelstufe","B2 – Gute Kenntnisse","C1 – Fortgeschritten","C2 – Muttersprachlich"],
    langNote: "Hinweis: Mindestens Deutschkenntnisse auf B1-Niveau sind erforderlich.",
    experience: "Jahre Berufserfahrung in der Kita *",
    experienceLevels: ["Berufseinsteiger (0-1 Jahre)","1-2 Jahre","2-5 Jahre","5-10 Jahre","Mehr als 10 Jahre"],
    ageGroups: "Erfahrung mit Altersgruppen",
    ageGroupList: ["Krippe (0-3 Jahre)","Kindergarten (3-6 Jahre)","Hort (6-12 Jahre)","Integrationskita","Familiengruppen","Ganztagesbetreuung"],
    description: "Kurze Beschreibung deiner Erfahrung", descriptionPh: "Beschreibe kurz deine bisherige Erfahrung in der Kita...",
    availableFrom: "Verfügbar ab *", workingHours: "Gewünschte Arbeitszeit *",
    workingHoursList: ["Vollzeit (38-40h)","Teilzeit (20-30h)","Minijob","Vertretung / Aushilfe"],
    state: "Gewünschtes Bundesland", flexible: "Egal / Flexibel",
    states: ["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"],
    summary: "Zusammenfassung",
    summaryFields: ["Name","E-Mail","Qualifikation","Deutschkenntnisse","Erfahrung","Verfügbar ab","Arbeitszeit","Bundesland"],
    flexibleLabel: "Flexibel",
    agbText: "Ich stimme den AGB zu *", privacyText: "Ich habe die Datenschutzerklärung gelesen *",
    welcome: "Willkommen bei KitaBridge!",
    thankYou: "Vielen Dank! Wir haben dein Profil erhalten und melden uns innerhalb von 24 Stunden.",
    emailSent: "📧 Willkommens-E-Mail gesendet!",
    emailInfo: "Wir haben eine E-Mail an {email} geschickt. Bitte prüfe auch deinen Spam-Ordner.",
    nextSteps: "Nächste Schritte:",
    nextStepsList: ["Wir prüfen dein Profil innerhalb von 24 Stunden","Du erhältst eine Bestätigung per E-Mail","Kitas in ganz Deutschland können dich kontaktieren"],
    viewProfile: "Mein Profil ansehen →", backHome: "Zurück zur Startseite",
    anonNote: "🔒 Dein echter Name bleibt immer verborgen – Kitas sehen nur deinen Benutzernamen.",
  },
  en: {
    steps: ["Personal Data","Qualification","Language Skills","Work Experience","Availability","Summary"],
    step: "Step", of: "of",
    fillFields: "Please fill in all required fields",
    next: "Next", back: "Back", submit: "Complete Registration", saving: "Saving...",
    errorRequired: "Please fill in all required fields.",
    errorPassword: "The password must be at least 6 characters long.",
    errorAuth: "Registration error: ", errorDb: "Saving error: ",
    profileMode: "How would you like to introduce yourself?",
    profileModeDesc: "You can use your real name or stay anonymous. Your name is only revealed when you accept a daycare's request.",
    modeReal: "With real name",
    modeRealDesc: "First and last name visible after accepting a request",
    modeAnon: "Anonymous (username)",
    modeAnonDesc: "Only your username is visible – never your real name",
    firstName: "First Name *", lastName: "Last Name *", email: "Email Address *",
    username: "Username *", usernamePh: "e.g. Educator_Hamburg",
    password: "Password * (min. 6 characters)", phone: "Phone Number", city: "Current City",
    firstNamePh: "Maria", lastNamePh: "Smith", emailPh: "maria@example.com",
    passwordPh: "••••••••", phonePh: "+49 123 456789", cityPh: "Berlin",
    qualification: "Professional Qualification *", pleaseSelect: "Please select",
    qualifications: [
      "State-certified Educator (Erzieherin/Erzieher)",
      "Childcare Worker (Kinderpfleger)",
      "Social Pedagogue (Sozialpädagoge)",
      "Special Needs Educator (Heilpädagoge)",
      "Early Childhood Educator (Kindheitspädagoge)",
      "Occupational Therapist (Ergotherapeut)",
      "Speech Therapist (Logopäde)",
      "Social Worker (Sozialarbeiter)",
      "Psychologist (Psychologe)",
      "Primary School Teacher (Grundschullehrer)",
      "Special Education Teacher (Sonderpädagoge)",
      "School Assistant (Schulbegleiter)",
      "Movement Educator (Motopädagoge)",
      "Music Therapist (Musiktherapeut)",
      "Caregiver / Supervisor (Betreuer)",
      "Family Support Worker (Familienhelfer)",
      "Deputy Daycare Manager",
      "Pediatric Nurse (Kinderkrankenpfleger)",
      "Physiotherapist (Physiotherapeut)",
      "Intern (Praktikant)",
      "Recognition Intern (Anerkennungspraktikant)",
      "Apprentice (Auszubildende)",
      "Student (Studierende)",
      "Daycare Manager (Kita-Leitung)",
      "Other pedagogical qualification"
    ],
    additionalQual: "Additional Qualifications",
    additionalQuals: ["Montessori Certificate","Waldorf Training","Language Promotion","Inclusive Pedagogy","Music Education","First Aid for Children"],
    university: "University Degree (if applicable)", universityPh: "e.g. Bachelor Education",
    german: "German Language Skills *", english: "English Language Skills", otherLangs: "Other Languages",
    none: "None", otherLangsPh: "e.g. French B2, Arabic native speaker",
    langLevels: ["A1 – Beginner","A2 – Elementary","B1 – Intermediate","B2 – Upper Intermediate","C1 – Advanced","C2 – Native/Proficient"],
    langNote: "Note: Minimum German language skills at B1 level are required.",
    experience: "Years of Daycare Experience *",
    experienceLevels: ["Career starter (0-1 years)","1-2 years","2-5 years","5-10 years","More than 10 years"],
    ageGroups: "Experience with Age Groups",
    ageGroupList: ["Nursery (0-3 years)","Kindergarten (3-6 years)","After-school care (6-12 years)","Inclusive daycare","Mixed-age groups","Full-day care"],
    description: "Brief description of your experience", descriptionPh: "Briefly describe your previous experience in childcare...",
    availableFrom: "Available from *", workingHours: "Desired Working Hours *",
    workingHoursList: ["Full-time (38-40h)","Part-time (20-30h)","Mini job","Substitute / Temp"],
    state: "Preferred Federal State", flexible: "Flexible / No preference",
    states: ["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"],
    summary: "Summary",
    summaryFields: ["Name","Email","Qualification","German Skills","Experience","Available from","Working Hours","Federal State"],
    flexibleLabel: "Flexible",
    agbText: "I agree to the Terms & Conditions *", privacyText: "I have read the Privacy Policy *",
    welcome: "Welcome to KitaBridge!",
    thankYou: "Thank you! We have received your profile and will get back to you within 24 hours.",
    emailSent: "📧 Welcome email sent!",
    emailInfo: "We sent an email to {email}. Please also check your spam folder.",
    nextSteps: "Next Steps:",
    nextStepsList: ["We review your profile within 24 hours","You will receive a confirmation by email","Daycare centers across Germany can contact you"],
    viewProfile: "View my profile →", backHome: "Back to home page",
    anonNote: "Your real name stays always hidden – daycares only see your username.",
  }
};

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
  color: "#1a1a2e", background: "white", marginBottom: 4, boxSizing: "border-box"
};
const labelStyle = { display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#4A5568", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 };
const selectStyle = { ...inputStyle, cursor: "pointer" };

export default function Registrieren() {
  const router = useRouter();
  const [lang, setLang] = useState("de");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // "real" = echter Name, "anon" = Benutzername
  const [profileMode, setProfileMode] = useState("real");
  const tx = t[lang];
  const STEPS = tx.steps;

  const [form, setForm] = useState({
    vorname: "", nachname: "", username: "", email: "", passwort: "", telefon: "", wohnort: "",
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

  const handleWeiter = () => {
    setError("");
    if (step === 0) {
      if (!form.email || !form.passwort) { setError(tx.errorRequired); return; }
      if (profileMode === "real" && (!form.vorname || !form.nachname)) { setError(tx.errorRequired); return; }
      if (profileMode === "anon" && !form.username) { setError(tx.errorRequired); return; }
      if (form.passwort.length < 6) { setError(tx.errorPassword); return; }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!form.agb || !form.datenschutz) return;
    setLoading(true);
    setError("");

    const createRes = await fetch("/api/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.passwort,
        einrichtung_name: profileMode === "real" ? form.vorname : form.username
      })
    });
    const createData = await createRes.json();

    if (createData.error && createData.error !== "A user with this email address has already been registered") {
      setError(tx.errorAuth + createData.error);
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase.from("fachkraefte").insert([{
      vorname: profileMode === "real" ? form.vorname : null,
      nachname: profileMode === "real" ? form.nachname : null,
      username: profileMode === "anon" ? form.username : null,
      anonym: profileMode === "anon",
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

    if (dbError) { setError(tx.errorDb + dbError.message); setLoading(false); return; }

    await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "fachkraft", data: form }) });
    await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "willkommen_fachkraft", data: form }) });

    setLoading(false);
    setSubmitted(true);
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const displayName = profileMode === "anon" ? form.username : `${form.vorname} ${form.nachname}`.trim();

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F0F4F9, #EAF7EF)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: "white", borderRadius: 24, padding: "40px 28px", maxWidth: 500, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(26,63,111,0.12)" }}>
          <div style={{ fontSize: "4rem", marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: NAVY, marginBottom: 16 }}>{tx.welcome}</h2>
          <p style={{ color: "#6B7897", lineHeight: 1.7, marginBottom: 28 }}>{tx.thankYou}</p>
          <div style={{ background: "#EAF7EF", borderRadius: 12, padding: 16, marginBottom: 28 }}>
            <div style={{ color: GREEN, fontWeight: 700, fontSize: "0.9rem" }}>{tx.emailSent}</div>
            <div style={{ color: "#444", fontSize: "0.85rem", marginTop: 8, lineHeight: 1.7 }}>
              {tx.emailInfo.split("{email}")[0]}<strong>{form.email}</strong>{tx.emailInfo.split("{email}")[1]}
            </div>
          </div>
          <div style={{ background: "#F8FAFF", borderRadius: 12, padding: 16, marginBottom: 28, textAlign: "left" }}>
            <div style={{ color: NAVY, fontWeight: 700, fontSize: "0.9rem", marginBottom: 8 }}>{tx.nextSteps}</div>
            <div style={{ color: "#444", fontSize: "0.85rem", lineHeight: 1.9 }}>
              {tx.nextStepsList.map((s, i) => <div key={i}>{i+1}. {s}</div>)}
            </div>
          </div>
          <button onClick={() => router.push("/fachkraft/einstellungen")} style={{ display: "block", padding: "12px 28px", borderRadius: 50, background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 12, width: "100%" }}>
            {tx.viewProfile}
          </button>
          <a href="/" style={{ display: "block", color: "#9BA8C0", fontSize: "0.88rem", textDecoration: "none" }}>{tx.backHome}</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F0F4F9, #EAF7EF)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, select:focus, textarea:focus { border-color: ${BLUE} !important; box-shadow: 0 0 0 3px rgba(36,113,163,0.1); }
        .lang-btn { background: none; border: 1.5px solid #E8EDF4; border-radius: 8px; padding: 4px 10px; cursor: pointer; font-size: 0.8rem; font-weight: 700; font-family: 'DM Sans', sans-serif; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s; color: #444; }
        .lang-btn:hover { border-color: #1A3F6F; }
        .lang-btn.active { border-color: #1A3F6F; background: #EEF2FF; color: #1A3F6F; }
        .flag-img { width: 20px; height: 14px; border-radius: 2px; object-fit: cover; }
        .mode-card { border: 2px solid #E2E8F0; border-radius: 14px; padding: 18px 20px; cursor: pointer; transition: all 0.2s; background: white; }
        .mode-card:hover { border-color: ${BLUE}; }
        .mode-card.selected { border-color: ${NAVY}; background: #F0F4FF; }
        @media (max-width: 600px) {
          .reg-header { padding: 14px 16px !important; }
          .reg-container { padding: 24px 16px !important; }
          .reg-card { padding: 24px 18px !important; }
          .two-col-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .checkbox-grid { grid-template-columns: 1fr !important; }
          .nav-btns-row { flex-direction: column !important; gap: 10px !important; }
          .nav-btns-row button { width: 100% !important; }
          .mode-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="reg-header" style={{ background: "white", borderBottom: "1px solid #E8EDF4", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700 }}>
          <span style={{ color: NAVY }}>Kita</span><span style={{ color: GREEN }}>Bridge</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 4 }}>
            <button className={`lang-btn${lang === "de" ? " active" : ""}`} onClick={() => setLang("de")}>
              <img className="flag-img" src="https://flagcdn.com/w20/de.png" alt="DE" />DE
            </button>
            <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>
              <img className="flag-img" src="https://flagcdn.com/w20/gb.png" alt="EN" />EN
            </button>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#6B7897" }}>{tx.step} {step + 1} {tx.of} {STEPS.length}</div>
        </div>
      </div>

      <div className="reg-container" style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>
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

        <div className="reg-card" style={{ background: "white", borderRadius: 24, padding: 36, boxShadow: "0 8px 40px rgba(26,63,111,0.1)", border: "1px solid #E8EDF4" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: NAVY, marginBottom: 8 }}>{STEPS[step]}</h2>
          <p style={{ color: "#9BA8C0", fontSize: "0.85rem", marginBottom: 28 }}>{tx.fillFields}</p>

          {/* ── STEP 0: Persönliche Daten ── */}
          {step === 0 && (
            <div>
              {/* PROFIL-MODUS WAHL */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: NAVY, marginBottom: 6 }}>{tx.profileMode}</div>
                <div style={{ fontSize: "0.82rem", color: "#9BA8C0", marginBottom: 14 }}>{tx.profileModeDesc}</div>
                <div className="mode-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className={`mode-card${profileMode === "real" ? " selected" : ""}`} onClick={() => setProfileMode("real")}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${profileMode === "real" ? NAVY : "#D1DAE8"}`, background: profileMode === "real" ? NAVY : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {profileMode === "real" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }}/>}
                      </div>
                      <span style={{ fontWeight: 700, color: NAVY, fontSize: "0.9rem" }}>👤 {tx.modeReal}</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#9BA8C0", paddingLeft: 28 }}>{tx.modeRealDesc}</div>
                  </div>
                  <div className={`mode-card${profileMode === "anon" ? " selected" : ""}`} onClick={() => setProfileMode("anon")}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${profileMode === "anon" ? NAVY : "#D1DAE8"}`, background: profileMode === "anon" ? NAVY : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {profileMode === "anon" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }}/>}
                      </div>
                      <span style={{ fontWeight: 700, color: NAVY, fontSize: "0.9rem" }}>🦸 {tx.modeAnon}</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#9BA8C0", paddingLeft: 28 }}>{tx.modeAnonDesc}</div>
                  </div>
                </div>
              </div>

              {/* FELDER je nach Modus */}
              {profileMode === "real" ? (
                <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div><label style={labelStyle}>{tx.firstName}</label><input style={inputStyle} value={form.vorname} onChange={e => set("vorname", e.target.value)} placeholder={tx.firstNamePh}/></div>
                  <div><label style={labelStyle}>{tx.lastName}</label><input style={inputStyle} value={form.nachname} onChange={e => set("nachname", e.target.value)} placeholder={tx.lastNamePh}/></div>
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{tx.username}</label>
                  <input style={inputStyle} value={form.username} onChange={e => set("username", e.target.value)} placeholder={tx.usernamePh}/>
                  <div style={{ background: "#EAF7EF", borderRadius: 10, padding: "10px 14px", marginTop: 8, fontSize: "0.82rem", color: GREEN, fontWeight: 600 }}>
                    {tx.anonNote}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}><label style={labelStyle}>{tx.email}</label><input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder={tx.emailPh}/></div>
              <div style={{ marginBottom: 16 }}><label style={labelStyle}>{tx.password}</label><input style={inputStyle} type="password" value={form.passwort} onChange={e => set("passwort", e.target.value)} placeholder={tx.passwordPh}/></div>
              <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><label style={labelStyle}>{tx.phone}</label><input style={inputStyle} value={form.telefon} onChange={e => set("telefon", e.target.value)} placeholder={tx.phonePh}/></div>
                <div><label style={labelStyle}>{tx.city}</label><input style={inputStyle} value={form.wohnort} onChange={e => set("wohnort", e.target.value)} placeholder={tx.cityPh}/></div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Qualifikation ── */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{tx.qualification}</label>
                <select style={selectStyle} value={form.qualifikation} onChange={e => set("qualifikation", e.target.value)}>
                  <option value="">{tx.pleaseSelect}</option>
                  {tx.qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{tx.additionalQual}</label>
                <div className="checkbox-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {tx.additionalQuals.map(z => (
                    <label key={z} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: form.zusatzqualifikation.includes(z) ? "#EAF7EF" : "white" }}>
                      <input type="checkbox" checked={form.zusatzqualifikation.includes(z)} onChange={() => set("zusatzqualifikation", form.zusatzqualifikation.includes(z) ? form.zusatzqualifikation.replace(z, "").trim() : (form.zusatzqualifikation + " " + z).trim())} style={{ accentColor: GREEN }}/>{z}
                    </label>
                  ))}
                </div>
              </div>
              <div><label style={labelStyle}>{tx.university}</label><input style={inputStyle} value={form.uniabschluss} onChange={e => set("uniabschluss", e.target.value)} placeholder={tx.universityPh}/></div>
            </div>
          )}

          {/* ── STEP 2: Sprachen ── */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{tx.german}</label>
                <select style={selectStyle} value={form.deutsch} onChange={e => set("deutsch", e.target.value)}>
                  <option value="">{tx.pleaseSelect}</option>
                  {tx.langLevels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{tx.english}</label>
                <select style={selectStyle} value={form.englisch} onChange={e => set("englisch", e.target.value)}>
                  <option value="">{tx.none}</option>
                  {tx.langLevels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>{tx.otherLangs}</label><input style={inputStyle} value={form.weitere_sprachen} onChange={e => set("weitere_sprachen", e.target.value)} placeholder={tx.otherLangsPh}/></div>
              <div style={{ marginTop: 20, background: "#F0F4F9", borderRadius: 12, padding: 16, fontSize: "0.85rem", color: "#6B7897" }}>{tx.langNote}</div>
            </div>
          )}

          {/* ── STEP 3: Erfahrung ── */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{tx.experience}</label>
                <select style={selectStyle} value={form.erfahrung_jahre} onChange={e => set("erfahrung_jahre", e.target.value)}>
                  <option value="">{tx.pleaseSelect}</option>
                  {tx.experienceLevels.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{tx.ageGroups}</label>
                <div className="checkbox-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {tx.ageGroupList.map(a => (
                    <label key={a} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: form.kita_alter.includes(a) ? "#EAF7EF" : "white" }}>
                      <input type="checkbox" checked={form.kita_alter.includes(a)} onChange={() => toggleArr("kita_alter", a)} style={{ accentColor: GREEN }}/>{a}
                    </label>
                  ))}
                </div>
              </div>
              <div><label style={labelStyle}>{tx.description}</label><textarea style={{ ...inputStyle, height: 100, resize: "vertical" }} value={form.beschreibung} onChange={e => set("beschreibung", e.target.value)} placeholder={tx.descriptionPh}/></div>
            </div>
          )}

          {/* ── STEP 4: Verfügbarkeit ── */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: 16 }}><label style={labelStyle}>{tx.availableFrom}</label><input style={inputStyle} type="date" value={form.verfuegbar_ab} onChange={e => set("verfuegbar_ab", e.target.value)}/></div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{tx.workingHours}</label>
                <div className="checkbox-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {tx.workingHoursList.map(a => (
                    <label key={a} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.88rem", color: "#444", padding: "12px 16px", borderRadius: 8, border: `1.5px solid ${form.arbeitszeit === a ? BLUE : "#E2E8F0"}`, background: form.arbeitszeit === a ? "#EBF4FF" : "white" }}>
                      <input type="radio" name="arbeitszeit" value={a} checked={form.arbeitszeit === a} onChange={() => set("arbeitszeit", a)} style={{ accentColor: BLUE }}/>{a}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>{tx.state}</label>
                <select style={selectStyle} value={form.bundesland} onChange={e => set("bundesland", e.target.value)}>
                  <option value="">{tx.flexible}</option>
                  {tx.states.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 5: Zusammenfassung ── */}
          {step === 5 && (
            <div>
              <div style={{ background: "#F8FAFF", borderRadius: 16, padding: 20, marginBottom: 24 }}>
                <h3 style={{ color: NAVY, fontSize: "0.95rem", fontWeight: 700, marginBottom: 12 }}>{tx.summary}</h3>
                {[
                  [tx.summaryFields[0], profileMode === "anon" ? `🦸 ${form.username} (Anonym)` : `${form.vorname} ${form.nachname}`],
                  [tx.summaryFields[1], form.email],
                  [tx.summaryFields[2], form.qualifikation],
                  [tx.summaryFields[3], form.deutsch],
                  [tx.summaryFields[4], form.erfahrung_jahre],
                  [tx.summaryFields[5], form.verfuegbar_ab],
                  [tx.summaryFields[6], form.arbeitszeit],
                  [tx.summaryFields[7], form.bundesland || tx.flexibleLabel],
                ].map(([k, v]) => v ? (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #E8EDF4", fontSize: "0.85rem", gap: 8 }}>
                    <span style={{ color: "#9BA8C0", fontWeight: 600, flexShrink: 0 }}>{k}</span>
                    <span style={{ color: NAVY, textAlign: "right" }}>{v}</span>
                  </div>
                ) : null)}
              </div>

              {profileMode === "anon" && (
                <div style={{ background: "#EAF7EF", borderRadius: 12, padding: 14, marginBottom: 20, fontSize: "0.85rem", color: GREEN, fontWeight: 600 }}>
                  🔒 {tx.anonNote}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 12 }}>
                  <input type="checkbox" checked={form.agb} onChange={e => set("agb", e.target.checked)} style={{ marginTop: 2, accentColor: NAVY, flexShrink: 0 }}/>
                  <span style={{ fontSize: "0.85rem", color: "#444" }}><a href="/agb" style={{ color: BLUE }}>{tx.agbText}</a></span>
                </label>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.datenschutz} onChange={e => set("datenschutz", e.target.checked)} style={{ marginTop: 2, accentColor: NAVY, flexShrink: 0 }}/>
                  <span style={{ fontSize: "0.85rem", color: "#444" }}><a href="/datenschutz" style={{ color: BLUE }}>{tx.privacyText}</a></span>
                </label>
              </div>
              {error && <div style={{ padding: "12px 16px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.88rem", marginBottom: 16 }}>⚠️ {error}</div>}
            </div>
          )}

          {error && step < 5 && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, color: "#9B1C1C", fontSize: "0.88rem" }}>⚠️ {error}</div>
          )}

          <div className="nav-btns-row" style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 12 }}>
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 28px", borderRadius: 50, border: `2px solid ${NAVY}`, background: "transparent", color: NAVY, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                {tx.back}
              </button>
            ) : <div/>}
            {step < STEPS.length - 1 ? (
              <button onClick={handleWeiter} style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: `linear-gradient(135deg, ${NAVY}, ${BLUE})`, color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(26,63,111,0.28)" }}>
                {tx.next}
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!form.agb || !form.datenschutz || loading}
                style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: form.agb && form.datenschutz ? `linear-gradient(135deg, ${GREEN}, #27AE60)` : "#ccc", color: "white", fontWeight: 700, cursor: form.agb && form.datenschutz ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif" }}>
                {loading ? tx.saving : tx.submit}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}