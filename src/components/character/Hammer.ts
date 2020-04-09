import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import hammerSprite from '../../assets/character/hammer.png';
import values from '../../values.json';

export type HammerProps = {};

export default class Hammer extends Component<HammerProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => ({
        source: hammerSprite,
        width: 128 * values.character.size,
        height: 128 * values.character.size
      })
    }
  ];
}
