import {mkdir,cp,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','style.css','app.js','engine.js','scene.js'])await copyFile(file,'dist/'+file);
await cp('vendor','dist/vendor',{recursive:true});
console.log('Static website built in dist/');
