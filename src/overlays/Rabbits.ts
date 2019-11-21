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


export type RabbitsProps = {}

export default class Rabbits extends Component<RabbitsProps> {
   rabbits: RabbitData[] = []

   protected onTick(ctx: PropsContext<RabbitsProps>, timeDifference: number): void {
      const movablesStore = this.stores.movables as MovablesStore
      movablesStore.updateRabbits(timeDifference)

      const characterStore = this.stores.character as CharacterStore
      movablesStore.detectHit(characterStore.content.bullets)

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
               component: () => new Rabbit(),
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
