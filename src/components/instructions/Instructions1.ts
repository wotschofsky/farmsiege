import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Coordinates from '../../../lib/helpers/Coordinates';
import Text, { TextProps } from '../../../lib/components/native/Text';
import Character, { CharacterProps } from '../character/Character';
import { Directions } from '../../../lib/Enums';
import PropsContext from '../../../lib/PropsContext';
import WASDButtons, { WASDButtonsProps } from '../inputButtons/KeyboardWASDButtons';
import ArrowButtons, { ArrowButtonsProps } from '../inputButtons/KeyboardArrowButtons';

export type Instructions1Props = {};

export default class Instructions1 extends Component<Instructions1Props> {
  private movingDirection = Directions.Right;
  private position = 0;
  private turnPointLeft = 0;
  private turnPointRight = 350;

  onTick(ctx: PropsContext<Instructions1>, timeDifference: number): void {
    if (this.movingDirection === Directions.Right) {
      this.position += 750 * (timeDifference / 1000);
    } else {
      this.position -= 750 * (timeDifference / 1000);
    }

    if (this.position > this.turnPointRight) {
      this.movingDirection = Directions.Left;
    }

    if (this.position < this.turnPointLeft) {
      this.movingDirection = Directions.Right;
    }
  }

  protected template: Template = [
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(this.position, 0),
      props: (): CharacterProps => ({
        direction: this.movingDirection
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Move using WASD, Arrow Keys or Left Stick',
        color: '#fff'
      })
    },
    {
      component: new ArrowButtons(),
      position: (): Coordinates => new Coordinates(300, -85),
      props: (): ArrowButtonsProps => {
        const activeKey = this.movingDirection === Directions.Left ? 'left' : 'right';

        return {
          pressed: [activeKey]
        };
      }
    },
    {
      component: new WASDButtons(),
      position: (): Coordinates => new Coordinates(420, -85),
      props: (): WASDButtonsProps => {
        const activeKey = this.movingDirection === Directions.Left ? 'a' : 'd';

        return {
          pressed: [activeKey]
        };
      }
    }
  ];
}
