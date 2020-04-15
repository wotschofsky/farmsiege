import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import blackManLeftSprite from '../../assets/character/body/black_man_left.png';
import blackManRightSprite from '../../assets/character/body/black_man_right.png';
import values from '../../values.json';

export type CharacterBaseProps = {
  direction: Directions;
};

export default class CharacterBase extends Component<CharacterBaseProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<CharacterBaseProps>): SpriteProps => {
        return {
          source: ctx.props.direction === Directions.Left ? blackManLeftSprite : blackManRightSprite,
          width: 128 * values.character.size,
          height: 128 * values.character.size * 1.5
        };
      }
    }
  ];
}
