import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { von_id, an_id, von_typ, nachricht, empfaenger_email, empfaenger_name, absender_name } = await request.json();

  const { error } = await supabase.from("nachrichten").insert({
    von_id, an_id, von_typ, nachricht
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  await resend.emails.send({
    from: "KitaBridge <hallo@kitabridge.de>",
    to: empfaenger_email,
    subject: "📩 Neue Nachricht auf KitaBridge",
    html: `
      <h2>Hallo ${empfaenger_name}!</h2>
      <p><strong>${absender_name}</strong> hat dir eine Nachricht geschickt:</p>
      <blockquote style="border-left: 3px solid #1A3F6F; padding-left: 16px; color: #444;">
        ${nachricht}
      </blockquote>
      <a href="https://kitabridge.de/login" style="display:inline-block; background:#1A3F6F; color:white; padding:12px 24px; border-radius:50px; text-decoration:none; font-weight:700; margin-top:16px;">
        Jetzt antworten
      </a>
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