import Component from './Component';
import Coordinates from './helpers/Coordinates';
import PropsContext from './PropsContext';

export type TemplateItem = {
  component: Component<any>;
  position: (context: PropsContext<any>) => Coordinates;
  props?: (context: PropsContext<any>) => { [key: string]: any };
  show?: (context: PropsContext<any>) => boolean;
};

export type Template = TemplateItem[];
