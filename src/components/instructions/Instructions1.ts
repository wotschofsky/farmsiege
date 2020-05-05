import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Character, { CharacterProps } from '../character/Character';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import { HoldableItems } from '../../store/CharacterStore';
import ArrowButtons, { ArrowButtonsProps } from '../inputButtons/KeyboardArrowButtons';
import ControllerStick, { ControllerStickProps } from '../inputButtons/ControllerStick';
import WASDButtons, { WASDButtonsProps } from '../inputButtons/KeyboardWASDButtons';

export type Instructions1Props = {};

export default class Instructions1 extends Component<Instructions1Props> {
  private movingDirection = Directions.Right;
  private positionX = 300;
  private positionY = 100;
  private readonly turningPointLeft = 250;
  private readonly turningPointRight = 400;
  private readonly turningPointTop = -120;
  private readonly turningPointBottom = 25;
  private readonly movementSpeed = 375;

  onTick(ctx: PropsContext<Instructions1>, timeDifference: number): void {
    switch (this.movingDirection) {
      case Directions.Right:
        this.positionX += this.movementSpeed * (timeDifference / 1000);
        break;
      case Directions.Left:
        this.positionX -= this.movementSpeed * (timeDifference / 1000);
        break;
      case Directions.Up:
        this.positionY -= this.movementSpeed * (timeDifference / 1000);
        break;
      case Directions.Down:
        this.positionY += this.movementSpeed * (timeDifference / 1000);
        break;
    }

    if (this.positionX > this.turningPointRight) {
      this.positionX = this.turningPointRight;
      this.movingDirection = Directions.Up;
    }

    if (this.positionX < this.turningPointLeft) {
      this.positionX = this.turningPointLeft;
      this.movingDirection = Directions.Down;
    }

    if (this.positionY < this.turningPointTop) {
      this.positionY = this.turningPointTop;
      this.movingDirection = Directions.Left;
    }

    if (this.positionY > this.turningPointBottom) {
      this.positionY = this.turningPointBottom;
      this.movingDirection = Directions.Right;
    }
  }

  protected template: Template = [
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(this.positionX, this.positionY),
      props: (): CharacterProps => ({
        direction: this.movingDirection,
        heldItem: HoldableItems.None
      })
    },
    {
      component: new ArrowButtons(),
      position: (): Coordinates => new Coordinates(0, -20),
      props: (): ArrowButtonsProps => {
        let activeKey: 'up' | 'left' | 'down' | 'right';
        switch (this.movingDirection) {
          case Directions.Up:
            activeKey = 'up';
            break;
          case Directions.Left:
            activeKey = 'left';
            break;
          case Directions.Down:
            activeKey = 'down';
            break;
          case Directions.Right:
            activeKey = 'right';
            break;
        }

        return {
          pressed: [activeKey]
        };
      }
    },
    {
      component: new WASDButtons(),
      position: (): Coordinates => new Coordinates(0, 124),
      props: (): WASDButtonsProps => {
        let activeKey: 'w' | 'a' | 's' | 'd';
        switch (this.movingDirection) {
          case Directions.Up:
            activeKey = 'w';
            break;
          case Directions.Left:
            activeKey = 'a';
            break;
          case Directions.Down:
            activeKey = 's';
            break;
          case Directions.Right:
            activeKey = 'd';
            break;
        }

        return {
          pressed: [activeKey]
        };
      }
    },
    {
      component: new ControllerStick(),
      position: (): Coordinates => new Coordinates(200, 124),
      props: (): ControllerStickProps => ({
        type: 'left',
        direction: this.movingDirection
      })
    }
  ];
}
