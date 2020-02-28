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
// import spriteIdleLeft from '../../assets/finn_idle_left.png';
// import spriteIdleRight from '../../assets/finn_idle_right.png';
// import spriteRunningLeft from '../../assets/finn_running_left.png';
// import spriteRunningRight from '../../assets/finn_running_right.png';

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
    // {
    //    component: new AnimatedSprite(),
    //    position: (): Coordinates => new Coordinates(
    //       this.stores.character.content.posX - 64,
    //       this.stores.character.content.posY - 128,
    //    ),
    //    props: (): AnimatedSpriteProps => ({
    //       source: this.activeSprite,
    //       // source: blackManSprite,
    //       spriteWidth: 32,
    //       spriteHeight: 32,
    //       width: 256,
    //       height: 256,
    //       interval: 150
    //    }),
    // }
  ];
}
