import Component from '../../lib/Component'
import { Template } from '../../lib/Types'
import Sprite from '../../lib/components/native/Sprite'
import Coordinates from '../../lib/helpers/Coordinates'


export type MoleHillProps = {
   moleVisible: boolean
}

export default class MoleHill extends Component<MoleHillProps> {
   protected template: Template = [
      {
         component: new Sprite(),
         position: () => new Coordinates(0, 0),
         props: () => ({

         }),
      }
   ]
}
