import { Directions } from '../../../lib/Enums'
import { Template } from '../../../lib/Types'
import AnimatedSprite, { AnimatedSpriteProps } from '../../../lib/components/native/AnimatedSprite'
import Component from '../../../lib/Component'
import Coordinates from '../../../lib/helpers/Coordinates'
import PropsContext from '../../../lib/PropsContext'

import rabbitMovingLeftSprite from '../../assets/animals/rabbit_moving_left.png'
import rabbitMovingRightSprite from '../../assets/animals/rabbit_moving_right.png'
import rabbitStillLeftSprite from '../../assets/animals/rabbit_still_left.png'
import rabbitStillRightSprite from '../../assets/animals/rabbit_still_right.png'
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite'


export type RabbitProps = {
   direction: Directions,
   moving: boolean,
}

export default class Rabbit extends Component<RabbitProps> {
   protected template: Template = [
      {
         component: new AnimatedSprite(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (ctx: PropsContext<RabbitProps>): AnimatedSpriteProps => {
            let source = rabbitMovingLeftSprite
            if(ctx.props.direction === Directions.Right) {
               source = rabbitMovingRightSprite
            }
            return {
               source,
               spriteWidth: 126,
               spriteHeight: 108,
               width: 126 * 2,
               height: 108 * 2,
               interval: 100
            }
         },
         show: (ctx: PropsContext<RabbitProps>) => ctx.props.moving,
      },
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (ctx: PropsContext<RabbitProps>): SpriteProps => {
            let source = rabbitStillLeftSprite
            if(ctx.props.direction === Directions.Right) {
               source = rabbitStillRightSprite
            }
            return {
               source,
               width: 126 * 2,
               height: 108 * 2,
            }
         },
         show: (ctx: PropsContext<RabbitProps>) => !ctx.props.moving,
      },
   ]
}
