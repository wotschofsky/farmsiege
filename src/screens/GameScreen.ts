import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'

import Bullets from '../overlays/Bullets'
import CharacterContainer from '../components/CharacterContainer'
import Grid from '../components/Grid'
import Rabbits from '../overlays/Rabbits'
import ScoreCounter from '../components/ScoreCounter'


export type GameScreenProps = {}

export default class GameScreen extends Component<GameScreenProps> {
   protected template: Template = [
      {
         component: new Grid(),
         position: (): Coordinates => new Coordinates(288, 176),
      },
      {
         component: new ScoreCounter(),
         position: (): Coordinates => new Coordinates(800, 0),
      },
      {
         component: new Rabbits(),
         position: (): Coordinates => new Coordinates(0, 176),
      },
      {
         component: new CharacterContainer(),
         position: (): Coordinates => new Coordinates(288, 176),
      },
      {
         component: new Bullets(),
         position: (): Coordinates => new Coordinates(0, 0),
      },
   ]
}
