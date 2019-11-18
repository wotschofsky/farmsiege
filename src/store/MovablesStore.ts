import cloneDeep from 'lodash/cloneDeep'
import Store from '../../lib/store/Store'


export type RabbitData = {
   x: number,
   y: number,
   direction: number,
   movingTimeLeft: number,
}

type MovablesStoreContent = {
   rabbits: RabbitData[]
}

export default class MovablesStore extends Store<MovablesStoreContent> {
   constructor() {
      const rabbitAmount = Math.ceil(Math.random() * 5) + 2
      const rabbits: RabbitData[] = []
      for(let i = 0; i < rabbitAmount; i++) {
         rabbits.push({
            x: 0,
            y: Math.random() * 500,
            direction: Math.PI * 1.5,
            movingTimeLeft: 400
         })
      }

      super('movables', {
         rabbits
      })
   }

   public updateRabbits(timeDifference: number): void {
      this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.rabbits = clonedState.rabbits.map((data): RabbitData => {
            let x = data.movingTimeLeft > 0 ? data.x - 1 : data.x
            let movingTimeLeft = Math.max(data.movingTimeLeft - timeDifference, 0)

            return {
               ...data,
               x,
               movingTimeLeft
            }
         })

         return clonedState
      })
   }
}
