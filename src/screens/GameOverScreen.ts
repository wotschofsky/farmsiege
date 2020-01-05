import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import Dimensions from '../../lib/helpers/Dimensions'
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener'
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite'
import Text, { TextProps } from '../../lib/components/native/Text'

import CharacterStore from '../store/CharacterStore'
import Dialog, { DialogProps } from '../components/Dialog'
import EffectsStore from '../store/EffectsStore'
import GridStore from '../store/GridStore'
import Highscores from '../components/Highscores'
import MovablesStore from '../store/MovablesStore'
import retryButtonSprite from '../assets/ui/retry.png'
import ScreensStore, { Screens } from '../store/ScreensStore'
import StatsStore from '../store/StatsStore'


export type GameOverScreenProps = {}

export default class GameOverScreen extends Component<GameOverScreenProps> {
   private startGame(): void {
      const screensStore = this.stores.screens as ScreensStore
      screensStore.setScreen(Screens.Game)

      const gridStore = this.stores.grid as GridStore
      gridStore.reset()
      gridStore.start()

      const movablesStore = this.stores.movables as MovablesStore
      movablesStore.reset()

      const characterStore = this.stores.character as CharacterStore
      characterStore.reset()

      const statsStore = this.stores.score as StatsStore
      statsStore.reset()

      const effectsStore = this.stores.effects as EffectsStore
      effectsStore.reset()
   }

   template: Template = [
      {
         component: new Dialog(),
         position: (): Coordinates => new Coordinates(500, 200),
         props: (): DialogProps => ({
            width: 600,
            height: 600,
         }),
      },
      {
         component: new Text(),
         position: (): Coordinates => new Coordinates(550, 350),
         props: (): TextProps => {
            const statsStore = this.stores.score as StatsStore
            return {
               text: `YOUR SCORE: ${statsStore.content.score}`,
               color: '#fff',
               size: 36,
            }
         },
      },

      {
         component: new Highscores(),
         position: (): Coordinates => new Coordinates(550, 420)
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
