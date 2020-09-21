import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';

import logoFarmSprite from '../assets/ui/logo/logo_farm.png';
import logoSiegeSprite from '../assets/ui/logo/logo_siege.png';

export type LogoProps = {
  progress?: number;
};

export default class Logo extends Component<LogoProps> {
  private getPartsShown(progress: number): number {
    if (progress >= 1) {
      return 2;
    } else if (progress >= 1 / 2) {
      return 1;
    } else {
      return 0;
    }
  }

  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => ({
        source: logoFarmSprite,
        width: 600,
        height: 152.5
      }),
      show: (ctx: PropsContext<LogoProps> | undefined): boolean => {
        if (!ctx) return false;
        if (ctx.props.progress === undefined) return true;
        return this.getPartsShown(ctx.props.progress) >= 1;
      }
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 148),
      props: (): SpriteProps => ({
        source: logoSiegeSprite,
        width: 600,
        height: 152.5
      }),
      show: (ctx: PropsContext<LogoProps> | undefined): boolean => {
        if (!ctx) return false;
        if (ctx.props.progress === undefined) return true;
        return this.getPartsShown(ctx.props.progress) >= 2;
      }
    }
  ];
}
