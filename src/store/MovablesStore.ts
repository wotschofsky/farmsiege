import cloneDeep from 'lodash/cloneDeep'
import Store from '../../lib/store/Store'
import { BulletData } from './CharacterStore'
import { Directions } from '../../lib/Enums'


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
      super('movables', {
         rabbits: [],
      })

      this.spawnRabbits()
   }

   public updateRabbits(timeDifference: number): void {
      this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.rabbits = clonedState.rabbits.map((data): RabbitData => {
            const speed = data.direction === Directions.Left ? 0.2 : -0.2
            let x = data.movingTimeLeft > 0 ? data.x - timeDifference * speed : data.x
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

   private spawnRabbits(): void {
      this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
         const clonedState = cloneDeep(oldState)

         const rabbitAmount = Math.ceil(Math.random() * 5) + 2
         const rabbitRows: number[] = []
         for(let i = 0; i < rabbitAmount; i++) {
            let row = Math.round(Math.random() * 8)
            while(rabbitRows.includes(row)) {
               row = Math.round(Math.random() * 8)
            }
            rabbitRows.push(row)
         }

         const direction = Math.random() > 0.5 ? Directions.Left : Directions.Right
         const mappedRabbits: RabbitData[] = rabbitRows.map((row) => ({
            x: direction === Directions.Left ? 1600 : -128,
            y: row * 128 - 64,
            direction: direction,
            movingTimeLeft: Math.random() * 2000 + 2250,
         }))

         clonedState.rabbits = mappedRabbits.concat(clonedState.rabbits, mappedRabbits)

         return clonedState
      })

      setTimeout(() => {
         this.spawnRabbits()
      }, Math.random() * 5000 + 5000)
   }

   public detectHit(bullets: BulletData[]): void {
      this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.rabbits = clonedState.rabbits.filter((rabbit) => {
            let rabbitHit = false
            bullets.forEach((bullet) => {
               if(Math.abs((rabbit.x + 128) - bullet.x) < 50 && Math.abs((rabbit.y + 128) - bullet.y) < 50) {
                  rabbitHit = true
               }
            })
            return !rabbitHit
         })

         return clonedState
      })
   }
}
