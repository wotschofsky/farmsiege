import Component from '../../Component'
import RenderingContext from '../../RenderingContext'
import Coordinates from '../../helpers/Coordinates'
import { EventTypes } from '../../Enums'
import Dimensions from '../../helpers/Dimensions'


export type EventListenerProps = {
   size: Dimensions,
   onClick?: (position: Coordinates) => void
}

export default class EventListener extends Component<EventListenerProps> {
   private clickListener: (position: Coordinates) => void | null
   private componentPosition: Coordinates
   private componentSize: Dimensions
   private renderContext: RenderingContext

   public constructor() {
      super()

      this.clickListener = (): void => {}
   }

   public propagateEvent(type: EventTypes, position: Coordinates): void {
      if(
         position.x < this.componentPosition.x + this.componentSize.width + this.renderContext.parentX &&
         position.y < this.componentPosition.y + this.componentSize.height + this.renderContext.parentY &&
         position.x > this.componentPosition.x + this.renderContext.parentX &&
         position.y > this.componentPosition.y + this.renderContext.parentY
      ) {
         if(type === EventTypes.Click && this.clickListener) {
            this.clickListener(position)
         }
      }
   }

   public render(context: RenderingContext, position: Coordinates, props: EventListenerProps): void {
      this.clickListener = props.onClick || null
      this.componentPosition = position
      this.componentSize = props.size
      this.renderContext = context
   }
}
