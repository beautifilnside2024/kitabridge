import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    if (type === "willkommen_fachkraft") {
      await resend.emails.send({
        from: "KitaBridge <hallo@kitabridge.de>",
        to: data.email,
        subject: "Willkommen bei KitaBridge!",
        html: `<h2>Hallo ${data.vorname}!</h2><p>Vielen Dank für deine Registrierung bei KitaBridge.</p><p>Wir haben dein Profil erhalten und melden uns innerhalb von 24 Stunden.</p><p>Viele Grüße,<br/>Das KitaBridge Team</p>`
      });
    }

    if (type === "fachkraft") {
      await resend.emails.send({
        from: "KitaBridge <hallo@kitabridge.de>",
        to: "hallo@kitabridge.de",
        subject: `Neue Fachkraft: ${data.vorname} ${data.nachname}`,
        html: `<h2>Neue Registrierung</h2><p><strong>Name:</strong> ${data.vorname} ${data.nachname}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Qualifikation:</strong> ${data.qualifikation}</p>`
      });
    }

    if (type === "kontakt") {
      await resend.emails.send({
        from: "KitaBridge <hallo@kitabridge.de>",
        to: "hallo@kitabridge.de",
        subject: `Kontaktanfrage: ${data.betreff || "Kein Betreff"}`,
        html: `<h2>Neue Kontaktanfrage</h2><p><strong>Name:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Nachricht:</strong> ${data.nachricht}</p>`
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}