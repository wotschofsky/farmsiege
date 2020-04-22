import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';

import MiscStore from '../store/MiscStore';
import muteIconSprite from '../assets/ui/icons/volume_0.png';
import SettingsStore from '../store/SettingsStore';
import volumeIconSprite from '../assets/ui/icons/volume_3.png';

export type MuteButtonProps = {};

export default class MuteButton extends Component<MuteButtonProps> {
  private toggleMusic(): void {
    const miscStore = <MiscStore>this.stores.misc;
    if (miscStore.content.splashScreenShowing) {
      return;
    }

    const settingsStore = <SettingsStore>this.stores.settings;
    settingsStore.toggleMusic();
  }

  private get icon(): string {
    const settingsStore = <SettingsStore>this.stores.settings;

    if (settingsStore.content.volume) {
      return volumeIconSprite;
    }
    return muteIconSprite;
  }

  protected template: Template = [
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
    }
  ];
}
