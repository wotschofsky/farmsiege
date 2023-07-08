import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Text, { TextProps } from '../../../lib/components/native/Text';

import { HoldableItems } from '../../store/CharacterStore';
import Character, { CharacterProps } from '../character/Character';
import ControllerBButton, { ControllerBButtonProps } from '../inputButtons/ControllerBButton';
import KeyboardSpaceButton, { KeyboardSpaceButtonProps } from '../inputButtons/KeyboardSpaceButton';
import ScoreEffect, { ScoreEffectProps } from '../ScoreEffect';
import Weed from '../tileContents/Weed';

import values from '../../values.json';

export type Instructions8Props = {};

export default class Instructions8 extends Component<Instructions8Props> {
  private timer = 0;

  protected onTick(_ctx: PropsContext<Instructions8>, timeDifference: number): void {
    this.timer += timeDifference;
  }

  private get showWeed1(): boolean {
    const time = this.timer % 3000;
    return time >= 500;
  }

  private get showWeed2(): boolean {
    const time = this.timer % 3000;
    return time >= 1000;
  }

  private get showWeed3(): boolean {
    const time = this.timer % 3000;
    return time >= 1500 && time < 2000;
  }

  private get buttonPressed(): boolean {
    const time = this.timer % 3000;
    return time >= 2000 && time < 2250;
  }

  private get showScore(): boolean {
    const time = this.timer % 3000;
    return time >= 2000;
  }

  protected template: Template = [
    // Instructions
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Get rid of the weed!',
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },

    // Animation
    {
      component: new Weed(),
      position: (): Coordinates => new Coordinates(220, 100),
      show: (): boolean => this.showWeed1
    },
    {
      component: new Weed(),
      position: (): Coordinates => new Coordinates(220, -28),
      show: (): boolean => this.showWeed2
    },
    {
      component: new Weed(),
      position: (): Coordinates => new Coordinates(92, 100),
      show: (): boolean => this.showWeed3
    },
    {
      component: new ScoreEffect(),
      position: (): Coordinates => new Coordinates(192, 100),
      props: (): ScoreEffectProps => ({
        value: values.scores.weed
      }),
      show: (): boolean => this.showScore
    },
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(16, 0),
      props: (): CharacterProps => ({
        direction: Directions.Right,
        heldItem: HoldableItems.Shovel
      })
    },

    // Buttons
    {
      component: new KeyboardSpaceButton(),
      position: (): Coordinates => new Coordinates(373, 75),
      props: (): KeyboardSpaceButtonProps => ({
        pressed: this.buttonPressed
      })
    },
    {
      component: new ControllerBButton(),
      position: (): Coordinates => new Coordinates(425, 150),
      props: (): ControllerBButtonProps => ({
        pressed: this.buttonPressed
      })
    }
  ];
}
