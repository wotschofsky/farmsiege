import cloneDeep from 'lodash/cloneDeep'
import Store from '../../lib/store/Store'
import Coordinates from '../../lib/helpers/Coordinates'

import TileContents from '../TileContents'


type TileData = {
   type: TileContents,
   data: Record<string, any>
}

type RowData = [TileData, TileData, TileData, TileData, TileData, TileData, TileData, TileData]

export type GridStoreContent = [
   RowData,
   RowData,
   RowData,
   RowData,
   RowData,
   RowData,
   RowData,
   RowData
]

const initialTile: TileData = {
   type: TileContents.Empty,
   data: {}
}

export default class GridStore extends Store<GridStoreContent> {
   timers: number[] = []

   constructor() {
      const initialGrid: GridStoreContent = []
      for(let i = 0; i < 8; i++) {
         const initialRow: RowData = [
            cloneDeep(initialTile),
            cloneDeep(initialTile),
            cloneDeep(initialTile),
            cloneDeep(initialTile),
            cloneDeep(initialTile),
            cloneDeep(initialTile),
            cloneDeep(initialTile),
            cloneDeep(initialTile)
         ]
         initialGrid.push(initialRow)
      }

      for(let i = 0; i < 3; i++) {
         const row = Math.floor(Math.random() * 8)
         const col = Math.floor(Math.random() * 8)

         initialGrid[row][col].type = TileContents.Plant
         initialGrid[row][col].data = {
            age: Math.random() * 4000
         }
      }

      super('grid', initialGrid)
   }

   public start(): void {
      this.updateMole()
      this.growPlants()
      this.updateWeed()
      this.updateLightning()
   }

   public stop(): void {
      this.timers.forEach((timer) => {
         clearTimeout(timer)
      })
   }

   public removeContent(x: number, y: number): void {
      this.update((oldState: GridStoreContent): GridStoreContent => {
         const clonedState = cloneDeep(oldState)

         if(clonedState[x][y].type === TileContents.Lightning) return clonedState

         clonedState[x][y].type = TileContents.Empty
         return clonedState
      })
   }

   public placePlant(x: number, y: number): void {
      this.update((oldState: GridStoreContent): GridStoreContent => {
         if(oldState[x][y].type !== TileContents.Empty) return oldState

         const clonedState = cloneDeep(oldState)
         clonedState[x][y].type = TileContents.Plant
         clonedState[x][y].data = {
            age: 0
         }
         return clonedState
      })
   }

   private growPlants(): void {
      this.update((oldState: GridStoreContent): GridStoreContent => {
         const clonedState = cloneDeep(oldState)

         clonedState.forEach((row) => {
            row.forEach((tile) => {
               if(tile.type === TileContents.Plant) {
                  tile.data.age += 100
               }
            })
         })

         return clonedState
      })

      const timeout = setTimeout(() => {
         this.growPlants()
      }, 100)
      this.timers.push(timeout)
   }

   private updateMole(): void {
      this.update((oldState: GridStoreContent): GridStoreContent => {
         const clonedState = cloneDeep(oldState)

         // Überprüfen, ob bereits ein Maulwurf im Spiel ist
         let moleActive = false
         let molePosition = new Coordinates(0, 0)
         clonedState.forEach((row, rowIndex) => {
            row.forEach((tile, columnIndex) => {
               if(tile.type === TileContents.Mole) {
                  moleActive = true
                  molePosition = new Coordinates(
                     columnIndex,
                     rowIndex,
                  )
               }
            })
         })

         if(!moleActive) {
            // Mit 5% Wahrscheinlichkeit Maulwurf an zufälliger Stelle erscheinen lassen

            if(Math.random() > 0.05) return oldState

            const row = Math.floor(Math.random() * 8)
            const col = Math.floor(Math.random() * 8)

            clonedState[row][col].type = TileContents.Mole
         } else {
            // Maulwurf verschieben und Hügel hinterlassen
            const row = Math.floor(Math.random() * 8)
            const col = Math.floor(Math.random() * 8)
            clonedState[row][col].type = TileContents.Mole
            clonedState[molePosition.y][molePosition.x].type = TileContents.Molehill
         }

         return clonedState
      })

      const timeout = setTimeout(() => {
         this.updateMole()
      }, Math.random() * 4000 + 1000)
      this.timers.push(timeout)
   }

   private updateWeed(): void {
      this.update((oldState: GridStoreContent): GridStoreContent => {
         const clonedState = cloneDeep(oldState)

         const foundWeed: Coordinates[] = []
         clonedState.forEach((row, rowIndex) => {
            row.forEach((tile, columnIndex) => {
               if(tile.type === TileContents.Weed) {
                  foundWeed.push(
                     new Coordinates(
                        columnIndex,
                        rowIndex,
                     )
                  )
               }
            })
         })

         if(Math.random() < 0.3) {
            const row = Math.floor(Math.random() * 8)
            const col = Math.floor(Math.random() * 8)
            clonedState[row][col].type = TileContents.Weed
         }

         foundWeed.forEach((coords) => {
            if(Math.random() > 1 / Math.sqrt(foundWeed.length)) return

            const row = clonedState[coords.y + Math.round(Math.random() * 2) - 1]
            if(!row) return
            const tile = row[coords.x + Math.round(Math.random() * 2) - 1]
            if(!tile || tile.type !== TileContents.Empty) return
            tile.type = TileContents.Weed
         })

         return clonedState
      })

      const timeout = setTimeout(() => {
         this.updateWeed()
      }, Math.random() * 4000 + 1000)
      this.timers.push(timeout)
   }

   private updateLightning(): void {
      const randomRow = Math.floor(Math.random() * 8)
      const randomCol = Math.floor(Math.random() * 8)

      this.update((oldState: GridStoreContent): GridStoreContent => {
         const clonedState = cloneDeep(oldState)

         for(let rowIndex = -1; rowIndex <= 1; rowIndex++) {
            if(randomRow + rowIndex >= 0 && randomRow + rowIndex <= 7) {
               for(let colIndex = -1; colIndex <= 1; colIndex++) {
                  if(randomCol + colIndex >= 0 && randomCol + colIndex <= 7) {
                     clonedState[randomRow + rowIndex][randomCol + colIndex].type = TileContents.Empty
                  }
               }
            }
         }
         clonedState[randomRow][randomCol].type = TileContents.Lightning

         return clonedState
      })

      const clearTimeout = setTimeout(() => {
         this.update((oldState: GridStoreContent): GridStoreContent => {
            const clonedState = cloneDeep(oldState)
            clonedState[randomRow][randomCol].type = TileContents.Empty
            return clonedState
         })
      }, 1400)
      this.timers.push(clearTimeout)

      const repeatTimeout = setTimeout(() => {
         this.updateLightning()
      }, Math.random() * 4000 + 1000)
      this.timers.push(repeatTimeout)
   }

   // Gibt ein Array mit allen Feldern zurück
   private get allTiles(): TileData[] {
      let result: TileData[] = []
      this.content.forEach((row) => {
         result = result.concat(row)
      })
      return cloneDeep(result)
   }

   // Gibt die Anzahl der selbst platzierten Pflanzen an
   public get friendlyPlants(): number {
      let amount = 0
      this.allTiles.forEach((tile) => {
         if(tile.type === TileContents.Plant) {
            amount++
         }
      })
      return amount
   }
}
