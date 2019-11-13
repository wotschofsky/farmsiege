import Component from '../../Component'
import RenderingContext from '../../RenderingContext'
import Coordinates from '../../helpers/Coordinates'


export type PatternProps = {
   source: string
   width: number
   height: number
   mode: 'repeat' | 'repeat-x' | 'repeat-y'
}

export default class Pattern extends Component<PatternProps> {
   private lastSource: string | null = null
   private imageElement: HTMLImageElement | null = null

   public render(context: RenderingContext, position: Coordinates, props: PatternProps): void {
      if(!props.source) return
      if(this.lastSource !== props.source) {
         this.imageElement = document.createElement('img')
         this.imageElement.src = props.source
         // this.imageElement.addEventListener('load', function(event) {
         //    // console.log(event.target.naturalWidth)
         //    console.log(this.naturalHeight)
         // })
      }

      this.lastSource = props.source

      // context.drawImage(this.imageElement, props.x, props.y, props.width, props.height, 10, 10, 50, 60);
      context.renderContext.imageSmoothingEnabled = false

      const pattern = context.renderContext.createPattern(this.imageElement as HTMLImageElement, props.mode) as CanvasPattern
      context.renderContext.rect(
         (position.x + context.parentX) * context.scaleFactor,
         (position.y + context.parentY) * context.scaleFactor,
         props.width * context.scaleFactor,
         props.height * context.scaleFactor
      )
      context.renderContext.fillStyle = pattern
      context.renderContext.fill()
   }
}
