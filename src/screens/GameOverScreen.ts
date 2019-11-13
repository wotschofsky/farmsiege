import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import Dimensions from '../../lib/helpers/Dimensions'
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener'
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite'

import CharacterStore from '../store/CharacterStore'
import GridStore from '../store/GridStore'
import logo from '../assets/logo.png'
import retryButtonSprite from '../assets/ui/retry.png'
import ScoreStore from '../store/ScoreStore'
import ScreensStore, { Screens } from '../store/ScreensStore'
import Dialog, { DialogProps } from '../components/Dialog'
import Text, { TextProps } from '../../lib/components/native/Text'


export type GameOverScreenProps = {}

export default class GameOverScreen extends Component<GameOverScreenProps> {
   private startGame(): void {
      const screensStore = this.stores.screens as ScreensStore
      screensStore.setScreen(Screens.Game)

      const gridStore = this.stores.grid as GridStore
      gridStore.reset()

      const characterStore = this.stores.character as CharacterStore
      characterStore.reset()

      const scoreStore = this.stores.score as ScoreStore
      scoreStore.reset()
   }

   template: Template = [
      // {
      //    component: new Sprite(),
      //    position: (): Coordinates => new Coordinates(444, 150),
      //    props: () => ({
      //       source: logo,
      //       width: 712,
      //       height: 296,
      //    }),
      // },
      {
         component: new Dialog(),
         position: (): Coordinates => new Coordinates(500, 400),
         props: (): DialogProps => ({
            width: 600,
            height: 400,
         }),
      },
      {
         component: new Text(),
         position: (): Coordinates => new Coordinates(500 + 50, 400 + 150),
         props: (): TextProps => ({
            text: 'YOUR SCORE:',
            color: '#fff',
            size: 36,
         }),
      },
      {
         component: new Text(),
         position: (): Coordinates => new Coordinates(500 + 50, 400 + 250),
         props: (): TextProps => {
            const scoreStore = this.stores.score as ScoreStore
            return {
               text: scoreStore.content.score.toString(),
               color: '#fff',
               size: 36,
            }
         },
      },

      {
         component: new EventListener(),
         position: (): Coordinates => new Coordinates(650, 900),
         props: (): EventListenerProps => ({
            size: new Dimensions(300, 200),
            onClick: this.startGame,
         })
      },
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(650, 900),
         props: (): SpriteProps => ({
            source: retryButtonSprite,
            width: 300,
            height: 200,
         }),
      }
   ]
}
