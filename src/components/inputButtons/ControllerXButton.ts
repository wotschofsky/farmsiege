import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import BaseButton, { ButtonPropsTemplate, BaseButtonProps } from './BaseButton';

import controllerXSprite from '../../assets/inputs/controller_x.png';
import controllerXPressedSprite from '../../assets/inputs/controller_x_pressed.png';

export type ControllerXButtonProps = ButtonPropsTemplate;

export default class ControllerXButton extends Component<ControllerXButtonProps> {
  template: Template = [
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<ControllerXButtonProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed,
        sprite: controllerXSprite,
        spritePressed: controllerXPressedSprite
      })
    }
  ];
}
