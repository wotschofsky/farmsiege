export const SIZE=8, SPACING=2.3, GROW_TIME=15;
export const SCORES={plant:15,rabbit:5,weed:2,mole:50};
export const position=(index)=>({x:((index%SIZE)-3.5)*SPACING,z:(Math.floor(index/SIZE)-3.5)*SPACING});
export const indexAt=(x,z)=>{
  const col=Math.floor(x/SPACING+4),row=Math.floor(z/SPACING+4);
  return col>=0&&col<SIZE&&row>=0&&row<SIZE?row*SIZE+col:-1;
};
export class FarmGame {
  constructor(random=Math.random){this.random=random;this.reset();}
  reset(relaxed=false){
    this.relaxed=relaxed;this.tiles=Array.from({length:64},()=>({type:'empty',age:0}));
    for(const i of [18,37,54])this.tiles[i]={type:'plant',age:this.random()*4};
    this.time=0;this.score=0;this.harvests=0;this.defended=0;this.wave=0;this.over=false;
    this.rabbits=[];this.nextId=1;this.events=[];this.nextWave=14;this.nextWeed=6;this.nextMole=18;this.nextStorm=30;this.storm=null;
  }
  get crops(){return this.tiles.filter(t=>t.type==='plant').length;}
  get speed(){return this.relaxed?0.55:Math.min(4,1+this.time/150);}
  emit(type,data={}){this.events.push({type,...data});}
  drain(){return this.events.splice(0);}
  plant(i){if(this.over||!this.tiles[i]||this.tiles[i].type!=='empty')return false;this.tiles[i]={type:'plant',age:0};this.emit('plant',{i});return true;}
  tend(i){
    if(this.over||!this.tiles[i])return false;const tile=this.tiles[i];let score=0;
    if(tile.type==='plant'){
      if(tile.age<GROW_TIME){this.emit('unripe',{i});return false;}
      score=SCORES.plant;this.harvests++;
    }else if(tile.type==='weed')score=SCORES.weed;
    else if(tile.type==='mole')score=SCORES.mole;
    else if(tile.type!=='hill')return false;
    this.tiles[i]={type:'empty',age:0};this.score+=score;this.emit('tend',{i,score,kind:tile.type});
    this.checkEnd();return true;
  }
  checkEnd(){if(this.crops===0&&!this.over){this.over=true;this.emit('end');}}
  nearestCrop(x,z){
    let best=-1,distance=Infinity;
    this.tiles.forEach((tile,i)=>{if(tile.type!=='plant')return;const p=position(i);const d=Math.hypot(p.x-x,p.z-z);if(d<distance){distance=d;best=i;}});
    return best;
  }
  shoot(origin,direction){
    if(this.over)return 0;let hits=0;
    this.rabbits=this.rabbits.filter(r=>{
      const dx=r.x-origin.x,dy=0.45-origin.y,dz=r.z-origin.z,d=Math.hypot(dx,dy,dz);
      const dot=(dx*direction.x+dy*direction.y+dz*direction.z)/d;
      if(d<28&&dot>Math.cos(0.095+0.5/Math.max(d,1))){hits++;this.score+=SCORES.rabbit;this.defended++;this.emit('hit',{x:r.x,z:r.z,score:SCORES.rabbit});return false;}return true;
    });return hits;
  }
  spawnWave(){
    this.wave++;const side=this.random()>0.5?1:-1;
    const amount=this.relaxed?2:Math.min(7,3+Math.floor(this.wave/2));
    for(let n=0;n<amount;n++)this.rabbits.push({id:this.nextId++,x:side*(14+n*0.6),z:(this.random()-0.5)*18,bite:0,phase:this.random()*6.28});
    this.emit('wave',{wave:this.wave,amount});this.nextWave=this.time+(12+this.random()*7)/this.speed;
  }
  strike(i){
    const x=i%SIZE,z=Math.floor(i/SIZE);
    for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
      const c=x+dx,r=z+dz;if(c<0||c>=8||r<0||r>=8)continue;
      this.tiles[r*8+c]={type:'empty',age:0};
    }
    this.emit('lightning',{i});this.checkEnd();
  }
  tick(dt){
    if(this.over)return;this.time+=dt;
    for(const t of this.tiles)if(t.type==='plant')t.age+=dt;
    if(this.time>=this.nextWave)this.spawnWave();
    if(this.time>=this.nextWeed){
      const weeds=this.tiles.flatMap((t,i)=>t.type==='weed'?[i]:[]);
      if(this.random()<0.4){const i=Math.floor(this.random()*64);if(this.tiles[i].type==='empty')this.tiles[i]={type:'weed',age:0};}
      for(const i of weeds){if(this.random()>1/Math.sqrt(weeds.length))continue;const x=i%8,z=Math.floor(i/8),nx=x+Math.floor(this.random()*3)-1,nz=z+Math.floor(this.random()*3)-1;
        if(nx>=0&&nx<8&&nz>=0&&nz<8&&this.tiles[nz*8+nx].type==='empty')this.tiles[nz*8+nx]={type:'weed',age:0};}
      this.nextWeed=this.time+(3+this.random()*3)/this.speed;
    }
    if(this.time>=this.nextMole){
      const old=this.tiles.findIndex(t=>t.type==='mole');
      if(old!==-1||this.random()<0.18){
        if(old!==-1)this.tiles[old]={type:'hill',age:0};
        const i=Math.floor(this.random()*64);this.tiles[i]={type:'mole',age:0};this.emit('mole',{i});this.checkEnd();
      }this.nextMole=this.time+(4+this.random()*5)/this.speed;
    }
    if(this.storm&&this.time>=this.storm.at){this.strike(this.storm.i);this.storm=null;}
    if(this.time>=this.nextStorm&&!this.storm){
      const i=Math.floor(this.random()*64);this.storm={i,at:this.time+2.5};this.emit('storm',{i});this.nextStorm=this.time+(22+this.random()*12)/this.speed;
    }
    for(const r of this.rabbits){
      const i=this.nearestCrop(r.x,r.z);if(i<0)break;const p=position(i),dx=p.x-r.x,dz=p.z-r.z,d=Math.hypot(dx,dz);
      if(d>0.35){const move=Math.min(d,dt*(this.relaxed?0.9:1.35)*Math.min(1.8,this.speed));r.x+=dx/d*move;r.z+=dz/d*move;r.bite=0;}
      else {r.bite+=dt;if(r.bite>=2){this.tiles[i]={type:'empty',age:0};this.emit('eaten',{i});r.bite=0;this.checkEnd();}}
    }
  }
}
