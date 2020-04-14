import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Text, { TextProps } from '../../lib/components/native/Text';

import Dialog, { DialogProps } from '../components/Dialog';
import ScreensStore from '../store/ScreensStore';
import homeButtonSprite from '../assets/ui/home.png';
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating';
import CreditItem, { CreditItemProps } from '../components/CreditItem';

export type CreditsScreenProps = {};

type CreditData = {
  label: string;
  url?: string;
};

export default class CreditsScreen extends Component<CreditsScreenProps> {
  private readonly credits: CreditData[] = [
    {
      label: 'Music by Evan King',
      url: 'https://evankingmusic.com/'
    },
    {
      label: 'Heartbit Font by Void',
      url: 'https://arcade.itch.io/heartbit'
    },
    {
      label: 'Animals Sprite Pack by Time Fantasy',
      url: 'https://finalbossblues.itch.io/animals-sprite-pack'
    },
    {
      label: 'Sky by SavvyCow',
      url: 'https://savvycow.itch.io/loudypixelsky'
    },
    {
      label: 'Key Sprites by Hyohnoo',
      url: 'https://hyohnoo.itch.io/keyboard-controller-keys'
    },
    {
      label: 'Jungle Tileset by Time Fantasy',
      url: 'https://finalbossblues.itch.io/tf-jungle-tileset'
    },
    {
      label: 'Gun Sprite by Asgaard42',
      url: 'https://asgaard42.itch.io/rifle-and-shotgun-sprites'
    },
    {
      label: 'Clouds by Igor Gundarev',
      url: 'https://opengameart.org/content/clouds'
    },
    {
      label: 'Trees by ansimuz',
      url: 'https://opengameart.org/content/trees-bushes'
    },
    {
      label: 'Farming Crops by josehzz',
      url: 'https://opengameart.org/content/farming-crops-16x16'
    },
    {
      label: 'Lightning Spell by NYKNCK',
      url: 'https://kvsr.itch.io/attack-pixel-art'
    },
    {
      label: 'Smoke Animated Particle by KnoblePersona',
      url: 'https://opengameart.org/content/smoke-fire-animated-particle-16x16'
    },
    {
      label: 'Heavy Iron Hammer by laxattack1226',
      url: 'https://opengameart.org/content/heavy-iron-hammer'
    },
    {
      label: 'Pump Shotgun Sound by RA The Sun God',
      url: 'http://soundbible.com/2095-Mossberg-500-Pump-Shotgun.html'
    }
  ];

  private goBack(): void {
    const screensStore = <ScreensStore>this.stores.screens;
    screensStore.content.onReturn();
  }

  protected template: Template = [
    {
      component: new Dialog(),
      position: (): Coordinates => new Coordinates(500, 200),
      props: (): DialogProps => ({
        width: 600,
        height: 700
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(550, 220),
      props: (): TextProps => ({
        text: 'Credits',
        baseline: 'top',
        color: '#fff',
        font: 'Heartbit',
        size: 64
      })
    },

    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(550, 300),
      props: (): RepeatingProps => ({
        list: this.credits,
        component: (): CreditItem => new CreditItem(),
        position: (data: CreditData, index: number): Coordinates => new Coordinates(0, index * 40),
        props: (data: CreditData, index: number): CreditItemProps => ({
          label: data.label,
          url: data.url
        })
      })
    },

    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(650, 900),
      props: (): EventListenerProps => ({
        size: new Dimensions(300, 200),
        onClick: this.goBack
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(650, 900),
      props: (): SpriteProps => ({
        source: homeButtonSprite,
        width: 300,
        height: 200
      })
    }
  ];
}
