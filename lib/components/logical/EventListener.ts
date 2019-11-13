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

   constructor() {
      super()

      this.clickListener = () => {}
   }

   public propagateEvent(type: EventTypes, position: Coordinates) {
      if(
         position.x < this.componentPosition.x + this.componentSize.width &&
         position.y < this.componentPosition.y + this.componentSize.height &&
         position.x > this.componentPosition.x &&
         position.y > this.componentPosition.y
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
   }
}
