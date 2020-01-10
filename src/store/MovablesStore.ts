import { Directions } from '../../lib/Enums'
import cloneDeep from 'clone-deep'
import Coordinates from '../../lib/helpers/Coordinates'
import Store from '../../lib/store/Store'

import BulletData from './models/BulletData'
import GridUtils from '../utils/Grid'
import RabbitData from './models/RabbitData'
import values from '../values.json'


type MovablesStoreContent = {
   rabbits: RabbitData[],
}

export default class MovablesStore extends Store<MovablesStoreContent> {
   private _speedMultiplier: number

   public constructor() {
      super('movables', {
         rabbits: [],
      })

      this._speedMultiplier = 1

      this.spawnRabbits()
   }

   public set speedMultiplier(value: number) {
      this._speedMultiplier = value
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

         for(const rabbit of clonedState.rabbits) {
            const speed = rabbit.direction === Directions.Left ? values.rabbits.speed : -values.rabbits.speed
            const relativeX = timeDifference * speed

            const shouldMove = rabbit.distanceToTarget > 0

            rabbit.move(shouldMove ? relativeX : 0)

            if(rabbit.targetReached) {
               rabbit.reduceTimeLeft(timeDifference)
            }
         }

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

         const rabbitAmount = Math.round(Math.random() * (values.rabbits.amount.max - values.rabbits.amount.min)) + values.rabbits.amount.min
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
            const x = direction === Directions.Left ? 1600 + offset : -128 - offset
            const y = row * 128 - 96
            return new RabbitData(x, y, direction)
         })

         clonedState.rabbits = clonedState.rabbits.concat(mappedRabbits)

         return clonedState
      })

      setTimeout(() => {
         this.spawnRabbits()
      }, (Math.random() * (values.rabbits.spawning.max - values.rabbits.spawning.min) + values.rabbits.spawning.min) / this._speedMultiplier)
   }

   public detectHit(bullets: BulletData[], callback: (x: number, y: number) => void): void {
      this.update((oldState: MovablesStoreContent): MovablesStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.rabbits = clonedState.rabbits.filter((rabbit) => {
            const rabbitHit = rabbit.detectHit(bullets)

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

   public get directStillRabbits(): RabbitData[] {
      return this.directContent.rabbits.filter((rabbit) => {
         return rabbit.x === rabbit.targetX
      })
   }
}
