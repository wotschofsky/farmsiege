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
import ScoreStore from '../store/ScoreStore'


export type RabbitsProps = {}

export default class Rabbits extends Component<RabbitsProps> {
   rabbits: RabbitData[] = []

   protected onTick(ctx: PropsContext<RabbitsProps>, timeDifference: number): void {
      const movablesStore = this.stores.movables as MovablesStore
      const characterStore = this.stores.character as CharacterStore
      const effectsStore = this.stores.effects as EffectsStore
      const scoreStore = this.stores.score as ScoreStore

      movablesStore.updateRabbits(timeDifference)

      movablesStore.detectHit(characterStore.content.bullets, (x: number, y: number) => {
         effectsStore.showSmoke(x + 96, y + 256)
         scoreStore.add(10)
      })

      const gridStore = this.stores.grid as GridStore

      movablesStore.stillRabbits.forEach((rabbit) => {
         const coords = GridUtils.coordsToField(new Coordinates(
            rabbit.x - 288,
            rabbit.y + 108,
         ))
         gridStore.removePlant(coords.x, coords.y)
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
                  moving: data.movingTimeLeft > 0
               })
            }
         }
      }
   ]
}
