import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import PropsContext from '../../lib/PropsContext'
import Rabbit, { RabbitProps } from '../components/animals/Rabbit'
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating'
import MovablesStore, { RabbitData } from '../store/MovablesStore'
import CharacterStore from '../store/CharacterStore'
import GridStore from '../store/GridStore'
import GridUtils from '../utils/Grid'
import EffectsStore from '../store/EffectsStore'
import StatsStore from '../store/StatsStore'
import TileContents from '../TileContents'
import { Directions } from '../../lib/Enums'


export type RabbitsProps = {}

export default class Rabbits extends Component<RabbitsProps> {
   rabbits: RabbitData[] = []

   protected onTick(ctx: PropsContext<RabbitsProps>, timeDifference: number): void {
      const characterStore = this.stores.character as CharacterStore
      const effectsStore = this.stores.effects as EffectsStore
      const gridStore = this.stores.grid as GridStore
      const movablesStore = this.stores.movables as MovablesStore
      const statsStore = this.stores.score as StatsStore

      movablesStore.setRabbitTargets((row: number, direction: Directions, currentColumn: number): number => {
         // console.log(currentColumn)
         let offset = Math.max(0, Math.round(currentColumn))
         if(direction === Directions.Left) {
            offset = Math.max(0, 8 - offset)
         }

         // x-y-Raster in Array mit bestimmeter Reihe umwandeln
         let contentRow = gridStore.content.map((column) => {
            return column[row]
         })

         // Bei Bedarf Startpunkt ändern
         if(direction === Directions.Right) {
            contentRow = contentRow.slice(offset)
         } else {
            contentRow = contentRow.reverse().slice(offset)
         }


         let computedTarget = direction === Directions.Right ? 12 : -4

         for(const index in contentRow) {
            if(contentRow[index].type === TileContents.Plant) {
               if(direction === Directions.Right) {
                  computedTarget = parseInt(index) + offset
               } else {
                  computedTarget = 8 - parseInt(index) - offset
               }
               break
            }
         }

         return computedTarget
      })

      movablesStore.updateRabbits(timeDifference)

      movablesStore.detectHit(characterStore.content.bullets, (x: number, y: number) => {
         effectsStore.showSmoke(x + 96, y + 256)
         statsStore.addScore(10)
      })

      movablesStore.stillRabbits.forEach((rabbit) => {
         if(rabbit.direction === Directions.Right) {
            const coords = GridUtils.coordsToField(new Coordinates(
               rabbit.x - (288 - 128),
               rabbit.y + 108,
            ))
            gridStore.removePlant(coords.x, coords.y)
         } else {
            const coords = GridUtils.coordsToField(new Coordinates(
               rabbit.x - (288),
               rabbit.y + 108,
            ))
            gridStore.removePlant(coords.x, coords.y)
         }
      })
   }

   template: Template = [
      {
         component: new Repeating(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): RepeatingProps => {
            const movablesStore = this.stores.movables as MovablesStore

            return {
               list: movablesStore.content.rabbits,
               component: (): Rabbit => new Rabbit(),
               position: (data: RabbitData): Coordinates => {
                  return new Coordinates(data.x, data.y)
               },
               props: (data: RabbitData): RabbitProps => ({
                  direction: data.direction,
                  moving: data.x !== data.targetX
               })
            }
         }
      }
   ]
}
