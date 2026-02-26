var fs=require('fs');
var c=fs.readFileSync('app/Registrieren/page.tsx','utf8');
var alt="onClick={() => { if (form.agb && form.datenschutz) setSubmitted(true); }}";
var neu="onClick={async () => { if (form.agb && form.datenschutz) { try { var m=await import('@supabase/supabase-js'); var sb=m.createClient('https://miftmpmfnotezloesaxh.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZnRtcG1mbm90ZXpsb2VzYXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTg4NjAsImV4cCI6MjA4NzU5NDg2MH0.YFFEljANfkpzPqQeCTSaqYcClPteDQrzjSTvLsU-QLA'); var r=await sb.from('fachkraefte').insert([{vorname:form.vorname,nachname:form.nachname,email:form.email,wohnort_stadt:form.wohnort,beruf:form.qualifikation,erfahrung:form.erfahrung_jahre,beschaeftigung:form.arbeitszeit,eintrittstermin:form.verfuegbar_ab,kurzprofil:form.beschreibung,status:'neu'}]); console.log('R:',JSON.stringify(r)); } catch(e){console.error('E:',e);} setSubmitted(true); } }}";
var fixed=c.replace(alt,neu);
fs.writeFileSync('app/Registrieren/page.tsx',fixed,'utf8');
console.log('done, supabase eingebaut:', fixed.includes('miftmpmf'));