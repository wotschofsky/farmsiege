export default class InputMap {
   private activeKeys: string[] = []
   private template: Record<string, string[]>
   private usedKeys: string[] = []

   constructor(template: Record<string, string[]>) {
      this.template = template

      for(const key in this.template) {
         this.usedKeys = [
            ...this.usedKeys,
            ...this.template[key]
         ]
      }

      window.addEventListener('keydown', (event) => {
         if(this.usedKeys.includes(event.code)) {
            event.preventDefault()
         }

         if(!this.activeKeys.includes(event.code)) {
            this.activeKeys.push(event.code)
         }
      })

      window.addEventListener('keyup', (event) => {
         event.preventDefault()

         this.activeKeys = this.activeKeys.filter((key) => {
            return key !== event.code
         })
      })

      window.addEventListener('blur', () => {
         this.activeKeys = []
      })
   }

   public removeActiveKey(code: string): void {

      this.activeKeys = this.activeKeys.filter((key) => {
         return key !== code
      })

   }

   public get pressed(): Record<string, boolean> {
      const mappedKeys: Record<string, boolean> = {}
      for(const key in this.template) {
         let active = false
         this.template[key].forEach((code) => {
            if(this.activeKeys.includes(code)) {
               active = true
            }
         })

         mappedKeys[key] = active
      }
      return mappedKeys
   }
}
