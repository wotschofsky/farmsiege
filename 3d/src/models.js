import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
export const palette={cream:0xf4e6ca,wood:0xa5764e,darkWood:0x5a3827,red:0xa94332,roof:0x344b48,green:0x416c32,leaf:0x638e38,soil:0x5c3928,gold:0xd6ad5c};
const mats=new Map();
export function mat(color,roughness=0.8,metalness=0){const key=`${color}-${roughness}-${metalness}`;if(!mats.has(key))mats.set(key,new T.MeshStandardMaterial({color,roughness,metalness}));return mats.get(key);}
export function mesh(geo,material,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(parent)parent.add(m);return m;}
export function box(parent,x,y,z,w,h,d,color,rot=0){const m=mesh(new T.BoxGeometry(w,h,d),typeof color==='number'?mat(color):color,parent,x,y,z);m.rotation.z=rot;return m;}
export function ellipsoid(parent,x,y,z,sx,sy,sz,color,detail=20){const m=mesh(new T.SphereGeometry(1,detail,Math.floor(detail*0.75)),typeof color==='number'?mat(color):color,parent,x,y,z);m.scale.set(sx,sy,sz);return m;}
export function rod(parent,a,b,r,color,r2=r){const va=new T.Vector3(...a),vb=new T.Vector3(...b),delta=vb.clone().sub(va);const m=mesh(new T.CylinderGeometry(r2,r,delta.length(),10),typeof color==='number'?mat(color):color,parent);m.position.copy(va.add(vb).multiplyScalar(0.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return m;}
export function bake(group){
  group.updateMatrixWorld(true);const geometries=new Map();
  group.traverse(obj=>{if(!obj.isMesh)return;let geo=obj.geometry.clone();if(geo.index)geo=geo.toNonIndexed();geo.applyMatrix4(obj.matrixWorld);const key=obj.material.uuid;if(!geometries.has(key))geometries.set(key,{material:obj.material,parts:[]});geometries.get(key).parts.push(geo);});
  const out=new T.Group();for(const {parts,material} of geometries.values()){const geo=mergeGeometries(parts,false);mesh(geo,material,out);for(const p of parts)p.dispose();}return out;
}
function leafGeo(){
  const geo=new T.SphereGeometry(1,12,8);const a=geo.attributes.position;for(let i=0;i<a.count;i++){const y=a.getY(i);a.setXYZ(i,a.getX(i)*0.17*(0.75+0.25*Math.sin(y*18)),y*0.32,a.getZ(i)*0.035+Math.pow(y,2)*0.07);}geo.computeVertexNormals();return geo;
}
const leafGeometry=leafGeo();
function leaf(parent,x,y,z,angle,size=1,color=palette.leaf){const m=mesh(leafGeometry,mat(color),parent,x,y,z);m.rotation.set(0,angle,0.85);m.scale.setScalar(size);return m;}
export function tomato(){
  const group=new T.Group();rod(group,[0,0,0],[0.02,1.3,0],0.028,0x467831,0.015);
  rod(group,[0.19,0,0.07],[0.19,1.55,0.07],0.017,palette.wood);
  for(let i=0;i<7;i++){
    const angle=i*2.4,h=0.23+i*0.14,bx=Math.cos(angle)*0.37,bz=Math.sin(angle)*0.37;
    rod(group,[0,h,0],[bx,h+0.12,bz],0.012,0x4b7c32,0.006);
    leaf(group,bx,h+0.18,bz,angle,0.9+i*0.04,i%2?0x487f32:0x689640);
    leaf(group,bx*0.5,h+0.18,bz*0.5,angle+Math.PI,0.65,0x4b8032);
  }
  const foliage=bake(group),fruitGroup=new T.Group();
  for(let i=0;i<6;i++){
    const a=i*2.4+0.5,h=0.38+(i%3)*0.23,x=Math.cos(a)*0.30,z=Math.sin(a)*0.30;
    ellipsoid(fruitGroup,x,h,z,0.135,0.115,0.13,i%2?0xdc4830:0xef5535,24);
    for(let j=0;j<5;j++){const b=j*Math.PI*0.4;const sep=mesh(leafGeometry,mat(0x3d6430),fruitGroup,x,h+0.12,z);sep.rotation.set(0,b,1.25);sep.scale.set(0.42,0.28,0.42);}
    rod(fruitGroup,[x,h+0.12,z],[x*0.8,h+0.19,z*0.8],0.009,0x4b7030);
  }
  foliage.add(bake(fruitGroup));foliage.children.at(-1).name='fruit';return foliage;
}
export function weed(){const g=new T.Group();for(let i=0;i<10;i++){const a=i*2.4;rod(g,[0,0,0],[Math.cos(a)*0.20,0.3+i%3*0.13,Math.sin(a)*0.20],0.014,0x6c713a);leaf(g,Math.cos(a)*0.17,0.24+i%3*0.1,Math.sin(a)*0.17,a,0.95,0x8d9443);}for(let j=0;j<3;j++)ellipsoid(g,Math.cos(j*2.4)*0.2,0.52,Math.sin(j*2.4)*0.2,0.035,0.035,0.035,0xe0cd78,10);return bake(g);}
export function rabbit(){
  const g=new T.Group(),body=new T.Group();
  const fur=mat(0xd7c6aa,0.98),light=mat(0xf1e5cf),pink=mat(0xc68e80);
  ellipsoid(body,0,0.36,0.04,0.26,0.29,0.42,fur,28);
  ellipsoid(body,0,0.45,-0.3,0.23,0.23,0.23,fur,28);
  ellipsoid(body,-0.10,0.37,-0.48,0.115,0.105,0.10,light);
  ellipsoid(body,0.10,0.37,-0.48,0.115,0.105,0.10,light);
  ellipsoid(body,0,0.405,-0.555,0.055,0.034,0.03,pink);
  for(const side of [-1,1]){
    ellipsoid(body,side*0.20,0.51,-0.395,0.028,0.039,0.025,0x252924);
    ellipsoid(body,side*0.21,0.52,-0.412,0.009,0.01,0.008,0xffffff,10);
    ellipsoid(body,side*0.2,0.16,0.25,0.15,0.16,0.21,fur);
    ellipsoid(body,side*0.16,0.08,-0.23,0.085,0.075,0.17,light);
    for(let k=0;k<3;k++)rod(body,[side*0.10,0.37,-0.53],[side*(0.31+k*0.02),0.36+k*0.025,-0.56+k*0.03],0.002,0xe5daca);
  }
  ellipsoid(body,0,0.38,0.44,0.12,0.12,0.13,light);
  g.add(bake(body));g.userData.ears=[];
  for(const side of [-1,1]){const ear=new T.Group();ellipsoid(ear,0,0.20,0,0.072,0.25,0.06,fur,24);ellipsoid(ear,0,0.22,-0.045,0.039,0.18,0.015,pink,16);const b=bake(ear);b.position.set(side*0.115,0.60,-0.25);b.rotation.z=side*0.15;g.add(b);g.userData.ears.push(b);}
  return g;
}
export function mole(){const g=new T.Group();ellipsoid(g,0,0.06,0,0.50,0.17,0.43,0x674631);for(let i=0;i<10;i++){const a=i*2.4;ellipsoid(g,Math.cos(a)*0.32,0.05,Math.sin(a)*0.28,0.15,0.07,0.12,0x806040,10);}const hill=bake(g),body=new T.Group();ellipsoid(body,0,0.25,0,0.18,0.24,0.17,0x514b43);ellipsoid(body,0,0.27,-0.18,0.07,0.05,0.1,0xd6a196);for(const s of [-1,1]){ellipsoid(body,s*0.105,0.32,-0.13,0.016,0.022,0.015,0x111111);ellipsoid(body,s*0.2,0.12,-0.10,0.11,0.045,0.075,0xc7a28e);}hill.add(bake(body));hill.children.at(-1).name='mole';return hill;}
export function tree(seed=1){
  const g=new T.Group();rod(g,[0,0,0],[0.2,4.4,0],0.31,0x674930,0.09);
  for(let i=0;i<6;i++){const a=i*2.4+seed,x=Math.cos(a)*1.4,z=Math.sin(a)*1.4,y=2.3+i*0.35;rod(g,[0.1,y-0.8,0],[x,y+0.7,z],0.12,0x765335,0.025);}
  for(let i=0;i<23;i++){
    const a=i*2.4+seed,r=0.3+(i%4)*0.5,x=Math.cos(a)*r,z=Math.sin(a)*r,y=3.7+(i%5)*0.42;
    const geo=new T.IcosahedronGeometry(1.1,2),p=geo.attributes.position;
    for(let j=0;j<p.count;j++){const s=1+0.10*Math.sin(p.getX(j)*8+seed)*Math.cos(p.getZ(j)*9);p.setXYZ(j,p.getX(j)*s,p.getY(j)*s*0.9,p.getZ(j)*s);}geo.computeVertexNormals();
    mesh(geo,mat([0x547436,0x658541,0x739447,0x456531][i%4]),g,x,y,z);
  }return bake(g);
}
export function barn(){
  const g=new T.Group();box(g,0,2.2,0,7,4.4,7,0xa94232);
  for(let i=0;i<29;i++){const x=-3.45+i*0.246;box(g,x,2.2,3.53,0.16,4.38,0.035,i%3===0?0xba5440:0xa94232);box(g,x,2.2,-3.53,0.16,4.38,0.035,0xa94232);}
  for(let i=0;i<29;i++){const z=-3.45+i*0.246;box(g,-3.53,2.2,z,0.035,4.38,0.16,i%3===0?0xba5440:0xa94232);box(g,3.53,2.2,z,0.035,4.38,0.16,0xa94232);}
  for(const x of [-3.55,3.55])for(const z of [-3.55,3.55])box(g,x,2.3,z,0.18,4.6,0.18,palette.cream);
  const shape=new T.Shape();shape.moveTo(-3.65,0);shape.lineTo(3.65,0);shape.lineTo(0,2.3);shape.closePath();
  const end=mesh(new T.ShapeGeometry(shape),mat(palette.red),g,0,4.4,3.54);const back=end.clone();back.position.z=-3.54;back.rotation.y=Math.PI;g.add(back);
  const slope=Math.atan2(2.3,3.65);for(const side of [-1,1]){
    box(g,side*1.83,5.56,0,4.45,0.18,7.8,palette.roof,-side*slope);
    for(let i=0;i<16;i++)box(g,side*1.83,5.69,-3.7+i*0.49,4.47,0.045,0.035,0x4a6057,-side*slope);
    rod(g,[0,6.85,3.65],[side*3.77,4.44,3.65],0.08,palette.cream);
  }
  box(g,0,1.6,3.60,3.1,3.2,0.12,0x713a2b);
  for(let i=0;i<12;i++)box(g,-1.42+i*0.26,1.6,3.68,0.20,3.12,0.07,0x88422f);
  for(const x of [-1.62,0,1.62])box(g,x,1.65,3.78,0.11,3.35,0.1,palette.cream);
  box(g,0,3.28,3.78,3.35,0.14,0.12,palette.cream);
  rod(g,[-1.55,0.10,3.80],[-0.04,3.15,3.80],0.055,palette.cream);
  rod(g,[0.04,3.15,3.80],[1.55,0.10,3.80],0.055,palette.cream);
  box(g,0,5.0,3.63,0.85,0.85,0.08,palette.cream);
  box(g,0,5.0,3.70,0.62,0.62,0.09,0x314945);box(g,0,5.0,3.77,0.045,0.62,0.02,palette.cream);box(g,0,5.0,3.77,0.62,0.045,0.02,palette.cream);
  for(const side of [-1,1]){box(g,side*3.63,2.5,0,0.14,1.35,1.45,palette.cream);box(g,side*3.73,2.5,0,0.08,1.1,1.2,0x374f46);}
  const cup=new T.Group();box(cup,0,0.35,0,0.65,0.7,0.65,0xe6d9b6);const roof=mesh(new T.ConeGeometry(0.65,0.6,4),mat(palette.roof),cup,0,0.98,0);roof.rotation.y=Math.PI/4;rod(cup,[0,1.2,0],[0,1.75,0],0.025,0x343f39);box(cup,0.20,1.62,0,0.48,0.18,0.03,0x343f39);cup.position.set(0,6.62,-1.1);g.add(cup);
  return bake(g);
}
export function fence(length=5){const g=new T.Group();for(const x of [-length/2,length/2]){box(g,x,0.70,0,0.17,1.40,0.17,palette.wood);const top=mesh(new T.ConeGeometry(0.12,0.17,4),mat(0xc09968),g,x,1.48,0);top.rotation.y=Math.PI/4;}for(const y of [0.47,1.04])box(g,0,y,0,length,0.14,0.10,0xbd9566);rod(g,[-length/2,0.35,0.01],[length/2,1.14,0.01],0.042,palette.wood);return bake(g);}
export function hay(){const g=new T.Group();box(g,0,0.36,0,1.15,0.72,0.74,0xc9a958);for(let i=0;i<22;i++)box(g,-0.52+i*0.05,0.36,0.376,0.025,0.65,0.01,i%2?0xe0c274:0xb49144);for(const x of [-0.35,0.35]){box(g,x,0.365,0,0.042,0.75,0.77,0x735434);}return bake(g);}
export function barrel(){const g=new T.Group();const points=[new T.Vector2(0.25,0),new T.Vector2(0.3,0.08),new T.Vector2(0.35,0.5),new T.Vector2(0.31,0.94),new T.Vector2(0.26,1)];mesh(new T.LatheGeometry(points,24),mat(palette.wood),g);for(const y of [0.13,0.48,0.87]){const ring=mesh(new T.TorusGeometry(y===0.48?0.35:0.32,0.025,6,24),mat(0x45564e,0.45,0.6),g,0,y,0);ring.rotation.x=Math.PI/2;}mesh(new T.CylinderGeometry(0.28,0.28,0.04,24),mat(0x6d4b32),g,0,0.99,0);return bake(g);}
export function tools(){
  const seed=new T.Group();box(seed,0,0,0,0.19,0.28,0.04,0xe4d1a3);box(seed,0,0.055,-0.027,0.15,0.07,0.007,0x486c42);ellipsoid(seed,0,-0.03,-0.028,0.05,0.047,0.008,0xd64c31);for(let j=0;j<3;j++)rod(seed,[-0.055+j*0.055,-0.12,-0.03],[-0.055+j*0.055,-0.11,-0.03],0.008,0xa08450);
  const spade=new T.Group();rod(spade,[0,-0.30,0],[0,0.51,0],0.028,0xae7e4d);const handle=mesh(new T.TorusGeometry(0.08,0.023,8,20),mat(0x775034),spade,0,0.55,0);handle.scale.y=0.70;const shovel=mesh(new T.SphereGeometry(1,16,10),mat(0x889798,0.38,0.65),spade,0,-0.40,0);shovel.scale.set(0.12,0.16,0.024);box(spade,0,-0.28,0,0.26,0.025,0.04,0x98a8a5);
  const mallet=new T.Group();rod(mallet,[0,-0.40,0],[0,0.28,0],0.029,0xb1804c);box(mallet,0,0.27,0,0.3,0.14,0.14,0x555b57);for(const s of [-1,1])box(mallet,s*0.15,0.27,0,0.03,0.16,0.16,0x899086);
  const gun=new T.Group();box(gun,0,-0.03,0.22,0.12,0.13,0.36,0x765037);box(gun,0,0.04,-0.04,0.09,0.10,0.24,0x404542);rod(gun,[0,0.085,-0.09],[0,0.085,-0.75],0.025,mat(0x424b4a,0.27,0.78));rod(gun,[0,0.032,-0.10],[0,0.032,-0.66],0.024,mat(0x3c4440,0.31,0.7));box(gun,0,0.03,-0.39,0.10,0.105,0.24,0x99693c);for(let j=0;j<7;j++)box(gun,0,0.03,-0.48+j*0.026,0.106,0.111,0.010,0x735032);const trigger=mesh(new T.TorusGeometry(0.055,0.008,6,18),mat(0x343b37,0.3,0.7),gun,0,-0.069,0.01);trigger.rotation.y=Math.PI/2;box(gun,0,0.119,-0.72,0.007,0.025,0.02,0xdfc89b);box(gun,0,-0.01,0.4,0.14,0.16,0.028,0x363b34);
  return [bake(seed),bake(spade),bake(mallet),bake(gun)];
}
