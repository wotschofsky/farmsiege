import * as T from 'three';
import {FarmGame,indexAt,position,GROW_TIME,SPACING} from './logic.js';
import {FarmWorld} from './world.js';
import {FarmAudio} from './audio.js';
const $=id=>document.getElementById(id);
const safeStore={get(key,fallback){try{const v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v);}catch{return fallback;}},set(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}};
const settings={sensitivity:1,muted:false,quality:true,hints:true,...safeStore.get('farmsiege3d-settings',{})};
const audio=new FarmAudio();audio.muted=settings.muted;
let world,game=new FarmGame(),state='menu',mode='survival',tool=0,target=-1,lastUse=-100,shotAt=-100,yaw=0,pitch=-0.42,movePhase=0,noticeUntil=0,popUntil=0,lastFrame=performance.now(),clock=0,lastBird=0,everLocked=false,dialog='';
let keys=new Set(),drag=null,joystick={x:0,y:0,pointer:null},touchLook=null;
const aim=new T.Vector3(),floorPoint=new T.Vector3(),ray=new T.Raycaster();
const player=new T.Vector3(0,1.68,12.6),mapCtx=$('map').getContext('2d');
const isTouch=matchMedia('(pointer:coarse)').matches;
if(isTouch)document.body.classList.add('touch');
document.body.classList.add('menu');
const mmss=t=>`${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;
function preview(){game=new FarmGame();for(let i=0;i<64;i++){game.tiles[i]={type:i%8===6||i%8===7||i<8?'empty':'plant',age:15-(i%4)*2};}for(const i of [36,44,17])game.tiles[i]={type:'empty',age:0};}
function notice(text,warn=false,duration=3){$('notice').textContent=text;$('notice').classList.add('show');$('notice').classList.toggle('warn',warn);noticeUntil=clock+duration;}
function pop(score){if(!score)return;$('score-pop').textContent=`+${score}`;$('score-pop').classList.add('show');popUntil=clock+0.9;}
function saveSettings(){safeStore.set('farmsiege3d-settings',settings);}
function setTool(i){tool=i;world?.setTool(i);document.querySelectorAll('[data-tool]').forEach(b=>b.classList.toggle('active',Number(b.dataset.tool)===i));}
function releasePointer(){if(document.pointerLockElement)document.exitPointerLock();keys.clear();drag=null;touchLook=null;joystick.x=joystick.y=0;$('joystick-knob').style.transform='';}
function openDialog(name){
  if(state==='playing'){state='paused';releasePointer();}
  dialog=name;$('modal').hidden=false;for(const id of ['how','settings','paused','gameover'])$(id).hidden=id!==name;
  $('modal-close').hidden=name==='gameover';
  $('guide-play').innerHTML=state==='paused'?'Back to the field <svg class="icon arrow"><use href="#i-arrow"/></svg>':'Got it. Let\'s grow. <svg class="icon arrow"><use href="#i-arrow"/></svg>';
  const focusable=$(name).querySelector('button,input');focusable?.focus({preventScroll:true});
}
function closeDialog(){if(state==='paused')resume();else{$('modal').hidden=true;dialog='';}}
async function capture(){
  if(isTouch||!world)return;
  try{await world.renderer.domElement.requestPointerLock();}catch{notice('Drag to look. Click to use your tool.',false,4);}
}
function start(){
  audio.start();game=new FarmGame();game.reset(mode==='relaxed');state='playing';target=-1;lastUse=shotAt=-100;player.set(0,1.68,12.6);yaw=0;pitch=-0.48;everLocked=false;movePhase=0;
  $('menu').hidden=true;$('hud').hidden=false;$('modal').hidden=true;dialog='';document.body.classList.remove('menu');document.body.classList.add('playing');world.toolRoot.visible=true;world.camera.position.copy(player);world.camera.rotation.set(pitch,yaw,0,'YXZ');setTool(0);world.select.visible=false;
  notice('Start planting. Keep at least one crop alive.',false,5);capture();
}
function resume(){if(state!=='paused')return;state='playing';$('modal').hidden=true;dialog='';audio.start();keys.clear();capture();}
function home(){state='menu';releasePointer();$('hud').hidden=true;$('menu').hidden=false;$('modal').hidden=true;dialog='';document.body.classList.add('menu');document.body.classList.remove('playing');world.toolRoot.visible=false;world.select.visible=false;world.stormRing.visible=false;preview();world.sync(game,clock,false);}
function end(){
  state='ended';releasePointer();const key=`farmsiege3d-best-${mode}`,best=safeStore.get(key,0),isBest=game.score>best;safeStore.set(key,Math.max(best,game.score));$('final-score').textContent=game.score;$('best-score').textContent=(isBest?'NEW PERSONAL BEST':'PERSONAL BEST')+' '+Math.max(best,game.score);$('final-time').textContent=mmss(game.time);$('final-harvests').textContent=game.harvests;$('final-defended').textContent=game.defended;
  $('result-line').textContent=game.harvests?'You made the field your own. Ready for another harvest?':'A few more seedlings can make all the difference.';openDialog('gameover');
}
function processEvents(){
  for(const e of game.drain()){
    const p=e.i!==undefined?position(e.i):null;
    if(e.type==='plant'){audio.play('plant');world.burst(p.x,p.z,0xb89968,7);}
    if(e.type==='tend'){audio.play(e.kind==='plant'?'harvest':'tend');world.burst(p.x,p.z,e.kind==='plant'?0xd47d45:0x96a255,12);pop(e.score);}
    if(e.type==='unripe')notice(`Still growing. Ready in ${Math.ceil(GROW_TIME-game.tiles[e.i].age)} seconds.`,false,1.5);
    if(e.type==='wave'){audio.play('wave');notice(`Siege ${e.wave}. ${e.amount} rabbits are heading for your crops.`,true,4);}
    if(e.type==='hit'){world.burst(e.x,e.z,0xe4d6b9,12);pop(e.score);}
    if(e.type==='eaten'){world.burst(p.x,p.z,0x67924b,8);notice('A rabbit ate a crop. Grab your shotgun.',true,2.5);}
    if(e.type==='mole')notice('A mole surfaced. Catch it for 50 points.',true,3);
    if(e.type==='storm'){notice('Lightning incoming. Spread out your crops.',true,3);audio.play('wave');}
    if(e.type==='lightning'){world.lightning(e.i);audio.play('thunder');$('flash').classList.add('hit');setTimeout(()=>$('flash').classList.remove('hit'),120);}
    if(e.type==='end')end();
  }
}
function shoot(){
  if(state!=='playing'||game.time-shotAt<1.2)return;
  shotAt=game.time;world.recoil=1;world.camera.getWorldDirection(aim);game.shoot(player,aim);audio.play('shot');$('crosshair').classList.add('shot');setTimeout(()=>$('crosshair').classList.remove('shot'),120);processEvents();
}
function use(context=false){
  if(state!=='playing')return;
  if(tool===3&&!context){shoot();return;}
  if(game.time-lastUse<0.2)return;lastUse=game.time;
  if(target<0){notice('Aim down at a nearby plot to work the soil.',false,1.5);return;}
  const tile=game.tiles[target];let success=false;
  if(context){if(tile.type==='empty'){setTool(0);success=game.plant(target);}else{setTool(tile.type==='mole'?2:1);success=game.tend(target);}}
  else if(tool===0){if(tile.type==='empty')success=game.plant(target);else notice('This plot is occupied. Press E to tend it.',false,1.5);}
  else if(tool===1){if(tile.type==='mole'){notice('Use your mallet, or press E, to catch the mole.',false,1.5);}else success=game.tend(target);}
  else if(tool===2){if(tile.type==='mole')success=game.tend(target);else notice('The mallet is for moles. Press E to tend this plot.',false,1.5);}
  if(success)world.swing=1;processEvents();
}
function findTarget(){
  world.camera.getWorldDirection(aim);target=-1;
  if(aim.y<-.035){const d=(.12-player.y)/aim.y;if(d>0&&d<4.9){floorPoint.copy(player).addScaledVector(aim,d);target=indexAt(floorPoint.x,floorPoint.z);}}
  world.select.visible=target>=0&&tool!==3;$('crosshair').classList.toggle('ready',target>=0);
  if(target>=0){const p=position(target);world.select.position.set(p.x,.123,p.z);const tile=game.tiles[target];$('target').style.display='block';const names={empty:'Open soil',plant:tile.age>=15?'Ripe tomatoes':'Tomato plant',weed:'Spreading weeds',mole:'An unwelcome mole',hill:'Molehill'};$('target-name').textContent=names[tile.type];
    $('target-detail').textContent=tile.type==='plant'?(tile.age>=15?'+15 points · ready to harvest':`Ripening · ${Math.ceil(15-tile.age)}s`):{empty:'A little room to grow',weed:'+2 points · pull before they spread',mole:'+50 points · make it count',hill:'Clear the hill to replant'}[tile.type];
    $('grow-fill').style.width=`${Math.min(100,tile.age/15*100)}%`;$('grow-fill').parentElement.style.display=tile.type==='plant'?'block':'none';$('target-action').textContent={empty:'Plant a seedling',plant:tile.age>=15?'Harvest tomatoes':'Check growth',weed:'Pull weeds',mole:'Smash the mole',hill:'Clear the plot'}[tile.type];
  }else $('target').style.display='none';
  if(tool===3){world.select.visible=false;$('target').style.display='none';}
}
function drawMap(){
  const ctx=mapCtx;ctx.clearRect(0,0,160,160);const cell=16,pad=16;
  game.tiles.forEach((t,i)=>{const x=i%8,y=Math.floor(i/8);ctx.fillStyle={empty:'#495439',plant:t.age>=15?'#c6be78':'#8ca66b',weed:'#74783c',mole:'#ddac77',hill:'#8c7652'}[t.type];ctx.globalAlpha=t.type==='empty'?.6:1;ctx.fillRect(pad+x*cell+1,pad+y*cell+1,cell-3,cell-3);});ctx.globalAlpha=1;
  const coord=v=>80+v/(SPACING*8)*128;
  for(const r of game.rabbits){ctx.fillStyle='#f1ae79';ctx.beginPath();ctx.arc(coord(r.x),coord(r.z),2.8,0,Math.PI*2);ctx.fill();}
  if(game.storm){const p=position(game.storm.i);ctx.strokeStyle='#ecba6d';ctx.lineWidth=1.5;ctx.strokeRect(coord(p.x)-24,coord(p.z)-24,48,48);}
  const px=Math.max(5,Math.min(155,coord(player.x))),pz=Math.max(5,Math.min(155,coord(player.z)));ctx.save();ctx.translate(px,pz);ctx.rotate(-yaw);ctx.fillStyle='#fff4d5';ctx.strokeStyle='#263b2c';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(3.5,3.5);ctx.lineTo(0,2);ctx.lineTo(-3.5,3.5);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
}
function updateHud(){
  $('score').textContent=game.score.toString().padStart(4,'0');$('crops').textContent=game.crops;$('timer').textContent=mmss(game.time);const rabbits=game.rabbits.length;$('wave-status').classList.toggle('danger',rabbits>0);$('wave-text').textContent=rabbits?`${rabbits} RABBIT${rabbits>1?'S':''} ON THE FIELD`:`${game.wave?'NEXT':'FIRST'} SIEGE IN ${Math.max(0,Math.ceil(game.nextWave-game.time))}s`;
  $('reload').style.width=`${Math.max(0,1-(game.time-shotAt)/1.2)*100}%`;drawMap();
}
function move(dt){
  let forward=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0)-joystick.y,right=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0)+joystick.x;
  if(keys.has('ArrowLeft'))yaw+=dt*1.8;if(keys.has('ArrowRight'))yaw-=dt*1.8;if(keys.has('ArrowUp'))pitch+=dt*1.2;if(keys.has('ArrowDown'))pitch-=dt*1.2;
  const gp=navigator.getGamepads?.()[0];if(gp){const axis=v=>Math.abs(v)>0.15?v:0;right+=axis(gp.axes[0]||0);forward-=axis(gp.axes[1]||0);yaw-=axis(gp.axes[2]||0)*dt*2;pitch-=axis(gp.axes[3]||0)*dt*1.6;if(gp.buttons[0]?.pressed)use(true);if(gp.buttons[7]?.pressed){setTool(3);shoot();}}
  const len=Math.hypot(forward,right),sprint=keys.has('ShiftLeft')||keys.has('ShiftRight');if(len>0){const s=(sprint?6.2:3.7)*dt/Math.max(1,len);player.x+=(-Math.sin(yaw)*forward+Math.cos(yaw)*right)*s;player.z+=(-Math.cos(yaw)*forward-Math.sin(yaw)*right)*s;player.x=Math.max(-15.4,Math.min(15.4,player.x));player.z=Math.max(-14.6,Math.min(16.5,player.z));movePhase+=dt*(sprint?14:9);}
  pitch=Math.max(-1.36,Math.min(.9,pitch));world.camera.position.copy(player);world.camera.position.y+=(len>0?Math.sin(movePhase)*0.025:0);world.camera.rotation.set(pitch,yaw,0,'YXZ');return len>0;
}
function tick(now){
  const dt=Math.min(.05,(now-lastFrame)/1000);lastFrame=now;clock+=dt;let moving=false;
  if(state==='playing'){moving=move(dt);game.tick(dt);processEvents();findTarget();updateHud();if(clock-lastBird>8){audio.play('bird');lastBird=clock;}}
  else if(state==='menu')world.menuCamera(clock);
  world.sync(game,clock,state!=='menu');world.update(dt,clock,moving);
  if(clock>noticeUntil)$('notice').classList.remove('show');if(clock>popUntil)$('score-pop').classList.remove('show');requestAnimationFrame(tick);
}
function fatal(error){console.error(error);$('loading').hidden=true;$('fatal').hidden=false;$('header').hidden=true;$('menu').hidden=true;$('fatal-message').textContent='The 3D renderer could not start. Enable hardware acceleration and use a browser with WebGL 2 support.';}
try{world=new FarmWorld($('scene'));preview();world.sync(game,0,false);world.quality(settings.quality);setTool(0);$('loading').hidden=true;requestAnimationFrame(tick);}catch(error){fatal(error);}
window.addEventListener('resize',()=>world?.resize());
window.addEventListener('keydown',e=>{
  if(e.target instanceof HTMLInputElement)return;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code)&&state==='playing')e.preventDefault();
  if(e.code==='Escape'){if(state==='playing'){state='paused';releasePointer();openDialog('paused');}else if(state==='paused'){if(dialog==='paused')resume();else openDialog('paused');}else if(dialog)closeDialog();return;}
  if(state!=='playing')return;keys.add(e.code);
  if(/^Digit[1-4]$/.test(e.code))setTool(Number(e.code.at(-1))-1);
  if(e.code==='KeyE'||e.code==='Space')use(true);
  if(e.code==='KeyV'){setTool(0);use();}
  if(e.code==='KeyC'){setTool(3);shoot();}
});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{keys.clear();if(state==='playing'){state='paused';releasePointer();openDialog('paused');}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing'){state='paused';releasePointer();openDialog('paused');}});
document.addEventListener('pointerlockchange',()=>{
  if(document.pointerLockElement){everLocked=true;drag=null;}
  else if(everLocked&&state==='playing'){state='paused';keys.clear();openDialog('paused');}
});
window.addEventListener('mousemove',e=>{if(state!=='playing')return;if(document.pointerLockElement){yaw-=e.movementX*.002*settings.sensitivity;pitch-=e.movementY*.002*settings.sensitivity;}else if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;yaw-=dx*.003*settings.sensitivity;pitch-=dy*.003*settings.sensitivity;drag.x=e.clientX;drag.y=e.clientY;drag.distance+=Math.abs(dx)+Math.abs(dy);}});
$('scene').addEventListener('pointerdown',e=>{if(state!=='playing')return;audio.start();if(e.pointerType==='touch'){touchLook={id:e.pointerId,x:e.clientX,y:e.clientY};$('scene').setPointerCapture(e.pointerId);}else if(document.pointerLockElement)use();else drag={x:e.clientX,y:e.clientY,distance:0};});
window.addEventListener('pointerup',e=>{if(drag){if(drag.distance<5)use();drag=null;}if(touchLook?.id===e.pointerId)touchLook=null;});
$('scene').addEventListener('pointermove',e=>{if(!touchLook||state!=='playing'||touchLook.id!==e.pointerId)return;yaw-=(e.clientX-touchLook.x)*.004*settings.sensitivity;pitch-=(e.clientY-touchLook.y)*.004*settings.sensitivity;touchLook.x=e.clientX;touchLook.y=e.clientY;});
$('scene').addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('wheel',e=>{if(state!=='playing')return;e.preventDefault();setTool((tool+(e.deltaY>0?1:3))%4);},{passive:false});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('selected',x===b));$('mode-description').textContent=mode==='relaxed'?'A gentler siege. More time to find your feet.':'A growing harvest. An even faster siege.';}));
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>setTool(Number(b.dataset.tool))));
$('start').addEventListener('click',start);$('retry').addEventListener('click',start);
$('instructions-btn').addEventListener('click',()=>openDialog('how'));$('pause-guide').addEventListener('click',()=>openDialog('how'));
$('guide-play').addEventListener('click',()=>state==='paused'?resume():start());$('modal-close').addEventListener('click',closeDialog);
$('resume').addEventListener('click',resume);$('pause-btn').addEventListener('click',()=>openDialog('paused'));$('quit').addEventListener('click',home);$('return-home').addEventListener('click',home);
$('settings-btn').addEventListener('click',()=>openDialog('settings'));$('settings-done').addEventListener('click',closeDialog);
function updateSound(){audio.muted=settings.muted;$('sound').querySelector('use').setAttribute('href',settings.muted?'#i-mute':'#i-sound');$('sound').setAttribute('aria-label',settings.muted?'Enable sound':'Mute sound');$('sound').title=settings.muted?'Enable sound':'Mute sound';$('audio-toggle').checked=!settings.muted;}
$('sound').addEventListener('click',()=>{audio.start();settings.muted=!settings.muted;updateSound();saveSettings();});
$('audio-toggle').addEventListener('change',()=>{audio.start();settings.muted=!$('audio-toggle').checked;updateSound();saveSettings();});
$('sensitivity').value=settings.sensitivity;$('sensitivity').addEventListener('input',()=>{settings.sensitivity=Number($('sensitivity').value);saveSettings();});
$('quality-toggle').checked=settings.quality;$('quality-toggle').addEventListener('change',()=>{settings.quality=$('quality-toggle').checked;world?.quality(settings.quality);saveSettings();});
$('hints-toggle').checked=settings.hints;$('hints-toggle').addEventListener('change',()=>{settings.hints=$('hints-toggle').checked;document.querySelector('.controls-hint').classList.toggle('hide-hints',!settings.hints);saveSettings();});
document.querySelector('.controls-hint').classList.toggle('hide-hints',!settings.hints);updateSound();
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{if(state==='playing')notice('Fullscreen is not available in this browser.',false,2);}});
$('touch-use').addEventListener('pointerdown',e=>{e.preventDefault();use();});$('touch-tend').addEventListener('pointerdown',e=>{e.preventDefault();use(true);});
const joy=$('joystick');joy.addEventListener('pointerdown',e=>{if(state!=='playing')return;joystick.pointer=e.pointerId;joy.setPointerCapture(e.pointerId);joyUpdate(e);});
function joyUpdate(e){if(e.pointerId!==joystick.pointer)return;const rect=joy.getBoundingClientRect(),dx=e.clientX-(rect.left+rect.width/2),dy=e.clientY-(rect.top+rect.height/2),d=Math.hypot(dx,dy),max=rect.width*.33,s=max/Math.max(d,max);joystick.x=dx*s/max;joystick.y=dy*s/max;$('joystick-knob').style.transform=`translate(${dx*s}px,${dy*s}px)`;}
joy.addEventListener('pointermove',joyUpdate);function resetJoy(){joystick.x=joystick.y=0;joystick.pointer=null;$('joystick-knob').style.transform='';}joy.addEventListener('pointerup',resetJoy);joy.addEventListener('pointercancel',resetJoy);
document.addEventListener('keydown',e=>{if(!$('modal').hidden&&e.key==='Tab'){const els=[...document.querySelectorAll('#modal button:not([hidden]),#modal input')].filter(el=>el.offsetParent!==null),first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
