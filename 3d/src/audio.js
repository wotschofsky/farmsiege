export class FarmAudio {
  constructor(){this.ctx=null;this.muted=false;}
  start(){if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});}
  tone(freq=440,duration=0.12,type='sine',volume=0.035,delay=0){
    if(!this.ctx||this.muted)return;const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+duration);o.connect(g);g.connect(this.ctx.destination);o.start(t);o.stop(t+duration);
  }
  noise(duration=0.2,volume=0.15,freq=600){
    if(!this.ctx||this.muted)return;const n=this.ctx.sampleRate*duration,buffer=this.ctx.createBuffer(1,n,this.ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<n;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);const s=this.ctx.createBufferSource(),g=this.ctx.createGain(),f=this.ctx.createBiquadFilter();s.buffer=buffer;f.type='lowpass';f.frequency.value=freq;g.gain.value=volume;s.connect(f);f.connect(g);g.connect(this.ctx.destination);s.start();
  }
  play(name){
    if(name==='shot'){this.noise(0.4,0.7,1900);this.tone(65,0.22,'triangle',0.18);this.tone(140,0.06,'square',0.025,0.45);}
    else if(name==='harvest'){this.tone(659,0.15);this.tone(880,0.25,'sine',0.035,0.08);}
    else if(name==='plant'){this.noise(0.1,0.08,350);this.tone(350,0.12,'sine',0.025);}
    else if(name==='wave'){this.tone(330,0.25,'triangle');this.tone(247,0.4,'triangle',0.035,0.2);}
    else if(name==='thunder')this.noise(1.5,0.6,280);
    else if(name==='tend'){this.noise(0.12,0.1,600);this.tone(180,0.1,'triangle');}
    else if(name==='bird'){this.tone(2400,0.08,'sine',0.008);this.tone(2900,0.1,'sine',0.007,0.1);}
  }
}
