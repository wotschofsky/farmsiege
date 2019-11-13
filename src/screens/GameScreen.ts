import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'

import Character from '../components/Character'
import Grid from '../components/Grid'
import ScoreCounter from '../components/ScoreCounter'


export type GameScreenProps = {}

export default class GameScreen extends Component<GameScreenProps> {
   template: Template = [
      {
         component: new Grid(),
         position: (): Coordinates => new Coordinates(288, 176),
      },
      {
         component: new Character(),
         position: (): Coordinates => new Coordinates(288, 176),
      },
      {
         component: new ScoreCounter(),
         position: (): Coordinates => new Coordinates(800, 0),
      },
   ]
}
