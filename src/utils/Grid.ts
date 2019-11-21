import Coordinates from '../../lib/helpers/Coordinates'


export default class GridUtils {
   static coordsToField(position: Coordinates): Coordinates {
      return new Coordinates(
         Math.round(position.x / 128),
         Math.round(position.y / 128),
      )
   }
}
