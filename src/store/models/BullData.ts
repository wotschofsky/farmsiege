import { Directions } from '../../../lib/Enums'


export default class RabbitData {
   private _x: number
   private _y: number
   private _direction: Directions


   public constructor(x: number, y: number, direction: Directions) {
      this._x = x
      this._y = y
      this._direction = direction
   }


   public get x(): number {
      return this._x
   }

   public move(amount: number): void {
      this._x -= amount
   }

   public get y(): number {
      return this._y
   }

   public get direction(): Directions {
      return this._direction
   }
}
