import { Directions } from '../../lib/Enums';
import cloneDeep from 'clone-deep';
import Coordinates from '../../lib/helpers/Coordinates';
import Store from '../../lib/store/Store';
import Timer from 'better-timer';

import BulletData from './models/BulletData';
import RabbitData from './models/RabbitData';

import GridUtils from '../utils/Grid';
import Random from '../utils/Random';

import values from '../values.json';

type MovablesStoreContent = {
  rabbits: RabbitData[];
};

export default class MovablesStore extends Store<MovablesStoreContent> {
  private timers: Timer[];
  private _speedMultiplier: number;

  public constructor() {
    super({
      rabbits: []
    });

    this.timers = [];
    this._speedMultiplier = 1;
  }

  public set speedMultiplier(value: number) {
    this._speedMultiplier = value;
  }

  public start(): void {
    const timer = new Timer(
      Random.between(values.rabbits.grace.min, values.rabbits.grace.max),
      this.spawnRabbits.bind(this)
    );
    this.timers.push(timer);
  }

  public stop(): void {
    // Delete timers to prevent this code from running after the game is over
    for (const timer of this.timers) {
      timer.cancel();
    }
    this.timers = [];
  }

  public updateRabbits(timeDifference: number): void {
    this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
      const clonedState = cloneDeep(oldState);

      // Remove rabbits that are no longer visible
      clonedState.rabbits = clonedState.rabbits.filter((data) => {
        let outsideScreen = false;

        // Choose different x values based on the direction of movement
        if (data.direction === Directions.Left && data.x <= -256) {
          outsideScreen = true;
        } else if (data.direction === Directions.Right && data.x >= 1600) {
          outsideScreen = true;
        }

        return !outsideScreen;
      });

      for (const rabbit of clonedState.rabbits) {
        // Check if the rabbit has reached its target
        if (!rabbit.targetReached) {
          // Move the rabbit in the direction of movement
          const speed = rabbit.direction === Directions.Left ? values.rabbits.speed : -values.rabbits.speed;
          const relativeX = timeDifference * speed;
          rabbit.move(relativeX);
        } else {
          // Update the rabbit's timer
          rabbit.reduceTimeLeft(timeDifference);
        }
      }

      return clonedState;
    });
  }

  public setRabbitTargets(callback: (row: number, direction: Directions, currentColumn: number) => number): void {
    this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
      const clonedState = cloneDeep(oldState);

      for (const rabbit of clonedState.rabbits) {
        // Calculate the field based on the coordinates of the rabbit
        const { x: currentColumn, y: rabbitRow } = GridUtils.coordsToExactField(
          new Coordinates(rabbit.x - 128, rabbit.y + 96)
        );

        // Call the callback function and store the return value
        const targetCol = callback(rabbitRow, rabbit.direction, currentColumn);

        // Convert the column to coordinates and store it in the rabbit
        rabbit.targetX = targetCol * 128 + 288 - 128;
      }

      return clonedState;
    });
  }

  private spawnRabbits(): void {
    this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
      const clonedState = cloneDeep(oldState);

      // Calculate the number of new rabbits
      const rabbitAmount = Random.roundedBetween(values.rabbits.amount.min, values.rabbits.amount.max);

      // Determine the rows in which rabbits will spawn
      const rabbitRows: number[] = [];
      for (let i = 0; i < rabbitAmount; i++) {
        let row: number;
        do {
          row = Random.roundedBetween(0, 7);
          // Prevent two rabbits from spawning in the same row
        } while (rabbitRows.includes(row));
        rabbitRows.push(row);
      }

      // Choose the direction randomly
      const direction = Random.randomBoolean() ? Directions.Left : Directions.Right;

      const mappedRabbits: RabbitData[] = rabbitRows.map((row): RabbitData => {
        // Generate a random offset value
        const offset = Random.between(0, 256);

        // Calculate the coordinates
        let x: number;
        switch (direction) {
          case Directions.Left:
            x = 1600 + offset;
            break;
          case Directions.Right:
            x = -128 - offset;
            break;
        }
        const y = row * 128 - 96;

        return new RabbitData(x, y, direction);
      });

      // Add new rabbits to the existing ones
      clonedState.rabbits = clonedState.rabbits.concat(mappedRabbits);

      return clonedState;
    });

    // Start the timer for the next rabbit cycle
    const timer = new Timer(
      Random.between(values.rabbits.spawning.min, values.rabbits.spawning.max) / this._speedMultiplier,
      this.spawnRabbits.bind(this)
    );
    this.timers.push(timer);
  }

  public detectHit(bullets: BulletData[], callback: (x: number, y: number) => void): void {
    this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
      const clonedState = cloneDeep(oldState);

      // Remove hit rabbits
      clonedState.rabbits = clonedState.rabbits.filter((rabbit) => {
        // Test if the rabbit was hit
        const rabbitHit = rabbit.detectHit(bullets);

        // Execute the callback on a hit
        if (rabbitHit) {
          callback(rabbit.x, rabbit.y);
        }

        return !rabbitHit;
      });

      return clonedState;
    });
  }

  public get stillRabbits(): RabbitData[] {
    return this.content.rabbits.filter((rabbit) => rabbit.targetReached);
  }
}
