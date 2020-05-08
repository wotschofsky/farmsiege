import Coordinates from '../../../lib/helpers/Coordinates';
import eases from 'eases';

export default class EffectData {
  private readonly offsetMultiplier = 100;
  private readonly maxAge = 500;
  private _position: Coordinates;
  private _value: number;
  private age = 0;

  public constructor(position: Coordinates, value: number) {
    this._position = position;
    this._value = value;
  }

  public get position(): Coordinates {
    return this._position;
  }

  public get value(): number {
    return this._value;
  }

  public increaseTimer(amount: number): void {
    this.age += amount;
  }

  public get expired(): boolean {
    return this.age > this.maxAge;
  }

  // Berechnet Verschiebung in Y Richtung im Verlauf des Effektdauer
  public get verticalOffset(): number {
    return eases.quadOut(this.age / this.maxAge) * this.offsetMultiplier;
  }
}
