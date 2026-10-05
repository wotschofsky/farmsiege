import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import {tomato,rabbit,mole,tree,barn,tools} from '../src/models.js';
test('all custom models have finite geometry, normals, and usable bounds',()=>{
  for(const [name,make] of Object.entries({tomato,rabbit,mole,tree,barn})){const model=make();let triangles=0;model.traverse(o=>{if(!o.isMesh)return;for(const attr of ['position','normal'])for(const n of o.geometry.attributes[attr].array)assert.ok(Number.isFinite(n),`${name} ${attr}`);triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;});const bounds=new T.Box3().setFromObject(model);assert.ok(!bounds.isEmpty());assert.ok(triangles>100);assert.ok(bounds.getSize(new T.Vector3()).y>0.5);}
  assert.equal(tools().length,4);
});
test('imported livestock assets are valid binary glTF files',()=>{
  for(const name of ['cow','sheep']){const b=fs.readFileSync(`assets/${name}.glb`);assert.equal(b.toString('utf8',0,4),'glTF');assert.equal(b.readUInt32LE(4),2);assert.equal(b.readUInt32LE(8),b.length);const json=JSON.parse(b.toString('utf8',20,20+b.readUInt32LE(12)));assert.ok(json.meshes.length>0);assert.ok(!json.buffers.some(x=>x.uri),'self-contained geometry');}
});
test('the interface has every element referenced by game code',()=>{
  const html=fs.readFileSync('index.html','utf8'),main=fs.readFileSync('src/main.js','utf8');const ids=[...main.matchAll(/\$\('([^']+)'\)/g)].map(x=>x[1]);for(const id of new Set(ids))assert.ok(html.includes(`id="${id}"`),id);
});
