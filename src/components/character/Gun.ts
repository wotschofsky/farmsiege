import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import shotgunLeftSprite from '../../assets/character/items/shotgun_left.png';
import shotgunRightSprite from '../../assets/character/items/shotgun_right.png';

import values from '../../values.json';

export type GunProps = {
  direction: Directions;
};

export default class Gun extends Component<GunProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (ctx: PropsContext<GunProps>): Coordinates => {
        let xOffset = -64;
        if (ctx.props.direction === Directions.Right) {
          xOffset = 36;
        }
        return new Coordinates(xOffset * values.character.size, 0);
      },
      props: (ctx: PropsContext<GunProps>): SpriteProps => ({
        source: ctx.props.direction === Directions.Left ? shotgunLeftSprite : shotgunRightSprite,
        width: 4 * 39 * values.character.size,
        height: 4 * 10 * values.character.size
      })
    }
  ];
}
