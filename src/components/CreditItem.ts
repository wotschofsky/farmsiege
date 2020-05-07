import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import PropsContext from '../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Text, { TextProps } from '../../lib/components/native/Text';

import linkIconSprite from '../assets/ui/icons/link.png';

export type CreditItemProps = {
  label: string;
  url?: string;
};

export default class CreditItem extends Component<CreditItemProps> {
  private openLink(url: string): void {
    const newTab = window.open(url, '_blank');
    if (newTab) {
      newTab.focus();
    } else {
      alert('Failed opening link');
    }
  }

  protected template: Template = [
    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<CreditItemProps>): EventListenerProps => ({
        size: new Dimensions(500, 36),
        onClick: ctx.props.url ? this.openLink.bind(this, ctx.props.url) : undefined
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => ({
        source: linkIconSprite,
        width: 32,
        height: 32
      }),
      show: (ctx?: PropsContext<CreditItemProps>): boolean => !!ctx && !!ctx.props.url
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(40, 4),
      props: (ctx: PropsContext<CreditItemProps>): TextProps => ({
        text: ctx.props.label,
        baseline: 'hanging',
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    }
  ];
}
