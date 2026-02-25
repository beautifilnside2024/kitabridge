"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const NAVY = "#1A3F6F";
const BLUE = "#2471A3";
const GREEN = "#1E8449";

const TYPEN = ["Grundschule","Sekundarschule","Gymnasium","Gesamtschule","Foerderschule","Berufsschule","Kita","Kinderkrippe","Hort","Freier Traeger","Schulamt","Andere"];
const LAENDER = ["Baden-Wuerttemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thueringen"];
const TRAEGER = ["Oeffentlich","Kirchlich","AWO","DRK","Paritaetisch","Privat","Elterninitiative","Andere"];
const FAECHER = ["Mathematik","Deutsch","Englisch","Franzoesisch","Spanisch","Physik","Chemie","Biologie","Geschichte","Geografie","Sport","Kunst","Musik","Informatik","Sachkunde","DaF/DaZ","Fruehkindlich","Sonderpaedagogik","Soziale Arbeit","Andere"];
const STELLEN = ["1","2-3","4-5","6-10","10+"];
const POSITIONEN = ["Klassenlehrerin","Fachlehrerin","Vertretungslehrerin","Erzieherin","Gruppenleitung","Kita-Leitung","Schulbegleitung","Andere"];
const ADDONS = [
  {id:"a1",title:"Hervorgehobenes Profil",desc:"Ihr Profil erscheint ganz oben.",price:"49 EUR/Monat",num:49},
  {id:"a2",title:"Top-Platzierung Stellenanzeige",desc:"30 Tage ganz oben.",price:"79 EUR/30 Tage",num:79},
  {id:"a3",title:"Schnell-antworten Markierung",desc:"Steigert die Bewerbungsrate.",price:"29 EUR/Monat",num:29},
];
const STEPS = ["Einrichtung","Adresse","Kontakt","Stellen","Tarif","Fertig"];

function Page() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [pay, setPay] = useState(false);
  const [paying, setPaying] = useState(false);
  const [addons, setAddons] = useState([]);
  const [err, setErr] = useState({});
  const [f, setF] = useState({
    name:"",typ:"",traeger:"",info:"",
    str:"",nr:"",plz:"",ort:"",land:"",
    kontakt:"",rolle:"",email:"",tel:"",pw:"",pw2:"",
    stellen:"",faecher:[],pos:[],
    kname:"",knr:"",kexp:"",cvv:"",
  });

  const upd = (k, v) => { setF(p => ({...p,[k]:v})); setErr(p => ({...p,[k]:""})); };
  const toggleList = (k, v) => setF(p => { const a = p[k]; return {...p,[k]:a.includes(v)?a.filter(x=>x!==v):[...a,v]}; });
  const toggleAddon = (id) => setAddons(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const total = 299 + addons.reduce((s,id) => { const a = ADDONS.find(x=>x.id===id); return s+(a?a.num:0); },0);

  const validate = () => {
    const e = {};
    if(step===0){ if(!f.name.trim()) e.name="Pflichtfeld"; if(!f.typ) e.typ="Pflichtfeld"; if(!f.traeger) e.traeger="Pflichtfeld"; }
    if(step===1){ if(!f.str.trim()) e.str="Pflichtfeld"; if(!f.plz.trim()) e.plz="Pflichtfeld"; if(!f.ort.trim()) e.ort="Pflichtfeld"; if(!f.land) e.land="Pflichtfeld"; }
    if(step===2){ if(!f.kontakt.trim()) e.kontakt="Pflichtfeld"; if(!f.email.includes("@")) e.email="Ungueltige E-Mail"; if(f.pw.length<6) e.pw="Min. 6 Zeichen"; if(f.pw!==f.pw2) e.pw2="Passwoerter ungleich"; }
    if(step===3){ if(!f.stellen) e.stellen="Pflichtfeld"; if(f.faecher.length===0) e.faecher="Mindestens eines waehlen"; }
    if(step===4&&pay){ if(!f.kname.trim()) e.kname="Pflichtfeld"; if(f.knr.replace(/\s/g,"").length<16) e.knr="Ungueltig"; if(!f.kexp) e.kexp="Pflichtfeld"; if(f.cvv.length<3) e.cvv="Ungueltig"; }
    setErr(e);
    return Object.keys(e).length===0;
  };

  const next = () => { if(validate()) setStep(s=>s+1); };
  const back = () => { setPay(false); setStep(s=>s-1); };
  const submit = () => {
    if(!pay){ setPay(true); return; }
    if(!validate()) return;
    setPaying(true);
    setTimeout(()=>{ setPaying(false); setDone(true); },2000);
  };

  const fmtKnr = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp = v => { const c=v.replace(/\D/g,"").slice(0,4); return c.length>=2?c.slice(0,2)+"/"+c.slice(2):c; };

  const inp = k => ({ width:"100%",padding:"12px 15px",borderRadius:11,border:`1.5px solid ${err[k]?"#E74C3C":"#E8EDF4"}`,fontSize:"0.92rem",fontFamily:"sans-serif",outline:"none",color:"#1a1a2e",background:"white" });
  const sel = k => ({ ...inp(k),appearance:"none",cursor:"pointer" });
  const lbl = { fontSize:"0.8rem",fontWeight:700,color:NAVY,marginBottom:5,display:"block" };
  const er = k => err[k]?<div style={{fontSize:"0.73rem",color:"#E74C3C",marginTop:3}}>{err[k]}</div>:null;
  const fw = { marginBottom:18 };
  const g2 = { display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18 };

  if(done) return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,#0D3B2E,${GREEN})`,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"sans-serif"}}>
      <div style={{background:"white",borderRadius:28,padding:"48px 40px",textAlign:"center",maxWidth:480,width:"100%"}}>
        <div style={{fontSize:"3rem",marginBottom:16}}>Willkommen!</div>
        <h2 style={{fontSize:"1.8rem",color:NAVY,marginBottom:10}}>{f.name} ist jetzt aktiv!</h2>
        <p style={{color:"#6B7897",marginBottom:24}}>Sie haben sofort Zugang zu allen Fachkraft-Profilen.</p>
        <div style={{background:"#EAF7EF",borderRadius:14,padding:"16px 20px",marginBottom:24,textAlign:"left"}}>
          <div style={{fontSize:"0.83rem",color:"#333",marginBottom:5}}>Einrichtung: {f.name}</div>
          <div style={{fontSize:"0.83rem",color:"#333",marginBottom:5}}>Ort: {f.ort}, {f.land}</div>
          <div style={{fontSize:"0.83rem",color:"#333",marginBottom:5}}>Kontakt: {f.kontakt}</div>
          <div style={{fontWeight:700,color:NAVY,marginTop:8,paddingTop:8,borderTop:"1px solid #D5F5E3"}}>Gesamt: {total} EUR/Monat</div>
        </div>
        <a href="/" style={{padding:"12px 28px",borderRadius:50,background:`linear-gradient(135deg,${NAVY},${BLUE})`,color:"white",fontWeight:600,textDecoration:"none"}}>Zur Homepage</a>
      </div>
    </div>
  );

  const pct = (step/(STEPS.length-1))*100;

  return (
    <div style={{minHeight:"100vh",background:"#F0F4F9",fontFamily:"sans-serif"}}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        input:focus,select:focus,textarea:focus{border-color:${BLUE}!important;outline:none;}
        .pb{padding:8px 14px;border-radius:50px;border:1.5px solid #E8EDF4;background:white;font-size:0.8rem;cursor:pointer;color:#444;}
        .pb:hover{border-color:${BLUE};color:${BLUE};}
        .pb.on{background:${NAVY};color:white;border-color:${NAVY};}
        .bn{width:100%;padding:14px;border-radius:50px;background:linear-gradient(135deg,${NAVY},${BLUE});color:white;border:none;font-weight:700;font-size:0.97rem;cursor:pointer;margin-top:10px;}
        .bn:hover{opacity:0.9;}
        .bn:disabled{opacity:0.6;cursor:not-allowed;}
        .bb{width:100%;padding:13px;border-radius:50px;background:transparent;color:#6B7897;border:1.5px solid #E8EDF4;font-weight:600;font-size:0.92rem;cursor:pointer;margin-top:8px;}
        .bb:hover{border-color:${NAVY};color:${NAVY};}
        .ac{border-radius:16px;padding:18px;border:2px solid #E8EDF4;background:white;cursor:pointer;display:flex;gap:14px;align-items:flex-start;margin-bottom:12px;}
        .ac:hover{border-color:${BLUE};}
        .ac.on{border-color:${GREEN};background:#F0FBF4;}
      `}</style>

      <div style={{background:"white",borderBottom:"1px solid #E8EDF4",padding:"0 32px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <a href="/" style={{fontWeight:700,fontSize:"1.2rem",textDecoration:"none"}}>
          <span style={{color:NAVY}}>Kita</span><span style={{color:GREEN}}>Bridge</span>
        </a>
        <span style={{fontSize:"0.82rem",color:"#6B7897"}}>Bereits registriert? <a href="#" style={{color:BLUE,fontWeight:600}}>Anmelden</a></span>
      </div>

      <div style={{height:3,background:"#E8EDF4"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${NAVY},${GREEN})`,transition:"width 0.4s"}}/>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"40px 16px 60px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <h1 style={{fontSize:"1.9rem",fontWeight:800,color:NAVY,marginBottom:6}}>Arbeitgeber-Registrierung</h1>
          <p style={{color:"#6B7897",fontSize:"0.88rem"}}>Schritt {step+1} von {STEPS.length} - {STEPS[step]}</p>
        </div>

        <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginBottom:32}}>
          {STEPS.map((s,i) => (
            <div key={i} style={{display:"flex",alignItems:"center"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:step>i?GREEN:step===i?NAVY:"#E8EDF4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",color:step>=i?"white":"#9BA8C0",fontWeight:700}}>
                  {step>i?"✓":(i+1)}
                </div>
                <span style={{fontSize:"0.6rem",fontWeight:600,color:step===i?NAVY:"#B0BAD0",whiteSpace:"nowrap"}}>{s}</span>
              </div>
              {i<STEPS.length-1&&<div style={{width:20,height:2,background:step>i?GREEN:"#E8EDF4",margin:"0 3px",marginBottom:18}}/>}
            </div>
          ))}
        </div>

        <div style={{background:"white",borderRadius:22,padding:"32px",boxShadow:"0 8px 40px rgba(26,63,111,0.09)",border:"1px solid #E8EDF4"}}>

          {step===0&&<>
            <h2 style={{fontSize:"1.3rem",color:NAVY,marginBottom:20}}>Ihre Einrichtung</h2>
            <div style={fw}><label style={lbl}>Name der Einrichtung *</label><input style={inp("name")} value={f.name} onChange={e=>upd("name",e.target.value)} placeholder="z.B. Grundschule Am Stadtpark"/>{er("name")}</div>
            <div style={g2}>
              <div><label style={lbl}>Typ *</label><select style={sel("typ")} value={f.typ} onChange={e=>upd("typ",e.target.value)}><option value="">Bitte waehlen</option>{TYPEN.map(t=><option key={t}>{t}</option>)}</select>{er("typ")}</div>
              <div><label style={lbl}>Traeger *</label><select style={sel("traeger")} value={f.traeger} onChange={e=>upd("traeger",e.target.value)}><option value="">Bitte waehlen</option>{TRAEGER.map(t=><option key={t}>{t}</option>)}</select>{er("traeger")}</div>
            </div>
            <div style={fw}><label style={lbl}>Beschreibung (optional)</label><textarea style={{...inp("info"),resize:"vertical",minHeight:80}} value={f.info} onChange={e=>upd("info",e.target.value)} maxLength={400}/></div>
            <button className="bn" onClick={next}>Weiter</button>
          </>}

          {step===1&&<>
            <h2 style={{fontSize:"1.3rem",color:NAVY,marginBottom:20}}>Adresse</h2>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:18}}>
              <div><label style={lbl}>Strasse *</label><input style={inp("str")} value={f.str} onChange={e=>upd("str",e.target.value)} placeholder="Hauptstrasse"/>{er("str")}</div>
              <div><label style={lbl}>Nr.</label><input style={inp("nr")} value={f.nr} onChange={e=>upd("nr",e.target.value)} placeholder="12"/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:14,marginBottom:18}}>
              <div><label style={lbl}>PLZ *</label><input style={inp("plz")} value={f.plz} onChange={e=>upd("plz",e.target.value.slice(0,5))} placeholder="10115" maxLength={5}/>{er("plz")}</div>
              <div><label style={lbl}>Ort *</label><input style={inp("ort")} value={f.ort} onChange={e=>upd("ort",e.target.value)} placeholder="Berlin"/>{er("ort")}</div>
            </div>
            <div style={fw}><label style={lbl}>Bundesland *</label><select style={sel("land")} value={f.land} onChange={e=>upd("land",e.target.value)}><option value="">Bitte waehlen</option>{LAENDER.map(l=><option key={l}>{l}</option>)}</select>{er("land")}</div>
            <button className="bn" onClick={next}>Weiter</button>
            <button className="bb" onClick={back}>Zurueck</button>
          </>}

          {step===2&&<>
            <h2 style={{fontSize:"1.3rem",color:NAVY,marginBottom:20}}>Kontakt und Account</h2>
            <div style={g2}>
              <div><label style={lbl}>Name *</label><input style={inp("kontakt")} value={f.kontakt} onChange={e=>upd("kontakt",e.target.value)} placeholder="Maria Mueller"/>{er("kontakt")}</div>
              <div><label style={lbl}>Rolle</label><input style={inp("rolle")} value={f.rolle} onChange={e=>upd("rolle",e.target.value)} placeholder="Schulleiterin"/></div>
            </div>
            <div style={g2}>
              <div><label style={lbl}>E-Mail *</label><input style={inp("email")} type="email" value={f.email} onChange={e=>upd("email",e.target.value)} placeholder="schule@email.de"/>{er("email")}</div>
              <div><label style={lbl}>Telefon</label><input style={inp("tel")} value={f.tel} onChange={e=>upd("tel",e.target.value)} placeholder="030 123456"/></div>
            </div>
            <div style={g2}>
              <div><label style={lbl}>Passwort * (min.6)</label><input style={inp("pw")} type="password" value={f.pw} onChange={e=>upd("pw",e.target.value)}/>{er("pw")}</div>
              <div><label style={lbl}>Wiederholen *</label><input style={inp("pw2")} type="password" value={f.pw2} onChange={e=>upd("pw2",e.target.value)}/>{er("pw2")}</div>
            </div>
            <button className="bn" onClick={next}>Weiter</button>
            <button className="bb" onClick={back}>Zurueck</button>
          </>}

          {step===3&&<>
            <h2 style={{fontSize:"1.3rem",color:NAVY,marginBottom:20}}>Gesuchte Stellen</h2>
            <div style={fw}>
              <label style={lbl}>Anzahl *</label>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {STELLEN.map(s=><button key={s} className={`pb ${f.stellen===s?"on":""}`} onClick={()=>upd("stellen",s)}>{s}</button>)}
              </div>{er("stellen")}
            </div>
            <div style={fw}>
              <label style={lbl}>Fachrichtungen * (Mehrfachwahl)</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                {FAECHER.map(x=><button key={x} className={`pb ${f.faecher.includes(x)?"on":""}`} onClick={()=>toggleList("faecher",x)}>{f.faecher.includes(x)?"+ ":""}{x}</button>)}
              </div>{er("faecher")}
            </div>
            <div style={fw}>
              <label style={lbl}>Positionen (optional)</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
                {POSITIONEN.map(x=><button key={x} className={`pb ${f.pos.includes(x)?"on":""}`} onClick={()=>toggleList("pos",x)}>{f.pos.includes(x)?"+ ":""}{x}</button>)}
              </div>
            </div>
            <button className="bn" onClick={next}>Weiter</button>
            <button className="bb" onClick={back}>Zurueck</button>
          </>}

          {step===4&&<>
            {!pay?<>
              <h2 style={{fontSize:"1.3rem",color:NAVY,marginBottom:20}}>Tarif</h2>
              <div style={{borderRadius:18,border:`2px solid ${GREEN}`,background:"linear-gradient(135deg,#F0FBF4,#fff)",padding:24,marginBottom:24,position:"relative"}}>
                <div style={{position:"absolute",top:-13,left:24,background:GREEN,color:"white",padding:"4px 16px",borderRadius:50,fontSize:"0.75rem",fontWeight:700}}>Hauptplan</div>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                  <div>
                    <div style={{fontWeight:700,color:NAVY,fontSize:"1.2rem",marginBottom:8}}>Monatlicher Zugang</div>
                    {["Alle Profile","Unbegrenzte Suche","Direktkontakt","Chat","Keine Provision","Monatlich kuendbar"].map(x=><div key={x} style={{fontSize:"0.77rem",color:"#333",marginBottom:4}}>+ {x}</div>)}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"2rem",fontWeight:700,color:NAVY}}>299 EUR</div>
                    <div style={{fontSize:"0.77rem",color:"#9BA8C0"}}>/Monat zzgl. MwSt.</div>
                  </div>
                </div>
              </div>
              <label style={{...lbl,marginBottom:12}}>Optionale Add-ons</label>
              {ADDONS.map(a=>(
                <div key={a.id} className={`ac ${addons.includes(a.id)?"on":""}`} onClick={()=>toggleAddon(a.id)}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:"0.86rem",color:NAVY,marginBottom:2}}>{a.title}</div>
                    <div style={{fontSize:"0.77rem",color:"#6B7897"}}>{a.desc}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontWeight:700,color:addons.includes(a.id)?GREEN:NAVY}}>{a.price}</div>
                    <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${addons.includes(a.id)?GREEN:"#ccc"}`,background:addons.includes(a.id)?GREEN:"white",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"auto",marginTop:6}}>
                      {addons.includes(a.id)&&<span style={{color:"white",fontSize:"0.7rem",fontWeight:700}}>+</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{background:"#F0F4F9",borderRadius:14,padding:"14px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontWeight:700,color:NAVY}}>Gesamt: {total} EUR/Monat</div>
                <div style={{fontSize:"0.75rem",color:"#9BA8C0"}}>zzgl. MwSt.</div>
              </div>
              <button className="bn" onClick={()=>{if(validate())setPay(true);}}>Weiter zur Zahlung</button>
              <button className="bb" onClick={back}>Zurueck</button>
            </>:<>
              <h2 style={{fontSize:"1.3rem",color:NAVY,marginBottom:20}}>Zahlungsdaten</h2>
              <div style={{background:`linear-gradient(135deg,${NAVY},${BLUE})`,borderRadius:16,padding:"20px 22px",marginBottom:22}}>
                <div style={{color:"rgba(255,255,255,0.6)",fontSize:"0.72rem",marginBottom:16}}>KREDITKARTE</div>
                <div style={{color:"white",fontSize:"1.1rem",fontWeight:600,letterSpacing:3,marginBottom:16}}>{f.knr||".... .... .... ...."}</div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div><div style={{color:"rgba(255,255,255,0.5)",fontSize:"0.65rem"}}>NAME</div><div style={{color:"white"}}>{f.kname||"-"}</div></div>
                  <div><div style={{color:"rgba(255,255,255,0.5)",fontSize:"0.65rem"}}>GUELTIG</div><div style={{color:"white"}}>{f.kexp||"MM/JJ"}</div></div>
                </div>
              </div>
              <div style={fw}><label style={lbl}>Name auf der Karte *</label><input style={inp("kname")} value={f.kname} onChange={e=>upd("kname",e.target.value.toUpperCase())} placeholder="MARIA MUELLER"/>{er("kname")}</div>
              <div style={fw}><label style={lbl}>Kartennummer *</label><input style={inp("knr")} value={f.knr} onChange={e=>upd("knr",fmtKnr(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19}/>{er("knr")}</div>
              <div style={g2}>
                <div><label style={lbl}>Ablauf *</label><input style={inp("kexp")} value={f.kexp} onChange={e=>upd("kexp",fmtExp(e.target.value))} placeholder="MM/JJ" maxLength={5}/>{er("kexp")}</div>
                <div><label style={lbl}>CVV *</label><input style={inp("cvv")} value={f.cvv} onChange={e=>upd("cvv",e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="123" maxLength={4} type="password"/>{er("cvv")}</div>
              </div>
              <button className="bn" style={{background:`linear-gradient(135deg,${GREEN},#27AE60)`}} onClick={submit} disabled={paying}>
                {paying?"Wird verarbeitet...":`Jetzt ${total} EUR/Monat starten`}
              </button>
              <button className="bb" onClick={()=>setPay(false)}>Zurueck</button>
            </>}
          </>}

          {step===5&&<>
            <h2 style={{fontSize:"1.3rem",color:NAVY,marginBottom:20}}>Zusammenfassung</h2>
            {[["Einrichtung",f.name],["Typ",f.typ],["Adresse",`${f.str} ${f.nr}, ${f.plz} ${f.ort}`],["Bundesland",f.land],["Kontakt",f.kontakt],["E-Mail",f.email],["Stellen",f.stellen],["Fachrichtungen",f.faecher.join(", ")],["Plan","299 EUR/Monat"],["Add-ons",addons.length>0?addons.map(id=>ADDONS.find(a=>a.id===id)?.title).join(", "):"Keine"],["Gesamt",`${total} EUR/Monat`]].map(([k,v])=>(
              <div key={k} style={{display:"flex",padding:"9px 0",borderBottom:"1px solid #F0F4F9",gap:10}}>
                <span style={{fontSize:"0.78rem",fontWeight:700,color:"#6B7897",minWidth:140,flexShrink:0}}>{k}</span>
                <span style={{fontSize:"0.82rem",color:"#1a1a2e"}}>{v||"-"}</span>
              </div>
            ))}
            <button className="bn" style={{background:`linear-gradient(135deg,${GREEN},#27AE60)`,marginTop:16}} onClick={()=>setDone(true)}>
              Registrierung abschliessen
            </button>
            <button className="bb" onClick={back}>Zurueck</button>
          </>}

        </div>
        <div style={{textAlign:"center",marginTop:20,fontSize:"0.78rem",color:"#9BA8C0"}}>
          DSGVO-konform - Monatlich kuendbar - Keine Einrichtungsgebuehr
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), { ssr: false });