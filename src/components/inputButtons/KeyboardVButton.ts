import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import keyboardVSprite from '../../assets/inputs/keyboard_v.png';
import keyboardVPressedSprite from '../../assets/inputs/keyboard_v_pressed.png';

export type VButtonProps = {
  pressed: boolean;
};

export default class VButton extends Component<VButtonProps> {
  private readonly buttonSize = 32;

  template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<VButtonProps>): SpriteProps => ({
        width: this.buttonSize,
        height: this.buttonSize,
        source: ctx.props.pressed ? keyboardVPressedSprite : keyboardVSprite
      })
    }
  ];
}
