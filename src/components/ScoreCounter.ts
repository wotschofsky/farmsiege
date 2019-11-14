import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import Rectangle, { RectangleProps } from '../../lib/components/native/Rectangle'
import Text, { TextProps } from '../../lib/components/native/Text'
import ScoreStore from '../store/ScoreStore'


export type ScoreCounterProps = {}

export default class ScoreCounter extends Component<ScoreCounterProps> {
   score = 0

   protected onTick() {
      // Score aus ScoreStore übertragen
      const scoreStore = this.stores.score as ScoreStore
      this.score = scoreStore.content.score
   }

   template: Template = [
      {
         component: new Rectangle(),
         position: (): Coordinates => new Coordinates(-50, 0),
         props: (): RectangleProps =>({
            width: 100,
            height: 50,
            color: 'rgba(0, 0, 0, 0.5)',
         }),
      },
      {
         component: new Text(),
         position: (): Coordinates => new Coordinates(-30, 30),
         props: (): TextProps => ({
            text: `${this.score} Points`,
            color: '#fff',
         }),
      }
   ]
}
