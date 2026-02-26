var fs=require('fs');
var c=fs.readFileSync('app/Registrieren/page.tsx','utf8');
var fixed=c.replace(
  "} catch(e) { console.error(e); } setSubmitted(true);",
  "} catch(e) { console.error('FEHLER:',JSON.stringify(e)); } setSubmitted(true);"
);
fixed=fixed.replace(
  "setSubmitted(true); } }}",
  "console.log('RESULT:',JSON.stringify(result)); setSubmitted(true); } }}"
);
fs.writeFileSync('app/Registrieren/page.tsx',fixed,'utf8');
console.log('done');