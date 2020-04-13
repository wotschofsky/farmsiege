import Component from '../../lib/Component';
import { Template } from '../../lib/Types';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Coordinates from '../../lib/helpers/Coordinates';

import logo from '../assets/logo.png';
import PropsContext from '../../lib/PropsContext';

export type LogoProps = {
  progress?: number;
};

export default class Logo extends Component<LogoProps> {
  private getPartsShown(progress: number): number {
    if (progress >= 1 / 2) {
      return 1;
    }
    return 0;
  }

  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => ({
        source: logo,
        width: 712,
        height: 296
      }),
      show: (ctx: PropsContext<LogoProps> | undefined): boolean => {
        if (!ctx) return false;
        if (ctx.props.progress === undefined) return true;
        return this.getPartsShown(ctx.props.progress) >= 1;
      }
    }
  ];
}
