import test from 'node:test';
import assert from 'node:assert/strict';
import {MouseCapture} from '../src/mouse.js';
function fixture(request){
  const document=new EventTarget();document.pointerLockElement=null;
  const changes=[],errors=[];let calls=0,focuses=0;
  const canvas={focus(){focuses++;},requestPointerLock(){calls++;return request?.(document,canvas);}};
  document.exitPointerLock=()=>{document.pointerLockElement=null;document.dispatchEvent(new Event('pointerlockchange'));};
  const mouse=new MouseCapture(canvas,document,{onChange:locked=>changes.push(locked),onError:()=>errors.push('error')});
  return {mouse,document,canvas,changes,errors,get calls(){return calls;},get focuses(){return focuses;}};
}
test('Firefox void-returning API waits for the pointerlockchange event',()=>{
  const f=fixture();f.mouse.request();assert.equal(f.calls,1);assert.equal(f.focuses,1);assert.equal(f.mouse.locked,false);assert.equal(f.mouse.pending,true);
  f.document.pointerLockElement=f.canvas;f.document.dispatchEvent(new Event('pointerlockchange'));assert.equal(f.mouse.locked,true);assert.equal(f.mouse.pending,false);assert.deepEqual(f.changes,[true]);
});
test('legacy pointerlockerror allows a fresh user-gesture retry',()=>{
  const f=fixture();f.mouse.request();f.document.dispatchEvent(new Event('pointerlockerror'));assert.equal(f.errors.length,1);assert.equal(f.mouse.pending,false);f.mouse.request();assert.equal(f.calls,2);
});
test('rejected promise is handled and the next request can capture the mouse',async()=>{
  let first=true;const f=fixture((document,canvas)=>{if(first){first=false;return Promise.reject(new Error('Denied'));}document.pointerLockElement=canvas;document.dispatchEvent(new Event('pointerlockchange'));return Promise.resolve();});
  f.mouse.request();await Promise.resolve();assert.equal(f.errors.length,1);assert.equal(f.mouse.pending,false);
  f.mouse.request();assert.equal(f.mouse.locked,true);assert.equal(f.calls,2);assert.deepEqual(f.changes,[true]);
});
test('a synchronous failure does not strand input in pending mode',()=>{
  const f=fixture(()=>{throw new Error('Unsupported or sandboxed');});f.mouse.request();assert.equal(f.mouse.pending,false);assert.equal(f.errors.length,1);
});
test('release cancels stale asynchronous requests and ignores late failures',async()=>{
  let reject;const f=fixture(()=>new Promise((_,r)=>reject=r));f.mouse.request();f.mouse.release();reject(new Error('Late rejection'));await Promise.resolve();assert.equal(f.errors.length,0);assert.equal(f.mouse.pending,false);
});
test('releasing a captured mouse reports unlock and allows resume capture',()=>{
  const f=fixture((document,canvas)=>{document.pointerLockElement=canvas;document.dispatchEvent(new Event('pointerlockchange'));});f.mouse.request();assert.equal(f.mouse.locked,true);f.mouse.release();assert.equal(f.mouse.locked,false);f.mouse.request();assert.equal(f.mouse.locked,true);assert.deepEqual(f.changes,[true,false,true]);
});
test('repeated clicks do not duplicate pending requests',()=>{
  const f=fixture();f.mouse.request();f.mouse.request();assert.equal(f.calls,1);
});
