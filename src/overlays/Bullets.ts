import Component from '../../lib/Component'
import { Template } from '../../lib/Types'
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating'
import Coordinates from '../../lib/helpers/Coordinates'
import Rectangle, { RectangleProps } from '../../lib/components/native/Rectangle'
import PropsContext from '../../lib/PropsContext'
import CharacterStore, { BulletData } from '../store/CharacterStore'


export type BulletsProps = {}

export default class Bullets extends Component<BulletsProps> {
   protected onTick(ctx: PropsContext<BulletsProps>, timeDifference: number) {
      const characterStore = this.stores.character as CharacterStore
      characterStore.updateBullets(timeDifference)
   }

   template: Template = [
      {
         component: new Repeating(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): RepeatingProps => {
            const characterStore = this.stores.character as CharacterStore
            return {
               list: characterStore.content.bullets,
               component: () => new Rectangle(),
               position: (data: BulletData): Coordinates => {
                  return new Coordinates(data.x, data.y)
               },
               props: (data: BulletData): RectangleProps => ({
                  color: '#000',
                  width: 12,
                  height: 12,
               })
            }
         }
      }
   ]
}
