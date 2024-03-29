import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

export type ButtonPropsTemplate = {
  pressed: boolean;
};

export type BaseButtonProps = {
  sprite: string;
  spritePressed: string;
  pressed: boolean;
  widthFactor?: number;
};

export default class BaseButton extends Component<BaseButtonProps> {
  private readonly buttonSize = 64;

  template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<BaseButtonProps>): SpriteProps => ({
        width: this.buttonSize * (ctx.props.widthFactor || 1),
        height: this.buttonSize,
        source: ctx.props.pressed ? ctx.props.spritePressed : ctx.props.sprite
      })
    }
  ];
}
