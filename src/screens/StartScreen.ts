import Cookie from 'js-cookie'

import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import Dimensions from '../../lib/helpers/Dimensions'
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener'
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite'

import CharacterStore from '../store/CharacterStore'
import GridStore from '../store/GridStore'
import ScoreStore from '../store/ScoreStore'
import ScreensStore, { Screens } from '../store/ScreensStore'
import logo from '../assets/logo.png'
import playButtonSprite from '../assets/ui/play.png'
import helpButtonSprite from '../assets/ui/help.png'


export type StartScreenProps = {}

export default class StartScreen extends Component<StartScreenProps> {
   private startGame(): void {
      const screensStore = this.stores.screens as ScreensStore
      if(Cookie.getJSON('helpShown')) {
         screensStore.setScreen(Screens.Game)
      } else {
         screensStore.setScreen(Screens.Help)
         screensStore.setReturnScreen(Screens.Game)
         Cookie.set('helpShown', 'true')
      }


      const gridStore = this.stores.grid as GridStore
      gridStore.reset()

      const characterStore = this.stores.character as CharacterStore
      characterStore.reset()

      const scoreStore = this.stores.score as ScoreStore
      scoreStore.reset()
   }

   private showHelp(): void {
      const screensStore = this.stores.screens as ScreensStore
      screensStore.setScreen(Screens.Help)
      screensStore.setReturnScreen(Screens.Start)
   }

   template: Template = [
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(444, 150),
         props: (): SpriteProps => ({
            source: logo,
            width: 712,
            height: 296,
         }),
      },
      {
         component: new EventListener(),
         position: (): Coordinates => new Coordinates(650, 500),
         props: (): EventListenerProps => ({
            size: new Dimensions(300, 200),
            onClick: this.startGame,
         })
      },
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(650, 500),
         props: (): SpriteProps => ({
            source: playButtonSprite,
            width: 300,
            height: 200,
         }),
      },
      {
         component: new EventListener(),
         position: (): Coordinates => new Coordinates(650, 700),
         props: (): EventListenerProps => ({
            size: new Dimensions(300, 200),
            onClick: this.showHelp,
         })
      },
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(650, 700),
         props: (): SpriteProps => ({
            source: helpButtonSprite,
            width: 300,
            height: 200,
         }),
      },
   ]
}
