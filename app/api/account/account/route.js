const handleDeleteAccount = async () => {
  const bestaetigung = window.confirm(
    "Sind Sie sicher? Ihr Account und alle Daten werden unwiderruflich gelöscht. Ihr Abonnement wird sofort gekündigt."
  );
  if (!bestaetigung) return;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const res = await fetch("/api/account/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: session.user.email, rolle: "arbeitgeber" }),
  });

  if (res.ok) {
    await supabase.auth.signOut();
    alert("Ihr Account wurde erfolgreich gelöscht.");
    router.push("/");
  } else {
    alert("Fehler beim Löschen. Bitte kontaktieren Sie uns unter kitabridge@protonmail.com");
  }
};