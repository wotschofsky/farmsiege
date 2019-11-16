import Component from '../../Component'
import RenderingContext from '../../RenderingContext'
import Coordinates from '../../helpers/Coordinates'


export type TextProps = {
   text: string,
   color?: string,
   font?: string,
   size?: number,
}

export default class Text extends Component<TextProps> {
   render(context: RenderingContext, position: Coordinates, props: TextProps): void {
      context.renderContext.textAlign = 'left'
      context.renderContext.fillStyle = props.color || 'black'
      context.renderContext.font = `${(props.size || 16) * context.scaleFactor}px ${props.font || 'Arial'}`
      context.renderContext.fillText(
         props.text,
         (position.x + context.parentX) * context.scaleFactor,
         (position.y + context.parentY) * context.scaleFactor
      )
   }
}
