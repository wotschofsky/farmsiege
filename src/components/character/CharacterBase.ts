import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import CosmeticsStore from '../../store/CosmeticsStore';

import characterBaseSprite1 from '../../assets/character/body/base_character_1.png';
import characterBaseSprite2 from '../../assets/character/body/base_character_2.png';
import characterBaseSprite3 from '../../assets/character/body/base_character_3.png';
import characterBaseSprite4 from '../../assets/character/body/base_character_4.png';
import characterBaseSprite5 from '../../assets/character/body/base_character_5.png';
import eyesLeftSprite from '../../assets/character/body/eyes_left.png';
import eyesRightSprite from '../../assets/character/body/eyes_right.png';

import values from '../../values.json';

export type CharacterBaseProps = {
  direction: Directions;
};

export default class CharacterBase extends Component<CharacterBaseProps> {
  private get baseSprite(): string {
    const cosmeticsStore = <CosmeticsStore>this.stores.cosmetics;
    switch (cosmeticsStore.content.skinColor) {
      case 1:
        return characterBaseSprite1;
      case 2:
        return characterBaseSprite2;
      case 3:
        return characterBaseSprite3;
      case 4:
        return characterBaseSprite4;
      case 5:
        return characterBaseSprite5;
    }
  }

  protected template: Template = [
    // Base Body
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => ({
        source: this.baseSprite,
        width: 128 * values.character.size,
        height: 128 * values.character.size * 1.5
      })
    },

    // Eyes
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<CharacterBaseProps>): SpriteProps => ({
        source: ctx.props.direction === Directions.Left ? eyesLeftSprite : eyesRightSprite,
        width: 128 * values.character.size,
        height: 128 * values.character.size * 1.5
      })
    }
  ];
}
