import test from 'node:test';
import assert from 'node:assert/strict';
import {FarmGame,position,indexAt,GROW_TIME} from '../src/logic.js';
const create=()=>new FarmGame(()=>0.5);
test('all 64 plots map correctly between field coordinates and indices',()=>{
  for(let i=0;i<64;i++){const p=position(i);assert.equal(indexAt(p.x,p.z),i);}assert.equal(indexAt(100,0),-1);assert.equal(indexAt(0,-100),-1);
});
test('crops mature at 15 seconds and award points only once',()=>{
  const g=create();g.tiles[0]={type:'empty',age:0};assert.equal(g.plant(0),true);assert.equal(g.plant(0),false);assert.equal(g.tend(0),false);g.tick(GROW_TIME-0.01);assert.equal(g.tend(0),false);g.tick(.01);assert.equal(g.tend(0),true);assert.equal(g.score,15);assert.equal(g.harvests,1);assert.equal(g.tend(0),false);assert.equal(g.score,15);
});
test('harvesting the last living crop ends the run and freezes simulation',()=>{
  const g=create();g.tiles.fill(null);g.tiles=g.tiles.map(()=>({type:'empty',age:0}));g.tiles[0]={type:'plant',age:15};g.tend(0);assert.equal(g.over,true);assert.equal(g.score,15);const t=g.time;g.tick(100);assert.equal(g.time,t);assert.equal(g.plant(3),false);assert.equal(g.drain().filter(e=>e.type==='end').length,1);
});
test('lightning clears the 3x3 patch without wrapping at field edges',()=>{
  const g=create();g.tiles=g.tiles.map(()=>({type:'plant',age:20}));g.strike(0);assert.equal(g.crops,60);assert.equal(g.tiles[7].type,'plant');assert.equal(g.tiles[8].type,'empty');g.strike(27);assert.equal(g.crops,51);
});
test('moles and weeds award original FarmSiege scores and hills clear without score',()=>{
  const g=create();g.tiles[0]={type:'mole',age:0};g.tiles[1]={type:'weed',age:0};g.tiles[2]={type:'hill',age:0};g.tend(0);g.tend(1);g.tend(2);assert.equal(g.score,52);assert.equal(g.tiles[2].type,'empty');
});
test('rabbits seek crops, eat them after two seconds, and can end the game',()=>{
  const g=create();g.tiles=g.tiles.map(()=>({type:'empty',age:0}));g.tiles[0]={type:'plant',age:10};const p=position(0);g.rabbits.push({id:1,x:p.x,z:p.z,bite:0,phase:0});g.tick(1);assert.equal(g.crops,1);g.tick(1);assert.equal(g.crops,0);assert.equal(g.over,true);
});
test('shotgun cone hits rabbits in the line of fire while leaving others untouched',()=>{
  const g=create();g.rabbits=[{id:1,x:0,z:-4},{id:2,x:10,z:-4}];const origin={x:0,y:1.7,z:0},dy=.45-1.7,length=Math.hypot(dy,-4),direction={x:0,y:dy/length,z:-4/length};assert.equal(g.shoot(origin,direction),1);assert.equal(g.score,5);assert.equal(g.defended,1);assert.equal(g.rabbits[0].id,2);
});
test('easygoing mode reduces pest pressure, and restarting resets all state',()=>{
  const g=create();g.reset(true);assert.equal(g.speed,.55);g.spawnWave();assert.equal(g.rabbits.length,2);g.score=100;g.time=70;g.reset();assert.equal(g.score,0);assert.equal(g.time,0);assert.equal(g.rabbits.length,0);assert.equal(g.crops,3);assert.equal(g.over,false);
});
