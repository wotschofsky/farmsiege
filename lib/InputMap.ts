export enum GamepadStickDirections {
  LeftStickLeft = 'LeftStickLeft',
  LeftStickRight = 'LeftStickRight',
  LeftStickUp = 'LeftStickUp',
  LeftStickDown = 'LeftStickDown',
  RightStickLeft = 'RightStickLeft',
  RightStickRight = 'RightStickRight',
  RightStickUp = 'RightStickUp',
  RightStickDown = 'RightStickDown'
}

export enum GamepadButtons {
  ButtonA = 'ButtonA',
  ButtonB = 'ButtonB',
  ButtonX = 'ButtonX',
  ButtonY = 'ButtonY',
  BumperLeft = 'BumperLeft',
  BumperRight = 'BumperRight',
  TriggerLeft = 'TriggerLeft',
  TriggerRight = 'TriggerRight',
  ButtonBack = 'ButtonBack',
  ButtonStart = 'ButtonStart',
  StickLeft = 'StickLeft',
  StickRight = 'StickRight',
  DpadUp = 'DpadUp',
  DpadDown = 'DpadDown',
  DpadLeft = 'DpadLeft',
  DpadRight = 'DpadRight',
  Button16 = 'Button16'
}

export default class InputMap {
  private activeKeys: string[] = [];
  private template: Record<string, string[]>;
  private usedKeys: string[] = [];

  public constructor(template: Record<string, string[]>) {
    this.template = template;

    for (const key in this.template) {
      this.usedKeys = [...this.usedKeys, ...this.template[key]];
    }

    window.addEventListener('keydown', event => {
      if (this.usedKeys.includes(event.code)) {
        event.preventDefault();
      }

      if (!this.activeKeys.includes(event.code)) {
        this.activeKeys.push(event.code);
      }
    });

    window.addEventListener('keyup', event => {
      event.preventDefault();

      this.activeKeys = this.activeKeys.filter(key => {
        return key !== event.code;
      });
    });

    window.addEventListener('blur', () => {
      this.activeKeys = [];
    });
  }

  public removeActiveKey(code: string): void {
    this.activeKeys = this.activeKeys.filter(key => {
      return key !== code;
    });
  }

  public get pressed(): { [key: string]: boolean } {
    const mappedKeys: Record<string, boolean> = {};
    for (const key in this.template) {
      let active = false;
      this.template[key].forEach(code => {
        if (this.activeKeys.includes(code)) {
          active = true;
        }

        if (code in GamepadButtons) {
          for (const gamepad of navigator.getGamepads()) {
            if (gamepad) {
              if (code === GamepadButtons.ButtonA && gamepad.buttons[0].pressed) {
                active = true;
              }

              if (code === GamepadButtons.ButtonB && gamepad.buttons[1].pressed) {
                active = true;
              }

              if (code === GamepadButtons.ButtonX && gamepad.buttons[2].pressed) {
                active = true;
              }

              if (code === GamepadButtons.ButtonY && gamepad.buttons[3].pressed) {
                active = true;
              }

              if (code === GamepadButtons.BumperLeft && gamepad.buttons[4].pressed) {
                active = true;
              }

              if (code === GamepadButtons.BumperRight && gamepad.buttons[5].pressed) {
                active = true;
              }

              if (code === GamepadButtons.TriggerLeft && gamepad.buttons[6].pressed) {
                active = true;
              }

              if (code === GamepadButtons.TriggerRight && gamepad.buttons[7].pressed) {
                active = true;
              }

              if (code === GamepadButtons.ButtonBack && gamepad.buttons[8].pressed) {
                active = true;
              }

              if (code === GamepadButtons.ButtonStart && gamepad.buttons[9].pressed) {
                active = true;
              }

              if (code === GamepadButtons.StickLeft && gamepad.buttons[10].pressed) {
                active = true;
              }

              if (code === GamepadButtons.StickRight && gamepad.buttons[11].pressed) {
                active = true;
              }

              if (code === GamepadButtons.DpadUp && gamepad.buttons[12].pressed) {
                active = true;
              }

              if (code === GamepadButtons.DpadDown && gamepad.buttons[13].pressed) {
                active = true;
              }

              if (code === GamepadButtons.DpadLeft && gamepad.buttons[14].pressed) {
                active = true;
              }

              if (code === GamepadButtons.DpadRight && gamepad.buttons[15].pressed) {
                active = true;
              }

              if (code === GamepadButtons.Button16 && gamepad.buttons[16].pressed) {
                active = true;
              }
            }
          }
        }

        if (code in GamepadStickDirections) {
          for (const gamepad of navigator.getGamepads()) {
            if (gamepad) {
              const { axes } = gamepad;
              switch (code) {
                case GamepadStickDirections.LeftStickLeft:
                  if (axes[0] < -0.5) {
                    active = true;
                  }
                  break;
                case GamepadStickDirections.LeftStickRight:
                  if (axes[0] > 0.5) {
                    active = true;
                  }
                  break;
                case GamepadStickDirections.LeftStickUp:
                  if (axes[1] < -0.5) {
                    active = true;
                  }
                  break;
                case GamepadStickDirections.LeftStickDown:
                  if (axes[1] > 0.5) {
                    active = true;
                  }
                  break;
                case GamepadStickDirections.RightStickLeft:
                  if (axes[2] < -0.5) {
                    active = true;
                  }
                  break;
                case GamepadStickDirections.RightStickRight:
                  if (axes[2] > 0.5) {
                    active = true;
                  }
                  break;
                case GamepadStickDirections.RightStickUp:
                  if (axes[3] < -0.5) {
                    active = true;
                  }
                  break;
                case GamepadStickDirections.RightStickDown:
                  if (axes[3] > 0.5) {
                    active = true;
                  }
                  break;
              }
            }
          }
        }

        mappedKeys[key] = active;
      });
    }
    return mappedKeys;
  }
}
