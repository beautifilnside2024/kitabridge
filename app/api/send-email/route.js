import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const body = await request.json();
  const { type, data } = body;

  let subject = "";
  let html = "";

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
  }

  try {
    await resend.emails.send({
      from: "KitaBridge <onboarding@resend.dev>",
      to: "kitabridge@protonmail.com",
      subject,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
