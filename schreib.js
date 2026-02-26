var fs=require('fs');
fs.writeFileSync('app/Arbeitgeber/page.jsx',fs.readFileSync('arbeitgeber.tsx','utf8'),'utf8');
console.log('done');