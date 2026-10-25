import {mkdir,cp,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','style.css','polish.css','app.js','engine.js','scene.js','motion.js','workspace.js','engine-catalog.js','engine-model.js','assembly-bounds.js','scene-renderer.js','workspace.css'])await copyFile(file,'dist/'+file);
await cp('vendor','dist/vendor',{recursive:true});
console.log('Static website built in dist/');
