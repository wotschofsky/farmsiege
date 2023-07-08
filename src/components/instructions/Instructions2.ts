import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Character, { CharacterProps } from '../character/Character';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Text, { TextProps } from '../../../lib/components/native/Text';

import { HoldableItems } from '../../store/CharacterStore';

import ControllerAButton, { ControllerAButtonProps } from '../inputButtons/ControllerAButton';
import KeyboardVButton, { KeyboardVButtonProps } from '../inputButtons/KeyboardVButton';
import Tomato, { TomatoProps } from '../tileContents/Tomato';

export type Instructions2Props = {};

export default class Instructions2 extends Component<Instructions2Props> {
  private timer = 0;

  onTick(_ctx: PropsContext<Instructions2>, timeDifference: number): void {
    this.timer += timeDifference;
  }

  private get showPlant(): boolean {
    const time = this.timer % 2000;
    return time > 1000;
  }

  private get buttonPressed(): boolean {
    const time = this.timer % 2000;
    return time > 1000 && time < 1250;
  }

  protected template: Template = [
    // Instructions
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Plant crops!',
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
        age: 0
      }),
      show: (): boolean => this.showPlant
    },
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(100, 0),
      props: (): CharacterProps => ({
        direction: Directions.Right,
        heldItem: HoldableItems.None
      })
    },

    // Buttons
    {
      component: new KeyboardVButton(),
      position: (): Coordinates => new Coordinates(425, 75),
      props: (): KeyboardVButtonProps => ({
        pressed: this.buttonPressed
      })
    },
    {
      component: new ControllerAButton(),
      position: (): Coordinates => new Coordinates(425, 150),
      props: (): ControllerAButtonProps => ({
        pressed: this.buttonPressed
      })
    }
  ];
}
