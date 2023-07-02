import cloneDeep from 'clone-deep';
import Coordinates from '../../lib/helpers/Coordinates';
import Store from '../../lib/store/Store';
import Timer from 'better-timer';

import GridUtils from '../utils/Grid';
import Random from '../utils/Random';

import TileContents from '../TileContents';
import values from '../values.json';

export type TileData = {
  type: TileContents;
  data: Record<string, string | number>;
};

export type RowData = [TileData, TileData, TileData, TileData, TileData, TileData, TileData, TileData];

export type GridData = [RowData, RowData, RowData, RowData, RowData, RowData, RowData, RowData];

export type GridStoreContent = GridData;

export default class GridStore extends Store<GridStoreContent> {
  private timers: Timer[];
  private _speedMultiplier: number;
  private _lastRemovedPlant: Coordinates;

  public constructor() {
    const initialGrid = GridUtils.generateInitialGrid();
    super(initialGrid);

    this.timers = [];
    this._speedMultiplier = 1;
  }

  public reset(): void {
    this.update(GridUtils.generateInitialGrid);
  }

  public set speedMultiplier(value: number) {
    if (value < 1) {
      return;
    }

    this._speedMultiplier = value;
  }

  public start(): void {
    this.growPlants();

    {
      const duration = Random.between(values.mole.grace.min, values.mole.grace.max);
      const timer = new Timer(duration, this.updateMole.bind(this));
      this.timers.push(timer);
    }

    {
      const duration = Random.between(values.weed.grace.min, values.weed.grace.max);
      const timer = new Timer(duration, this.updateWeed.bind(this));
      this.timers.push(timer);
    }

    {
      const duration = Random.between(values.lightning.grace.min, values.lightning.grace.max);
      const timer = new Timer(duration, this.updateLightning.bind(this));
      this.timers.push(timer);
    }
  }

  public stop(): void {
    // Cancel timers to prevent them from executing after the game is over
    for (const timer of this.timers) {
      timer.cancel();
    }
    this.timers = [];
  }

  public removeContent(x: number, y: number, callback?: (removedContent: TileContents) => void): void {
    if (!GridUtils.isValidField(x, y) || this.content[y][x].type === TileContents.Lightning) {
      return;
    }

    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        // Copy tile content type
        const tileContent = clonedState[y][x].type;

        // Clear tile content
        clonedState[y][x].type = TileContents.Empty;

        // If it was a plant, save coordinates for game over animation
        if (tileContent === TileContents.Plant) {
          this._lastRemovedPlant = new Coordinates(x, y);
        }

        // Execute callback
        if (tileContent !== TileContents.Empty && callback) {
          callback(tileContent);
        }

        return clonedState;
      }
    );
  }

  public placePlant(x: number, y: number): void {
    if (!GridUtils.isValidField(x, y) || this.content[y][x].type !== TileContents.Empty) {
      return;
    }

    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        clonedState[y][x].type = TileContents.Plant;
        clonedState[y][x].data = {
          age: 0
        };

        return clonedState;
      }
    );
  }

  private growPlants(): void {
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        for (const row of clonedState) {
          for (const tile of row) {
            if (tile.type === TileContents.Plant) {
              (<number>tile.data.age) += 100;
            }
          }
        }

        return clonedState;
      }
    );

    // Start timer for next plant cycle
    const timer = new Timer(100, this.growPlants.bind(this));
    this.timers.push(timer);
  }

  private updateMole(): void {
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        // Check if there is already a mole in the game
        let moleActive = false;
        let molePosition = new Coordinates(0, 0);

        rowsLoop: for (let rowIndex = 0; rowIndex < clonedState.length; rowIndex++) {
          for (let columnIndex = 0; columnIndex < clonedState[rowIndex].length; columnIndex++) {
            // Save reference to tile
            const tile = clonedState[rowIndex][columnIndex];

            // Check if there is a mole on the tile
            if (tile.type === TileContents.Mole) {
              moleActive = true;
              molePosition = new Coordinates(columnIndex, rowIndex);

              // Prevent further iterations
              break rowsLoop;
            }
          }
        }

        // New position
        const row = Random.roundedBetween(0, 7);
        const col = Random.roundedBetween(0, 7);

        if (moleActive) {
          // Move mole and leave molehill behind
          clonedState[row][col].type = TileContents.Mole;
          clonedState[molePosition.y][molePosition.x].type = TileContents.Molehill;
        } else {
          // Cancel if minimum value for new mole is not met
          if (Math.random() > values.mole.newChance) {
            return clonedState;
          }

          // Save coordinates of potential plant for game over animation
          if (clonedState[row][col].type === TileContents.Plant) {
            this._lastRemovedPlant = new Coordinates(col, row);
          }

          // Let mole appear
          clonedState[row][col].type = TileContents.Mole;
        }

        return clonedState;
      }
    );

    // Start timer for next mole cycle
    const timer = new Timer(
      Random.between(values.mole.spawning.min, values.mole.spawning.max) / this._speedMultiplier,
      this.updateMole.bind(this)
    );
    this.timers.push(timer);
  }

  private updateWeed(): void {
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState: GridStoreContent = cloneDeep(oldState);

        const foundWeed: Coordinates[] = [];
        clonedState.forEach((row, rowIndex) => {
          row.forEach((tile, columnIndex) => {
            // Check if there is weed on the tile
            if (tile.type === TileContents.Weed) {
              foundWeed.push(new Coordinates(columnIndex, rowIndex));
            }
          });
        });

        // Place new weed at a random position if condition is met
        if (Math.random() < values.weed.newChance) {
          // Try up to 10 times to find an empty spot and place weed
          for (let i = 0; i < 10; i++) {
            const row = Random.roundedBetween(0, 7);
            const col = Random.roundedBetween(0, 7);

            if (clonedState[row][col].type === TileContents.Empty) {
              clonedState[row][col].type = TileContents.Weed;
              break;
            }
          }
        }

        for (const coords of foundWeed) {
          // Weed spreading probability decreases with the number of weed
          if (Math.random() > 1 / Math.sqrt(foundWeed.length)) {
            break;
          }

          // Cancel if row doesn't exist
          const row = clonedState[coords.y + Random.roundedBetween(-1, 1)];
          if (!row) {
            break;
          }

          // Cancel if tile doesn't exist or is not empty
          const tile = row[coords.x + Random.roundedBetween(-1, 1)];
          if (!tile || tile.type !== TileContents.Empty) {
            break;
          }

          // Set tile as weed
          tile.type = TileContents.Weed;
        }

        return clonedState;
      }
    );

    // Start timer for next weed cycle
    const timer = new Timer(
      Random.between(values.weed.spawning.min, values.weed.spawning.max) / this._speedMultiplier,
      this.updateWeed.bind(this)
    );
    this.timers.push(timer);
  }

  private updateLightning(): void {
    const lightningRow = Random.roundedBetween(0, 7);
    const lightningCol = Random.roundedBetween(0, 7);

    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        let plantDestroyed = false;
        for (let rowIndex = -1; rowIndex <= 1; rowIndex++) {
          if (!GridUtils.rowExists(lightningRow + rowIndex)) {
            continue;
          }

          for (let colIndex = -1; colIndex <= 1; colIndex++) {
            if (!GridUtils.colExists(lightningCol + colIndex)) {
              continue;
            }

            // Save reference to tile
            const tile = clonedState[lightningRow + rowIndex][lightningCol + colIndex];

            if (tile.type === TileContents.Plant) {
              plantDestroyed = true;
            }

            // Clear tile
            tile.type = TileContents.Empty;
          }
        }

        // Save coordinates of lightning for game over animation
        if (plantDestroyed) {
          this._lastRemovedPlant = new Coordinates(lightningCol, lightningRow);
        }

        // Show lightning
        clonedState[lightningRow][lightningCol].type = TileContents.Lightning;

        return clonedState;
      }
    );

    {
      // Remove lightning after 1.4 seconds
      const timer = new Timer(1400, () => {
        this.update(
          (oldState: GridStoreContent): GridStoreContent => {
            const clonedState = cloneDeep(oldState);

            clonedState[lightningRow][lightningCol].type = TileContents.Empty;

            return clonedState;
          }
        );
      });
      this.timers.push(timer);
    }

    {
      const timer = new Timer(
        Random.between(values.lightning.spawning.min, values.lightning.spawning.max) / this._speedMultiplier,
        this.updateLightning.bind(this)
      );
      this.timers.push(timer);
    }
  }

  // Returns an array with all tiles
  private get allTiles(): TileData[] {
    const tiles: TileData[] = [];

    // Add the content of all rows to an array
    for (const row of this.content) {
      tiles.push(...row);
    }

    return cloneDeep(tiles);
  }

  // Returns the number of self-placed plants
  public get friendlyPlants(): number {
    let amount = 0;

    for (const tile of this.allTiles) {
      if (tile.type === TileContents.Plant) {
        amount++;
      }
    }

    return amount;
  }

  public get lastRemovedPlant(): Coordinates {
    return this._lastRemovedPlant;
  }
}
