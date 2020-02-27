import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Coordinates from '../../../lib/helpers/Coordinates';
import AnimatedSprite, { AnimatedSpriteProps } from '../../../lib/components/native/AnimatedSprite';
import { Directions } from '../../../lib/Enums';

import bullMovingLeftSprite from '../../assets/animals/bull_moving_left.png';
import bullMovingRightSprite from '../../assets/animals/bull_moving_right.png';
import PropsContext from '../../../lib/PropsContext';

export type BullProps = {
  direction: Directions;
};

export default class Bull extends Component<BullProps> {
  protected template: Template = [
    {
      component: new AnimatedSprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<BullProps>): AnimatedSpriteProps => ({
        source: ctx.props.direction === Directions.Right ? bullMovingRightSprite : bullMovingLeftSprite,
        spriteWidth: 42,
        spriteHeight: 36,
        width: 42 * 6,
        height: 36 * 6,
        interval: 75
      })
    }
  ];
}
