import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const body = await request.json();
  const { type, data } = body;

  let subject = "";
  let html = "";
  let to = "kitabridge@protonmail.com";

  if (type === "arbeitgeber") {
    subject = `🏢 Neuer Arbeitgeber: ${data.einrichtung_name}`;
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A3F6F;">Neuer Arbeitgeber registriert!</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding:8px; color:#666;">Einrichtung</td><td style="padding:8px; font-weight:bold;">${data.einrichtung_name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px; color:#666;">Typ</td><td style="padding:8px;">${data.einrichtungstyp}</td></tr>
          <tr><td style="padding:8px; color:#666;">Träger</td><td style="padding:8px;">${data.traeger}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px; color:#666;">Ort</td><td style="padding:8px;">${data.plz} ${data.ort}, ${data.bundesland}</td></tr>
          <tr><td style="padding:8px; color:#666;">Ansprechpartner</td><td style="padding:8px;">${data.ansprech_name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px; color:#666;">E-Mail</td><td style="padding:8px;">${data.email}</td></tr>
          <tr><td style="padding:8px; color:#666;">Telefon</td><td style="padding:8px;">${data.telefon || "-"}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px; color:#666;">Offene Stellen</td><td style="padding:8px;">${data.stellen_anzahl}</td></tr>
        </table>
        <a href="https://kitabridge.vercel.app/admin" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#1A3F6F; color:white; text-decoration:none; border-radius:8px; font-weight:bold;">Im Admin ansehen</a>
      </div>
    `;

  } else if (type === "fachkraft") {
    // Admin-Benachrichtigung
    subject = `👤 Neue Fachkraft: ${data.vorname} ${data.nachname}`;
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A3F6F;">Neue Fachkraft registriert!</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding:8px; color:#666;">Name</td><td style="padding:8px; font-weight:bold;">${data.vorname} ${data.nachname}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px; color:#666;">E-Mail</td><td style="padding:8px;">${data.email}</td></tr>
          <tr><td style="padding:8px; color:#666;">Qualifikation</td><td style="padding:8px;">${data.qualifikation}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px; color:#666;">Deutschkenntnisse</td><td style="padding:8px;">${data.deutsch}</td></tr>
          <tr><td style="padding:8px; color:#666;">Erfahrung</td><td style="padding:8px;">${data.erfahrung_jahre}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px; color:#666;">Verfügbar ab</td><td style="padding:8px;">${data.verfuegbar_ab}</td></tr>
          <tr><td style="padding:8px; color:#666;">Arbeitszeit</td><td style="padding:8px;">${data.arbeitszeit}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px; color:#666;">Bundesland</td><td style="padding:8px;">${data.bundesland || "Flexibel"}</td></tr>
        </table>
        <a href="https://kitabridge.vercel.app/admin" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#1A3F6F; color:white; text-decoration:none; border-radius:8px; font-weight:bold;">Im Admin ansehen</a>
      </div>
    `;

  } else if (type === "willkommen_fachkraft") {
    // Willkommens-E-Mail an die Fachkraft selbst
    to = data.email;
    subject = `Willkommen bei KitaBridge, ${data.vorname}! 🎉`;
    html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0; padding:0; background:#F0F4F9; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width:600px; margin:0 auto; padding:40px 20px;">

          <!-- Header -->
          <div style="background:#1A3F6F; borderRadius:16px 16px 0 0; padding:32px; text-align:center; border-radius:16px 16px 0 0;">
            <div style="font-size:2rem; font-weight:800; color:white; letter-spacing:-0.5px;">
              Kita<span style="color:#4ADE80;">Bridge</span>
            </div>
            <div style="color:rgba(255,255,255,0.6); font-size:0.85rem; margin-top:4px;">Die Brücke zwischen Fachkräften und Kitas</div>
          </div>

          <!-- Body -->
          <div style="background:white; padding:40px 36px; border-radius:0 0 16px 16px; box-shadow:0 4px 24px rgba(26,63,111,0.10);">

            <h1 style="color:#1A3F6F; font-size:1.6rem; margin:0 0 8px 0;">
              Willkommen, ${data.vorname}! 🎉
            </h1>
            <p style="color:#6B7897; font-size:0.95rem; margin:0 0 28px 0; line-height:1.6;">
              Schön, dass du dabei bist! Deine Registrierung bei KitaBridge war erfolgreich.
            </p>

            <!-- Status Box -->
            <div style="background:#FFF7ED; border:1px solid #FED7AA; border-radius:12px; padding:20px; margin-bottom:28px;">
              <div style="font-weight:700; color:#92400E; margin-bottom:6px;">⏳ Dein Profil wird geprüft</div>
              <div style="color:#78350F; font-size:0.88rem; line-height:1.6;">
                Wir prüfen dein Profil innerhalb von <strong>24 Stunden</strong> und schalten es frei. 
                Danach können Kitas aus ganz Deutschland dich direkt kontaktieren.
              </div>
            </div>

            <!-- Nächste Schritte -->
            <h2 style="color:#1A3F6F; font-size:1.1rem; margin:0 0 16px 0;">📋 Wie geht es weiter?</h2>

            <table style="width:100%; border-collapse:collapse; margin-bottom:28px;">
              <tr>
                <td style="padding:14px 0; border-bottom:1px solid #F0F4F9; vertical-align:top;">
                  <div style="display:inline-block; width:28px; height:28px; background:#1A3F6F; color:white; border-radius:50%; text-align:center; line-height:28px; font-weight:700; font-size:0.8rem; margin-right:12px;">1</div>
                  <strong style="color:#1A3F6F;">Profil-Freischaltung</strong>
                  <div style="color:#6B7897; font-size:0.85rem; margin-top:4px; padding-left:40px;">Wir prüfen dein Profil und schalten es innerhalb von 24 Stunden frei.</div>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 0; border-bottom:1px solid #F0F4F9; vertical-align:top;">
                  <div style="display:inline-block; width:28px; height:28px; background:#1A3F6F; color:white; border-radius:50%; text-align:center; line-height:28px; font-weight:700; font-size:0.8rem; margin-right:12px;">2</div>
                  <strong style="color:#1A3F6F;">Kitas finden dich</strong>
                  <div style="color:#6B7897; font-size:0.85rem; margin-top:4px; padding-left:40px;">Arbeitgeber können dein Profil sehen und dich direkt per E-Mail oder Telefon kontaktieren.</div>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 0; vertical-align:top;">
                  <div style="display:inline-block; width:28px; height:28px; background:#1E8449; color:white; border-radius:50%; text-align:center; line-height:28px; font-weight:700; font-size:0.8rem; margin-right:12px;">3</div>
                  <strong style="color:#1E8449;">Traumjob gefunden ✅</strong>
                  <div style="color:#6B7897; font-size:0.85rem; margin-top:4px; padding-left:40px;">Du entscheidest, welche Anfragen dich interessieren – völlig unverbindlich.</div>
                </td>
              </tr>
            </table>

            <!-- Tipp Box -->
            <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:12px; padding:20px; margin-bottom:28px;">
              <div style="font-weight:700; color:#1E40AF; margin-bottom:8px;">💡 Tipp: Profil vervollständigen</div>
              <div style="color:#1E3A8A; font-size:0.88rem; line-height:1.6;">
                Je vollständiger dein Profil ist, desto mehr Anfragen erhältst du! 
                Füge eine persönliche Beschreibung und alle deine Qualifikationen hinzu.
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align:center; margin-bottom:28px;">
              <a href="https://kitabridge.vercel.app/fachkraft/einstellungen" 
                 style="display:inline-block; background:#1A3F6F; color:white; text-decoration:none; padding:14px 32px; border-radius:12px; font-weight:700; font-size:0.95rem;">
                Mein Profil ansehen →
              </a>
            </div>

            <hr style="border:none; border-top:1px solid #F0F4F9; margin:24px 0;" />

            <p style="color:#9BA8C0; font-size:0.82rem; text-align:center; margin:0; line-height:1.6;">
              Du hast Fragen? Schreib uns: <a href="mailto:kitabridge@protonmail.com" style="color:#2471A3;">kitabridge@protonmail.com</a><br/>
              KitaBridge · Heusenstammer Weg 69 · 63071 Offenbach am Main
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  try {
    await resend.emails.send({
      from: "KitaBridge <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
