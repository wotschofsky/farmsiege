import { Directions } from '../../lib/Enums';
import cloneDeep from 'clone-deep';
import Coordinates from '../../lib/helpers/Coordinates';
import Store from '../../lib/store/Store';

import GridUtils from '../utils/Grid';
import BulletData from './models/BulletData';
import values from '../values.json';

export enum HoldableItems {
  None,
  Gun,
  Hammer,
  Shovel
}

export type CharacterStoreContent = {
  posX: number;
  posY: number;
  direction: Directions;
  fieldX: number;
  fieldY: number;
  bullets: BulletData[];
  heldItem: HoldableItems;
  hammerTimer: number;
};

// Store, der die exakte Position des Charakters enthält und daraus das aktive Feld errechnet
export default class CharacterStore extends Store<CharacterStoreContent> {
  private readonly hammerAnimationDuration = 100;

  public constructor() {
    super('character', {
      bullets: [],
      posX: 512 - 32 * values.character.size,
      posY: 512,
      direction: Directions.Right,
      fieldX: 0,
      fieldY: 0,
      heldItem: HoldableItems.None,
      hammerTimer: 0
    });
  }

  public move(x: number, y: number): void {
    this.update(
      (oldState: CharacterStoreContent): CharacterStoreContent => {
        let newX = oldState.posX + x;
        let newY = oldState.posY + y;

        if (newX <= 0) {
          newX = 0;
        }
        if (newX >= 1024 - 96) {
          newX = 1024 - 96;
        }
        if (newY <= 0) {
          newY = 0;
        }
        if (newY >= 1024 - 96) {
          newY = 1024 - 96;
        }

        const gridPosition = GridUtils.coordsToField(new Coordinates(newX, newY));

        return {
          ...oldState,
          posX: newX,
          posY: newY,
          direction: x < 0 ? Directions.Left : x > 0 ? Directions.Right : oldState.direction,
          fieldX: gridPosition.x,
          fieldY: gridPosition.y
        };
      }
    );
  }

  public fireGun(): void {
    this.heldItem = HoldableItems.Gun;

    this.update(
      (oldState: CharacterStoreContent): CharacterStoreContent => {
        const clonedState = cloneDeep(oldState);

        for (let i = 0; i < values.guns.pumpgun.amount; i++) {
          let direction: number;
          let xOffset: number;
          if (clonedState.direction === Directions.Right) {
            direction =
              Math.PI * (-0.5 * values.guns.pumpgun.spread) + Math.random() * Math.PI * values.guns.pumpgun.spread;
            xOffset = 164;
          } else {
            direction =
              Math.PI * (1 - 0.5 * values.guns.pumpgun.spread) + Math.random() * Math.PI * values.guns.pumpgun.spread;
            xOffset = -156;
          }

          const bullet = new BulletData(oldState.posX + 320 + xOffset, oldState.posY + 196, direction);

          clonedState.bullets.push(bullet);
        }

        return clonedState;
      }
    );
  }

  public updateTimer(timeDifference: number): void {
    this.update(
      (oldState: CharacterStoreContent): CharacterStoreContent => {
        const clonedState = cloneDeep(oldState);

        clonedState.bullets = clonedState.bullets.filter((bullet: BulletData): boolean => bullet.endOfLifeReached);

        for (const bullet of clonedState.bullets) {
          bullet.update(timeDifference);
        }

        if (clonedState.hammerTimer > this.hammerAnimationDuration) {
          clonedState.hammerTimer = 0;
        }

        if (clonedState.hammerTimer > 0) {
          clonedState.hammerTimer += timeDifference;
        }

        return clonedState;
      }
    );
  }

  public set heldItem(value: HoldableItems) {
    this.update(
      (oldState: CharacterStoreContent): CharacterStoreContent => {
        const clonedState = cloneDeep(oldState);

        clonedState.heldItem = value;

        if (value === HoldableItems.Hammer) {
          clonedState.hammerTimer = 1;
        }

        return clonedState;
      }
    );
  }

  public get hammerPosition(): number {
    return this.directContent.hammerTimer / this.hammerAnimationDuration;
  }
}
