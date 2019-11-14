import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import Coordinates from '../../lib/helpers/Coordinates'
import Dimensions from '../../lib/helpers/Dimensions'
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener'
import SettingsStore from '../store/SettingsStore'

export type MuteButtonProps = {}

export default class MuteButton extends Component<MuteButtonProps> {
   private toggleMusic(): void {
      const settingsStore = this.stores.settings as SettingsStore
      settingsStore.toggleMusic()
   }

   template: Template = [
      {
         component: new EventListener(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): EventListenerProps => ({
            size: new Dimensions(20, 20),
            onClick: this.toggleMusic
         })
      }
   ]
}
