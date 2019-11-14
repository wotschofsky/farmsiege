import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import Dimensions from '../../lib/helpers/Dimensions'
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener'
import SettingsStore from '../store/SettingsStore'
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite'

import muteIconSprite from '../assets/ui/icons/mute.png'
import volumeIconSprite from '../assets/ui/icons/volume.png'
import Rectangle, { RectangleProps } from '../../lib/components/native/Rectangle'


export type MuteButtonProps = {}

export default class MuteButton extends Component<MuteButtonProps> {
   private toggleMusic(): void {
      const settingsStore = this.stores.settings as SettingsStore
      settingsStore.toggleMusic()
   }

   private get icon(): string {
      const settingsStore = this.stores.settings as SettingsStore

      if(settingsStore.content.music) {
         return volumeIconSprite
      }
      return muteIconSprite
   }

   template: Template = [
      {
         component: new EventListener(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): EventListenerProps => ({
            size: new Dimensions(40, 40),
            onClick: this.toggleMusic
         })
      },
      {
         component: new Sprite(),
         position: (): Coordinates => new Coordinates(4, 4),
         props: (): SpriteProps => ({
            width: 32,
            height: 32,
            source: this.icon
         })
      },
   ]
}
