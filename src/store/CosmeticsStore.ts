import Store from '../../lib/store/Store'

import copHatSprite from '../assets/character/hats/mexican_hat.png'
import crownSprite from '../assets/character/hats/crown.png'
import mexicanHatSprite from '../assets/character/hats/mexican_hat.png'
import topHatSprite from '../assets/character/hats/crown.png'


export enum Hats {
   Cop,
   Crown,
   Mexican,
   Top,
}

type HatData = { id: Hats, sprite: string }
export const hatsData: HatData[] = [
   {
      id: Hats.Cop,
      sprite: copHatSprite,
   },
   {
      id: Hats.Crown,
      sprite: crownSprite,
   },
   {
      id: Hats.Mexican,
      sprite: mexicanHatSprite,
   },
   {
      id: Hats.Top,
      sprite: topHatSprite,
   },
]

export type CosmeticsStoreContent = {
   hat: Hats,
}

export default class CosmeticsStore extends Store<CosmeticsStoreContent> {
   constructor() {
      super('cosmetics', {
         hat: Hats.Mexican
      })
   }

   public get activeHat(): HatData {
      const storeHat = this.content.hat
      return hatsData.find((hat): boolean => {
         return hat.id === storeHat
      }) as HatData
   }
}
