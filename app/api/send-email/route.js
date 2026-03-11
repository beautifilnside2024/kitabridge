import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Service Role Client – umgeht RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const { type, data } = await req.json();

  try {
    if (type === "neue_anfrage") {
      // E-Mail der Fachkraft direkt aus Supabase holen (RLS umgangen via Service Role)
      const { data: fachkraft, error } = await supabaseAdmin
        .from("fachkraefte")
        .select("email, vorname, username")
        .eq("id", data.fachkraft_id)
        .single();

      if (error || !fachkraft?.email) {
        console.error("Fachkraft nicht gefunden:", error);
        return new Response(JSON.stringify({ error: "Fachkraft nicht gefunden" }), { status: 404 });
      }

      const fachkraftName =
        fachkraft.vorname || fachkraft.username || "Fachkraft";

      const kitaName = data.kita_name || "Eine Kita";
      const nachricht =
        data.nachricht?.trim() ||
        `Hallo! Wir sind ${kitaName} und suchen eine engagierte Fachkraft. Wir wurden uns freuen, von Ihnen zu horen!`;

      await resend.emails.send({
        from: "KitaBridge <noreply@kitabridge.de>",
        to: fachkraft.email,
        subject: `Neue Anfrage von ${kitaName} - KitaBridge`,
        html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Neue Anfrage - KitaBridge</title>
</head>
<body style="margin:0;padding:0;background:#F0F4F9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1A3F6F;border-radius:16px 16px 0 0;padding:28px 36px;">
              <div style="font-size:1.4rem;font-weight:700;color:white;">
                Kita<span style="color:#4ADE80;">Bridge</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:white;padding:36px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(26,63,111,0.10);">

              <h1 style="color:#1A3F6F;font-size:1.4rem;margin:0 0 8px 0;">
                Hallo ${fachkraftName},
              </h1>
              <p style="color:#6B7897;font-size:0.95rem;margin:0 0 24px 0;">
                du hast eine neue Anfrage auf KitaBridge erhalten!
              </p>

              <!-- Anfrage-Box -->
              <div style="background:#F0F4F9;border-left:4px solid #1A3F6F;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
                <div style="font-size:0.75rem;font-weight:700;color:#9BA8C0;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                  Einrichtung
                </div>
                <div style="font-size:1.1rem;font-weight:700;color:#1A3F6F;margin-bottom:16px;">
                  ${kitaName}
                </div>
                <div style="font-size:0.75rem;font-weight:700;color:#9BA8C0;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">
                  Nachricht
                </div>
                <div style="font-size:0.92rem;color:#444;line-height:1.7;">
                  ${nachricht}
                </div>
              </div>

              <!-- Datenschutz-Hinweis -->
              <div style="background:#FFF8ED;border-radius:10px;padding:14px 18px;margin-bottom:28px;font-size:0.83rem;color:#92400E;line-height:1.6;">
                <strong>Datenschutz:</strong> Deine Kontaktdaten bleiben verborgen.
                Erst wenn du die Anfrage annimmst, werden deine Daten an die Einrichtung weitergegeben.
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="https://kitabridge.de/fachkraft/dashboard"
                   style="display:inline-block;background:linear-gradient(135deg,#1A3F6F,#2471A3);color:white;font-weight:700;font-size:0.95rem;padding:14px 32px;border-radius:50px;text-decoration:none;">
                  Anfrage ansehen &amp; antworten
                </a>
              </div>

              <p style="color:#9BA8C0;font-size:0.8rem;text-align:center;margin:0;">
                Du erhaeltst diese E-Mail, weil du bei KitaBridge als Fachkraft registriert bist.<br/>
                <a href="https://kitabridge.de/abmelden" style="color:#2471A3;">Abmelden</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // ───────────────────────────────────────────────────────────────
    if (type === "anfrage_akzeptiert") {
      const kitaEmail = data.kita_email;
      const kitaName = data.kita_name || "Ihre Einrichtung";
      const fachkraftName = data.fachkraft_name || "Die Fachkraft";
      const fachkraftEmail = data.fachkraft_email;
      const fachkraftTelefon = data.fachkraft_telefon;

      await resend.emails.send({
        from: "KitaBridge <noreply@kitabridge.de>",
        to: kitaEmail,
        subject: `Anfrage akzeptiert! - KitaBridge`,
        html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Anfrage akzeptiert - KitaBridge</title>
</head>
<body style="margin:0;padding:0;background:#F0F4F9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="background:#1A3F6F;border-radius:16px 16px 0 0;padding:28px 36px;">
              <div style="font-size:1.4rem;font-weight:700;color:white;">
                Kita<span style="color:#4ADE80;">Bridge</span>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:white;padding:36px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(26,63,111,0.10);">

              <div style="text-align:center;font-size:3rem;margin-bottom:16px;">&#x2705;</div>

              <h1 style="color:#1A3F6F;font-size:1.4rem;margin:0 0 8px 0;text-align:center;">
                Anfrage akzeptiert!
              </h1>
              <p style="color:#6B7897;font-size:0.95rem;margin:0 0 28px 0;text-align:center;">
                ${fachkraftName} hat Ihre Anfrage angenommen.
              </p>

              <div style="background:#EAF7EF;border-radius:12px;padding:22px 26px;margin-bottom:28px;">
                <div style="font-size:0.75rem;font-weight:700;color:#9BA8C0;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">
                  Kontaktdaten
                </div>
                <div style="font-size:0.95rem;color:#1E8449;font-weight:700;margin-bottom:6px;">
                  &#x1F464; ${fachkraftName}
                </div>
                ${fachkraftEmail ? `<div style="font-size:0.92rem;color:#444;margin-bottom:4px;">&#x2709;&#xFE0F; <a href="mailto:${fachkraftEmail}" style="color:#2471A3;">${fachkraftEmail}</a></div>` : ""}
                ${fachkraftTelefon ? `<div style="font-size:0.92rem;color:#444;">&#x1F4DE; ${fachkraftTelefon}</div>` : ""}
              </div>

              <div style="text-align:center;margin-bottom:28px;">
                <a href="https://kitabridge.de/arbeitgeber/dashboard"
                   style="display:inline-block;background:linear-gradient(135deg,#1E8449,#27AE60);color:white;font-weight:700;font-size:0.95rem;padding:14px 32px;border-radius:50px;text-decoration:none;">
                  Zum Dashboard
                </a>
              </div>

              <p style="color:#9BA8C0;font-size:0.8rem;text-align:center;margin:0;">
                Du erhaeltst diese E-Mail, weil du bei KitaBridge als Arbeitgeber registriert bist.<br/>
                <a href="https://kitabridge.de/abmelden" style="color:#2471A3;">Abmelden</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Unbekannter Typ" }), { status: 400 });

  } catch (err) {
    console.error("send-email Fehler:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}