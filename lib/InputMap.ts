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
  private readonly analogDeadzone = 0.2;

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

  public get pressed(): { [key: string]: number } {
    const mappedKeys: { [key: string]: number } = {};
    for (const key in this.template) {
      let value = 0;
      this.template[key].forEach(code => {
        if (this.activeKeys.includes(code)) {
          value = 1;

          if (key.startsWith('!')) {
            this.removeActiveKey(code);
          }
        }

        if (code in GamepadButtons) {
          for (const gamepad of navigator.getGamepads()) {
            if (gamepad) {
              if (code === GamepadButtons.ButtonA && gamepad.buttons[0].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.ButtonB && gamepad.buttons[1].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.ButtonX && gamepad.buttons[2].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.ButtonY && gamepad.buttons[3].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.BumperLeft && gamepad.buttons[4].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.BumperRight && gamepad.buttons[5].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.TriggerLeft && gamepad.buttons[6].value > this.analogDeadzone) {
                value = gamepad.buttons[6].value;
              }

              if (code === GamepadButtons.TriggerRight && gamepad.buttons[7].value > this.analogDeadzone) {
                value = gamepad.buttons[7].value;
              }

              if (code === GamepadButtons.ButtonBack && gamepad.buttons[8].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.ButtonStart && gamepad.buttons[9].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.StickLeft && gamepad.buttons[10].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.StickRight && gamepad.buttons[11].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.DpadUp && gamepad.buttons[12].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.DpadDown && gamepad.buttons[13].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.DpadLeft && gamepad.buttons[14].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.DpadRight && gamepad.buttons[15].pressed) {
                value = 1;
              }

              if (code === GamepadButtons.Button16 && gamepad.buttons[16].pressed) {
                value = 1;
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
                  if (axes[0] < -this.analogDeadzone) {
                    value = Math.abs(axes[0]);
                  }
                  break;
                case GamepadStickDirections.LeftStickRight:
                  if (axes[0] > this.analogDeadzone) {
                    value = Math.abs(axes[0]);
                  }
                  break;
                case GamepadStickDirections.LeftStickUp:
                  if (axes[1] < -this.analogDeadzone) {
                    value = Math.abs(axes[1]);
                  }
                  break;
                case GamepadStickDirections.LeftStickDown:
                  if (axes[1] > this.analogDeadzone) {
                    value = Math.abs(axes[1]);
                  }
                  break;
                case GamepadStickDirections.RightStickLeft:
                  if (axes[2] < -this.analogDeadzone) {
                    value = Math.abs(axes[2]);
                  }
                  break;
                case GamepadStickDirections.RightStickRight:
                  if (axes[2] > this.analogDeadzone) {
                    value = Math.abs(axes[2]);
                  }
                  break;
                case GamepadStickDirections.RightStickUp:
                  if (axes[3] < -this.analogDeadzone) {
                    value = Math.abs(axes[3]);
                  }
                  break;
                case GamepadStickDirections.RightStickDown:
                  if (axes[3] > this.analogDeadzone) {
                    value = Math.abs(axes[3]);
                  }
                  break;
              }
            }
          }
        }

        mappedKeys[key] = value;
      });
    }

    for (const key in mappedKeys) {
      if (key.startsWith('!')) {
        const strippedKey = key.slice(1);
        mappedKeys[strippedKey] = mappedKeys[key];
        delete mappedKeys[key];
      }
    }

    return mappedKeys;
  }
}
