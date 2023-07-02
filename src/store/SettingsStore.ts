import Store from '../../lib/store/Store';

import CookieJSON from '../utils/CookieJSON';

export type VolumeValues = 0 | 0.33 | 0.67 | 1;

const validVolumeValues: VolumeValues[] = [0, 0.33, 0.67, 1];

export type SettingsStoreContent = {
  volume: VolumeValues;
};

export default class SettingsStore extends Store<SettingsStoreContent> {
  public constructor() {
    let volume: VolumeValues = 0.67;

    // Read cookie value
    const cookieValue = CookieJSON.get('volume');

    // Validate cookie value
    if (typeof cookieValue === 'number' && validVolumeValues.includes(<VolumeValues>cookieValue)) {
      volume = <VolumeValues>cookieValue;
    }

    super({
      volume: volume
    });
  }

  public toggleSounds(): void {
    this.update((oldState: SettingsStoreContent): SettingsStoreContent => {
      let newVolume: VolumeValues = 0;
      switch (oldState.volume) {
        case 0:
          newVolume = 0.33;
          break;
        case 0.33:
          newVolume = 0.67;
          break;
        case 0.67:
          newVolume = 1;
          break;
      }

      // Save new volume value as a cookie
      CookieJSON.set('volume', newVolume, { expires: 365 });

      return {
        ...oldState,
        volume: newVolume
      };
    });
  }
}
