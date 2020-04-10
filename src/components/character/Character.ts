import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Coordinates from '../../../lib/helpers/Coordinates';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';
import { Directions } from '../../../lib/Enums';
import PropsContext from '../../../lib/PropsContext';
import values from '../../values.json';

import Hat from './Hat';
import Shirt from './Shirt';
import Pants from './Pants';
import blackManLeftSprite from '../../assets/character/body/black_man_left.png';
import blackManRightSprite from '../../assets/character/body/black_man_right.png';

export type CharacterProps = {
  direction: Directions;
};

export default class Character extends Component<CharacterProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<CharacterProps>): SpriteProps => {
        return {
          source: ctx.props.direction === Directions.Left ? blackManLeftSprite : blackManRightSprite,
          width: 128 * values.character.size,
          height: 128 * values.character.size * 1.5
        };
      }
    },
    {
      component: new Pants(),
      position: (): Coordinates => new Coordinates(0, 72 * values.character.size)
    },
    {
      component: new Shirt(),
      position: (): Coordinates => new Coordinates(0, 56 * values.character.size)
    },
    {
      component: new Hat(),
      position: (): Coordinates => new Coordinates(0, -48 * values.character.size)
    }
  ];
}
