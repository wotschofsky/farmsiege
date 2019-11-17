import { Template } from '../../../lib/Types'
import AnimatedSprite, { AnimatedSpriteProps } from '../../../lib/components/native/AnimatedSprite'
import Component from '../../../lib/Component'
import Coordinates from '../../../lib/helpers/Coordinates'

import rabbitLeftSprite from '../../assets/animals/rabbit_left.png'


export type RabbitProps = {}

export default class Rabbit extends Component<RabbitProps> {
   template: Template = [
      {
         component: new AnimatedSprite(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): AnimatedSpriteProps => ({
            source: rabbitLeftSprite,
            spriteWidth: 126,
            spriteHeight: 126,
            height: 256,
            width: 256,
            interval: 100
         })
      }
   ]
}
