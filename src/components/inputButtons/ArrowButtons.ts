import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import keyboardUpSprite from '../../assets/inputs/keyboard_up.png';
import keyboardUpPressedSprite from '../../assets/inputs/keyboard_up_pressed.png';
import keyboardLeftSprite from '../../assets/inputs/keyboard_left.png';
import keyboardLeftPressedSprite from '../../assets/inputs/keyboard_left_pressed.png';
import keyboardDownSprite from '../../assets/inputs/keyboard_down.png';
import keyboardDownPressedSprite from '../../assets/inputs/keyboard_down_pressed.png';
import keyboardRightSprite from '../../assets/inputs/keyboard_right.png';
import keyboardRightPressedSprite from '../../assets/inputs/keyboard_right_pressed.png';

export type ArrowButtonsProps = {
  pressed: ('up' | 'left' | 'down' | 'right')[];
};

export default class ArrowButtons extends Component<ArrowButtonsProps> {
  private readonly buttonSize = 32;

  template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(this.buttonSize, 0),
      props: (ctx: PropsContext<ArrowButtonsProps>): SpriteProps => ({
        width: this.buttonSize,
        height: this.buttonSize,
        source: ctx.props.pressed.includes('up') ? keyboardUpPressedSprite : keyboardUpSprite
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, this.buttonSize),
      props: (ctx: PropsContext<ArrowButtonsProps>): SpriteProps => ({
        width: this.buttonSize,
        height: this.buttonSize,
        source: ctx.props.pressed.includes('left') ? keyboardLeftPressedSprite : keyboardLeftSprite
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(this.buttonSize, this.buttonSize),
      props: (ctx: PropsContext<ArrowButtonsProps>): SpriteProps => ({
        width: this.buttonSize,
        height: this.buttonSize,
        source: ctx.props.pressed.includes('down') ? keyboardDownPressedSprite : keyboardDownSprite
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(2 * this.buttonSize, this.buttonSize),
      props: (ctx: PropsContext<ArrowButtonsProps>): SpriteProps => ({
        width: this.buttonSize,
        height: this.buttonSize,
        source: ctx.props.pressed.includes('right') ? keyboardRightPressedSprite : keyboardRightSprite
      })
    }
  ];
}
