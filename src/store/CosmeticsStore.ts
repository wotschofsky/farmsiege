import cloneDeep from 'clone-deep';
import Store from '../../lib/store/Store';

import copHatSprite from '../assets/character/hats/cop_hat.png';
import crownSprite from '../assets/character/hats/crown.png';
import mexicanHatSprite from '../assets/character/hats/mexican_hat.png';
import topHatSprite from '../assets/character/hats/top_hat.png';

import whiteShirtSprite from '../assets/character/shirt/white_shirt.png';
import woodsmanShirtSprite from '../assets/character/shirt/woodsman_shirt.png';

interface CosmeticsData {
  sprite: string;
}

interface HatData extends CosmeticsData {
  id: Hats;
}

interface ShirtData extends CosmeticsData {
  id: Shirts;
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

export type CosmeticsStoreContent = {
  hat: Hats;
  shirt: Shirts;
};

export default class CosmeticsStore extends Store<CosmeticsStoreContent> {
  public constructor() {
    super('cosmetics', {
      hat: Hats.Mexican,
      shirt: Shirts.Woodsman
    });
  }

  public get activeHat(): HatData {
    const storeHat = this.content.hat;
    return hatsData.find((hat): boolean => {
      return hat.id === storeHat;
    }) as HatData;
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
  }

  public get activeShirt(): ShirtData {
    const storeShirt = this.content.shirt;
    return shirtsData.find((shirt): boolean => {
      return shirt.id === storeShirt;
    }) as ShirtData;
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
  }
}
