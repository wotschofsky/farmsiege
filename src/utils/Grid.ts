import Coordinates from '../../lib/helpers/Coordinates';

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
    return this.rowExists(x) && this.colExists(y);
  }
}
