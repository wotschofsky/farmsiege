import RenderingContext from './RenderingContext'
import Dimensions from './helpers/Dimensions'
import Component from './Component'
import FPS from './utils/FPS'
import FPSDisplay from './FPSDisplay'
import Coordinates from './helpers/Coordinates'
import { EventTypes } from './Enums'


type CanvasConfig = {
   el: HTMLCanvasElement
   aspectRatio: number
   width: number
   grid: Dimensions
   root: Component<any>
   showFPS: boolean
}

class Canvas {
   private canvas: HTMLCanvasElement
   private context: CanvasRenderingContext2D
   private aspectRatio: number
   private width: number
   private height: number
   private root: Component<any>
   private scaleFactor: number
   private grid: Dimensions
   private showFPS?: boolean

   private fps: FPS
   private fpsDisplay: FPSDisplay

   private lastFrameOn: number
   private frameStart: number

   constructor(config: CanvasConfig) {
      this.scaleFactor = 1

      this.canvas = config.el
      this.aspectRatio = config.aspectRatio
      this.width = config.width
      this.height = this.width * (1 / this.aspectRatio)
      this.root = config.root
      this.grid = config.grid
      this.showFPS = config.showFPS || false

      this.fps = new FPS()
      this.fpsDisplay = new FPSDisplay()

      this.canvas.width = config.grid.width
      this.canvas.height = config.grid.height

      this.adjustToScreen()

      this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D

      this.lastFrameOn = Date.now()
      this.frameStart = Date.now()
      this.render()

      window.addEventListener('resize', () => {
         // Gerenderte Auflösung anpassen, wenn sich die Fenstergröße ändert
         this.adjustToScreen()
      })

      this.canvas.addEventListener('click', (event) => {
         const rect = this.canvas.getBoundingClientRect()
         this.root.propagateEvent(
            EventTypes.Click,
            new Coordinates(
               event.clientX / rect.width * this.grid.width,
               event.clientY / rect.height * this.grid.height,
            ),
         )
      })
   }

   private adjustToScreen(): void {
      this.canvas.width = this.width = window.innerWidth * window.devicePixelRatio
      this.canvas.height = this.height = window.innerWidth * (1 / this.aspectRatio) * window.devicePixelRatio
      this.scaleFactor = (window.innerWidth / this.grid.width) * window.devicePixelRatio
   }

   private render(): void {
      this.frameStart = Date.now()
      const timeDifference = this.frameStart - this.lastFrameOn
      this.lastFrameOn = this.frameStart

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.root.render(
         new RenderingContext(
            new Dimensions(
               this.width,
               this.height
            ),
            0,
            0,
            this.canvas,
            this.context,
            this.scaleFactor,
            timeDifference,
            this.frameStart,
         ),
         new Coordinates(0, 0),
         {},
      )

      if(this.showFPS) {
         this.fpsDisplay.render(this.canvas, this.context, timeDifference)
      }

      setTimeout(() => {
         this.render()
      }, (1000 / this.fps.current) - (Date.now() - this.frameStart))
   }
}


export default Canvas
