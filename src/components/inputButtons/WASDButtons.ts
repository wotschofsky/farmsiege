import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import keyboardWSprite from '../../assets/inputs/keyboard_w.png';
import keyboardWPressedSprite from '../../assets/inputs/keyboard_w_pressed.png';
import keyboardASprite from '../../assets/inputs/keyboard_a.png';
import keyboardAPressedSprite from '../../assets/inputs/keyboard_a_pressed.png';
import keyboardSSprite from '../../assets/inputs/keyboard_s.png';
import keyboardSPressedSprite from '../../assets/inputs/keyboard_s_pressed.png';
import keyboardDSprite from '../../assets/inputs/keyboard_d.png';
import keyboardDPressedSprite from '../../assets/inputs/keyboard_d_pressed.png';

export type WASDButtonsProps = {
  pressed: ('w' | 'a' | 's' | 'd')[];
};

export default class WASDButtons extends Component<WASDButtonsProps> {
  private readonly buttonSize = 32;

  template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(this.buttonSize, 0),
      props: (ctx: PropsContext<WASDButtonsProps>): SpriteProps => ({
        width: this.buttonSize,
        height: this.buttonSize,
        source: ctx.props.pressed.includes('w') ? keyboardWPressedSprite : keyboardWSprite
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, this.buttonSize),
      props: (ctx: PropsContext<WASDButtonsProps>): SpriteProps => ({
        width: this.buttonSize,
        height: this.buttonSize,
        source: ctx.props.pressed.includes('a') ? keyboardAPressedSprite : keyboardASprite
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(this.buttonSize, this.buttonSize),
      props: (ctx: PropsContext<WASDButtonsProps>): SpriteProps => ({
        width: this.buttonSize,
        height: this.buttonSize,
        source: ctx.props.pressed.includes('s') ? keyboardSPressedSprite : keyboardSSprite
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(2 * this.buttonSize, this.buttonSize),
      props: (ctx: PropsContext<WASDButtonsProps>): SpriteProps => ({
        width: this.buttonSize,
        height: this.buttonSize,
        source: ctx.props.pressed.includes('d') ? keyboardDPressedSprite : keyboardDSprite
      })
    }
  ];
}
