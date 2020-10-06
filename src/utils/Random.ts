export default class Random {
  public static between(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  public static roundedBetween(min: number, max: number): number {
    return Math.round(this.between(min, max));
  }

  public static randomBoolean(): boolean {
    return Math.random() >= 0.5;
  }

  public static randomElement<T>(array: T[]): T {
    const maxIndex = array.length - 1;
    const index = this.roundedBetween(0, maxIndex);
    return array[index];
  }
}
