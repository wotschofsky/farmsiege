import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import BaseButton, { ButtonPropsTemplate, BaseButtonProps } from './BaseButton';

import controllerBSprite from '../../assets/inputs/controller_b.png';
import controllerBPressedSprite from '../../assets/inputs/controller_b_pressed.png';

export type ControllerBButtonProps = ButtonPropsTemplate;

export default class ControllerBButton extends Component<ControllerBButtonProps> {
  template: Template = [
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<ControllerBButtonProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed,
        sprite: controllerBSprite,
        spritePressed: controllerBPressedSprite
      })
    }
  ];
}
