import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite'


export type MoleHillProps = {
   moleVisible: boolean
}

export default class MoleHill extends Component<MoleHillProps> {
   protected template: Template = [
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): SpriteProps => ({

         }),
      }
   ]
}
