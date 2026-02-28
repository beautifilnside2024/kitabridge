import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    const { data: ag } = await supabaseAdmin
      .from("arbeitgeber")
      .select("stripe_subscription_id")
      .eq("email", email)
      .single();

    if (!ag?.stripe_subscription_id) {
      return Response.json({ error: "Kein Abo gefunden" }, { status: 404 });
    }

    await stripe.subscriptions.update(ag.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Kündigung Ihres KitaBridge-Abos",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1A3F6F;padding:24px 32px">
            <h1 style="color:white;margin:0;font-size:22px">KitaBridge</h1>
          </div>
          <div style="padding:32px;background:#fff">
            <h2 style="color:#1A3F6F">Kündigung bestätigt</h2>
            <p style="color:#444;line-height:1.7">Wir haben Ihre Kündigung erhalten. Ihr Abo läuft bis zum Ende des aktuellen Abrechnungszeitraums weiter.</p>
            <p style="color:#444;line-height:1.7">Bei Fragen: <a href="mailto:kitabridge@protonmail.com" style="color:#2471A3">kitabridge@protonmail.com</a></p>
            <p style="color:#444">Viele Grüße,<br/><strong>Das KitaBridge-Team</strong></p>
          </div>
          <div style="background:#F8FAFF;padding:16px 32px;text-align:center">
            <p style="color:#9BA8C0;font-size:12px;margin:0">KitaBridge - Heusenstammer Weg 69 - 63071 Offenbach am Main</p>
          </div>
        </div>`
      })
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Kündigungs-Fehler:", err);
    return Response.json({ error: "Serverfehler" }, { status: 500 });
  }
}