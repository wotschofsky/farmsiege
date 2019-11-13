import GamepadButtons from './data/GamepadButton'


class InputMap {
   private mappedInputs
   private pressedButtons = []

   constructor(selectorFunction) {
      mappedInputs = selectorFunction({
         gamepad: gamepadButtons
      })

      for(let key in mappedInputs) {
         mappedInputs[key].forEach((el, i) => {
            mappedInputs[key][i] = el.split('.')
            mappedInputs[key][i][2] = parseInt(mappedInputs[key][i][2])
         })
      }

      window.addEventListener('keydown', (event) => {
         pressedButtons.push(event.code)
      })

      window.addEventListener('keyup', (event) => {
         pressedButtons = pressedButtons.filter((el) => {
            return event.code != el
         })
      })

      window.addEventListener('blur', () => {
         pressedButtons = []
      })
   }

   getData() {
      let returnObj = {}

      for(let gamepad of navigator.getGamepads()) {
         if(gamepad) {
            for(let key in mappedInputs) {
               mappedInputs[key].forEach((el) => {
                  if(returnObj[key] == undefined) returnObj[key] = 0

                  if(el[1] == 'buttons') {
                     let inputValue = gamepad[el[1]][el[2]].value
                     if(inputValue > returnObj[key]) returnObj[key] = inputValue
                  }
                  if(el[1] == 'axes') {
                     let inputValue = gamepad[el[1]][el[2]]
                     if(inputValue > returnObj[key]) returnObj[key] = inputValue

                     if(el[3] == '!') {
                        returnObj[key] = -returnObj[key]
                     }
                  }
               })
            }
         }
      }

      return returnObj
   }
}


export default InputMap
