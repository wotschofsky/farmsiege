import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Coordinates from '../../../lib/helpers/Coordinates';
import Text, { TextProps } from '../../../lib/components/native/Text';
import Character, { CharacterProps } from '../character/Character';
import { Directions } from '../../../lib/Enums';
import PropsContext from '../../../lib/PropsContext';
import Tomato, { TomatoProps } from '../plants/Tomato';
import Lightning from '../Lightning';
import Molehill, { MolehillProps } from '../MoleHill';
import Rabbit, { RabbitProps } from '../animals/Rabbit';

export type Instructions5Props = {};

export default class Instructions5 extends Component<Instructions5Props> {
  private timer = 0;

  onTick(ctx: PropsContext<Instructions5>, timeDifference: number): void {
    this.timer += timeDifference;
  }

  private get showPlant(): boolean {
    return this.timer % 4200 < 1400;
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
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Watch out! There are dangers trying to destroy your plants.',
        color: '#fff'
      })
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
