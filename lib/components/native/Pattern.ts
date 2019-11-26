import Component from '../../Component'
import RenderingContext from '../../RenderingContext'
import Coordinates from '../../helpers/Coordinates'


export type PatternProps = {
   source: string,
   tileWidth: number,
   tileHeight: number,
   width: number,
   height: number,
   mode: 'repeat' | 'repeat-x' | 'repeat-y',
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

      context.renderContext.imageSmoothingEnabled = false

      for(let row = 0; row < Math.ceil(props.height / props.tileHeight); row++) {
         for(let col = 0; col < Math.ceil(props.width / props.tileWidth); col++) {
            const offsetX = props.tileWidth * col
            const offsetY = props.tileWidth * row

            context.renderContext.drawImage(
               this.imageElement as HTMLImageElement,
               (position.x + context.parentX + offsetX) * context.scaleFactor,
               (position.y + context.parentY + offsetY) * context.scaleFactor,
               props.tileWidth * context.scaleFactor,
               props.tileHeight * context.scaleFactor
            )
         }
      }
   }
}
