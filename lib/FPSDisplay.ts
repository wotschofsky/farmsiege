// Klasse um eine FPS-Anzeige im rechten oberen Eck zu rendern

export default class FPSDisplay {
   private history: number[]
   private lastDisplay: number
   private lastUpdate: number

   constructor() {
      this.history = []
      this.lastDisplay = 0
      this.lastUpdate = Date.now()
   }

   public render(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, timeDifference: number): void {
      const fps = Math.round(1000 / timeDifference)
      this.history.push(fps)
      if(Date.now() - this.lastUpdate >= 1000) {
         this.lastDisplay = Math.round((this.history.reduce((a, b) => a + b, 0) / this.history.length))
         if(this.lastDisplay === Infinity) {
            this.lastDisplay = 0
         }
         this.history = []
         this.lastUpdate = Date.now()
      }

      context.font = '16px Arial'
      context.fillStyle = 'rgba(0, 0, 0, 0.5)'
      context.fillRect(
         canvas.width - 40,
         5,
         35,
         20
      )
      context.fillStyle = 'white'
      context.textAlign = 'right'
      context.fillText(
         this.lastDisplay.toString(),
         canvas.width - 8,
         20,
      )

      // Textorientierung zurücksetzen
      context.textAlign = 'left'
   }
}
