import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import BaseButton, { ButtonPropsTemplate, BaseButtonProps } from './BaseButton';
import keyboardVSprite from '../../assets/inputs/keyboard_v.png';
import keyboardVPressedSprite from '../../assets/inputs/keyboard_v_pressed.png';

export type KeyboardVButtonProps = ButtonPropsTemplate;

export default class KeyboardVButton extends Component<KeyboardVButtonProps> {
  template: Template = [
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<KeyboardVButtonProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed,
        sprite: keyboardVSprite,
        spritePressed: keyboardVPressedSprite
      })
    }
  ];
}
