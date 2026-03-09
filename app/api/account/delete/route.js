import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function DELETE(request) {
  try {
    const { email, rolle } = await request.json();

    if (!email) {
      return Response.json({ error: "Email fehlt" }, { status: 400 });
    }

    // User aus Auth löschen
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const user = users?.users?.find(u => u.email === email);

    if (user) {
      await supabaseAdmin.auth.admin.deleteUser(user.id);
    }

    // User aus Datenbank löschen
    if (rolle === "fachkraft") {
      await supabaseAdmin.from("fachkraefte").delete().eq("email", email);
    } else if (rolle === "arbeitgeber") {
      await supabaseAdmin.from("arbeitgeber").delete().eq("email", email);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}