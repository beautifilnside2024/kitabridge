"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError("E-Mail oder Passwort falsch."); setLoading(false); return; }
    const { data: fk } = await supabase.from("fachkraefte").select("id").eq("email", data.user.email).single();
    if (fk) { router.push("/fachkraft/einstellungen"); return; }
    const { data: ei } = await supabase.from("einrichtungen").select("id").eq("email", data.user.email).single();
    if (ei) { router.push("/einrichtung/dashboard"); return; }
    router.push("/");
  };
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#F0F4F9,#E8EEF8)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"sans-serif", padding:"24px 16px" }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <a href="/" style={{ textDecoration:"none", fontSize:"1.8rem", fontWeight:800 }}>
            <span style={{ color:"#1A3F6F" }}>Kita</span><span style={{ color:"#1E8449" }}>Bridge</span>
          </a>
        </div>
        <div style={{ background:"white", borderRadius:24, padding:"36px 32px", boxShadow:"0 4px 32px rgba(26,63,111,0.12)" }}>
          <h1 style={{ fontSize:"1.5rem", color:"#1A3F6F", marginBottom:28 }}>Einloggen</h1>
          {error && <div style={{ marginBottom:16, padding:"12px 16px", background:"#FFF5F5", borderRadius:10, color:"#9B1C1C" }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:"0.75rem", fontWeight:700, color:"#9BA8C0", marginBottom:6 }}>E-MAIL</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width:"100%", padding:"12px 16px", border:"1.5px solid #D1DAE8", borderRadius:12, fontSize:"0.95rem", boxSizing:"border-box" }} />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:"block", fontSize:"0.75rem", fontWeight:700, color:"#9BA8C0", marginBottom:6 }}>PASSWORT</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width:"100%", padding:"12px 16px", border:"1.5px solid #D1DAE8", borderRadius:12, fontSize:"0.95rem", boxSizing:"border-box" }} />
            </div>
            <button type="submit" disabled={loading} style={{ width:"100%", padding:"14px", background:loading?"#9BA8C0":"#1A3F6F", color:"white", border:"none", borderRadius:12, fontWeight:700, fontSize:"1rem", cursor:loading?"not-allowed":"pointer" }}>
              {loading ? "Wird eingeloggt..." : "Einloggen"}
            </button>
          </form>
          <div style={{ marginTop:20, textAlign:"center" }}>
            <a href="/passwort-vergessen" style={{ color:"#2471A3", fontSize:"0.85rem", textDecoration:"none" }}>Passwort vergessen?</a>
          </div>
        </div>
        <p style={{ textAlign:"center", marginTop:20, color:"#9BA8C0", fontSize:"0.85rem" }}>
          Noch kein Konto?{" "}
          <a href="/Registrieren" style={{ color:"#2471A3", fontWeight:600, textDecoration:"none" }}>Jetzt registrieren</a>
        </p>
      </div>
    </div>
  );
}
