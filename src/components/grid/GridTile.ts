import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Rectangle, { RectangleProps } from '../../../lib/components/native/Rectangle';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import CharacterStore from '../../store/CharacterStore';
import GridStore from '../../store/GridStore';

import Lightning from '../tileContents/Lightning';

import dirt from '../../assets/dirt.png';
import mole from '../../assets/mole.png';
import molehill from '../../assets/molehill.png';
import tomato0 from '../../assets/plants/tomato_0.png';
import tomato1 from '../../assets/plants/tomato_1.png';
import tomato2 from '../../assets/plants/tomato_2.png';
import tomato3 from '../../assets/plants/tomato_3.png';
import weed from '../../assets/plants/weed.png';

import TileContents from '../../TileContents';
import values from '../../values.json';

export type GridTileProps = {
  row: number;
  column: number;
};

export default class GridTile extends Component<GridTileProps> {
  private readonly tileSize = 128;
  private content: TileContents = TileContents.Empty;
  private contentData: Record<string, any> = {};

  protected onTick(ctx: PropsContext<GridTileProps>): void {
    const tileData = (<GridStore>this.stores.grid).directContent[ctx.props.row][ctx.props.column];
    this.content = tileData.type;
    this.contentData = tileData.data;
  }

  protected template: Template = [
    // Basissprite
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => ({
        source: dirt,
        width: this.tileSize,
        height: this.tileSize
      })
    },

    // Schwarzes Overlay für Schachbrettmuster
    {
      component: new Rectangle(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RectangleProps => ({
        width: this.tileSize,
        height: this.tileSize,
        color: `rgba(0, 0, 0, 0.3)`
      }),
      show: (ctx: PropsContext<GridTileProps> | undefined): boolean => {
        if (!ctx) {
          return false;
        }

        const isDark = (ctx.props.row + ctx.props.column) % 2 === 1;
        return isDark;
      }
    },

    // Feldinhalt
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => {
        let sprite = null;

        switch (this.content) {
          case TileContents.Mole:
            sprite = mole;
            break;
          case TileContents.Molehill:
            sprite = molehill;
            break;
          case TileContents.Plant:
            sprite = tomato0;
            if (this.contentData.age >= (values.plant.age.fullyGrown * 1) / 3) sprite = tomato1;
            if (this.contentData.age >= (values.plant.age.fullyGrown * 2) / 3) sprite = tomato2;
            if (this.contentData.age >= values.plant.age.fullyGrown) sprite = tomato3;
            break;
          case TileContents.Weed:
            sprite = weed;
            break;
        }

        return {
          source: sprite,
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
      component: new Lightning(),
      position: (): Coordinates => new Coordinates(0, -128),
      show: (): boolean => this.content === TileContents.Lightning
    },

    // Weißés Overlay, das anzeigt, dass das Feld ausgewählt ist
    {
      component: new Rectangle(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RectangleProps => ({
        width: this.tileSize,
        height: this.tileSize,
        color: 'rgba(255, 255, 255, 0.3)'
      }),
      show: (ctx: PropsContext<GridTileProps> | undefined): boolean => {
        if (!ctx) {
          return false;
        }

        const characterStore = <CharacterStore>this.stores.character;
        return ctx.props.column === characterStore.content.fieldX && ctx.props.row === characterStore.content.fieldY;
      }
    }
  ];
}
