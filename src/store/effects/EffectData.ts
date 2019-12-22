import Coordinates from '../../../lib/helpers/Coordinates'


export default class EffectData {
   private _position: Coordinates
   private _timeRemaining = 500

   constructor(position: Coordinates) {
      this._position = position
   }

   public get position(): Coordinates {
      return this._position
   }

   public reduceRemainingTime(amount: number): void {
      this._timeRemaining -= amount
   }

   public get expired(): boolean {
      return this._timeRemaining <= 0
   }
}
