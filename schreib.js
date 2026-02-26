var fs=require('fs');
var c=fs.readFileSync('app/Arbeitgeber/page.jsx','utf8');
var alt='<div style={{ marginBottom: 20 }}>';
console.log('Gefunden:', c.includes(alt));
console.log('Anzahl step 5:', c.split('step === 5').length-1);