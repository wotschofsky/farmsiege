import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import PropsContext from '../../lib/PropsContext'
import Rabbit, { RabbitProps } from '../components/animals/Rabbit'
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating'


type RabbitData = {
   x: number,
   y: number,
   direction: number,
   movingTimeLeft: number,
}

export type RabbitsProps = {}

export default class Rabbits extends Component<RabbitsProps> {
   rabbits: RabbitData[] = [
      {
         x: 0,
         y: 0,
         direction: Math.PI * 1.5,
         movingTimeLeft: 400
      }
   ]

   protected onTick(ctx: PropsContext<RabbitsProps>, timeDifference: number): void {
      this.rabbits = this.rabbits.map((data): RabbitData => {
         let x = data.movingTimeLeft > 0 ? data.x - 1 : data.x
         let movingTimeLeft = Math.max(data.movingTimeLeft - timeDifference, 0)

         return {
            ...data,
            x,
            movingTimeLeft
         }
      })
   }

   template: Template = [
      {
         component: new Repeating(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): RepeatingProps => ({
            list: this.rabbits,
            component: new Rabbit(),
            position: (data: RabbitData): Coordinates => {
               return new Coordinates(data.x, data.y)
            },
            props: (data: RabbitData): RabbitProps => ({

            })
         })
      }
   ]
}
