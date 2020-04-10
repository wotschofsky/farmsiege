import Component from './Component';
import Coordinates from './helpers/Coordinates';
import PropsContext from './PropsContext';

export type TransformationConfig = {
  rotate?: {
    center: Coordinates;
    angle: number;
  };
};

export type TemplateItem = {
  component: Component<any>;
  position: (context: PropsContext<any>) => Coordinates;
  props?: (context: PropsContext<any>) => { [key: string]: any };
  show?: (context?: PropsContext<any>) => boolean;
  transform?: (context: PropsContext<any>) => TransformationConfig;
};

export type Template = TemplateItem[];
