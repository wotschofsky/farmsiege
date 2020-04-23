import cloneDeep from 'clone-deep';
import Cookie from 'js-cookie';
import Store from '../../lib/store/Store';

import copHatSprite from '../assets/character/hats/cop_hat.png';
import crownSprite from '../assets/character/hats/crown.png';
import mexicanHatSprite from '../assets/character/hats/mexican_hat.png';
import topHatSprite from '../assets/character/hats/top_hat.png';

import whiteShirtSprite from '../assets/character/shirt/white_shirt.png';
import woodsmanShirtSprite from '../assets/character/shirt/woodsman_shirt.png';

import bluePantsSprite from '../assets/character/pants/blue_pants.png';
import grayPantsSprite from '../assets/character/pants/gray_pants.png';

export type CosmeticsTypes = 'hat' | 'shirt' | 'pants';

interface CosmeticsData {
  sprite: string;
}

export interface HatData extends CosmeticsData {
  id: Hats;
}

export interface ShirtData extends CosmeticsData {
  id: Shirts;
}

export interface PantsData extends CosmeticsData {
  id: Pants;
}

export enum Hats {
  None,
  Cop,
  Crown,
  Mexican,
  Top
}

export const hatsData: HatData[] = [
  {
    id: Hats.None,
    sprite: ''
  },
  {
    id: Hats.Cop,
    sprite: copHatSprite
  },
  {
    id: Hats.Crown,
    sprite: crownSprite
  },
  {
    id: Hats.Mexican,
    sprite: mexicanHatSprite
  },
  {
    id: Hats.Top,
    sprite: topHatSprite
  }
];

export enum Shirts {
  None,
  White,
  Woodsman
}

export const shirtsData: ShirtData[] = [
  {
    id: Shirts.None,
    sprite: ''
  },
  {
    id: Shirts.White,
    sprite: whiteShirtSprite
  },
  {
    id: Shirts.Woodsman,
    sprite: woodsmanShirtSprite
  }
];

export enum Pants {
  Blue,
  Gray
}

export const pantsData: PantsData[] = [
  {
    id: Pants.Blue,
    sprite: bluePantsSprite
  },
  {
    id: Pants.Gray,
    sprite: grayPantsSprite
  }
];

export type SkinColors = 1 | 2 | 3 | 4 | 5;

export type CosmeticsStoreContent = {
  hat: Hats;
  shirt: Shirts;
  pants: Pants;
  skinColor: SkinColors;
};

export default class CosmeticsStore extends Store<CosmeticsStoreContent> {
  cookieName = 'cosmetics';

  public constructor() {
    super('cosmetics', {
      hat: Math.floor(Math.random() * hatsData.length),
      shirt: Math.floor(Math.random() * shirtsData.length),
      pants: Math.floor(Math.random() * pantsData.length),
      skinColor: <SkinColors>(Math.round(Math.random() * 4) + 1)
    });

    const cookieData = this.retrieveConfiguration();
    if (cookieData) {
      this.update(() => cookieData);
    } else {
      this.saveConfiguration();
    }
  }

  public saveConfiguration(): void {
    const data = this.content;
    Cookie.set(this.cookieName, data);
  }

  public retrieveConfiguration(): CosmeticsStoreContent | void {
    const data = <CosmeticsStoreContent | undefined>Cookie.getJSON(this.cookieName);

    if (!data) {
      return;
    }

    if (!data.hat || !hatsData.find(val => val.id === data.hat)) {
      return;
    }

    if (!data.shirt || !shirtsData.find(val => val.id === data.shirt)) {
      return;
    }

    if (!data.pants || !pantsData.find(val => val.id === data.pants)) {
      return;
    }

    if (!data.skinColor || data.skinColor < 0 || data.skinColor > 5) {
      return;
    }

    return data;
  }

  public get activeHat(): HatData {
    const storeHat = this.content.hat;
    return <HatData>hatsData.find((hat): boolean => {
      return hat.id === storeHat;
    });
  }

  public setHat(value: Hats): void {
    this.update((oldState: CosmeticsStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.hat = value;

      return clonedState;
    });
    this.saveConfiguration();
  }

  public get activeShirt(): ShirtData {
    const storeShirt = this.content.shirt;
    return <ShirtData>shirtsData.find((shirt): boolean => {
      return shirt.id === storeShirt;
    });
  }

  public setShirt(value: Shirts): void {
    this.update((oldState: CosmeticsStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.shirt = value;

      return clonedState;
    });
    this.saveConfiguration();
  }

  public get activePants(): PantsData {
    const storePants = this.content.pants;
    return <PantsData>pantsData.find((pants): boolean => {
      return pants.id === storePants;
    });
  }

  public setPants(value: Pants): void {
    this.update((oldState: CosmeticsStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.pants = value;

      return clonedState;
    });
    this.saveConfiguration();
  }

  public setSkinColor(color: SkinColors): void {
    this.update((oldState: CosmeticsStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.skinColor = color;

      return clonedState;
    });
    this.saveConfiguration();
  }
}
