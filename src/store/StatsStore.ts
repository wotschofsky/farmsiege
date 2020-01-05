import cloneDeep from 'clone-deep'
import Store from '../../lib/store/Store'


export type StatsStoreContent = {
   score: number,
   duration: number,
}

export default class StatsStore extends Store<StatsStoreContent> {
   constructor() {
      super('score', {
         score: 0,
         duration: 0
      })
   }

   public addScore(amount: number): void {
      this.update((oldState: StatsStoreContent): StatsStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.score += amount

         return clonedState
      })
   }

   public increaseDuration(amount: number): void {
      this.update((oldState: StatsStoreContent) => {
         const clonedState = cloneDeep(oldState)

         clonedState.duration += amount

         return clonedState
      })
   }

   public get gameSpeed(): number {
      return 10e-6 * this.content.duration + 1
   }
}
