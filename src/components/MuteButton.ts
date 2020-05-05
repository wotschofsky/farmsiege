import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';

import MiscStore from '../store/MiscStore';
import SettingsStore from '../store/SettingsStore';

import volume0IconSprite from '../assets/ui/icons/volume_0.png';
import volume1IconSprite from '../assets/ui/icons/volume_1.png';
import volume2IconSprite from '../assets/ui/icons/volume_2.png';
import volume3IconSprite from '../assets/ui/icons/volume_3.png';

export type MuteButtonProps = {};

export default class MuteButton extends Component<MuteButtonProps> {
  private toggleSounds(): void {
    const miscStore = <MiscStore>this.stores.misc;
    if (miscStore.content.splashScreenShowing) {
      return;
    }

    const settingsStore = <SettingsStore>this.stores.settings;
    settingsStore.toggleSounds();
  }

  private get icon(): string {
    const settingsStore = <SettingsStore>this.stores.settings;

    switch (settingsStore.content.volume) {
      case 0:
        return volume0IconSprite;
      case 0.33:
        return volume1IconSprite;
      case 0.67:
        return volume2IconSprite;
      case 1:
        return volume3IconSprite;
    }
  }

  protected template: Template = [
    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): EventListenerProps => ({
        size: new Dimensions(40, 40),
        onClick: this.toggleSounds
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
