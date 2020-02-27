export default class PropsContext<P> {
  private _props: P;

  public constructor(props: P) {
    this._props = props;
  }

  public get props(): P {
    return this._props;
  }
}
