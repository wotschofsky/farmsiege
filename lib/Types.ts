import Component from './Component'
import PropsContext from './PropsContext'
import Coordinates from './helpers/Coordinates'


export type TemplateItem = {
   component: Component<any>,
   position: (context: PropsContext<any>) => Coordinates,
   props?: (context: PropsContext<any>) => { [key: string]: any },
   show?: (context: PropsContext<any>) => boolean,
}

export type Template = TemplateItem[]
