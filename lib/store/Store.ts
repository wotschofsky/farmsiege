import cloneDeep from 'lodash/cloneDeep'


// Stores sind globale Speicher, welche für eine Komponente und deren Unterkomponenten initialisiert wird und von denen aus zugänglich ist

type ListenerCallback = (state: S) => void

export default abstract class Store<S> {
   private _content: S
   private _name: string
   private _initialState: S
   private _listeners: (ListenerCallback | null)[]

   constructor(name: string, initialState: S) {
      this._name = name
      this._content = cloneDeep(initialState)
      this._initialState = cloneDeep(initialState)
      this._listeners = []
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
      this.callListeners()
   }

   public subscribe(callback: ListenerCallback): number {
      const id = this._listeners.length
      this._listeners[id] = callback
      return id
   }

   public unsubscribe(id: number): void {
      this._listeners[id] = null
   }

   private callListeners(): void {
      this._listeners.forEach((listener) => {
         if(listener) {
            listener(this._content)
         }
      })
   }
}
