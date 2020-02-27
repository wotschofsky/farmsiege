import { Template } from '../../lib/Types';
import AnimatedSprite, { AnimatedSpriteProps } from '../../lib/components/native/AnimatedSprite';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';
import Rectangle, { RectangleProps } from '../../lib/components/native/Rectangle';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';

import CharacterStore from '../store/CharacterStore';
import GridStore from '../store/GridStore';
import TileContents from '../TileContents';
import values from '../values.json';

import dirt from '../assets/dirt.png';
import lightning from '../assets/lightning.png';
import mole from '../assets/mole.png';
import molehill from '../assets/molehill.png';
import tomato0 from '../assets/plants/tomato_0.png';
import tomato1 from '../assets/plants/tomato_1.png';
import tomato2 from '../assets/plants/tomato_2.png';
import tomato3 from '../assets/plants/tomato_3.png';
import weed from '../assets/plants/weed.png';

export type GridTileProps = {
  row: number;
  column: number;
};

export default class GridTile extends Component<GridTileProps> {
  private tileSize = 128;
  private content: TileContents = TileContents.Empty;
  private contentData: Record<string, any> = {};

  protected onTick(ctx: PropsContext<GridTileProps>): void {
    const tileData = (this.stores.grid as GridStore).directContent[ctx.props.row][ctx.props.column];
    this.content = tileData.type;
    this.contentData = tileData.data;
  }

  protected template: Template = [
    {
      component: new Sprite(),
      position: (ctx: PropsContext<GridTileProps>): Coordinates =>
        new Coordinates(ctx.props.row * this.tileSize, ctx.props.column * this.tileSize),
      props: (): SpriteProps => ({
        source: dirt,
        width: this.tileSize,
        height: this.tileSize
      })
    },
    {
      component: new Rectangle(),
      position: (ctx: PropsContext<GridTileProps>): Coordinates =>
        new Coordinates(ctx.props.row * this.tileSize, ctx.props.column * this.tileSize),
      props: (ctx: PropsContext<GridTileProps>): RectangleProps => {
        const isDark = (ctx.props.row + ctx.props.column) % 2 === 1;
        return {
          width: this.tileSize,
          height: this.tileSize,
          color: `rgba(0, 0, 0, ${isDark ? 0.3 : 0})`
        };
      }
    },
    {
      component: new Sprite(),
      position: (ctx: PropsContext<GridTileProps>): Coordinates =>
        new Coordinates(ctx.props.row * this.tileSize, ctx.props.column * this.tileSize),
      props: (): SpriteProps => {
        let child;
        switch (this.content) {
          case TileContents.Mole:
            child = mole;
            break;
          case TileContents.Molehill:
            child = molehill;
            break;
          case TileContents.Plant:
            child = tomato0;
            if (this.contentData.age >= (values.plant.age.fullyGrown * 1) / 3) child = tomato1;
            if (this.contentData.age >= (values.plant.age.fullyGrown * 2) / 3) child = tomato2;
            if (this.contentData.age >= values.plant.age.fullyGrown) child = tomato3;
            break;
          case TileContents.Weed:
            child = weed;
            break;
          default:
            child = null;
            break;
        }

        return {
          source: child,
          width: this.tileSize,
          height: this.tileSize
        };
      },
      show: (): boolean =>
        this.content === TileContents.Mole ||
        this.content === TileContents.Molehill ||
        this.content === TileContents.Plant ||
        this.content === TileContents.Weed
    },
    {
      component: new AnimatedSprite(),
      position: (ctx: PropsContext<GridTileProps>): Coordinates =>
        new Coordinates(ctx.props.row * this.tileSize, ctx.props.column * this.tileSize - 128),
      props: (): AnimatedSpriteProps => ({
        source: lightning,
        interval: 100,
        width: 128,
        height: 256,
        spriteWidth: 256,
        spriteHeight: 512
      }),
      show: (): boolean => this.content === TileContents.Lightning
    },
    {
      component: new Rectangle(),
      position: (ctx: PropsContext<GridTileProps>): Coordinates =>
        new Coordinates(ctx.props.row * this.tileSize, ctx.props.column * this.tileSize),
      props: (): RectangleProps => ({
        width: this.tileSize,
        height: this.tileSize,
        color: 'rgba(255, 255, 255, 0.3)'
      }),
      show: (ctx: PropsContext<GridTileProps>): boolean => {
        const characterStore = this.stores.character as CharacterStore;
        return ctx.props.row === characterStore.content.fieldX && ctx.props.column === characterStore.content.fieldY;
      }
    }
  ];
}
