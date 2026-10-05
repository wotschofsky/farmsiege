import {build} from 'esbuild';
import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await build({entryPoints:['src/main.js'],bundle:true,format:'esm',target:'es2022',outfile:'dist/game.js',minify:true,sourcemap:true});
for(const file of ['index.html','style.css']) await copyFile(file,`dist/${file}`);
await cp('assets','dist/assets',{recursive:true});
console.log('FarmSiege 3D built successfully.');
