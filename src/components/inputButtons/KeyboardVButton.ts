import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import BaseButton, { ButtonPropsTemplate, BaseButtonProps } from './BaseButton';
import keyboardVSprite from '../../assets/inputs/keyboard_v.png';
import keyboardVPressedSprite from '../../assets/inputs/keyboard_v_pressed.png';

export type VButtonProps = ButtonPropsTemplate;

export default class VButton extends Component<VButtonProps> {
  template: Template = [
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<VButtonProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed,
        sprite: keyboardVSprite,
        spritePressed: keyboardVPressedSprite
      })
    }
  ];
}
