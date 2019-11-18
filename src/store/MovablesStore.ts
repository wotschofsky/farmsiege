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
      const rabbitRows: number[] = []
      for(let i = 0; i < rabbitAmount; i++) {
         let row = Math.round(Math.random() * 8)
         while(rabbitRows.includes(row)) {
            row = Math.round(Math.random() * 8)
         }
         rabbitRows.push(row)
      }

      super('movables', {
         rabbits: rabbitRows.map((row) => ({
            x: 1600,
            y: row * 128 - 64,
            direction: Math.PI * 1.5,
            movingTimeLeft: Math.random() * 2000 + 2250,
         })),
      })
   }

   public updateRabbits(timeDifference: number): void {
      this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.rabbits = clonedState.rabbits.map((data): RabbitData => {
            let x = data.movingTimeLeft > 0 ? data.x - timeDifference * 0.2 : data.x
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
