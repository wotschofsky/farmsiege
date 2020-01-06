// https://jsfiddle.net/rBGPk/

export default class FPS {
   private animationFrame: (callback: FrameRequestCallback) => number
   private timestamps: number[]
   private _current: number

   public constructor() {
      this.animationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame
      this.timestamps = []
      // this.animate(0)
      this._current = 60

      const animate = (now: number): void => {
         this.timestamps.unshift(now)
         if(this.timestamps.length > 10) {
            const t0 = this.timestamps.pop() as number
            const fps = Math.floor(1000 * 10 / (now - t0))
            this._current = fps
         }

         // this.animationFrame(animate)
         window.requestAnimationFrame(animate)
      }

      animate(0)
   }

   public get current(): number {
      return Math.round(this._current)
   }
}
