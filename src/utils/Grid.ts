import Coordinates from '../../lib/helpers/Coordinates';

export default class GridUtils {
  public static coordsToField(position: Coordinates): Coordinates {
    return new Coordinates(Math.round(position.x / 128), Math.round(position.y / 128));
  }

  public static coordsToExactField(position: Coordinates): Coordinates {
    return new Coordinates(position.x / 128, position.y / 128);
  }
}
