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
    const codes: string[] = [];
    for (const key in this.keyCodes) {
      if (keyCode === this.keyCodes[key]) {
        codes.push(key);
      }
    }
    return codes;
  }

  // Based on https://gist.github.com/jiyinyiyong/5915004
  private readonly keyCodes: { [code: string]: number } = {
    Digit0: 48,
    Digit1: 49,
    Digit2: 50,
    Digit3: 51,
    Digit4: 52,
    Digit5: 53,
    Digit6: 54,
    Digit7: 55,
    Digit8: 56,
    Digit9: 57,
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    NumpadEnter: 13,
    ShiftLeft: 16,
    ShiftRight: 16,
    ControlLeft: 17,
    ControlRight: 17,
    AltLeft: 18,
    AltRight: 18,
    Pause: 19,
    CapsLock: 20,
    Escape: 27,
    Space: 32,
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Insert: 45,
    Delete: 46,
    KeyA: 65,
    KeyB: 66,
    KeyC: 67,
    KeyD: 68,
    KeyE: 69,
    KeyF: 70,
    KeyG: 71,
    KeyH: 72,
    KeyI: 73,
    KeyJ: 74,
    KeyK: 75,
    KeyL: 76,
    KeyM: 77,
    KeyN: 78,
    KeyO: 79,
    KeyP: 80,
    KeyQ: 81,
    KeyR: 82,
    KeyS: 83,
    KeyT: 84,
    KeyU: 85,
    KeyV: 86,
    KeyW: 87,
    KeyX: 88,
    KeyY: 89,
    KeyZ: 90,
    MetaLeft: 91,
    MetaRight: 92,
    ContextMenu: 93,
    Numpad0: 96,
    Numpad1: 97,
    Numpad2: 98,
    Numpad3: 99,
    Numpad4: 100,
    Numpad5: 101,
    Numpad6: 102,
    Numpad7: 103,
    Numpad8: 104,
    Numpad9: 105,
    NumpadMultiply: 106,
    NumpadAdd: 107,
    NumpadSubtract: 109,
    NumpadDecimal: 110,
    NumpadDivide: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NumLock: 144,
    ScrollLock: 145,
    Semicolon: 186,
    Equal: 187,
    comma: 188,
    dash: 189,
    period: 190,
    Slash: 191,
    Backquote: 192,
    BracketLeft: 219,
    Backslash: 220,
    BracketRight: 221,
    Quote: 222,
    IntlBackslash: 226
  };
}
