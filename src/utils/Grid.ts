import Coordinates from '../../lib/helpers/Coordinates';

import { GridData, RowData, TileData } from '../store/GridStore';
import Random from './Random';
import TileContents from '../TileContents';

import values from '../values.json';

export default class GridUtils {
  public static coordsToField(position: Coordinates): Coordinates {
    return new Coordinates(Math.round(position.x / 128), Math.round(position.y / 128));
  }

  public static coordsToExactField(position: Coordinates): Coordinates {
    return new Coordinates(position.x / 128, position.y / 128);
  }

  public static rowExists(y: number): boolean {
    if (y < 0) return false;
    if (y > 7) return false;
    return true;
  }

  public static colExists(x: number): boolean {
    if (x < 0) return false;
    if (x > 7) return false;
    return true;
  }

  public static isValidField(x: number, y: number): boolean {
    return this.rowExists(y) && this.colExists(x);
  }

  public static get initialTile(): TileData {
    const initialTile = {
      type: TileContents.Empty,
      data: {}
    };
    return initialTile;
  }

  public static generateInitialGrid(): GridData {
    const grid: RowData[] = [];
    for (let i = 0; i < 8; i++) {
      // Create row
      const row: TileData[] = [];
      for (let j = 0; j < 8; j++) {
        const tile = GridUtils.initialTile;
        row.push(tile);
      }
      grid.push(<RowData>row);
    }

    let plantsPlaced = 0;
    do {
      // Choose random coordinates
      const row = Random.roundedBetween(0, 7);
      const col = Random.roundedBetween(0, 7);

      // Avoid using the same field twice
      if (grid[row][col].type === TileContents.Plant) {
        continue;
      }

      // Fill the field
      grid[row][col].type = TileContents.Plant;
      grid[row][col].data = {
        age: Math.random() * values.plant.age.maxStart
      };

      // Increment the count
      plantsPlaced++;
    } while (plantsPlaced < values.plant.startAmount);

    return <GridData>grid;
  }
}
