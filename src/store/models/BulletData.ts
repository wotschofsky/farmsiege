import values from '../../values.json'


export default class BulletData {
   private _x: number
   private _y: number
   private _direction: number
   private _age = 0

   public constructor(x: number, y: number, direction: number) {
      this._x = x
      this._y = y
      this._direction = direction
   }

   public update(timeDifference: number): void {
      this._x = this._x + Math.cos(this._direction) * timeDifference * 3,
      this._y = this._y + Math.sin(this._direction) * timeDifference * 3,
      this._age = this._age + timeDifference
   }

   public get x(): number {
      return this._x
   }

   public get y(): number {
      return this._y
   }

   public get direction(): number {
      return this._direction
   }

   public get age(): number {
      return this._age
   }

   public get endOfLifeReached(): boolean {
      return this._age < values.guns.pumpgun.maxAge
   }
}
