import keyCodeToCodes from 'keycode-to-codes';

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

export type InputMapConfig = {
  [name: string]: {
    keys: string[];
    overrides?: string[];
    singlePress?: boolean;
  };
};

export default class InputMap {
  private readonly analogDeadzone = 0.2;

  private activeKeys: string[] = [];
  private template: InputMapConfig;
  private usedKeys: string[] = [];
  private disabled: boolean = false;

  public constructor(template: InputMapConfig) {
    this.template = template;

    for (const key in this.template) {
      this.usedKeys = [...this.usedKeys, ...this.template[key].keys];
    }

    window.addEventListener('keydown', event => {
      if (this.disabled) {
        return;
      }

      if (event.code) {
        if (this.usedKeys.includes(event.code)) {
          event.preventDefault();
        }

        if (!this.activeKeys.includes(event.code)) {
          this.activeKeys.push(event.code);
        }
      } else {
        // MS Edge Fallback
        const code = keyCodeToCodes(event.keyCode)[0];

        if (code) {
          if (this.usedKeys.includes(code)) {
            event.preventDefault();
          }

          if (!this.activeKeys.includes(code)) {
            this.activeKeys.push(code);
          }
        }
      }
    });

    window.addEventListener('keyup', event => {
      if (this.disabled) {
        return;
      }

      event.preventDefault();

      if (event.code) {
        this.activeKeys = this.activeKeys.filter(key => {
          return key !== event.code;
        });
      } else {
        // MS Edge Fallback
        const code = keyCodeToCodes(event.keyCode)[0];

        if (code) {
          this.activeKeys = this.activeKeys.filter(key => {
            return key !== code;
          });
        }
      }
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
      this.template[key].keys.forEach(code => {
        if (this.activeKeys.includes(code)) {
          value = 1;

          if (this.template[key].singlePress) {
            this.removeActiveKey(code);
          }
        }

        if (code in GamepadButtons && 'getGamepads' in navigator) {
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

        if (code in GamepadStickDirections && 'getGamepads' in navigator) {
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

      const overridesKey = this.template[key].overrides;
      if (mappedKeys[key] > 0 && overridesKey && overridesKey.length > 0) {
        for (const key of overridesKey) {
          mappedKeys[key] = 0;
        }
      }
    }

    return mappedKeys;
  }

  public enable(): void {
    this.disabled = false;
  }

  public disable(): void {
    this.disabled = true;
    this.activeKeys = [];
  }
}
