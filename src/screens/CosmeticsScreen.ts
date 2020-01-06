import Component from '../../lib/Component'
import { Template } from '../../lib/Types'
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating'
import { hatsData } from '../store/CosmeticsStore'
import Coordinates from '../../lib/helpers/Coordinates'
import Text, { TextProps } from '../../lib/components/native/Text'
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite'


export type CosmeticsScreenProps = {}

export default class CosmeticsScreen extends Component<CosmeticsScreenProps> {
   protected template: Template = [
      {
         component: new Repeating(),
         position: (): Coordinates => new Coordinates(100, 100),
         props: (): RepeatingProps => ({
            list: hatsData,
            component: () => new Sprite(),
            position: (data, index): Coordinates => {
               console.log(index)
               return new Coordinates(0, index * 50)
            },
            props: (data): SpriteProps => ({
               // text: data.id,
               // color: 'red',
               // size: 36
               source: data.sprite,
               width: 128,
               height: 128
            })
         })
      }
   ]
}
