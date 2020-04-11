import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import BaseButton, { ButtonPropsTemplate, BaseButtonProps } from './BaseButton';
import keyboardCSprite from '../../assets/inputs/keyboard_c.png';
import keyboardCPressedSprite from '../../assets/inputs/keyboard_c_pressed.png';

export type KeyboardCButtonProps = ButtonPropsTemplate;

export default class KeyboardCButton extends Component<KeyboardCButtonProps> {
  template: Template = [
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<KeyboardCButtonProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed,
        sprite: keyboardCSprite,
        spritePressed: keyboardCPressedSprite
      })
    }
  ];
}
