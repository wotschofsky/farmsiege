import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Text, { TextProps } from '../../../lib/components/native/Text';

import Tomato, { TomatoProps } from '../tileContents/Tomato';
import Lightning from '../Lightning';

export type Instructions9Props = {};

export default class Instructions9 extends Component<Instructions9Props> {
  private timer = 0;
  private readonly animationDuration = 4000;

  protected onTick(ctx: PropsContext<Instructions9>, timeDifference: number): void {
    this.timer += timeDifference;
  }

  private get showPlants(): boolean {
    const time = this.timer % this.animationDuration;
    return time < 2000;
  }

  private get showLightning(): boolean {
    const time = this.timer % this.animationDuration;
    return time > 2000 && time < 3400;
  }

  protected template: Template = [
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: `Lightnings? Can't do nothing!`,
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },
    {
      component: new Tomato(),
      position: (): Coordinates => new Coordinates(58, 100),
      props: (): TomatoProps => ({
        age: 3
      }),
      show: (): boolean => this.showPlants
    },
    {
      component: new Tomato(),
      position: (): Coordinates => new Coordinates(186, 100),
      props: (): TomatoProps => ({
        age: 3
      }),
      show: (): boolean => this.showPlants
    },
    {
      component: new Tomato(),
      position: (): Coordinates => new Coordinates(314, -28),
      props: (): TomatoProps => ({
        age: 3
      }),
      show: (): boolean => this.showPlants
    },
    {
      component: new Lightning(),
      position: (): Coordinates => new Coordinates(186, -28),
      show: (): boolean => this.showLightning
    }
  ];
}
