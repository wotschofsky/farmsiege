import Component from '../../lib/Component'
import { Template } from '../../lib/Types'
import AnimatedSprite, { AnimatedSpriteProps } from '../../lib/components/native/AnimatedSprite'
import Coordinates from '../../lib/helpers/Coordinates'
import InputMap from '../../lib/InputMap'
import { Directions } from '../../lib/Enums'

import CharacterStore from './store/CharacterStore'
import GridStore from '../store/GridStore'
import ScoreStore from '../store/ScoreStore'
import spriteIdleLeft from '../assets/finn_idle_left.png'
import spriteIdleRight from '../assets/finn_idle_right.png'
import spriteRunningLeft from '../assets/finn_running_left.png'
import spriteRunningRight from '../assets/finn_running_right.png'
import TileContents from '../TileContents'


export type CharacterProps = {}

export default class Character extends Component<CharacterProps> {
   private inputMap: InputMap
   private positionX: number = (1024 - 128) / 2
   private positionY: number = (1024) / 2

   private hasMoved = false

   protected onInit(): void {
      this.inputMap = new InputMap({
         up: ['KeyW', 'ArrowUp'],
         left: ['KeyA', 'ArrowLeft'],
         down: ['KeyS', 'ArrowDown'],
         right: ['KeyD', 'ArrowRight'],
         use: ['Space'],
         place: ['KeyV']
      })
   }

   protected onTick(_, timeDifference: number): void {
      const characterStore = this.stores.character as CharacterStore
      const gridStore = this.stores.grid as GridStore
      const scoreStore = this.stores.score as ScoreStore

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
            scoreStore.add(10)
         }

         gridStore.removeContent(characterStore.content.fieldX, characterStore.content.fieldY)
         this.inputMap.removeActiveKey('Space')
      }

      if(inputs.place) {
         gridStore.placePlant(characterStore.content.fieldX, characterStore.content.fieldY)
         this.inputMap.removeActiveKey('KeyV')
      }
   }

   private get activeSprite(): string {
      const characterStore = this.stores.character as CharacterStore

      // if(characterStore.content.direction === Directions.Right && !this.hasMoved) {
      //    return spriteIdleRight
      // } else if(characterStore.content.direction === Directions.Right && this.hasMoved) {
      //    return spriteRunningRight
      // } else if(characterStore.content.direction === Directions.Left && !this.hasMoved) {
      //    return spriteIdleLeft
      // } else {
      //    return spriteRunningLeft
      // }

      // if(characterStore.content.direction === Directions.Right) {
      switch(characterStore.content.direction) {
         case(Directions.Left):
            return spriteIdleLeft
            // return this.hasMoved ? spriteRunningLeft : spriteIdleLeft
         case(Directions.Right):
            return spriteIdleRight
            // return this.hasMoved ? spriteRunningRight : spriteIdleRight
      }

      return spriteIdleRight

      //    if(this.hasMoved) {
      //       return spriteRunningRight
      //    } else {
      //       return spriteIdleRight
      //    }
      // } else {
      //    switch(characterStore.content.direction) {
      //       case(Directions.Left):
      //          return spriteIdleLeft
      //       case(Directions.Right):
      //          return spriteIdleRight
      //    }
      //    if(this.hasMoved) {
      //       return spriteRunningLeft
      //    } else {
      //       return spriteIdleLeft
      //    }
      // }

      // return characterStore.content.direction === Directions.Right ? spriteIdleRight : spriteIdleLeft
      // return spriteIdleRight
   }

   template: Template = [
      {
         component: new AnimatedSprite(),
         position: (): Coordinates => new Coordinates(
            this.stores.character.content.posX - 64,
            this.stores.character.content.posY - 128,
         ),
         props: (): AnimatedSpriteProps => ({
            source: this.activeSprite,
            spriteWidth: 32,
            spriteHeight: 32,
            width: 256,
            height: 256,
            interval: 150
         }),
      }
   ]
}
