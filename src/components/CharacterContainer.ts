import { Howl } from 'howler'
import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import InputMap from '../../lib/InputMap'

import { Character, CharacterProps } from './character/Character'
import CharacterStore from '../store/CharacterStore'
import CharacterStore from './store/CharacterStore'
import GridStore from '../store/GridStore'
import shotgunSound from '../assets/sounds/shotgun.mp3'
import StatsStore from '../store/StatsStore'
import TileContents from '../TileContents'


export type CharacterContainerProps = {}

export default class CharacterContainer extends Component<CharacterContainerProps> {
   private inputMap: InputMap
   private positionX = (1024 - 128) / 2
   private positionY = (1024) / 2

   private hasMoved = false
   private nextShotAvailable = 0

   protected onInit(): void {
      this.inputMap = new InputMap({
         up: ['KeyW', 'ArrowUp'],
         left: ['KeyA', 'ArrowLeft'],
         down: ['KeyS', 'ArrowDown'],
         right: ['KeyD', 'ArrowRight'],
         use: ['Space'],
         place: ['KeyV'],
         fire: ['KeyC'],
      })
   }

   protected onTick(_, timeDifference: number): void {
      const characterStore = this.stores.character as CharacterStore
      const gridStore = this.stores.grid as GridStore
      const statsStore = this.stores.score as StatsStore

      const inputs = this.inputMap.pressed

      let moveX = 0
      let moveY = 0
      if(inputs.up) moveY -= 1000 * (timeDifference / 1000)
      if(inputs.down) moveY += 1000 * (timeDifference / 1000)
      if(inputs.right) moveX += 1000 * (timeDifference / 1000)
      if(inputs.left) moveX -= 1000 * (timeDifference / 1000)

      this.hasMoved = moveX !== 0

      characterStore.move(moveX, moveY)

      if(inputs.use) {
         const field = gridStore.content[characterStore.content.fieldX][characterStore.content.fieldY]
         if(field.type === TileContents.Plant && field.data.age >= 15000) {
            statsStore.addScore(10)
         }

         gridStore.removeContent(characterStore.content.fieldX, characterStore.content.fieldY)
         this.inputMap.removeActiveKey('Space')
      }

      if(inputs.place) {
         gridStore.placePlant(characterStore.content.fieldX, characterStore.content.fieldY)
         this.inputMap.removeActiveKey('KeyV')
      }

      if(inputs.fire) {
         if(this.nextShotAvailable <= Date.now()) {
            const characterStore = this.stores.character as CharacterStore
            characterStore.fireGun()
            this.inputMap.removeActiveKey('KeyC')

            new Howl({
               src: shotgunSound,
               autoplay: true,
            })

            this.nextShotAvailable = Date.now() + 1200
         }
      }
   }

   protected template: Template = [
      {
         component: new Character(),
         position: (): Coordinates => new Coordinates(
            this.stores.character.content.posX - 32,
            this.stores.character.content.posY - 128,
         ),
         props: (): CharacterProps => {
            const characterStore = this.stores.character as CharacterStore

            return {
               direction: characterStore.content.direction
            }
         }
      }
   ]
}
