import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import BaseButton, { ButtonPropsTemplate, BaseButtonProps } from './BaseButton';
import keyboardSpaceSprite from '../../assets/inputs/keyboard_space.png';
import keyboardSpacePressedSprite from '../../assets/inputs/keyboard_space_pressed.png';

export type KeyboardSpaceButtonProps = ButtonPropsTemplate;

export default class KeyboardSpaceButton extends Component<KeyboardSpaceButtonProps> {
  template: Template = [
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<KeyboardSpaceButtonProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed,
        sprite: keyboardSpaceSprite,
        spritePressed: keyboardSpacePressedSprite,
        widthFactor: 42 / 16
      })
    }
  ];
}
