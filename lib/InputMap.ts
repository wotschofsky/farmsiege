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

const gamepadButtonsMapping = {
  [GamepadButtons.ButtonA]: 0,
  [GamepadButtons.ButtonB]: 1,
  [GamepadButtons.ButtonX]: 2,
  [GamepadButtons.ButtonY]: 3,
  [GamepadButtons.BumperLeft]: 4,
  [GamepadButtons.BumperRight]: 5,
  [GamepadButtons.TriggerLeft]: 6,
  [GamepadButtons.TriggerRight]: 7,
  [GamepadButtons.ButtonBack]: 8,
  [GamepadButtons.ButtonStart]: 9,
  [GamepadButtons.StickLeft]: 10,
  [GamepadButtons.StickRight]: 11,
  [GamepadButtons.DpadUp]: 12,
  [GamepadButtons.DpadDown]: 13,
  [GamepadButtons.DpadLeft]: 14,
  [GamepadButtons.DpadRight]: 15,
  [GamepadButtons.Button16]: 16
};

const gamepadStickMapping: { [key: string]: { axis: 0 | 1 | 2 | 3; type: 'positive' | 'negative' } } = {
  [GamepadStickDirections.LeftStickLeft]: {
    axis: 0,
    type: 'negative'
  },
  [GamepadStickDirections.LeftStickRight]: {
    axis: 0,
    type: 'positive'
  },
  [GamepadStickDirections.LeftStickUp]: {
    axis: 1,
    type: 'negative'
  },
  [GamepadStickDirections.LeftStickDown]: {
    axis: 1,
    type: 'positive'
  },
  [GamepadStickDirections.RightStickLeft]: {
    axis: 2,
    type: 'negative'
  },
  [GamepadStickDirections.RightStickRight]: {
    axis: 2,
    type: 'positive'
  },
  [GamepadStickDirections.RightStickUp]: {
    axis: 3,
    type: 'negative'
  },
  [GamepadStickDirections.RightStickDown]: {
    axis: 3,
    type: 'positive'
  }
};

export default class InputMap {
  private readonly analogDeadzone = 0.2;

  private activeKeys: string[] = [];
  private template: InputMapConfig;
  private usedKeys: string[] = [];
  private disabled = false;

  public constructor(template: InputMapConfig) {
    this.template = template;

    for (const key in this.template) {
      // Alle verwendeten Tastencodes als Array speichern
      this.usedKeys = [...this.usedKeys, ...this.template[key].keys];
    }

    // Tastencode speichern, wenn eine Taste gedrückt wird
    window.addEventListener('keydown', event => {
      if (this.disabled) {
        return;
      }

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
      if (this.disabled) {
        return;
      }

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
      // Snapshot aller verbundenen Gamepads speichern
      gamepads = navigator.getGamepads();
    }

    // Objekt, in welchem die Ergebnisse der Tastendrucke gespeichert werden
    const mappedKeys: { [key: string]: number } = {};

    for (const key in this.template) {
      // Fallback value = nicht gedrückt
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
              // Index des entsprechenden Button im gamepad.buttons array aus gamepadButtonsMapping auslesen
              const buttonIndex = gamepadButtonsMapping[<GamepadButtons>code];

              // Wert von Button Objekt übertragen
              // Entspricht bei digitalen Inputs 0 oder 1
              // Bei Analogen 0-1
              value = gamepad.buttons[buttonIndex].value;
            }
          }
        }

        if (code in GamepadStickDirections) {
          for (const gamepad of gamepads) {
            if (gamepad) {
              const { axes } = gamepad;

              // Konfiguration für Stick auslesen & Referenz zur Controllerstickachse speichern
              const stickMapping = gamepadStickMapping[<GamepadStickDirections>code];

              // Die Stickachsen haben im unberührten Zustand einen Wert von 0
              // Ansonsten einen beliebigen Wert zwischen -1 und 1 abhängig von Position und Richtung
              const relevantAxis = axes[stickMapping.axis];

              switch (stickMapping.type) {
                case 'positive':
                  // Testen, ob der Controller Stick außerhalb der Deadzone ist
                  if (relevantAxis > this.analogDeadzone) {
                    // Wert des Sticks übertragen
                    value = relevantAxis;
                  }
                  break;
                case 'negative':
                  if (relevantAxis < -this.analogDeadzone) {
                    // Absoluten Wert des Sticks übertragen
                    value = Math.abs(relevantAxis);
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
      // Testen, ob die Taste gedrückt wurde
      if (mappedKeys[key] > 0 && overridesKey) {
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
