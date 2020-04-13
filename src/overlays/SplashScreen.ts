import { Template, TransformationConfig } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';
import Rectangle, { RectangleProps } from '../../lib/components/native/Rectangle';
import Text, { TextProps } from '../../lib/components/native/Text';

import Logo, { LogoProps } from '../components/Logo';

export type SplashScreenProps = {
  finishedCallback: () => void;
};

export default class SplashScreen extends Component<SplashScreenProps> {
  private readonly totalDuration = 3000;
  private timer = 0;
  private callbackExecuted = false;

  protected onTick(ctx: PropsContext<SplashScreenProps>, timeDifference: number): void {
    this.timer += timeDifference;
    if (this.timer >= this.totalDuration && !this.callbackExecuted) {
      ctx.props.finishedCallback();
      this.callbackExecuted = true;
    }
  }

  private get logoProgress(): number {
    return Math.min(1, this.timer / 500);
  }

  private get opacity(): number {
    if (this.timer < 2000) {
      return 1;
    }
    return Math.max(0, (3000 - this.timer) / 1000);
  }

  protected template: Template = [
    {
      component: new Rectangle(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RectangleProps => ({
        width: 1600,
        height: 1200,
        color: `rgba(255, 255, 255, ${this.opacity})`
      })
    },
    {
      component: new Logo(),
      position: (): Coordinates => new Coordinates(444, 150),
      props: (): LogoProps => ({
        progress: this.logoProgress
      }),
      transform: (): TransformationConfig => ({
        opacity: {
          value: this.opacity
        }
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(800, 800),
      props: (): TextProps => ({
        text: 'by Felix Wotschofsky',
        align: 'center',
        color: `rgba(0, 0, 0, ${this.opacity})`,
        font: 'Heartbit',
        size: 64
      })
    }
  ];
}
