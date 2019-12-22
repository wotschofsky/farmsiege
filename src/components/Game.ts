// import { Howl } from '../node_modules/howler/dist/howler.min.js'
import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'

import Background from './Background'
import menuSoundtrack from '../assets/soundtrack/menu.mp3'
import MuteButton from './MuteButton'

import GameOverScreen from '../screens/GameOverScreen'
import GameScreen from '../screens/GameScreen'
import HelpScreen from '../screens/HelpScreen'
import StartScreen from '../screens/StartScreen'

import CharacterStore from '../store/CharacterStore'
import CosmeticsStore from '../store/CosmeticsStore'
import Effects from '../overlays/Effects'
import EffectsStore from '../store/EffectsStore'
import GridStore from '../store/GridStore'
import MovablesStore from '../store/MovablesStore'
import PropsContext from '../../lib/PropsContext'
import ScoreStore from '../store/ScoreStore'
import ScreensStore, { Screens } from '../store/ScreensStore'
import SettingsStore, { SettingsStoreContent } from '../store/SettingsStore'


declare const Howl: Howl

class Game extends Component<{}> {
   activeScreen: Screens

   protected onInit(): void {

      const settingsStore = new SettingsStore()
      this.registerStore(settingsStore)

      const musicPlayer = new Howl({
         src: [menuSoundtrack],
         autoplay: true,
         loop: true,
         volume: settingsStore.content.music ? 0.8 : 0
      })

      settingsStore.subscribe((state: SettingsStoreContent) => {
         musicPlayer.volume(state.music ? 0.8 : 0)
      })
   }

   constructor() {
      super()

      this.activeScreen = Screens.Start

      const characterStore = new CharacterStore()
      this.registerStore(characterStore)

      const cosmeticsStore = new CosmeticsStore()
      this.registerStore(cosmeticsStore)

      const gridStore = new GridStore()
      this.registerStore(gridStore)

      const movablesStore = new MovablesStore()
      this.registerStore(movablesStore)

      const effectsStore = new EffectsStore()
      this.registerStore(effectsStore)

      const scoreStore = new ScoreStore()
      this.registerStore(scoreStore)

      const screensStore = new ScreensStore()
      this.registerStore(screensStore)

      const settingsStore = new SettingsStore()
      this.registerStore(settingsStore)
   }

   protected onTick(ctx: PropsContext<{}>, timeDifference: number): void {
      const screensStore = this.stores.screens as ScreensStore
      this.activeScreen = screensStore.content.active

      const gridStore = this.stores.grid as GridStore

      const scoreStore = this.stores.score as ScoreStore
      if(gridStore.friendlyPlants === 0) {
         const name = prompt('Please enter your name')
         if(!!name && name.length >= 1) {
            fetch('https://garden-defense.firebaseio.com/highscores.json', {
               method: 'POST',
               body: JSON.stringify({
                  score: scoreStore.content.score,
                  name
               }),
            })
         }

         gridStore.reset()
         gridStore.stop()

         screensStore.setScreen(Screens.GameOver)
      }

      const effectsStore = this.stores.effects as EffectsStore
      effectsStore.updateEffects(timeDifference)
   }

   template: Template = [
      {
         component: new Background(),
         position: (): Coordinates => new Coordinates(0, 0),
      },
      {
         component: new GameScreen(),
         position: (): Coordinates => new Coordinates(0, 0),
         show: (): boolean => this.activeScreen === Screens.Game
      },
      {
         component: new StartScreen(),
         position: (): Coordinates => new Coordinates(0, 0),
         show: (): boolean => this.activeScreen === Screens.Start
      },
      {
         component: new GameOverScreen(),
         position: (): Coordinates => new Coordinates(0, 0),
         show: (): boolean => this.activeScreen === Screens.GameOver
      },
      {
         component: new HelpScreen(),
         position: (): Coordinates => new Coordinates(0, 0),
         show: (): boolean => this.activeScreen === Screens.Help
      },
      {
         component: new MuteButton(),
         position: (): Coordinates => new Coordinates(12, 8),
      },
      {
         component: new Effects(),
         position: (): Coordinates => new Coordinates(0, 0),
      }
   ]
}


export default Game
