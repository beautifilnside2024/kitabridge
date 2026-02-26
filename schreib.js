var fs=require('fs');
var c=fs.readFileSync('app/Registrieren/page.tsx','utf8');
var alt="beschaeftigung:form.arbeitszeit";
var neu="beschaeftigung:[form.arbeitszeit]";
var fixed=c.replace(alt,neu);
fs.writeFileSync('app/Registrieren/page.tsx',fixed,'utf8');
console.log('done:', fixed.includes('[form.arbeitszeit]'));