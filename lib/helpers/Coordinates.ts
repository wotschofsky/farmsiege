export default class Coordinates {
  private _x: number;
  private _y: number;

  public constructor(x: number, y: number) {
    this._x = x || 0;
    this._y = y || 0;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }
}
