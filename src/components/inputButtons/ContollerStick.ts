import { Template, TransformationConfig } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import BaseButton, { BaseButtonProps } from './BaseButton';
import controllerStickLeftSprite from '../../assets/inputs/controller_stick_left.png';
import controllerStickRightSprite from '../../assets/inputs/controller_stick_right.png';
import { Directions } from '../../../lib/Enums';

export type ControllerStickProps = {
  type: 'left' | 'right';
  direction?: null | Directions;
};

export default class ControllerStick extends Component<ControllerStickProps> {
  template: Template = [
    {
      component: new BaseButton(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<ControllerStickProps>): BaseButtonProps => {
        let sprite: string;
        switch (ctx.props.type) {
          case 'left':
            sprite = controllerStickLeftSprite;
            break;
          case 'right':
            sprite = controllerStickRightSprite;
            break;
        }
        return {
          pressed: false,
          sprite: sprite,
          spritePressed: sprite
        };
      },
      transform: (ctx: PropsContext<ControllerStickProps>): TransformationConfig => {
        let angle = 0;
        switch (ctx.props.direction) {
          case Directions.Left:
            angle = -0.05 * Math.PI;
            break;
          case Directions.Right:
            angle = 0.05 * Math.PI;
            break;
        }

        return {
          rotate: {
            angle: angle,
            center: new Coordinates(32, 64)
          }
        };
      }
    }
  ];
}
