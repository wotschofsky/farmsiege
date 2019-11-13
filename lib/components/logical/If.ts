import Component from '../../Component'
import RenderUtils from '../../utils/Render'
import PropsContext from '../../PropsContext'
import Coordinates from '../../helpers/Coordinates'
import RenderingContext from '../../RenderingContext'
import { TemplateItem } from '../../Types'


export type IfProps = {
   show: boolean,
   child: TemplateItem,
   props: any,
}

export default class If extends Component<IfProps> {
   public render(context: RenderingContext, position: Coordinates, props: IfProps): void {
      if(!props.show) return

      const propsContext = new PropsContext<any>(props.props)
      RenderUtils.renderTemplateItem(
         props.child,
         context,
         position,
         propsContext,
      )
   }
}
