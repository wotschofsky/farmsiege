import Component from '../../../lib/Component'
import { Template } from '../../../lib/Types'
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite'
import Coordinates from '../../../lib/helpers/Coordinates'
import CharacterStore from '../../store/CharacterStore'

import mexicanHatSprite from '../../assets/character/hats/mexican_hat.png'
import crownSprite from '../../assets/character/hats/crown.png'


type HatProps = {}

export default class Hat extends Component<HatProps> {    
    template: Template = [
        {
            component: new Sprite(),
            position: (): Coordinates => new Coordinates(0, 0),
            props: (): SpriteProps => {
                const characterStore = this.stores.character as CharacterStore
                
                return {
                    width: 128 * 1.2,
                    height: 128 * 1.2,
                    source: crownSprite
                }
            }
        }
    ]
}