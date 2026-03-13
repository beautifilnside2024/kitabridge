import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    // ─── WILLKOMMEN FACHKRAFT ───────────────────────────────────────────────
    if (type === "willkommen_fachkraft") {
      const displayName = data.vorname || data.username || "";

      await resend.emails.send({
        from: "KitaBridge <hallo@kitabridge.de>",
        to: data.email,
        subject: "Willkommen bei KitaBridge! · Welcome to KitaBridge! 🎉",
        html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>body{margin:0;padding:0;background:#F0F4F9;font-family:Arial,sans-serif;-webkit-text-size-adjust:100%}.wrapper{width:100%;padding:20px 12px;box-sizing:border-box}.card{max-width:560px;margin:0 auto;border-radius:16px;overflow:hidden}.header{background:linear-gradient(135deg,#1A3F6F,#2471A3);padding:28px 24px;text-align:center}.body{background:white;padding:28px 24px}.footer{padding:20px 24px;text-align:center}.btn{display:block;background:linear-gradient(135deg,#1E8449,#27AE60);color:white;font-weight:700;font-size:15px;padding:14px 24px;border-radius:50px;text-decoration:none;text-align:center}.section-de{border-left:4px solid #1A3F6F;padding-left:16px;margin-bottom:24px}.section-en{border-left:4px solid #27AE60;padding-left:16px;margin-bottom:24px}h1{font-size:17px;font-weight:700;color:#1A3F6F;margin:0 0 10px}p{font-size:14px;color:#444;line-height:1.8;margin:0 0 10px}</style></head><body><div class="wrapper"><div class="card"><div class="header"><div style="font-size:24px;font-weight:800;color:white;">Kita<span style="color:#27AE60;">Bridge</span></div><div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:6px;">Die Plattform für pädagogische Fachkräfte</div></div><div class="body"><div style="text-align:center;font-size:44px;margin-bottom:20px;">🎉</div><div class="section-de"><h1>Herzlich willkommen bei KitaBridge${displayName ? `, ${displayName}` : ""}!</h1><p>Wir freuen uns sehr, dich in unserer Community begrüßen zu dürfen! 🌟</p><p>Bei KitaBridge kannst du dein Profil erstellen und wirst direkt von Kitas in ganz Deutschland kontaktiert – <strong>kein Lebenslauf, kein Anschreiben</strong> nötig.</p><p>Einfach sichtbar sein – und die passende Einrichtung meldet sich bei dir. 💪</p></div><hr style="border:none;border-top:2px dashed #E8EDF4;margin:0 0 24px;"><div class="section-en"><h1>Welcome to KitaBridge${displayName ? `, ${displayName}` : ""}!</h1><p>We are so happy to have you here! 🌟</p><p>At KitaBridge, you can create your profile and get contacted directly by daycare centers across Germany – <strong>no CV, no cover letter</strong> required.</p><p>Simply be visible – and the right employer will reach out to you. 💪</p></div><hr style="border:none;border-top:1px solid #E8EDF4;margin:0 0 20px;"><p style="font-size:14px;font-weight:700;color:#1A3F6F;margin:0 0 12px;">Deine nächsten Schritte · Your next steps:</p><p style="font-size:13px;color:#444;line-height:2;margin:0 0 24px;">✏️ Profil vervollständigen · Complete your profile<br>🔍 Von Kitas gefunden werden · Get found<br>📩 Kontaktiert werden · Get contacted<br>🤝 Deinen Traumjob finden · Find your dream job</p><a href="https://kitabridge.de/fachkraft/dashboard" class="btn">Jetzt Profil vervollständigen →</a></div><div class="footer"><p style="font-size:12px;color:#9BA8C0;margin:0 0 6px;">Bei Fragen · Questions: <a href="mailto:hallo@kitabridge.de" style="color:#2471A3;">hallo@kitabridge.de</a></p><p style="font-size:11px;color:#C0CAD8;margin:0;">© 2026 KitaBridge</p></div></div></div></body></html>`
      });
    }

    // ─── WILLKOMMEN ARBEITGEBER ─────────────────────────────────────────────
    if (type === "willkommen_arbeitgeber") {
      await resend.emails.send({
        from: "KitaBridge <hallo@kitabridge.de>",
        to: data.email,
        subject: "Willkommen bei KitaBridge – So geht es jetzt weiter 🎉",
        html: `<html><body style="margin:0;padding:0;background:#F0F4F9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1A3F6F,#2471A3);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
    <div style="font-size:28px;font-weight:800;color:white;">Kita<span style="color:#27AE60;">Bridge</span></div>
    <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:6px;">Die Plattform für Kitas &amp; pädagogische Fachkräfte</div>
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
      🤝 Hospitation vereinbaren &amp; einstellen
    </p>
    <div style="text-align:center;">
      <a href="https://kitabridge.de/suche" style="display:inline-block;background:linear-gradient(135deg,#1A3F6F,#2471A3);color:white;font-weight:700;font-size:16px;padding:16px 40px;border-radius:50px;text-decoration:none;">Jetzt Fachkräfte suchen →</a>
    </div>
  </td></tr>
  <tr><td style="padding:24px 40px;text-align:center;">
    <p style="font-size:12px;color:#9BA8C0;margin:0 0 8px;">Bei Fragen: <a href="mailto:hallo@kitabridge.de" style="color:#2471A3;">hallo@kitabridge.de</a></p>
    <p style="font-size:11px;color:#C0CAD8;margin:0;">© 2026 KitaBridge</p>
  </td></tr>
</table></td></tr></table>
</body></html>`
      });
    }

    // ─── NEUE ANFRAGE ───────────────────────────────────────────────────────
    if (type === "neue_anfrage") {
      const { data: fachkraft, error } = await supabaseAdmin
        .from("fachkraefte")
        .select("email, vorname, username")
        .eq("id", data.fachkraft_id)
        .single();

      if (error || !fachkraft?.email) {
        console.error("Fachkraft nicht gefunden:", error);
        return new Response(JSON.stringify({ error: "Fachkraft nicht gefunden" }), { status: 404 });
      }

      // ── FIX: Arbeitgeber-Daten über arbeitgeber_id laden ──────────────────
      const { data: ag } = await supabaseAdmin
        .from("arbeitgeber")
        .select("*")
        .eq("id", data.arbeitgeber_id)
        .single();

      const fachkraftName = fachkraft.vorname || fachkraft.username || "Fachkraft";
      const kitaName = ag?.einrichtung_name || data.kita_name || "Eine Einrichtung";
      const nachricht = data.nachricht?.trim() || `Wir sind ${kitaName} und suchen eine engagierte Fachkraft. Wir würden uns freuen, von Ihnen zu hören!`;

      await resend.emails.send({
        from: "KitaBridge <hallo@kitabridge.de>",
        to: fachkraft.email,
        subject: `Neue Anfrage von ${kitaName} – KitaBridge`,
        html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="font-family:Arial,sans-serif;background:#E8EDF5;margin:0;padding:20px 12px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

  <!-- HEADER -->
  <tr><td style="background:linear-gradient(135deg,#0F2442,#1A3F6F);border-radius:16px 16px 0 0;padding:24px 28px;">
    <div style="font-size:22px;font-weight:800;color:white;font-family:Georgia,serif;">Kita<span style="color:#4ADE80;">Bridge</span></div>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:white;padding:28px;">
    <h2 style="color:#1A3F6F;font-size:18px;margin:0 0 6px;">Hallo ${fachkraftName}!</h2>
    <p style="color:#6B7897;font-size:14px;margin:0 0 18px;line-height:1.6;">
      <strong style="color:#1A3F6F;">${kitaName}</strong> hat dir eine Anfrage geschickt:
    </p>

    <!-- Nachricht -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
      <tr><td style="background:#F8FAFF;border-left:3px solid #1A3F6F;padding:14px 18px;border-radius:0 10px 10px 0;">
        <p style="color:#374151;font-size:14px;line-height:1.7;margin:0;">${nachricht}</p>
      </td></tr>
    </table>

    <!-- VISITENKARTE HEADER -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #E4EAF4;border-radius:14px;overflow:hidden;margin-bottom:22px;">
      <tr><td style="background:linear-gradient(135deg,#0F2442,#1A3F6F);padding:18px 20px;">
        <p style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;margin:0 0 10px;">Über die Einrichtung</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:50px;vertical-align:middle;">
              <div style="width:44px;height:44px;border-radius:10px;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.2);text-align:center;line-height:44px;font-size:22px;">🏫</div>
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <p style="font-size:16px;font-weight:800;color:white;margin:0 0 6px;">${kitaName}</p>
              <table cellpadding="0" cellspacing="0"><tr>
                ${ag?.einrichtungstyp ? `<td style="padding-right:5px;"><span style="background:rgba(255,255,255,0.12);border-radius:99px;padding:3px 10px;font-size:11px;color:rgba(255,255,255,0.85);font-weight:600;">🏫 ${ag.einrichtungstyp}</span></td>` : ""}
                ${ag?.traeger ? `<td><span style="background:rgba(255,255,255,0.12);border-radius:99px;padding:3px 10px;font-size:11px;color:rgba(255,255,255,0.85);font-weight:600;">🏛 ${ag.traeger}</span></td>` : ""}
              </tr></table>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- VISITENKARTE DETAILS -->
      <tr><td style="background:white;padding:18px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${(ag?.plz || ag?.ort) && ag?.stellen_anzahl ? `
          <tr>
            <td style="width:50%;padding:8px 8px 8px 0;border-bottom:1px solid #F0F4F9;vertical-align:top;">
              <p style="font-size:10px;font-weight:800;color:#8A96B0;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 3px;">📍 Standort</p>
              <p style="font-size:13px;font-weight:700;color:#1C2B4A;margin:0;">${[ag?.plz, ag?.ort, ag?.bundesland].filter(Boolean).join(", ")}</p>
            </td>
            <td style="padding:8px 0 8px 8px;border-bottom:1px solid #F0F4F9;vertical-align:top;">
              <p style="font-size:10px;font-weight:800;color:#8A96B0;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 3px;">👥 Offene Stellen</p>
              <p style="font-size:13px;font-weight:700;color:#1C2B4A;margin:0;">${ag.stellen_anzahl}</p>
            </td>
          </tr>` : (ag?.plz || ag?.ort) ? `
          <tr><td colspan="2" style="padding:8px 0;border-bottom:1px solid #F0F4F9;">
            <p style="font-size:10px;font-weight:800;color:#8A96B0;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 3px;">📍 Standort</p>
            <p style="font-size:13px;font-weight:700;color:#1C2B4A;margin:0;">${[ag?.plz, ag?.ort, ag?.bundesland].filter(Boolean).join(", ")}</p>
          </td></tr>` : ""}

          ${ag?.ansprech_name ? `
          <tr><td colspan="2" style="padding:8px 0;border-bottom:1px solid #F0F4F9;">
            <p style="font-size:10px;font-weight:800;color:#8A96B0;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 3px;">👤 Ansprechpartner</p>
            <p style="font-size:13px;font-weight:700;color:#1C2B4A;margin:0;">${ag.ansprech_name}${ag?.ansprech_rolle ? ` · <span style="font-weight:400;color:#8A96B0;">${ag.ansprech_rolle}</span>` : ""}</p>
          </td></tr>` : ""}

          ${ag?.beschreibung ? `
          <tr><td colspan="2" style="padding:12px 0 0;">
            <p style="font-size:10px;font-weight:800;color:#8A96B0;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px;">Über uns</p>
            <p style="font-size:13px;color:#4B5563;line-height:1.7;margin:0;">${ag.beschreibung}</p>
          </td></tr>` : ""}
        </table>

        ${ag?.telefon || ag?.email ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
          <tr><td style="background:#0F2442;border-radius:10px;padding:14px 16px;">
            <p style="font-size:10px;font-weight:800;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">Kontakt</p>
            ${ag?.telefon ? `<p style="margin:0 0 6px;font-size:13px;color:white;">📞 ${ag.telefon}</p>` : ""}
            ${ag?.email ? `<p style="margin:0;font-size:13px;"><a href="mailto:${ag.email}" style="color:#93C5FD;">✉️ ${ag.email}</a></p>` : ""}
          </td></tr>
        </table>` : ""}
      </td></tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="https://kitabridge.de/login?rolle=fachkraft" style="display:inline-block;background:linear-gradient(135deg,#1A3F6F,#2471A3);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;">
          Jetzt antworten →
        </a>
      </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:18px 28px;border-top:1px solid #E8EDF4;text-align:center;">
    <p style="color:#9BA8C0;font-size:12px;margin:0;">Diese E-Mail wurde über KitaBridge gesendet · <a href="https://kitabridge.de" style="color:#9BA8C0;">kitabridge.de</a></p>
  </td></tr>

</table>
</td></tr></table>
</body>
</html>`
      });
    }

    // ─── ANFRAGE AKZEPTIERT ─────────────────────────────────────────────────
    if (type === "anfrage_akzeptiert") {
      const { kita_email, kita_name, fachkraft_name, fachkraft_email, fachkraft_telefon } = data;

      await resend.emails.send({
        from: "KitaBridge <hallo@kitabridge.de>",
        to: kita_email,
        subject: `Anfrage akzeptiert! ${fachkraft_name} möchte Kontakt – KitaBridge`,
        html: `<html><body style="margin:0;padding:0;background:#F0F4F9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#1A3F6F,#2471A3);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
    <div style="font-size:28px;font-weight:800;color:white;">Kita<span style="color:#27AE60;">Bridge</span></div>
  </td></tr>
  <tr><td style="background:white;padding:40px;border-radius:0 0 16px 16px;">
    <div style="text-align:center;font-size:48px;margin-bottom:16px;">✅</div>
    <p style="font-size:18px;font-weight:700;color:#1A3F6F;text-align:center;margin:0 0 8px;">Anfrage akzeptiert!</p>
    <p style="font-size:15px;color:#6B7897;text-align:center;line-height:1.7;margin:0 0 28px;">${fachkraft_name} hat Ihre Anfrage angenommen.</p>
    <div style="background:#EAF7EF;border-radius:12px;padding:24px;margin-bottom:24px;">
      <p style="font-size:12px;font-weight:700;color:#9BA8C0;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Kontaktdaten</p>
      <p style="font-size:16px;font-weight:700;color:#1E8449;margin:0 0 8px;">👤 ${fachkraft_name}</p>
      ${fachkraft_email ? `<p style="font-size:14px;color:#444;margin:0 0 6px;">✉️ <a href="mailto:${fachkraft_email}" style="color:#2471A3;">${fachkraft_email}</a></p>` : ""}
      ${fachkraft_telefon ? `<p style="font-size:14px;color:#444;margin:0;">📞 ${fachkraft_telefon}</p>` : ""}
    </div>
    <div style="text-align:center;">
      <!-- ── FIX: direkter Dashboard-Link, kein Login-Redirect nötig ── -->
      <a href="https://kitabridge.de/login?redirect=/arbeitgeber/dashboard" style="display:inline-block;background:linear-gradient(135deg,#1E8449,#27AE60);color:white;font-weight:700;font-size:16px;padding:16px 40px;border-radius:50px;text-decoration:none;">Zu meinem Dashboard →</a>
    </div>
  </td></tr>
  <tr><td style="padding:24px 40px;text-align:center;">
    <p style="font-size:12px;color:#9BA8C0;margin:0 0 8px;">Bei Fragen: <a href="mailto:hallo@kitabridge.de" style="color:#2471A3;">hallo@kitabridge.de</a></p>
    <p style="font-size:11px;color:#C0CAD8;margin:0;">© 2026 KitaBridge</p>
  </td></tr>
</table></td></tr></table>
</body></html>`
      });
    }

    // ─── INTERNE MAILS ──────────────────────────────────────────────────────
    if (type === "fachkraft") {
      await resend.emails.send({
        from: "KitaBridge <hallo@kitabridge.de>",
        to: "hallo@kitabridge.de",
        subject: `Neue Fachkraft: ${data.vorname || data.username}`,
        html: `<h2>Neue Registrierung</h2>
          <p><strong>Name:</strong> ${data.vorname ? `${data.vorname} ${data.nachname}` : `@${data.username} (anonym)`}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Qualifikation:</strong> ${data.qualifikation}</p>`
      });
    }

    if (type === "arbeitgeber") {
      await resend.emails.send({
        from: "KitaBridge <hallo@kitabridge.de>",
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

    if (type === "kontakt") {
      await resend.emails.send({
        from: "KitaBridge <hallo@kitabridge.de>",
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