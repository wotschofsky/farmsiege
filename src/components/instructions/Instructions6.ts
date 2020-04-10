import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Coordinates from '../../../lib/helpers/Coordinates';
import Text, { TextProps } from '../../../lib/components/native/Text';
import PropsContext from '../../../lib/PropsContext';
import Tomato, { TomatoProps } from '../plants/Tomato';
import Molehill, { MolehillProps } from '../MoleHill';
import Character, { CharacterProps } from '../character/Character';
import { Directions } from '../../../lib/Enums';
import { HoldableItems } from '../../store/CharacterStore';
import KeyboardSpaceButton, { KeyboardSpaceButtonProps } from '../inputButtons/KeyboardSpaceButton';
import ControllerBButton, { ControllerBButtonProps } from '../inputButtons/ControllerBButton';

export type Instructions6Props = {};

export default class Instructions6 extends Component<Instructions6Props> {
  private timer = 0;

  onTick(ctx: PropsContext<Instructions6>, timeDifference: number): void {
    this.timer += timeDifference;
  }

  private get showPlant(): boolean {
    const time = this.timer % 4000;
    return time < 1500;
  }

  private get showMole(): boolean {
    const time = this.timer % 4000;
    return time >= 1500 && time < 3000;
  }

  private get buttonPressed(): boolean {
    const currentTimer = this.timer % 4000;
    return currentTimer >= 2900 && currentTimer < 3150;
  }

  private get hammerPosition(): number {
    const time = this.timer % 4000;
    if (time < 2900 || time > 3000) {
      return 0;
    }
    return (3000 - 2900) / 100;
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
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Smash the moles!',
        color: '#fff'
      })
    },
    {
      component: new Molehill(),
      position: (): Coordinates => new Coordinates(180, 100),
      props: (): MolehillProps => ({
        moleVisible: true
      }),
      show: (): boolean => this.showMole
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
    {
      component: new KeyboardSpaceButton(),
      position: (): Coordinates => new Coordinates(400, 100),
      props: (): KeyboardSpaceButtonProps => ({
        pressed: this.buttonPressed
      })
    },
    {
      component: new ControllerBButton(),
      position: (): Coordinates => new Coordinates(400, 150),
      props: (): ControllerBButtonProps => ({
        pressed: this.buttonPressed
      })
    }
  ];
}
