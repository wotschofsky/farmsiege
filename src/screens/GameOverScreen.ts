import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import Dimensions from '../../lib/helpers/Dimensions'
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener'
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite'
import Text, { TextProps } from '../../lib/components/native/Text'

import CharacterStore from '../store/CharacterStore'
import Dialog, { DialogProps } from '../components/Dialog'
import GridStore from '../store/GridStore'
import MovablesStore from '../store/MovablesStore'
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating'
import retryButtonSprite from '../assets/ui/retry.png'
import ScoreStore from '../store/ScoreStore'
import ScreensStore, { Screens } from '../store/ScreensStore'


type ScoreData = {
   score: number,
   name: string,
}

export type GameOverScreenProps = {}

export default class GameOverScreen extends Component<GameOverScreenProps> {
   private highscores: ScoreData[] = []

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

      const scoreStore = this.stores.score as ScoreStore
      scoreStore.reset()
   }

   protected onInit() {
      fetch('https://garden-defense.firebaseio.com/highscores.json?orderBy=%22score%22&limitToLast=10').then((res) => {
         return res.json()
      }).then((json) => {
         let scores: ScoreData[] = []
         for(let score in json) {
            scores.push(json[score])
         }
         this.highscores = scores
      })
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
         position: (): Coordinates => new Coordinates(500 + 50, 200 + 150),
         props: (): TextProps => {
            const scoreStore = this.stores.score as ScoreStore
            return {
               text: `YOUR SCORE: ${scoreStore.content.score}`,
               color: '#fff',
               size: 36,
            }
         },
      },

      {
         component: new Repeating(),
         position: (): Coordinates => new Coordinates(500 + 50, 200 + 220),
         props: (): RepeatingProps => ({
            list: this.highscores,
            component: () => new Text(),
            position: (data: ScoreData, index: number): Coordinates => {
               return new Coordinates(0, index * 30)
            },
            props: (data: ScoreData, index: number): TextProps => {
               return {
                  text: `#${index + 1} ${data.name}: ${data.score}`,
                  color: '#fff',
               }
            }
         })
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
