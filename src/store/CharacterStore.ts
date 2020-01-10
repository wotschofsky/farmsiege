import cloneDeep from 'clone-deep'
import { Directions } from '../../lib/Enums'
import Coordinates from '../../lib/helpers/Coordinates'
import Store from '../../lib/store/Store'

import GridUtils from '../utils/Grid'
import values from '../values.json'


export type BulletData = {
   x: number,
   y: number,
   direction: number,
   age: number,
}

export type CharacterStoreContent = {
   posX: number,
   posY: number,
   direction: Directions,
   fieldX: number,
   fieldY: number,
   bullets: BulletData[],
}

// Store, der die exakte Position des Charakters enthält und daraus das aktive Feld errechnet
export default class CharacterStore extends Store<CharacterStoreContent> {
   public constructor() {
      super('character', {
         bullets: [],
         posX: 100,
         posY: 100,
         direction: Directions.Right,
         fieldX: 0,
         fieldY: 0,
      })
   }

   public move(x: number, y: number): void {
      this.update((oldState: CharacterStoreContent): CharacterStoreContent => {
         let newX = oldState.posX + x
         let newY = oldState.posY + y

         if(newX <= 0) {
            newX = 0
         }
         if(newX >= 1024 - 96) {
            newX = 1024 - 96
         }
         if(newY <= 0) {
            newY = 0
         }
         if(newY >= 1024 - 96) {
            newY = 1024 - 96
         }

         const gridPosition = GridUtils.coordsToField(new Coordinates(
            newX,
            newY
         ))

         return {
            ...oldState,
            posX: newX,
            posY: newY,
            direction: x < 0 ? Directions.Left : x > 0 ? Directions.Right : oldState.direction,
            fieldX: gridPosition.x,
            fieldY: gridPosition.y,
         }
      })
   }

   public fireGun(): void {
      this.update((oldState: CharacterStoreContent): CharacterStoreContent => {
         const clonedState = cloneDeep(oldState)

         for(let i = 0; i < values.guns.pumpgun.amount; i++) {
            let direction: number
            if(oldState.direction === Directions.Right) {
               direction = Math.PI * (-0.5 * values.guns.pumpgun.spread) + Math.random() * Math.PI * values.guns.pumpgun.spread
            } else {
               direction = Math.PI * (1 - 0.5 * values.guns.pumpgun.spread) + Math.random() * Math.PI * values.guns.pumpgun.spread
            }

            clonedState.bullets.push({
               x: oldState.posX + 288,
               y: oldState.posY + 176,
               direction,
               age: 0,
            })
         }

         return clonedState
      })
   }

   public updateBullets(timeDifference: number): void {
      this.update((oldState: CharacterStoreContent): CharacterStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.bullets = clonedState.bullets.filter((data: BulletData): boolean => data.age <= values.guns.pumpgun.maxAge)
         clonedState.bullets = clonedState.bullets.map((data: BulletData): BulletData => {
            return {
               ...data,
               x: data.x + Math.cos(data.direction) * timeDifference * 3,
               y: data.y + Math.sin(data.direction) * timeDifference * 3,
               age: data.age + timeDifference
            }
         })

         return clonedState
      })
   }
}
