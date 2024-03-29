import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import BaseButton, { BaseButtonProps } from './BaseButton';

import keyboardAPressedSprite from '../../assets/inputs/keyboard_a_pressed.png';
import keyboardASprite from '../../assets/inputs/keyboard_a.png';
import keyboardDPressedSprite from '../../assets/inputs/keyboard_d_pressed.png';
import keyboardDSprite from '../../assets/inputs/keyboard_d.png';
import keyboardSPressedSprite from '../../assets/inputs/keyboard_s_pressed.png';
import keyboardSSprite from '../../assets/inputs/keyboard_s.png';
import keyboardWPressedSprite from '../../assets/inputs/keyboard_w_pressed.png';
import keyboardWSprite from '../../assets/inputs/keyboard_w.png';

export type WASDButtonsProps = {
  pressed: ('w' | 'a' | 's' | 'd')[];
};

export default class WASDButtons extends Component<WASDButtonsProps> {
  private readonly buttonSize = 64;

  template: Template = [
    // W key
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(this.buttonSize, 0),
      props: (ctx: PropsContext<WASDButtonsProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed.includes('w'),
        sprite: keyboardWSprite,
        spritePressed: keyboardWPressedSprite
      })
    },

    // A key
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(0, this.buttonSize),
      props: (ctx: PropsContext<WASDButtonsProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed.includes('a'),
        sprite: keyboardASprite,
        spritePressed: keyboardAPressedSprite
      })
    },

    // S key
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(this.buttonSize, this.buttonSize),
      props: (ctx: PropsContext<WASDButtonsProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed.includes('s'),
        sprite: keyboardSSprite,
        spritePressed: keyboardSPressedSprite
      })
    },

    // D key
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(2 * this.buttonSize, this.buttonSize),
      props: (ctx: PropsContext<WASDButtonsProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed.includes('d'),
        sprite: keyboardDSprite,
        spritePressed: keyboardDPressedSprite
      })
    }
  ];
}
