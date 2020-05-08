import { Directions } from '../../../lib/Enums';
import { Template, TransformationConfig } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import shovelSprite from '../../assets/character/items/shovel.png';

import values from '../../values.json';

export type ShovelProps = {
  direction: Directions;
};

export default class Shovel extends Component<ShovelProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => ({
        source: shovelSprite,
        width: 128 * values.character.size,
        height: 128 * values.character.size
      }),
      transform: (): TransformationConfig => ({
        rotate: {
          angle: Math.PI * 0.25,
          center: new Coordinates((13.5 / 16) * 128 * values.character.size, (13.5 / 16) * 128 * values.character.size)
        }
      })
    }
  ];
}
