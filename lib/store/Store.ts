import cloneDeep from 'lodash/cloneDeep'


// Stores sind globale Speicher, welche für eine Komponente und deren Unterkomponenten initialisiert wird und von denen aus zugänglich ist

export default abstract class Store<S> {
   private _content: S
   private _name: string
   private _initialState: S

   constructor(name: string, initialState: S) {
      this._name = name
      this._content = cloneDeep(initialState)
      this._initialState = cloneDeep(initialState)
   }

   public get name(): string {
      return this._name
   }

   public get content(): S {
      return this._content
   }

   public reset(): void {
      this._content = this._initialState
   }

   protected update(mutator: (oldState: S) => S): void {
      // this._content = {
      //    ...this._content,
      //    ...mutator(this._content)
      // }
      this._content = mutator(this._content)
   }
}
