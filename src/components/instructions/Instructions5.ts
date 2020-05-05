import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Text, { TextProps } from '../../../lib/components/native/Text';

import Lightning from '../Lightning';
import Molehill, { MolehillProps } from '../tileContents/MoleHill';
import Rabbit, { RabbitProps } from '../animals/Rabbit';
import Tomato, { TomatoProps } from '../tileContents/Tomato';

export type Instructions5Props = {};

export default class Instructions5 extends Component<Instructions5Props> {
  private timer = 0;

  onTick(ctx: PropsContext<Instructions5>, timeDifference: number): void {
    this.timer += timeDifference;
  }

  private get showPlant(): boolean {
    const time = this.timer % 4200;
    return time < 1400;
  }

  private get showLightning(): boolean {
    const time = this.timer % 4200;
    return time > 1400 && time < 2800;
  }

  private get showMole(): boolean {
    const time = this.timer % 3000;
    return time >= 1750;
  }

  protected template: Template = [
    // Anweisung
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: `Watch out! You're not alone!`,
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },

    // Animation
    {
      component: new Tomato(),
      position: (): Coordinates => new Coordinates(180, 100),
      props: (): TomatoProps => ({
        age: 3
      }),
      show: (): boolean => this.showPlant
    },
    {
      component: new Lightning(),
      position: (): Coordinates => new Coordinates(180, -28),
      show: (): boolean => this.showLightning
    },

    {
      component: new Molehill(),
      position: (): Coordinates => new Coordinates(0, 50),
      props: (): MolehillProps => ({
        moleVisible: this.showMole
      })
    },
    {
      component: new Rabbit(),
      position: (): Coordinates => new Coordinates(300, -50),
      props: (): RabbitProps => ({
        direction: Directions.Left,
        moving: false
      })
    }
  ];
}
