import { Directions } from '../../lib/Enums'
import cloneDeep from 'clone-deep'
import Store from '../../lib/store/Store'

import { BulletData } from './CharacterStore'


export type RabbitData = {
   x: number,
   y: number,
   direction: Directions,
   movingTimeLeft: number,
   timeBeforeMove: number,
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

         // Nicht mehr sichtbare Hasen entfernen
         clonedState.rabbits = clonedState.rabbits.filter((data) => {
            let outsideScreen = false
            if(data.direction === Directions.Left && data.x <= -256) {
               outsideScreen = true
            } else if(data.direction === Directions.Right && data.x >= 1600) {
               outsideScreen = true
            }
            return !outsideScreen
         })

         clonedState.rabbits = clonedState.rabbits.map((data): RabbitData => {
            const speed = data.direction === Directions.Left ? 0.2 : -0.2
            let x = data.movingTimeLeft > 0 ? data.x - timeDifference * speed : data.x

            let timeBeforeMove = data.timeBeforeMove
            if(data.movingTimeLeft === 0) {
               timeBeforeMove = Math.max(data.timeBeforeMove - timeDifference, 0)
            }

            let movingTimeLeft = Math.max(data.movingTimeLeft - timeDifference, 0)
            if(data.timeBeforeMove === 0) {
               movingTimeLeft = Math.random() * 1500 + 3000
               timeBeforeMove = Math.random() * 2000 + 1000
            }

            return {
               ...data,
               x,
               movingTimeLeft,
               timeBeforeMove
            }
         })

         return clonedState
      })
   }

   private spawnRabbits(): void {
      this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
         const clonedState = cloneDeep(oldState)

         const rabbitAmount = Math.ceil(Math.random() * 4) + 3
         const rabbitRows: number[] = []
         for(let i = 0; i < rabbitAmount; i++) {
            let row = Math.round(Math.random() * 8)
            while(rabbitRows.includes(row)) {
               row = Math.round(Math.random() * 8)
            }
            rabbitRows.push(row)
         }

         const direction = Math.random() > 0.5 ? Directions.Left : Directions.Right
         const mappedRabbits: RabbitData[] = rabbitRows.map((row): RabbitData => {
            const offset = Math.random() * 252
            return {
               x: direction === Directions.Left ? 1600 + offset : -126 - offset,
               y: row * 126 - 96,
               direction: direction,
               movingTimeLeft: Math.random() * 1500 + 3000,
               timeBeforeMove: Math.random() * 2000 + 1000
            }
         })

         clonedState.rabbits = clonedState.rabbits.concat(mappedRabbits)

         return clonedState
      })

      setTimeout(() => {
         this.spawnRabbits()
      }, Math.random() * 12000 + 8000)
   }

   public detectHit(bullets: BulletData[], callback: (x: number, y: number) => void): void {
      this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.rabbits = clonedState.rabbits.filter((rabbit) => {
            let rabbitHit = false
            bullets.forEach((bullet) => {
               if(Math.abs((rabbit.x + 128) - bullet.x) < 50 && Math.abs((rabbit.y + 256) - bullet.y) < 50) {
                  rabbitHit = true
                  callback(rabbit.x + 96, rabbit.y + 256)
               }
            })
            return !rabbitHit
         })

         return clonedState
      })
   }

   public get stillRabbits(): RabbitData[] {
      return this.content.rabbits.filter((rabbit) => {
         return rabbit.movingTimeLeft === 0
      })
   }
}
