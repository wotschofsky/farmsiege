import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {palette,mat,mesh,box,rod,ellipsoid,bake,tomato,weed,rabbit,mole,tree,barn,fence,hay,barrel,tools} from './models.js';
import {position,SPACING,GROW_TIME} from './logic.js';
function seeded(seed){return()=>{seed|=0;seed=seed+0x6d2b79f5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function texture(kind){
  const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),r=seeded(23);ctx.fillStyle=kind==='soil'?'#63432c':'#667f3d';ctx.fillRect(0,0,256,256);
  for(let i=0;i<9000;i++){const x=r()*256,y=r()*256,a=r()*0.25;ctx.fillStyle=`rgba(${kind==='soil'?'27,18,9':'159,159,89'},${a})`;ctx.fillRect(x,y,1+r()*3,1+r()*3);}
  if(kind==='soil')for(let i=0;i<12;i++){ctx.strokeStyle='rgba(34,21,13,.22)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,i*24);ctx.bezierCurveTo(60,i*24+5,180,i*24-5,256,i*24);ctx.stroke();}
  const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.colorSpace=T.SRGBColorSpace;return tex;
}
export class FarmWorld {
  constructor(canvas){
    this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
    this.scene=new T.Scene();this.scene.background=new T.Color(0xb9d0c3);this.scene.fog=new T.FogExp2(0xcbd6ba,0.012);
    this.camera=new T.PerspectiveCamera(65,innerWidth/innerHeight,0.04,230);this.camera.rotation.order='YXZ';this.scene.add(this.camera);this.r=seeded(394);
    const ambient=new T.HemisphereLight(0xe4eece,0x5c5336,2.6);this.scene.add(ambient);
    this.sun=new T.DirectionalLight(0xffdfa1,3.1);this.sun.position.set(-28,35,-16);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-35,right:35,top:35,bottom:-35,near:1,far:100});this.sun.shadow.bias=-0.0003;this.sun.shadow.normalBias=0.035;this.scene.add(this.sun);
    this.scene.add(new T.AmbientLight(0xefc88e,0.15));
    this.buildGround();this.buildSky();this.buildFarm();this.buildGrass();this.buildPlants();this.buildTool();this.buildEffects();
    this.loadAnimals();this.resize();this.menuCamera(0);
  }
  resize(){this.renderer.setSize(innerWidth,innerHeight,false);this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();}
  buildGround(){
    const tex=texture('grass');tex.repeat.set(55,55);const ground=mesh(new T.PlaneGeometry(300,300),new T.MeshStandardMaterial({map:tex,color:0xa0ad77,roughness:1}),this.scene);ground.rotation.x=-Math.PI/2;
    const hills=new T.Group();for(let i=0;i<18;i++){const a=i*0.35;const x=Math.cos(a)*100,z=Math.sin(a)*100;ellipsoid(hills,x,-5,z,23+this.r()*35,10+this.r()*10,18+this.r()*30,[0x81976b,0x718b61,0x8fa374][i%3],28);}this.scene.add(bake(hills));
    const road=mesh(new T.PlaneGeometry(7,95),mat(0xbfa774),this.scene,23,0.016,15);road.rotation.x=-Math.PI/2;road.rotation.z=0.16;
    const soilTex=texture('soil');const soilMat=new T.MeshStandardMaterial({map:soilTex,color:0x9b8065,roughness:1});
    this.soil= new T.InstancedMesh(new T.BoxGeometry(1.94,0.13,1.94),soilMat,64);this.soil.receiveShadow=true;const dummy=new T.Object3D();
    const rails=new T.Group();for(let i=0;i<64;i++){const p=position(i);dummy.position.set(p.x,0.045,p.z);dummy.updateMatrix();this.soil.setMatrixAt(i,dummy.matrix);}
    for(let i=0;i<9;i++){const p=(i-4)*SPACING;box(rails,p,0.04,0,0.08,0.1,18.5,0x9a734c);box(rails,0,0.04,p,18.5,0.1,0.08,0x9a734c);}this.scene.add(this.soil,bake(rails));
    const pebbles=new T.InstancedMesh(new T.IcosahedronGeometry(0.07,0),mat(0x8b8167),240);for(let i=0;i<240;i++){const a=this.r()*Math.PI*2,r=12+this.r()*28;dummy.position.set(Math.cos(a)*r,0.035,Math.sin(a)*r);dummy.scale.set(1+this.r(),0.5,1);dummy.updateMatrix();pebbles.setMatrixAt(i,dummy.matrix);}this.scene.add(pebbles);
  }
  buildSky(){
    const skyMat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{top:{value:new T.Color(0x779eac)},bottom:{value:new T.Color(0xe9ddba)}},vertexShader:'varying vec3 vPos; void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 vPos;uniform vec3 top;uniform vec3 bottom;void main(){float h=normalize(vPos).y;gl_FragColor=vec4(mix(bottom,top,pow(max(h,0.0),0.55)),1.0);}'});
    mesh(new T.SphereGeometry(180,32,16),skyMat,this.scene);
    const sunDisk=mesh(new T.SphereGeometry(4.2,24,12),new T.MeshBasicMaterial({color:0xffeed0,fog:false}),this.scene,-90,95,-100);sunDisk.castShadow=false;
    const clouds=new T.Group();for(let i=0;i<14;i++){const x=(this.r()-0.5)*200,z=-60-this.r()*70,y=34+this.r()*15;for(let k=0;k<6;k++)ellipsoid(clouds,x+k*4,y+Math.sin(k)*2,z,6+this.r()*3,2.2+this.r()*1.2,3.5,0xe9e9d5,16);}this.clouds=bake(clouds);this.clouds.traverse(m=>{if(m.isMesh){m.castShadow=false;m.receiveShadow=false;}});this.scene.add(this.clouds);
    const birds=new T.Group();for(let i=0;i<7;i++){const x=this.r()*60-30;rod(birds,[x-0.28,20,-40],[x,19.88,-40],0.02,0x54635b);rod(birds,[x,19.88,-40],[x+0.28,20,-40],0.02,0x54635b);}this.birds=bake(birds);this.scene.add(this.birds);
  }
  buildFarm(){
    const b=barn();b.position.set(-18,0,-17);b.rotation.y=0.22;this.scene.add(b);
    const fences=new T.Group(),base=fence(4);for(let i=0;i<8;i++){
      for(const z of [-15,15]){if(z===15&&i===4)continue;const f=base.clone();f.position.set(-14+i*4,0,z);fences.add(f);}
      for(const x of [-16,16]){const f=base.clone();f.position.set(x,0,-14+i*4);f.rotation.y=Math.PI/2;fences.add(f);}
    }this.scene.add(fences);
    const pen=new T.Group();for(let i=0;i<4;i++){const a=base.clone();a.position.set(24+i*4,0,-4);pen.add(a);const c=base.clone();c.position.set(24+i*4,0,-14);pen.add(c);}for(const x of [22,38])for(let j=0;j<3;j++){const f=base.clone();f.position.set(x,0,-12+j*4);f.rotation.y=Math.PI/2;pen.add(f);}this.scene.add(pen);
    const treeBase=tree(0.7);for(let i=0;i<47;i++){const t=i%3===0?tree(i*0.1):treeBase.clone();const a=this.r()*Math.PI*2,r=34+this.r()*43;t.position.set(Math.cos(a)*r,0,Math.sin(a)*r);t.rotation.y=this.r()*6.28;t.scale.setScalar(0.9+this.r()*0.8);this.scene.add(t);}
    for(const p of [[-13,-24],[14,-24],[19,23],[-24,12],[-15,23]]){const t=treeBase.clone();t.position.set(p[0],0,p[1]);t.scale.setScalar(1.15);this.scene.add(t);}
    const hayBase=hay();for(const [x,y,z,rot] of [[-12,0,-16,.2],[-11,0,-16,.4],[-11.5,.75,-16,.1],[-14,0,-10,1.4],[19,0,12,0]]){const h=hayBase.clone();h.position.set(x,y,z);h.rotation.y=rot;this.scene.add(h);}
    for(const [x,z] of [[-13,-14],[-12,-13],[13,12]]){const h=barrel();h.position.set(x,0,z);this.scene.add(h);}
    const windmill=new T.Group();mesh(new T.CylinderGeometry(0.45,1.2,9,6),mat(0xbba987),windmill,0,4.5,0);mesh(new T.ConeGeometry(1.1,1.3,6),mat(palette.roof),windmill,0,9.5,0);this.rotor=new T.Group();for(let i=0;i<4;i++){const blade=new T.Group();rod(blade,[0,0,0],[0,4.1,0],0.045,palette.darkWood);for(let j=0;j<7;j++)box(blade,0.35,1+j*0.45,0,0.7,0.19,0.055,palette.cream);blade.rotation.z=i*Math.PI/2;this.rotor.add(blade);}this.rotor.position.set(0,8.5,1.15);windmill.add(this.rotor);windmill.position.set(-32,0,-30);windmill.rotation.y=0.4;this.scene.add(windmill);
    const sign=new T.Group();for(const x of [-0.63,0.63])box(sign,x,0.65,0,0.09,1.3,0.08,palette.darkWood);box(sign,0,1.2,0,1.6,0.65,0.075,palette.wood);const c=document.createElement('canvas');c.width=512;c.height=220;const ctx=c.getContext('2d');ctx.fillStyle='#ad8353';ctx.fillRect(0,0,512,220);ctx.fillStyle='#f5e8c7';ctx.textAlign='center';ctx.font='bold 62px Georgia';ctx.fillText('FARMSIEGE',256,104);ctx.font='25px Georgia';ctx.fillText('GROW • TEND • DEFEND',256,157);const sm=new T.MeshStandardMaterial({map:new T.CanvasTexture(c),roughness:1});const panel=mesh(new T.PlaneGeometry(1.48,0.62),sm,sign,0,1.2,0.042);sign.position.set(11.8,0,14.5);sign.rotation.y=-0.2;this.scene.add(sign);
    const trough=new T.Group();box(trough,0,0.26,0,2.3,0.45,0.85,0x837358);box(trough,0,0.49,0,2.13,0.015,0.69,mat(0x597f7b,0.15));trough.position.set(26,0,-5.5);this.scene.add(bake(trough));
  }
  async loadAnimals(){
    const loader=new GLTFLoader();const specs=[['cow',[[28,0,-9,1.9],[33,0,-11,0.4]]],['sheep',[[26,0,-12,0.4],[35,0,-7,2.3]]]];
    for(const [name,placements] of specs){try{const gltf=await loader.loadAsync(`./assets/${name}.glb`);for(const [x,y,z,a] of placements){const m=gltf.scene.clone();const b=new T.Box3().setFromObject(m),size=b.getSize(new T.Vector3());const scale=(name==='cow'?1.45:0.95)/size.y;m.scale.setScalar(scale);m.position.set(x,y-b.min.y*scale,z);m.rotation.y=a;m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});this.scene.add(m);}}catch(error){console.warn(`Optional ${name} model unavailable`,error);}}
  }
  buildGrass(){
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([-0.03,0,0,0.03,0,0,-0.019,0.27,0,0.019,0.27,0,0.015,0.55,0],3));geo.setIndex([0,1,2,1,3,2,2,3,4]);geo.computeVertexNormals();
    const material=new T.MeshStandardMaterial({color:0x7f9445,roughness:1,side:T.DoubleSide});this.windUniform={value:0};material.onBeforeCompile=shader=>{shader.uniforms.uTime=this.windUniform;shader.vertexShader='uniform float uTime;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed.x += sin(uTime*1.7 + instanceMatrix[3].x*.7 + instanceMatrix[3].z*.5)*position.y*position.y*.25;');};
    const grass=new T.InstancedMesh(geo,material,10000),dummy=new T.Object3D();for(let i=0;i<10000;i++){let x,z;do{x=(this.r()-0.5)*105;z=(this.r()-0.5)*105;}while(Math.abs(x)<11&&Math.abs(z)<11||x>18&&x<28);dummy.position.set(x,0.01,z);dummy.rotation.y=this.r()*6.28;dummy.scale.setScalar(0.45+this.r()*1.1);dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix);grass.setColorAt(i,new T.Color().setHSL(0.20+this.r()*0.06,0.35+this.r()*0.2,0.30+this.r()*0.14));}grass.receiveShadow=true;this.scene.add(grass);
    const flowers=new T.Group();for(let i=0;i<95;i++){const a=this.r()*6.28,r=17+this.r()*20,x=Math.cos(a)*r,z=Math.sin(a)*r;rod(flowers,[x,0,z],[x,0.28,z],0.008,0x688442);for(let j=0;j<5;j++)ellipsoid(flowers,x+Math.cos(j*1.256)*0.055,0.29,z+Math.sin(j*1.256)*0.055,0.048,0.016,0.048,0xefdfb4,8);ellipsoid(flowers,x,0.30,z,0.025,0.018,0.025,0xd4a33d,8);}this.scene.add(bake(flowers));
  }
  buildPlants(){
    this.plantTemplate=tomato();this.weedTemplate=weed();this.moleTemplate=mole();this.rabbitTemplate=rabbit();this.plants=[];
    for(let i=0;i<64;i++){const p=position(i),g=new T.Group(),plant=this.plantTemplate.clone(),w=this.weedTemplate.clone(),m=this.moleTemplate.clone();g.position.set(p.x,0.1,p.z);plant.rotation.y=this.r()*6.28;g.add(plant,w,m);this.scene.add(g);this.plants.push({group:g,plant,weed:w,mole:m});}
    this.rabbitMeshes=new Map();this.decorRabbits=[];for(let i=0;i<2;i++){const b=this.rabbitTemplate.clone();b.position.set(9+i*3,0,5-i*7);b.rotation.y=i*1.7;this.scene.add(b);this.decorRabbits.push(b);}
    this.select=mesh(new T.BoxGeometry(1.98,0.015,1.98),new T.MeshBasicMaterial({color:0xe1d99a,transparent:true,opacity:0.10,depthWrite:false}),this.scene);this.select.position.y=0.122;this.select.visible=false;
    const edges=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1.99,0.01,1.99)),new T.LineBasicMaterial({color:0xf6e7aa,transparent:true,opacity:0.75}));this.select.add(edges);
    this.stormRing=mesh(new T.RingGeometry(0.7,0.78,48),new T.MeshBasicMaterial({color:0xffb957,side:T.DoubleSide,transparent:true,opacity:0.8}),this.scene);this.stormRing.rotation.x=-Math.PI/2;this.stormRing.visible=false;
  }
  buildTool(){
    this.toolRoot=new T.Group();this.toolRoot.position.set(0.36,-0.40,-0.7);this.camera.add(this.toolRoot);this.toolModels=tools();this.toolModels.forEach((t,i)=>{t.visible=i===0;if(i===3)t.position.set(-0.08,0.14,0);else {t.rotation.x=-0.33;t.rotation.z=-0.16;}this.toolRoot.add(t);});
    const hand=new T.Group();ellipsoid(hand,0,-0.13,0.03,0.055,0.08,0.10,0xd6b18b);const forearm=rod(hand,[0,-0.13,0.1],[0.12,-0.30,0.48],0.055,0xbaa078,0.072);for(let i=0;i<4;i++)rod(hand,[-0.047+i*0.025,-0.10,-0.04],[-0.047+i*0.025,-0.15,-0.075],0.014,0xd2ad87);const sleeve=rod(hand,[0.04,-0.22,0.25],[0.13,-0.31,0.50],0.080,0x738169,0.1);this.toolRoot.add(bake(hand));
    const light=new T.PointLight(0xffeac0,0.55,3);light.position.set(-0.4,0.8,0);this.camera.add(light);
    this.muzzle=new T.PointLight(0xffbd50,0,3);this.muzzle.position.set(0.25,-0.2,-1.35);this.camera.add(this.muzzle);this.swing=0;this.recoil=0;
  }
  setTool(i){this.toolModels.forEach((t,j)=>t.visible=j===i);this.activeTool=i;}
  buildEffects(){
    this.particles=[];const p=new Float32Array(75*3);for(let i=0;i<75;i++){p[i*3]=(this.r()-0.5)*40;p[i*3+1]=this.r()*5;p[i*3+2]=(this.r()-0.5)*40;}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(p,3));this.pollen=new T.Points(geo,new T.PointsMaterial({color:0xe9dfa7,size:0.035,transparent:true,opacity:0.65}));this.scene.add(this.pollen);
    this.bolt=null;this.flash=0;
  }
  burst(x,z,color=0xb9965d,amount=12){for(let i=0;i<amount;i++){const obj=mesh(new T.IcosahedronGeometry(0.045+this.r()*0.02,0),mat(color),this.scene,x,0.45,z);obj.castShadow=false;this.particles.push({obj,v:new T.Vector3((this.r()-0.5)*2.4,1+this.r()*1.5,(this.r()-0.5)*2.4),life:0.7});}}
  lightning(i){
    const p=position(i),points=[];for(let n=0;n<11;n++)points.push(new T.Vector3(p.x+(n===10?0:(this.r()-0.5)*1.8),13-n*1.28,p.z+(this.r()-0.5)*0.6));
    if(this.bolt){this.scene.remove(this.bolt);this.bolt.geometry.dispose();this.bolt.material.dispose();}
    this.bolt=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0xffffff}));this.scene.add(this.bolt);this.flash=0.4;this.burst(p.x,p.z,0xffd182,30);
  }
  menuCamera(t){this.camera.position.set(17+Math.sin(t*0.045)*0.6,6.0,23);this.camera.lookAt(-1.5,1.4,-5);this.toolRoot.visible=false;}
  sync(game,t,playing){
    this.plants.forEach((slot,i)=>{
      const tile=game.tiles[i];slot.plant.visible=tile.type==='plant';slot.weed.visible=tile.type==='weed';slot.mole.visible=tile.type==='mole'||tile.type==='hill';
      if(tile.type==='plant'){const growth=Math.min(1,tile.age/GROW_TIME);slot.plant.scale.setScalar(0.16+growth*0.84);const fruit=slot.plant.getObjectByName('fruit');fruit.visible=growth>0.70;fruit.scale.setScalar(growth>=1?1:0.68);slot.plant.rotation.z=Math.sin(t*1.6+i)*0.012;}
      if(slot.mole.visible){const m=slot.mole.getObjectByName('mole');m.visible=tile.type==='mole';m.position.y=Math.sin(t*3)*0.025;}
    });
    this.decorRabbits.forEach(m=>{m.visible=!playing;m.position.y=Math.abs(Math.sin(t*2))*0.04;});
    const ids=new Set(game.rabbits.map(r=>r.id));for(const [id,m] of this.rabbitMeshes)if(!ids.has(id)){this.scene.remove(m);this.rabbitMeshes.delete(id);}
    for(const r of game.rabbits){let m=this.rabbitMeshes.get(r.id);if(!m){m=this.rabbitTemplate.clone();m.userData.ears=[m.children[1],m.children[2]];this.scene.add(m);this.rabbitMeshes.set(r.id,m);}const dx=r.x-m.position.x,dz=r.z-m.position.z;const target=game.nearestCrop(r.x,r.z);if(target>=0){const p=position(target);m.rotation.y=Math.atan2(-(p.x-r.x),-(p.z-r.z));}m.position.set(r.x,r.bite?Math.sin(t*9+r.phase)*0.013:Math.abs(Math.sin(t*6+r.phase))*0.15,r.z);m.rotation.x=r.bite?Math.sin(t*10)*0.08:Math.sin(t*6+r.phase)*0.10;for(const [i,ear] of m.userData.ears.entries())ear.rotation.z=(i?1:-1)*(0.15+Math.sin(t*4+r.phase)*0.055);}
    if(game.storm){const p=position(game.storm.i);this.stormRing.visible=true;this.stormRing.position.set(p.x,0.13,p.z);this.stormRing.scale.setScalar(1.6+Math.sin(t*9)*0.3);}else this.stormRing.visible=false;
  }
  update(dt,t,moving=false){
    this.windUniform.value=t;this.rotor.rotation.z-=dt*0.15;this.clouds.position.x=Math.sin(t*0.008)*8;this.birds.position.x=Math.sin(t*0.03)*30;
    this.pollen.rotation.y=t*0.008;
    for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;p.obj.position.addScaledVector(p.v,dt);p.v.y-=dt*4;p.obj.scale.setScalar(Math.max(0,p.life));if(p.life<=0){this.scene.remove(p.obj);p.obj.geometry.dispose();this.particles.splice(i,1);}}
    this.swing=Math.max(0,this.swing-dt*2.8);this.recoil=Math.max(0,this.recoil-dt*4.0);
    const bob=moving?Math.sin(t*10)*0.015:Math.sin(t*1.6)*0.003;this.toolRoot.position.set(0.36,-0.40+bob+Math.sin(this.swing*Math.PI)*0.10,-0.7+this.recoil*0.10);this.toolRoot.rotation.set(Math.sin(this.swing*Math.PI)*-0.8+this.recoil*0.15,0,Math.sin(this.swing*Math.PI)*0.18);this.muzzle.intensity=this.recoil>0.75?8:0;
    if(this.flash>0){this.flash-=dt;this.sun.intensity=3.1+Math.max(0,this.flash)*12;if(this.flash<=0&&this.bolt){this.scene.remove(this.bolt);this.bolt.geometry.dispose();this.bolt.material.dispose();this.bolt=null;}}this.renderer.render(this.scene,this.camera);
  }
  quality(high){this.renderer.setPixelRatio(high?Math.min(devicePixelRatio,1.5):1);this.renderer.shadowMap.enabled=high;this.renderer.setSize(innerWidth,innerHeight,false);this.scene.traverse(o=>{if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.needsUpdate=true);}});}
}
