// Pointer lock is event-based in Firefox and promise-based in some other browsers.
// Invoke request() directly from a user gesture; never infer success from its return value.
export class MouseCapture {
  constructor(canvas,document,{onChange=()=>{},onError=()=>{}}={}){
    this.canvas=canvas;this.document=document;this.onChange=onChange;this.onError=onError;
    this.pending=false;this.generation=0;
    document.addEventListener('pointerlockchange',()=>{
      this.pending=false;this.generation++;this.onChange(this.locked);
    });
    document.addEventListener('pointerlockerror',()=>{if(this.pending)this.fail(this.generation);});
  }
  get locked(){return this.document.pointerLockElement===this.canvas;}
  request(){
    if(this.locked||this.pending)return;
    const generation=++this.generation;this.pending=true;
    try{
      this.canvas.focus({preventScroll:true});
      const result=this.canvas.requestPointerLock();
      // Older implementations return void and report rejection via pointerlockerror.
      if(result&&typeof result.catch==='function')result.catch(()=>this.fail(generation));
    }catch{this.fail(generation);}
  }
  fail(generation){
    if(generation!==this.generation||!this.pending)return;
    this.pending=false;this.generation++;this.onError();
  }
  release(){
    this.pending=false;this.generation++;
    if(this.locked)this.document.exitPointerLock();
  }
}
