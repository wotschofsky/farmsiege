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

  public constructor(template: InputMapConfig) {
    this.template = template;

    for (const key in this.template) {
      this.usedKeys = [...this.usedKeys, ...this.template[key].keys];
    }

    window.addEventListener('keydown', event => {
      if (event.code) {
        if (this.usedKeys.includes(event.code)) {
          event.preventDefault();
        }

        if (!this.activeKeys.includes(event.code)) {
          this.activeKeys.push(event.code);
        }
      } else {
        // MS Edge Fallback
        const code = this.keyCodeToCodes(event.keyCode)[0];

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
      event.preventDefault();

      if (event.code) {
        this.activeKeys = this.activeKeys.filter(key => {
          return key !== event.code;
        });
      } else {
        // MS Edge Fallback
        const code = this.keyCodeToCodes(event.keyCode)[0];

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

      const overridesKey = this.template[key].overrides;
      if (mappedKeys[key] > 0 && overridesKey && overridesKey.length > 0) {
        for (const key of overridesKey) {
          mappedKeys[key] = 0;
        }
      }
    }

    return mappedKeys;
  }

  private keyCodeToCodes(keyCode: number): string[] {
    return this.keyCodes[keyCode];
  }

  // Based on https://gist.github.com/jiyinyiyong/5915004
  private readonly keyCodes: { [code: number]: string[] } = {
    48: ['Digit0'],
    49: ['Digit1'],
    50: ['Digit2'],
    51: ['Digit3'],
    52: ['Digit4'],
    53: ['Digit5'],
    54: ['Digit6'],
    55: ['Digit7'],
    56: ['Digit8'],
    57: ['Digit9'],
    8: ['Backspace'],
    9: ['Tab'],
    13: ['Enter', 'NumpadEnter'],
    16: ['ShiftLeft', 'ShiftRight'],
    17: ['ControlLeft', 'ControlRight'],
    18: ['AltLeft', 'AltRight'],
    19: ['Pause'],
    20: ['CapsLock'],
    27: ['Escape'],
    32: ['Space'],
    33: ['PageUp'],
    34: ['PageDown'],
    35: ['End'],
    36: ['Home'],
    37: ['ArrowLeft'],
    38: ['ArrowUp'],
    39: ['ArrowRight'],
    40: ['ArrowDown'],
    45: ['Insert'],
    46: ['Delete'],
    65: ['KeyA'],
    66: ['KeyB'],
    67: ['KeyC'],
    68: ['KeyD'],
    69: ['KeyE'],
    70: ['KeyF'],
    71: ['KeyG'],
    72: ['KeyH'],
    73: ['KeyI'],
    74: ['KeyJ'],
    75: ['KeyK'],
    76: ['KeyL'],
    77: ['KeyM'],
    78: ['KeyN'],
    79: ['KeyO'],
    80: ['KeyP'],
    81: ['KeyQ'],
    82: ['KeyR'],
    83: ['KeyS'],
    84: ['KeyT'],
    85: ['KeyU'],
    86: ['KeyV'],
    87: ['KeyW'],
    88: ['KeyX'],
    89: ['KeyY'],
    90: ['KeyZ'],
    91: ['MetaLeft'],
    92: ['MetaRight'],
    93: ['ContextMenu'],
    96: ['Numpad0'],
    97: ['Numpad1'],
    98: ['Numpad2'],
    99: ['Numpad3'],
    100: ['Numpad4'],
    101: ['Numpad5'],
    102: ['Numpad6'],
    103: ['Numpad7'],
    104: ['Numpad8'],
    105: ['Numpad9'],
    106: ['NumpadMultiply'],
    107: ['NumpadAdd'],
    109: ['NumpadSubtract'],
    110: ['NumpadDecimal'],
    111: ['NumpadDivide'],
    112: ['F1'],
    113: ['F2'],
    114: ['F3'],
    115: ['F4'],
    116: ['F5'],
    117: ['F6'],
    118: ['F7'],
    119: ['F8'],
    120: ['F9'],
    121: ['F10'],
    122: ['F11'],
    123: ['F12'],
    144: ['NumLock'],
    145: ['ScrollLock'],
    186: ['Semicolon'],
    187: ['Equal'],
    188: ['Comma'],
    189: ['Minus'],
    190: ['Period'],
    191: ['Slash'],
    192: ['Backquote'],
    219: ['BracketLeft'],
    220: ['Backslash'],
    221: ['BracketRight'],
    222: ['Quote'],
    226: ['IntlBackslash']
  };
}
