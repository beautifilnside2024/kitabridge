import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    if (type === "willkommen_fachkraft") {
      await resend.emails.send({
        from: "KitaBridge <onboarding@resend.dev>",
        to: data.email,
        subject: "Willkommen bei KitaBridge! · Welcome to KitaBridge! 🎉",
        html: `<html>
<body style="margin:0;padding:0;background:#F0F4F9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background:linear-gradient(135deg,#1A3F6F,#2471A3);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
    <div style="font-size:28px;font-weight:800;color:white;">Kita<span style="color:#27AE60;">Bridge</span></div>
    <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:6px;">Die Plattform für pädagogische Fachkräfte · The platform for childcare professionals</div>
  </td></tr>

  <tr><td style="background:white;padding:40px;border-radius:0 0 16px 16px;">

    <div style="text-align:center;font-size:48px;margin-bottom:16px;">🎉</div>

    <!-- DEUTSCH -->
    <div style="border-left:4px solid #1A3F6F;padding-left:20px;margin-bottom:32px;">
      <p style="font-size:18px;font-weight:700;color:#1A3F6F;margin:0 0 12px;">Herzlich willkommen bei KitaBridge, ${data.vorname}!</p>
      <p style="font-size:14px;color:#444;line-height:1.8;margin:0 0 12px;">
        Wir freuen uns sehr, dich in unserer Community begrüßen zu dürfen! 🌟
      </p>
      <p style="font-size:14px;color:#444;line-height:1.8;margin:0 0 12px;">
        Bei KitaBridge kannst du dein Profil erstellen und wirst direkt von Kitas und sozialen Einrichtungen in ganz Deutschland kontaktiert – <strong>kein Lebenslauf, kein Anschreiben</strong> nötig.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.8;margin:0;">
        Einfach sichtbar sein – und die passende Einrichtung meldet sich bei dir. 💪
      </p>
    </div>

    <hr style="border:none;border-top:2px dashed #E8EDF4;margin:0 0 32px;">

    <!-- ENGLISH -->
    <div style="border-left:4px solid #27AE60;padding-left:20px;margin-bottom:32px;">
      <p style="font-size:18px;font-weight:700;color:#1A3F6F;margin:0 0 12px;">Welcome to KitaBridge, ${data.vorname}!</p>
      <p style="font-size:14px;color:#444;line-height:1.8;margin:0 0 12px;">
        We are so happy to have you here! 🌟
      </p>
      <p style="font-size:14px;color:#444;line-height:1.8;margin:0 0 12px;">
        At KitaBridge, you can create your profile and get contacted directly by daycare centers and social institutions across Germany – <strong>no CV, no cover letter</strong> required.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.8;margin:0;">
        Simply be visible – and the right employer will reach out to you. 💪
      </p>
    </div>

    <hr style="border:none;border-top:1px solid #E8EDF4;margin:0 0 32px;">

    <p style="font-size:15px;font-weight:700;color:#1A3F6F;margin:0 0 16px;">
      Deine nächsten Schritte · Your next steps:
    </p>
    <p style="font-size:14px;color:#444;line-height:2;margin:0 0 32px;">
      ✏️ Profil vervollständigen · Complete your profile<br>
      🔍 Von Kitas gefunden werden · Get found by daycare centers<br>
      📩 Kontaktiert werden · Get contacted directly<br>
      🤝 Deinen Traumjob finden · Find your dream job
    </p>

    <div style="text-align:center;">
      <a href="https://kitabridge.de/fachkraft/einstellungen" style="display:inline-block;background:linear-gradient(135deg,#1E8449,#27AE60);color:white;font-weight:700;font-size:16px;padding:16px 40px;border-radius:50px;text-decoration:none;">
        Jetzt Profil vervollständigen · Complete Profile →
      </a>
    </div>

  </td></tr>

  <tr><td style="padding:24px 40px;text-align:center;">
    <p style="font-size:12px;color:#9BA8C0;margin:0 0 8px;">Bei Fragen · Questions: <a href="mailto:hallo@kitabridge.de" style="color:#2471A3;">support@kitabridge.de</a></p>
    <p style="font-size:11px;color:#C0CAD8;margin:0;">© 2026 KitaBridge</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`
      });
    }

    if (type === "fachkraft") {
      await resend.emails.send({
        from: "KitaBridge <onboarding@resend.dev>",
        to: "hallo@kitabridge.de",
        subject: `Neue Fachkraft: ${data.vorname} ${data.nachname}`,
        html: `<h2>Neue Registrierung</h2><p><strong>Name:</strong> ${data.vorname} ${data.nachname}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Qualifikation:</strong> ${data.qualifikation}</p>`
      });
    }

    if (type === "arbeitgeber") {
      await resend.emails.send({
        from: "KitaBridge <onboarding@resend.dev>",
        to: "hallo@kitabridge.de",
        subject: `Neue Einrichtung: ${data.einrichtung_name}`,
        html: `<h2>Neue Arbeitgeber-Registrierung</h2>
          <p><strong>Einrichtung:</strong> ${data.einrichtung_name}</p>
          <p><strong>Typ:</strong> ${data.einrichtungstyp}</p>
          <p><strong>Ort:</strong> ${data.plz} ${data.ort}</p>
          <p><strong>Ansprechpartner:</strong> ${data.ansprech_name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Telefon:</strong> ${data.telefon}</p>
          <p><strong>Stellen:</strong> ${data.stellen_anzahl}</p>`
      });
    }

    if (type === "willkommen_arbeitgeber") {
      await resend.emails.send({
        from: "KitaBridge <onboarding@resend.dev>",
        to: data.email,
        subject: "Willkommen bei KitaBridge – So geht es jetzt weiter 🎉",
        html: `<html>
<body style="margin:0;padding:0;background:#F0F4F9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1A3F6F,#2471A3);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
    <div style="font-size:28px;font-weight:800;color:white;">Kita<span style="color:#27AE60;">Bridge</span></div>
    <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:6px;">Die Plattform für Kitas & pädagogische Fachkräfte</div>
  </td></tr>
  <tr><td style="background:white;padding:40px;border-radius:0 0 16px 16px;">
    <p style="font-size:18px;font-weight:700;color:#1A3F6F;margin:0 0 8px;">Herzlich willkommen, ${data.ansprech_name}! 🎉</p>
    <p style="font-size:15px;color:#6B7897;line-height:1.7;margin:0 0 24px;">Wir freuen uns, <strong>${data.einrichtung_name}</strong> als neue Einrichtung begrüßen zu dürfen.</p>
    <hr style="border:none;border-top:1px solid #E8EDF4;margin:0 0 24px;">
    <div style="background:#EAF7EF;border-left:4px solid #1E8449;border-radius:0 12px 12px 0;padding:20px 24px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:800;color:#1E8449;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">📋 Unser Ansatz – bitte kurz lesen</p>
      <p style="font-size:14px;color:#2D4A2D;line-height:1.75;margin:0 0 10px;">Bei KitaBridge bitten wir Sie, Fachkräfte die über uns zu Ihnen kommen <strong>ausschließlich nach ihren Zeugnissen und Qualifikationsnachweisen</strong> zu beurteilen – kein Lebenslauf, kein Anschreiben erforderlich.</p>
      <p style="font-size:14px;color:#2D4A2D;line-height:1.75;margin:0 0 10px;">So finden beide Seiten schneller zusammen. 🤝</p>
      <p style="font-size:14px;color:#2D4A2D;line-height:1.75;margin:0;">Wenn eine Fachkraft von sich aus ein Anschreiben oder Lebenslauf einreichen möchte, ist das selbstverständlich willkommen.</p>
    </div>
    <p style="font-size:13px;color:#9BA8C0;font-style:italic;margin:0 0 32px;">Da Sie sich registriert haben, gehen wir davon aus dass Sie mit diesem Ansatz einverstanden sind. Vielen Dank!</p>
    <hr style="border:none;border-top:1px solid #E8EDF4;margin:0 0 24px;">
    <p style="font-size:15px;font-weight:700;color:#1A3F6F;margin:0 0 16px;">Ihre nächsten Schritte:</p>
    <p style="font-size:14px;color:#444;line-height:1.8;margin:0 0 32px;">
      🔍 Profile durchsuchen: kitabridge.de/suche<br>
      📩 Fachkraft direkt kontaktieren<br>
      📄 Zeugnisse per E-Mail vor der Hospitation anfordern<br>
      🤝 Hospitation vereinbaren & einstellen
    </p>
    <div style="text-align:center;">
      <a href="https://kitabridge.de/suche" style="display:inline-block;background:linear-gradient(135deg,#1A3F6F,#2471A3);color:white;font-weight:700;font-size:16px;padding:16px 40px;border-radius:50px;text-decoration:none;">Jetzt Fachkräfte suchen →</a>
    </div>
  </td></tr>
  <tr><td style="padding:24px 40px;text-align:center;">
    <p style="font-size:12px;color:#9BA8C0;margin:0 0 8px;">Bei Fragen: <a href="mailto:support@kitabridge.de" style="color:#2471A3;">support@kitabridge.de</a></p>
    <p style="font-size:11px;color:#C0CAD8;margin:0;">© 2026 KitaBridge</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
      });
    }

    if (type === "kontakt") {
      await resend.emails.send({
        from: "KitaBridge <onboarding@resend.dev>",
        to: "hallo@kitabridge.de",
        subject: `Kontaktanfrage: ${data.betreff || "Kein Betreff"}`,
        html: `<h2>Neue Kontaktanfrage</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Nachricht:</strong> ${data.nachricht}</p>`
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}