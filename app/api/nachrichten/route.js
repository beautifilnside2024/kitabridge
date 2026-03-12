import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const {
    von_id, an_id, von_typ, nachricht,
    empfaenger_email, empfaenger_name, absender_name,
    anfrage_id, arbeitgeber_id, // für Visitenkarte
  } = await request.json();

  const { error } = await supabase.from("nachrichten").insert({
    von_id, an_id, von_typ, nachricht
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Visitenkarten-Link nur wenn Arbeitgeber die Anfrage schickt
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.kitabridge.de";
  const visitenkarteBlock = (von_typ === "arbeitgeber" && arbeitgeber_id && anfrage_id)
    ? `
      <div style="margin: 24px 0; background: #F0F7FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 20px;">
        <div style="font-size: 12px; font-weight: 700; color: #2471A3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
          📋 Visitenkarte der Einrichtung
        </div>
        <p style="color: #374151; font-size: 14px; margin: 0 0 16px;">
          ${absender_name} hat Ihnen ihre Einrichtungs-Visitenkarte mitgeschickt.
        </p>
        <a href="${BASE_URL}/arbeitgeber/${arbeitgeber_id}?anfrage=${anfrage_id}"
           style="display: inline-block; background: #1A3F6F; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 14px;">
          Visitenkarte ansehen →
        </a>
      </div>
    `
    : "";

  await resend.emails.send({
    from: "KitaBridge <hallo@kitabridge.de>",
    to: empfaenger_email,
    subject: von_typ === "arbeitgeber"
      ? `📩 Anfrage von ${absender_name} auf KitaBridge`
      : `📩 Neue Nachricht von ${absender_name} auf KitaBridge`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'DM Sans', Arial, sans-serif; background: #F0F4F9; margin: 0; padding: 40px 20px;">
        <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(26,63,111,0.1);">

          <div style="background: linear-gradient(135deg, #1A3F6F, #2471A3); padding: 28px 32px;">
            <div style="font-family: serif; font-size: 22px; font-weight: 800; color: white;">
              Kita<span style="color: #4ADE80;">Bridge</span>
            </div>
          </div>

          <div style="padding: 32px;">
            <h2 style="color: #1A3F6F; font-size: 20px; margin: 0 0 8px;">Hallo ${empfaenger_name}!</h2>
            <p style="color: #6B7897; font-size: 15px; margin: 0 0 20px;">
              <strong style="color: #1A3F6F;">${absender_name}</strong> hat dir eine Nachricht geschickt:
            </p>

            <div style="background: #F8FAFF; border-left: 3px solid #1A3F6F; padding: 16px 20px; border-radius: 0 12px 12px 0; margin-bottom: 8px;">
              <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0;">${nachricht}</p>
            </div>

            ${visitenkarteBlock}

            <a href="${BASE_URL}/login"
               style="display: block; text-align: center; background: linear-gradient(135deg, #1A3F6F, #2471A3); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 15px; margin-top: 24px;">
              Jetzt antworten →
            </a>
          </div>

          <div style="padding: 20px 32px; border-top: 1px solid #E8EDF4; text-align: center;">
            <p style="color: #9BA8C0; font-size: 12px; margin: 0;">
              Diese E-Mail wurde über KitaBridge gesendet · <a href="${BASE_URL}" style="color: #9BA8C0;">kitabridge.de</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  return Response.json({ ok: true });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  const { data, error } = await supabase
    .from("nachrichten")
    .select("*")
    .or(`von_id.eq.${user_id},an_id.eq.${user_id}`)
    .order("erstellt_am", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
