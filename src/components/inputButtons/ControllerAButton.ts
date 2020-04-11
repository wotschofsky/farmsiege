import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import BaseButton, { ButtonPropsTemplate, BaseButtonProps } from './BaseButton';
import controllerASprite from '../../assets/inputs/controller_a.png';
import controllerAPressedSprite from '../../assets/inputs/controller_a_pressed.png';

export type ControllerAButtonProps = ButtonPropsTemplate;

export default class ControllerAButton extends Component<ControllerAButtonProps> {
  template: Template = [
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<ControllerAButtonProps>): BaseButtonProps => ({
        pressed: ctx.props.pressed,
        sprite: controllerASprite,
        spritePressed: controllerAPressedSprite
      })
    }
  ];
}
