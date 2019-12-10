import cloneDeep from 'clone-deep'
import Store from '../../lib/store/Store'

import SmokeData from './effects/SmokeData'
import Smoke from '../components/Smoke'
import Coordinates from '../../lib/helpers/Coordinates'
import EffectData from './effects/EffectData'


type EffectsStoreContent = {
   smoke: SmokeData[]
}

export default class EffectsStore extends Store<EffectsStoreContent> {
   constructor() {
      super('effects', {
         smoke: []
      })
   }

   public showSmoke(x: number, y: number): void {
      this.update((oldState) => {
         const clonedState = cloneDeep(oldState)

         const position = new Coordinates(x, y)
         const smoke = new SmokeData(position)
         clonedState.smoke.push(smoke)

         return clonedState
      })
   }

   public updateEffects(timeDifference: number): void {
      this.update((oldState) => {
         const clonedState = cloneDeep(oldState)

         clonedState.smoke.forEach((smoke) => {
            smoke.reduceRemainingTime(timeDifference)
         })

         clonedState.smoke = clonedState.smoke.filter((smoke) => {
            return smoke.expired
         })

         return oldState
      })
   }
}
