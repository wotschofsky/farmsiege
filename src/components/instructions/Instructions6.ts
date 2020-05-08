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
import Molehill, { MolehillProps } from '../tileContents/MoleHill';
import ScoreEffect, { ScoreEffectProps } from '../ScoreEffect';

import values from '../../values.json';

export type Instructions6Props = {};

export default class Instructions6 extends Component<Instructions6Props> {
  private timer = 0;

  onTick(ctx: PropsContext<Instructions6>, timeDifference: number): void {
    this.timer += timeDifference;
  }

  private get showMole(): boolean {
    const time = this.timer % 3000;
    return time >= 0 && time < 1925;
  }

  private get buttonPressed(): boolean {
    const time = this.timer % 3000;
    return time >= 1900 && time < 2150;
  }

  private get hammerPosition(): number {
    const time = this.timer % 3000;
    if (time < 1900 || time > 2000) {
      return 0;
    }
    return (2000 - 1900) / 100;
  }

  private get showScore(): boolean {
    const time = this.timer % 3000;
    return time > 2000;
  }

  protected template: Template = [
    // Anweisung
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Smash the moles!',
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },

    // Animation
    {
      component: new Molehill(),
      position: (): Coordinates => new Coordinates(180, 100),
      props: (): MolehillProps => ({
        moleVisible: true
      }),
      show: (): boolean => this.showMole
    },
    {
      component: new ScoreEffect(),
      position: (): Coordinates => new Coordinates(280, 120),
      props: (): ScoreEffectProps => ({
        value: values.scores.mole
      }),
      show: (): boolean => this.showScore
    },
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(50, 0),
      props: (): CharacterProps => ({
        direction: Directions.Right,
        heldItem: HoldableItems.Hammer,
        hammerPosition: this.hammerPosition
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
