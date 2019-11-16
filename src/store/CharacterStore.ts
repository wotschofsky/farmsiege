import Store from '../../lib/store/Store'
import { Directions } from '../../lib/Enums'


// Store, der die exakte Position des Charakters enthält und daraus das aktive Feld errechnet

export type CharacterStoreContent = {
   posX: number,
   posY: number,
   direction: Directions,
   fieldX: number,
   fieldY: number,
}

export default class CharacterStore extends Store<CharacterStoreContent> {
   constructor() {
      super('character', {
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

         return {
            posX: newX,
            posY: newY,
            direction: x < 0 ? Directions.Left : x > 0 ? Directions.Right : oldState.direction,
            fieldX: Math.round(newX / 128),
            fieldY: Math.round(newY / 128),
         }
      })
   }
}
