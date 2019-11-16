import Component from '../../Component'
import RenderUtils from '../../utils/Render'
import PropsContext from '../../PropsContext'
import Coordinates from '../../helpers/Coordinates'


export type RepeatingProps = {
   list: any[],
   component: Component<any>,
   position: (data: any) => Coordinates,
   props: (data: any) => {}
}

export default class Repeating extends Component<RepeatingProps> {
   public render(context: RenderingContext, position: Coordinates, props: RepeatingProps): void {
      props.list.forEach((data) => {
         const propsContext = new PropsContext(props.props(data))
         RenderUtils.renderTemplateItem({
            component: props.component,
            position: () => props.position(data),
            props: () => props.props(data),
         }, context, position, propsContext)
      })
   }
}
