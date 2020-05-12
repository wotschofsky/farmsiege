import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Text, { TextProps } from '../../../lib/components/native/Text';

import { HoldableItems } from '../../store/CharacterStore';

import Character, { CharacterProps } from '../character/Character';
import ScoreEffect, { ScoreEffectProps } from '../ScoreEffect';
import Tomato, { TomatoProps } from '../tileContents/Tomato';

export type Instructions4Props = {};

export default class Instructions4 extends Component<Instructions4Props> {
  private timer = 0;

  onTick(ctx: PropsContext<Instructions4>, timeDifference: number): void {
    this.timer += timeDifference;
  }

  private get showPlant(): boolean {
    const time = this.timer % 2000;
    return time < 1000;
  }

  private get showScore(): boolean {
    const time = this.timer % 2000;
    return time >= 1000;
  }

  protected template: Template = [
    // Anweisung
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Only fully grown plants give you points!',
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },

    // Animation
    {
      component: new Tomato(),
      position: (): Coordinates => new Coordinates(200, 100),
      props: (): TomatoProps => ({
        age: 2
      }),
      show: (): boolean => this.showPlant
    },
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(100, 0),
      props: (): CharacterProps => ({
        direction: Directions.Right,
        heldItem: HoldableItems.Shovel
      })
    },
    {
      component: new ScoreEffect(),
      position: (): Coordinates => new Coordinates(300, 100),
      props: (): ScoreEffectProps => ({
        value: 0
      }),
      show: (): boolean => this.showScore
    }
  ];
}
