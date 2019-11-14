import { Orientations } from '../Enums'


class Dimensions {
   private _width: number
   private _height: number

   constructor(width: number, height: number) {
      this._width = width
      this._height = height
   }

   public get width(): number {
      return this._width
   }

   public set width(v: number) {
      this._width = v
   }

   public get height(): number {
      return this._height
   }

   public set height(v: number) {
      this._height = v
   }

   public get orientation(): Orientations {
      return this._width >= this._height ? Orientations.Landscape : Orientations.Portrait
   }
}


export default Dimensions
