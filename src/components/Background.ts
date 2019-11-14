import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import Pattern, { PatternProps } from '../../lib/components/native/Pattern'
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite'

import tree1 from '../assets/trees/tree_1.png'
import tree2 from '../assets/trees/tree_2.png'
import tree3 from '../assets/trees/tree_3.png'
import sky from '../assets/sky/sky.png'
import grass from '../assets/grass.png'
import Clouds from './Clouds'


export type BackgroundProps = {}

export default class Background extends Component<BackgroundProps> {
   template: Template = [
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): SpriteProps => ({
            source: sky,
            width: 1600,
            height: 800,
         }),
      },
      {
         component: new Pattern(),
         position: (): Coordinates => new Coordinates(0, 176),
         props: (): PatternProps => ({
            source: grass,
            width: 1600,
            height: 1024,
            mode: 'repeat',
         }),
      },
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(
            20,
            40,
         ),
         props: (): SpriteProps => ({
            source: tree1,
            width: 300,
            height: 300,
         }),
      },
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(
            420,
            40,
         ),
         props: (): SpriteProps => ({
            source: tree2,
            width: 300,
            height: 300,
         }),
      },
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(
            820,
            40,
         ),
         props: (): SpriteProps => ({
            source: tree3,
            width: 100,
            height: 100,
         }),
      },
      {
         position: (): Coordinates => new Coordinates(0, 0),
         component: new Clouds(),
      },
   ]
}
