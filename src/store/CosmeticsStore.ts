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

interface CosmeticsData {
  sprite: string;
}

interface HatData extends CosmeticsData {
  id: Hats;
}

interface ShirtData extends CosmeticsData {
  id: Shirts;
}

interface PantsData extends CosmeticsData {
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
  None,
  Blue,
  Gray
}

export const pantsData: PantsData[] = [
  {
    id: Pants.None,
    sprite: ''
  },
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
      hat: Hats.Mexican,
      shirt: Shirts.Woodsman,
      pants: Pants.Blue,
      skinColor: <SkinColors>(Math.round(Math.random() * 4) + 1)
    });

    const cookieData = this.retrieveConfiguration();
    if (cookieData) {
      this.update(() => cookieData);
    }
  }

  public saveConfiguration(): void {
    const data = this.content;
    Cookie.set(this.cookieName, data);
  }

  public retrieveConfiguration(): CosmeticsStoreContent {
    const data = Cookie.getJSON(this.cookieName);
    return data;
  }

  public get activeHat(): HatData {
    const storeHat = this.content.hat;
    return <HatData>hatsData.find((hat): boolean => {
      return hat.id === storeHat;
    });
  }

  public rotateHat(): void {
    this.update(
      (oldState: CosmeticsStoreContent): CosmeticsStoreContent => {
        const clonedState = cloneDeep(oldState);

        clonedState.hat++;
        if (clonedState.hat === hatsData.length) {
          clonedState.hat = 0;
        }

        return clonedState;
      }
    );
    this.saveConfiguration();
  }

  public get activeShirt(): ShirtData {
    const storeShirt = this.content.shirt;
    return <ShirtData>shirtsData.find((shirt): boolean => {
      return shirt.id === storeShirt;
    });
  }

  public rotateShirt(): void {
    this.update(
      (oldState: CosmeticsStoreContent): CosmeticsStoreContent => {
        const clonedState = cloneDeep(oldState);

        clonedState.shirt++;
        if (clonedState.shirt === shirtsData.length) {
          clonedState.shirt = 0;
        }

        return clonedState;
      }
    );
    this.saveConfiguration();
  }

  public get activePants(): PantsData {
    const storePants = this.content.pants;
    return <PantsData>pantsData.find((pants): boolean => {
      return pants.id === storePants;
    });
  }

  public rotatePants(): void {
    this.update(
      (oldState: CosmeticsStoreContent): CosmeticsStoreContent => {
        const clonedState = cloneDeep(oldState);

        clonedState.pants++;
        if (clonedState.pants === pantsData.length) {
          clonedState.pants = 0;
        }

        return clonedState;
      }
    );
    this.saveConfiguration();
  }

  public setSkinColor(color: SkinColors): void {
    this.update((oldState: CosmeticsStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.skinColor = color;

      return clonedState;
    });
  }
}
