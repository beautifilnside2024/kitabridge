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

    // 1. Zuerst aus der Datenbank löschen
    if (rolle === "fachkraft") {
      const { error } = await supabaseAdmin.from("fachkraefte").delete().eq("email", email);
      if (error) console.error("DB-Löschfehler fachkraft:", error);
    } else if (rolle === "arbeitgeber") {
      const { error } = await supabaseAdmin.from("arbeitgeber").delete().eq("email", email);
      if (error) console.error("DB-Löschfehler arbeitgeber:", error);
    }

    // 2. Auth-User löschen – direkt per E-Mail suchen (paginiert)
    let authUserId = null;
    let page = 1;
    while (true) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error || !data?.users?.length) break;
      const found = data.users.find(u => u.email === email);
      if (found) { authUserId = found.id; break; }
      if (data.users.length < 1000) break;
      page++;
    }

    if (authUserId) {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(authUserId);
      if (error) console.error("Auth-Löschfehler:", error);
    } else {
      console.warn("Auth-User nicht gefunden für:", email);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}