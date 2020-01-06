import { Template } from '../../lib/Types'
import Component from '../../lib/Component'
import GridRow, { GridRowProps } from './GridRow'
import Coordinates from '../../lib/helpers/Coordinates'


export type GridProps = {}

export default class Grid extends Component<GridProps> {
   protected template: Template = [
      {
         component: new GridRow(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): GridRowProps => ({
            index: 0
         })
      },
      {
         component: new GridRow(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): GridRowProps => ({
            index: 1
         })
      },
      {
         component: new GridRow(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): GridRowProps => ({
            index: 2
         })
      },
      {
         component: new GridRow(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): GridRowProps => ({
            index: 3
         })
      },
      {
         component: new GridRow(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): GridRowProps => ({
            index: 4
         })
      },
      {
         component: new GridRow(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): GridRowProps => ({
            index: 5
         })
      },
      {
         component: new GridRow(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): GridRowProps => ({
            index: 6
         })
      },
      {
         component: new GridRow(),
         position: (): Coordinates => new Coordinates(0, 0),
         props: (): GridRowProps => ({
            index: 7
         })
      },
   ]
}
