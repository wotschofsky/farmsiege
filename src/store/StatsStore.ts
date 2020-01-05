import cloneDeep from 'clone-deep'
import Store from '../../lib/store/Store'


export type StatsStoreContent = {
   score: number,
}

export default class StatsStore extends Store<StatsStoreContent> {
   constructor() {
      super('score', {
         score: 0
      })
   }

   public add(amount: number): void {
      this.update((oldState: StatsStoreContent): StatsStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.score += amount

         return clonedState
      })
   }
}
