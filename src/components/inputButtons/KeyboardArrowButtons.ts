import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import BaseButton, { BaseButtonProps } from './BaseButton';

import keyboardDownPressedSprite from '../../assets/inputs/keyboard_down_pressed.png';
import keyboardDownSprite from '../../assets/inputs/keyboard_down.png';
import keyboardLeftPressedSprite from '../../assets/inputs/keyboard_left_pressed.png';
import keyboardLeftSprite from '../../assets/inputs/keyboard_left.png';
import keyboardRightPressedSprite from '../../assets/inputs/keyboard_right_pressed.png';
import keyboardRightSprite from '../../assets/inputs/keyboard_right.png';
import keyboardUpPressedSprite from '../../assets/inputs/keyboard_up_pressed.png';
import keyboardUpSprite from '../../assets/inputs/keyboard_up.png';

export type ArrowButtonsProps = {
  pressed: ('up' | 'left' | 'down' | 'right')[];
};

export default class ArrowButtons extends Component<ArrowButtonsProps> {
  private readonly buttonSize = 64;

  template: Template = [
    // Arrow key up
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(this.buttonSize, 0),
      props: (ctx: PropsContext<ArrowButtonsProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed.includes('up'),
        sprite: keyboardUpSprite,
        spritePressed: keyboardUpPressedSprite
      })
    },

    // Arrow key left
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(0, this.buttonSize),
      props: (ctx: PropsContext<ArrowButtonsProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed.includes('left'),
        sprite: keyboardLeftSprite,
        spritePressed: keyboardLeftPressedSprite
      })
    },

    // Arrow key down
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(this.buttonSize, this.buttonSize),
      props: (ctx: PropsContext<ArrowButtonsProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed.includes('down'),
        sprite: keyboardDownSprite,
        spritePressed: keyboardDownPressedSprite
      })
    },

    // Arrow key right
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(2 * this.buttonSize, this.buttonSize),
      props: (ctx: PropsContext<ArrowButtonsProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed.includes('right'),
        sprite: keyboardRightSprite,
        spritePressed: keyboardRightPressedSprite
      })
    }
  ];
}
