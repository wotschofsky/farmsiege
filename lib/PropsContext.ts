export default class PropsContext<P> {
   private _props: P

   constructor(
      props: P,
   ) {
      this._props = props
   }

   public get props(): P {
      return this._props
   }
}
