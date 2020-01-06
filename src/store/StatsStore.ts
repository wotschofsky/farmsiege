import cloneDeep from 'clone-deep'
import Store from '../../lib/store/Store'

import values from '../values.json'


export type StatsStoreContent = {
   score: number,
   duration: number,
}

export default class StatsStore extends Store<StatsStoreContent> {
   public constructor() {
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
      return Math.min(values.gameSpeed.max, 1 + ((values.gameSpeed.base * this.content.duration) ** values.gameSpeed.exponent) / values.gameSpeed.divideBy)
   }
}
