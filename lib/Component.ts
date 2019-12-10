import { EventTypes } from './Enums'
import { Template } from './Types'
import Coordinates from './helpers/Coordinates'
import PropsContext from './PropsContext'
import RenderingContext from './RenderingContext'
import Store from './store/Store'
import RenderUtils from './utils/Render'


export default abstract class Component<P> {
   private _template: Template = []
   private initialized = false
   private _stores: { [key: string]: Store<any> } = {}

   protected onTick(ctx: PropsContext<P>, timeDifference: number): void {
      return
   }
   protected onInit(): void {
      return
   }

   protected set template(tmp: Template) {
      this._template = tmp
   }

   public registerStore(store: Store<any>): void {
      this._stores[store.name] = store
      this._template.forEach((el) => {
         el.component.registerStore(store)
      })
   }

   public propagateEvent(type: EventTypes, position: Coordinates): void {
      this._template.forEach((el) => {
         if(typeof(el.show) === 'function' && !el.show()) return
         el.component.propagateEvent(type, position)
      })
   }

   protected get stores(): { [key: string]: Store<any> } {
      return this._stores
   }

   public render(context: RenderingContext, position: Coordinates, props: P): void {
      if(!this.initialized) {
         this.onInit()
         this.initialized = true
      }

      const propsContext = new PropsContext<P>(props)

      this.onTick(propsContext, context.timeDifference)

      this._template.forEach((el): void => {
         RenderUtils.renderTemplateItem(el, context, position, propsContext)
      })
   }
}
