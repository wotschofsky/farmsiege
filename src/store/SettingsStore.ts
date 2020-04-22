import Cookie from 'js-cookie';
import Store from '../../lib/store/Store';

export type SettingsStoreContent = {
  volume: boolean;
};

export default class SettingsStore extends Store<SettingsStoreContent> {
  public constructor() {
    let playMusic = true;
    if (Cookie.getJSON('playMusic') === false) {
      playMusic = false;
    }

    super('settings', {
      volume: playMusic
    });
  }

  public toggleMusic(): void {
    this.update(
      (oldState: SettingsStoreContent): SettingsStoreContent => {
        Cookie.set('playMusic', (!oldState.volume).toString());

        return {
          ...oldState,
          volume: !oldState.volume
        };
      }
    );
  }
}
