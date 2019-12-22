import Component from '../../../lib/Component'
import { Template } from '../../../lib/Types'
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite'
import Coordinates from '../../../lib/helpers/Coordinates'

import CosmeticsStore, { Hats, hatsData } from '../../store/CosmeticsStore'


type HatProps = {}

export default class Hat extends Component<HatProps> {
   private lastHat: Hats
   private hatSprite: string

   template: Template = [
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): SpriteProps => {
            const cosmeticsStore = this.stores.cosmetics as CosmeticsStore

            if(cosmeticsStore.content.hat !== this.lastHat) {
               this.lastHat = cosmeticsStore.content.hat
               this.hatSprite = cosmeticsStore.activeHat.sprite
            }

            return {
               width: 128 * 1.2,
               height: 128 * 1.2,
               source: this.hatSprite
               // source: hatsData[0].sprite
            }
         }
      }
   ]
}
