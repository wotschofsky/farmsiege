import cloneDeep from 'clone-deep';

// Stores are global storage that is initialized for a component and its sub-components, and is accessible from them

type ListenerCallback<S> = (state: S) => void;

export default abstract class Store<S> {
  private _content: S;
  private _initialState: S;
  private _listeners: (ListenerCallback<S> | null)[];

  public constructor(initialState: S) {
    this._content = cloneDeep(initialState);
    this._initialState = cloneDeep(initialState);
    this._listeners = [];
  }

  public get content(): S {
    // Clone the content to prevent manipulation of the store content
    return cloneDeep(this._content);
  }

  public reset(): void {
    // Reset store content to a copy of the initial state
    this._content = cloneDeep(this._initialState);
  }

  protected update(mutator: (oldState: S) => S): void {
    // Execute the mutator function and store the returned value
    this._content = mutator(this._content);

    this.callListeners();
  }

  public subscribe(callback: ListenerCallback<S>): number {
    // Store the reference to the listener function
    const id = this._listeners.length;
    this._listeners[id] = callback;
    return id;
  }

  public unsubscribe(id: number): void {
    // Delete the reference to the listener function
    this._listeners[id] = null;
  }

  private callListeners(): void {
    // Execute all registered listener functions
    this._listeners.forEach((listener) => {
      if (listener) {
        listener(this._content);
      }
    });
  }
}
