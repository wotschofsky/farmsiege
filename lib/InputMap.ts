import keyCodeToCodes from 'keycode-to-codes';

// Verfügbare Stick-Richtungen am Controller als Enum exportieren
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

// Verfügbare Knöpfe am Controller als Enum exportieren
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
  // Wo auch immer dieser Knopf ist...?
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
      // Alle verwendeten Tastencodes als Array speichern
      this.usedKeys = [...this.usedKeys, ...this.template[key].keys];
    }

    // Tastencode speichern, wenn eine Taste gedrückt wird
    window.addEventListener('keydown', event => {
      event.preventDefault();

      let code: string;
      if (event.code) {
        code = event.code;
      } else {
        // MS Edge Fallback
        code = keyCodeToCodes(event.keyCode)[0];
      }

      if (this.usedKeys.includes(code)) {
        // Taste zu Array von gedrückten Tasten hinzufügen
        this.activeKeys.push(code);
      }
    });

    // Tastencode aus Liste entfernen, wenn eine Taste losgelassen wird
    window.addEventListener('keyup', event => {
      event.preventDefault();

      let code: string;
      if (event.code) {
        code = event.code;
      } else {
        // MS Edge Fallback
        code = keyCodeToCodes(event.keyCode)[0];
      }

      this.removeActiveKey(code);
    });

    // Gedrückte Tasten zurücksetzen, wenn der Nutzer ein anderes Fenster/Tab fokussiert
    window.addEventListener('blur', () => {
      this.activeKeys = [];
    });
  }

  public removeActiveKey(code: string): void {
    // Tastencode aus dem Array der gedrückten Tasten entfernen
    this.activeKeys = this.activeKeys.filter(key => key !== code);
  }

  // Wird ausgeführt, um zu ermitteln, welche Inputs aktiv sind
  public get pressed(): { [key: string]: number } {
    // Wenn die Gamepad API verfügbar ist, Gamepads laden
    let gamepads: (Gamepad | null)[] = [];
    if ('getGamepads' in navigator) {
      gamepads = navigator.getGamepads();
    }

    // Objekt, in welchem die Ergebnisse der Tastendrucke gespeichert werden
    const mappedKeys: { [key: string]: number } = {};

    for (const key in this.template) {
      // Fallback value
      let value = 0;

      // Alle möglichen Eingabemethoden überprüfen
      codesLoop: for (const code of this.template[key].keys) {
        if (this.activeKeys.includes(code)) {
          value = 1;

          // Wenn singlePress konfiguriert wurde, die entsprechende Taste von den gedrückten entfernen
          if (this.template[key].singlePress) {
            this.removeActiveKey(code);
          }
        }

        if (code in GamepadButtons) {
          for (const gamepad of gamepads) {
            if (gamepad) {
              // Wenn der Tastencode dem jeweiligen Button entspricht und dieser gedrückt ist Wert auf 1 setzen
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

              // Sonderfall: Diese Tasten sind analog und liefern einen Wert zwischen von einschließlich 0-1
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
          for (const gamepad of gamepads) {
            if (gamepad) {
              const { axes } = gamepad;

              switch (code) {
                // Wenn der Tastencode übereinstimmt und der Controller Stick außerhalb der Deadzone ist
                // wird value auf den absoluten Wert der aktuellen Stickposition gesetzt
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

        // Wert übertragen & verhindern, dass der Wert kleiner wird
        mappedKeys[key] = Math.max(mappedKeys[key] ?? 0, value);

        // Abbrechen, wenn bereits der Maximalwert erreicht wurde um Leistung zu sparen
        if (mappedKeys[key] === 1) {
          break codesLoop;
        }
      }

      // Wenn overrides konfiguriert sind, diese keys überschreiben und auf 0 setzen
      const overridesKey = this.template[key].overrides;
      if (mappedKeys[key] > 0 && overridesKey) {
        for (const key of overridesKey) {
          mappedKeys[key] = 0;
        }
      }
    }

    return mappedKeys;
  }
}
