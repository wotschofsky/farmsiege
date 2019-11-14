import { EventTypes } from './Enums'
import { Template } from './Types'
import Coordinates from './helpers/Coordinates'
import PropsContext from './PropsContext'
import RenderingContext from './RenderingContext'
import Store from './store/Store'
import RenderUtils from './utils/Render'


export default class Component<P> {
   private _template: Template = []
   private initialized = false
   private _stores: { [key: string]: Store<any> } = {}

   // constructor() {
   //    this.template.forEach((el) => {
   //       el.component.registerStore()
   //    })
   // }

   protected onTick(ctx: PropsContext<P>, timeDifference: number): void {
      return
   }
   protected onInit(): void {
      return
   }

   protected set template(tmp: Template) {
      this._template = tmp
   }

   // protected setState(arg: Object | ((oldState: S) => {})): S {
   //    if(typeof(arg) === 'function') {
   //       this._state = {
   //          ...this._state,
   //          ...arg(this._state)
   //       }
   //       return this._state
   //    }
   //    this._state = {
   //       ...arg,
   //       ...this._state
   //    }
   //    return this._state
   // }

   // protected get state(): S {
   //    return this._state
   // }

   // protected set state(value: S) {
   //    this._state = value
   // }

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
         // if(typeof(el.show) === 'function' && !el.show(propsContext)) return

         // el.component.render(
         //    new RenderingContext(
         //       context.frame,
         //       context.parentX + (position.x),
         //       context.parentY + (position.y),
         //       context.canvas,
         //       context.renderContext,
         //       context.scaleFactor,
         //       context.timeDifference,
         //       context.frameStart,
         //    ),
         //    el.position(propsContext),
         //    typeof(el.props) === 'function' ? el.props(propsContext) : {}
         // )
         RenderUtils.renderTemplateItem(el, context, position, propsContext)
      })
   }
}
