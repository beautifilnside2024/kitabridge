import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email, password, einrichtung_name } = await request.json();

    // User erstellen mit Admin-Rechten (umgeht Email-Bestätigung)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Sofort bestätigt!
      user_metadata: { role: "arbeitgeber", einrichtung_name }
    });

    if (authError) {
      return Response.json({ error: authError.message }, { status: 400 });
    }

    return Response.json({ ok: true, user: authData.user });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}