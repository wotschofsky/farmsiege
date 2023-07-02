import { Directions } from '../../lib/Enums';
import cloneDeep from 'clone-deep';
import Coordinates from '../../lib/helpers/Coordinates';
import Store from '../../lib/store/Store';

import BulletData from './models/BulletData';
import GridUtils from '../utils/Grid';

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

// Store that contains the exact position of the character and calculates the active field from it
export default class CharacterStore extends Store<CharacterStoreContent> {
  private readonly hammerAnimationDuration = 100;

  public constructor() {
    super({
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
        // Calculate new position
        let newX = oldState.posX + x;
        let newY = oldState.posY + y;

        // Prevent the player from leaving the game field
        newX = Math.max(newX, 0);
        newX = Math.min(newX, 1024 - 96);
        newY = Math.max(newY, 0);
        newY = Math.min(newY, 1024 - 96);

        // Calculate position on the grid
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

          // Calculate angle randomly within a range
          if (clonedState.direction === Directions.Right) {
            direction =
              Math.PI * (-0.5 * values.guns.pumpgun.spread) + Math.random() * Math.PI * values.guns.pumpgun.spread;
            xOffset = 164;
          } else {
            direction =
              Math.PI * (1 - 0.5 * values.guns.pumpgun.spread) + Math.random() * Math.PI * values.guns.pumpgun.spread;
            xOffset = -156;
          }

          // Create BulletData object
          const bullet = new BulletData(oldState.posX + 320 + xOffset, oldState.posY + 196, direction);

          // Add object to the array
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

        // Remove projectiles that have reached the end of their lifespan
        clonedState.bullets = clonedState.bullets.filter((bullet: BulletData): boolean => !bullet.endOfLifeReached);

        // Update timer in all projectiles
        for (const bullet of clonedState.bullets) {
          bullet.update(timeDifference);
        }

        // Reset hammerTimer when animation is finished
        if (clonedState.hammerTimer > this.hammerAnimationDuration) {
          clonedState.hammerTimer = 0;
        }

        // Increase timer if animation is running
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

        // Start hammer animation if hammer is selected
        if (value === HoldableItems.Hammer) {
          clonedState.hammerTimer = 1;
        }

        return clonedState;
      }
    );
  }

  public get hammerPosition(): number {
    return this.content.hammerTimer / this.hammerAnimationDuration;
  }
}
