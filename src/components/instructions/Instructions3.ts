import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Character, { CharacterProps } from '../character/Character';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Text, { TextProps } from '../../../lib/components/native/Text';

import { HoldableItems } from '../../store/CharacterStore';

import ControllerBButton, { ControllerBButtonProps } from '../inputButtons/ControllerBButton';
import KeyboardSpaceButton, { KeyboardSpaceButtonProps } from '../inputButtons/KeyboardSpaceButton';
import ScoreEffect, { ScoreEffectProps } from '../ScoreEffect';
import Tomato, { TomatoProps } from '../tileContents/Tomato';

import values from '../../values.json';

export type Instructions3Props = {};

export default class Instructions3 extends Component<Instructions3Props> {
  private timer = 0;

  onTick(_ctx: PropsContext<Instructions3>, timeDifference: number): void {
    this.timer += timeDifference;
  }

  private get showPlant(): boolean {
    const time = this.timer % 2000;
    return time < 1000;
  }

  private get buttonPressed(): boolean {
    const time = this.timer % 2000;
    return time >= 1000 && time < 1250;
  }

  private get showScore(): boolean {
    return this.timer % 2000 >= 1000;
  }

  protected template: Template = [
    // Instructions
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Harvest crops!',
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
        age: 3
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
        value: values.scores.plant
      }),
      show: (): boolean => this.showScore
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
