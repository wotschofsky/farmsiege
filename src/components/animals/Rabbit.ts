import { Directions } from '../../../lib/Enums'
import { Template } from '../../../lib/Types'
import AnimatedSprite, { AnimatedSpriteProps } from '../../../lib/components/native/AnimatedSprite'
import Component from '../../../lib/Component'
import Coordinates from '../../../lib/helpers/Coordinates'
import PropsContext from '../../../lib/PropsContext'

import rabbitLeftSprite from '../../assets/animals/rabbit_left.png'
import rabbitRightSprite from '../../assets/animals/rabbit_right.png'


export type RabbitProps = {
   direction: Directions
}

export default class Rabbit extends Component<RabbitProps> {
   template: Template = [
      {
         component: new AnimatedSprite(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (ctx: PropsContext<RabbitProps>): AnimatedSpriteProps => {
            let source = rabbitLeftSprite
            if(ctx.props.direction === Directions.Right) {
               source = rabbitRightSprite
            }
            return {
               source,
               spriteWidth: 126,
               spriteHeight: 126,
               height: 256,
               width: 256,
               interval: 100
            }
         }
      }
   ]
}
