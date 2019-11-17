import Component from '../../Component'
import RenderUtils from '../../utils/Render'
import PropsContext from '../../PropsContext'
import Coordinates from '../../helpers/Coordinates'


export type RepeatingProps = {
   list: any[],
   component: Component<any>,
   position: (data: any, index: number) => Coordinates,
   props: (data: any, index: number) => {}
}

export default class Repeating extends Component<RepeatingProps> {
   public render(context: RenderingContext, position: Coordinates, props: RepeatingProps): void {
      props.list.forEach((data, index) => {
         const propsContext = new PropsContext(props.props(data))
         RenderUtils.renderTemplateItem({
            component: props.component,
            position: () => props.position(data, index),
            props: () => props.props(data, index),
         }, context, position, propsContext)
      })
   }
}
