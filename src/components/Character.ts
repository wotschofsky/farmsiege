import { Howl, Howler } from 'howler'
import { Directions } from '../../lib/Enums'
import { Template } from '../../lib/Types'
import AnimatedSprite, { AnimatedSpriteProps } from '../../lib/components/native/AnimatedSprite'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import InputMap from '../../lib/InputMap'

import CharacterStore from './store/CharacterStore'
import GridStore from '../store/GridStore'
import ScoreStore from '../store/StatsStore'
import spriteIdleLeft from '../assets/finn_idle_left.png'
import spriteIdleRight from '../assets/finn_idle_right.png'
import spriteRunningLeft from '../assets/finn_running_left.png'
import spriteRunningRight from '../assets/finn_running_right.png'
import TileContents from '../TileContents'
import shotgunSound from '../assets/sounds/shotgun.mp3'

import blackManLeftSprite from '../assets/character/body/black_man_left.png'
import blackManRightSprite from '../assets/character/body/black_man_right.png'

import copHatSprite from '../assets/character/hats/cop_hat.png'
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite'
import Hat from './character/Hat'
import CharacterStore from '../store/CharacterStore'
import StatsStore from '../store/StatsStore'
// import EffectsStore from '../store/EffectsStore'


export type CharacterProps = {}

export default class Character extends Component<CharacterProps> {
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


      // const effectsStore = this.stores.effects as EffectsStore
      // effectsStore.showSmoke(this.positionX, this.positionY)
   }

   private get activeSprite(): string {
      const characterStore = this.stores.character as CharacterStore


      // return blackManSprite

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
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(
            this.stores.character.content.posX - 32,
            this.stores.character.content.posY - 128,
         ),
         props: (): SpriteProps => {
            const characterStore = this.stores.character as CharacterStore

            return {
               source: characterStore.content.direction === Directions.Left ? blackManLeftSprite : blackManRightSprite,
               width: 128 * 1.2,
               height: 128 * 1.2 * 1.5,
            }
         },
      },
      {
         component: new Hat(),
         position: (): Coordinates => new Coordinates(
            this.stores.character.content.posX - 32,
            this.stores.character.content.posY - 128 - 48 * 1.2,
         ),
      }
      // {
      //    component: new AnimatedSprite(),
      //    position: (): Coordinates => new Coordinates(
      //       this.stores.character.content.posX - 64,
      //       this.stores.character.content.posY - 128,
      //    ),
      //    props: (): AnimatedSpriteProps => ({
      //       source: this.activeSprite,
      //       // source: blackManSprite,
      //       spriteWidth: 32,
      //       spriteHeight: 32,
      //       width: 256,
      //       height: 256,
      //       interval: 150
      //    }),
      // }
   ]
}
