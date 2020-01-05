import { Directions } from '../../lib/Enums'
import cloneDeep from 'clone-deep'
import Coordinates from '../../lib/helpers/Coordinates'
import Store from '../../lib/store/Store'

import { BulletData } from './CharacterStore'
import GridUtils from '../utils/Grid'


export type RabbitData = {
   x: number,
   y: number,
   direction: Directions,
   targetX: number,
}

type MovablesStoreContent = {
   rabbits: RabbitData[],
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

            const distanceToTarget = (data.targetX - data.x) * (data.direction === Directions.Left ? -1 : 1)
            const shouldMove = distanceToTarget > 0
            const relativeX = timeDifference * speed

            let x = shouldMove ? data.x - relativeX : data.x
            if(distanceToTarget < 0) {
               x = data.targetX
            }


            return {
               ...data,
               x
            }
         })

         return clonedState
      })
   }

   public setRabbitTargets(callback: (row: number, direction: Directions, currentColumn: number) => number): void {
      this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.rabbits.map((rabbit): RabbitData => {
            // Spalte mit Hilfe der x-Koordinate berechnen
            const { x: currentColumn } = GridUtils.coordsToExactField(new Coordinates(
               // rabbit.x - (288 - 128),
               rabbit.x - 128,
               0,
            ))

            const rabbitRow = (rabbit.y + 96) / 128

            const value = callback(rabbitRow, rabbit.direction, currentColumn)
            rabbit.targetX = value * 128 + 288 - 128
            return rabbit
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
            let row: number
            do {
               row = Math.round(Math.random() * 7)
            } while(rabbitRows.includes(row))
            rabbitRows.push(row)
         }

         const direction = Math.random() > 0.5 ? Directions.Left : Directions.Right
         const mappedRabbits: RabbitData[] = rabbitRows.map((row): RabbitData => {
            const offset = Math.random() * 252
            return {
               x: direction === Directions.Left ? 1600 + offset : -128 - offset,
               y: row * 128 - 96,
               direction,
               targetX: 800
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
               }
            })

            if(rabbitHit) {
               callback(rabbit.x, rabbit.y)
            }

            return !rabbitHit
         })

         return clonedState
      })
   }

   public get stillRabbits(): RabbitData[] {
      return this.content.rabbits.filter((rabbit) => {
         return rabbit.x === rabbit.targetX
      })
   }
}
