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
    subject = `Neuer Arbeitgeber: ${data.einrichtung_name}`;
    html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#1A3F6F;">Neuer Arbeitgeber registriert!</h2><table style="width:100%;border-collapse:collapse;"><tr><td style="padding:8px;color:#666;">Einrichtung</td><td style="padding:8px;font-weight:bold;">${data.einrichtung_name}</td></tr><tr style="background:#f9f9f9"><td style="padding:8px;color:#666;">Typ</td><td style="padding:8px;">${data.einrichtungstyp}</td></tr><tr><td style="padding:8px;color:#666;">Ort</td><td style="padding:8px;">${data.plz} ${data.ort}, ${data.bundesland}</td></tr><tr style="background:#f9f9f9"><td style="padding:8px;color:#666;">Ansprechpartner</td><td style="padding:8px;">${data.ansprech_name}</td></tr><tr><td style="padding:8px;color:#666;">E-Mail</td><td style="padding:8px;">${data.email}</td></tr><tr style="background:#f9f9f9"><td style="padding:8px;color:#666;">Telefon</td><td style="padding:8px;">${data.telefon || "-"}</td></tr><tr><td style="padding:8px;color:#666;">Offene Stellen</td><td style="padding:8px;">${data.stellen_anzahl}</td></tr></table><a href="https://www.kitabridge.de/admin" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#1A3F6F;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Im Admin ansehen</a></div>`;

  } else if (type === "fachkraft") {
    subject = `Neue Fachkraft: ${data.vorname} ${data.nachname}`;
    html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#1A3F6F;">Neue Fachkraft registriert!</h2><table style="width:100%;border-collapse:collapse;"><tr><td style="padding:8px;color:#666;">Name</td><td style="padding:8px;font-weight:bold;">${data.vorname} ${data.nachname}</td></tr><tr style="background:#f9f9f9"><td style="padding:8px;color:#666;">E-Mail</td><td style="padding:8px;">${data.email}</td></tr><tr><td style="padding:8px;color:#666;">Qualifikation</td><td style="padding:8px;">${data.qualifikation}</td></tr><tr style="background:#f9f9f9"><td style="padding:8px;color:#666;">Erfahrung</td><td style="padding:8px;">${data.erfahrung_jahre}</td></tr><tr><td style="padding:8px;color:#666;">Verfuegbar ab</td><td style="padding:8px;">${data.verfuegbar_ab}</td></tr><tr style="background:#f9f9f9"><td style="padding:8px;color:#666;">Bundesland</td><td style="padding:8px;">${data.bundesland || "Flexibel"}</td></tr></table><a href="https://www.kitabridge.de/admin" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#1A3F6F;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">Im Admin ansehen</a></div>`;

  } else if (type === "willkommen_fachkraft") {
    to = data.email;
    subject = `Willkommen bei KitaBridge, ${data.vorname}!`;
    html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#F0F4F9;font-family:Arial,sans-serif;"><div style="max-width:600px;margin:0 auto;padding:40px 20px;"><div style="background:#1A3F6F;padding:32px;text-align:center;border-radius:16px 16px 0 0;"><div style="font-size:2rem;font-weight:800;color:white;">Kita<span style="color:#4ADE80;">Bridge</span></div><div style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-top:4px;">Die Bruecke zwischen Fachkraeften und Kitas</div></div><div style="background:white;padding:40px;border-radius:0 0 16px 16px;"><h1 style="color:#1A3F6F;">Willkommen, ${data.vorname}!</h1><p style="color:#6B7897;line-height:1.6;">Deine Registrierung bei KitaBridge war erfolgreich.</p><div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:20px;margin:20px 0;"><b style="color:#92400E;">Dein Profil wird innerhalb von 24 Stunden freigeschaltet.</b><br/><span style="color:#78350F;font-size:0.88rem;">Danach koennen Kitas aus ganz Deutschland dich direkt kontaktieren.</span></div><p style="color:#6B7897;">1. Profil-Freischaltung in 24 Stunden<br/>2. Kitas sehen dein Profil und kontaktieren dich direkt<br/>3. Du entscheidest welche Anfragen dich interessieren</p><div style="text-align:center;margin:28px 0;"><a href="https://www.kitabridge.de/fachkraft/einstellungen" style="background:#1A3F6F;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;">Mein Profil ansehen</a></div><p style="color:#9BA8C0;text-align:center;font-size:0.82rem;">Fragen? hallo@kitabridge.de</p></div></div></body></html>`;

  } else if (type === "willkommen_arbeitgeber") {
    to = data.email;
    subject = `Willkommen bei KitaBridge, ${data.ansprech_name}!`;
    html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#F0F4F9;font-family:Arial,sans-serif;"><div style="max-width:600px;margin:0 auto;padding:40px 20px;"><div style="background:#1A3F6F;padding:32px;text-align:center;border-radius:16px 16px 0 0;"><div style="font-size:2rem;font-weight:800;color:white;">Kita<span style="color:#4ADE80;">Bridge</span></div><div style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-top:4px;">Die Bruecke zwischen Fachkraeften und Kitas</div></div><div style="background:white;padding:40px;border-radius:0 0 16px 16px;"><h1 style="color:#1A3F6F;">Willkommen, ${data.ansprech_name}!</h1><p style="color:#6B7897;line-height:1.6;">Vielen Dank fuer Ihre Registrierung! <strong>${data.einrichtung_name}</strong> ist jetzt bei KitaBridge angemeldet.</p><div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:20px;margin:20px 0;"><b style="color:#92400E;">Ihr Konto wird innerhalb von 24 Stunden freigeschaltet.</b><br/><span style="color:#78350F;font-size:0.88rem;">Sie erhalten eine Bestaetigung sobald Sie loslegen koennen.</span></div><div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:20px;margin:20px 0;"><b style="color:#1E40AF;">Ihre Zugangsdaten</b><br/><br/><span style="color:#1E3A8A;line-height:1.8;">E-Mail: ${data.email}<br/>Login: www.kitabridge.de/login<br/>Kosten: 299 Euro/Monat - monatlich kuendbar - keine Provision</span></div><p style="color:#6B7897;">1. Konto-Freischaltung in 24 Stunden<br/>2. Fachkraefte in Ihrer Region suchen<br/>3. Direkt kontaktieren - ohne Vermittler</p><div style="text-align:center;margin:28px 0;"><a href="https://www.kitabridge.de/login" style="background:#1A3F6F;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;">Jetzt einloggen</a></div><p style="color:#9BA8C0;text-align:center;font-size:0.82rem;">Fragen? hallo@kitabridge.de</p></div></div></body></html>`;
  }

  try {
    await resend.emails.send({
      from: "KitaBridge <hallo@kitabridge.de>",
      to,
      subject,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}