import cloneDeep from 'lodash/cloneDeep'
import Store from '../../lib/store/Store'


export type ScoreStoreContent = {
   score: number,
}

export default class ScoreStore extends Store<ScoreStoreContent> {
   constructor() {
      super('score', {
         score: 0
      })
   }

   public add(amount: number): void {
      this.update((oldState: ScoreStoreContent): ScoreStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.score += amount

         return clonedState
      })
   }
}
