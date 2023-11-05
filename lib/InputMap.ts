import keyCodeToCodes from 'keycode-to-codes';

// Export available stick directions on the controller as Enum
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

// Export available buttons on the controller as Enum
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
  // Wherever this button is...?
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
      // Store all used keycodes as array
      this.usedKeys = [...this.usedKeys, ...this.template[key].keys];
    }

    // Save key code when a key is pressed
    window.addEventListener('keydown', (event) => {
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
        // Add key to array of pressed keys
        this.activeKeys.push(code);
      }
    });

    // Remove key code from list when a key is released
    window.addEventListener('keyup', (event) => {
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

    // Reset pressed keys when the user focuses on another window/tab
    window.addEventListener('blur', () => {
      this.activeKeys = [];
    });
  }

  public removeActiveKey(code: string): void {
    // Remove key code from the array of pressed keys
    this.activeKeys = this.activeKeys.filter((key) => key !== code);
  }

  // Executed to determine which inputs are active
  public get pressed(): { [key: string]: number } {
    // If the Gamepad API is available, load gamepads
    let gamepads: (Gamepad | null)[] = [];
    if ('getGamepads' in navigator) {
      // Save snapshot of all connected gamepads
      gamepads = navigator.getGamepads();
    }

    // Object in which the results of the key presses are stored
    const mappedKeys: { [key: string]: number } = {};

    for (const key in this.template) {
      // Fallback value = not pressed
      let value = 0;

      // Check all possible input methods
      codesLoop: for (const code of this.template[key].keys) {
        if (this.activeKeys.includes(code)) {
          value = 1;

          // If singlePress is configured, remove the corresponding key from the pressed ones
          if (this.template[key].singlePress) {
            this.removeActiveKey(code);
          }
        }

        if (code in GamepadButtons) {
          for (const gamepad of gamepads) {
            if (gamepad) {
              // Read index of the corresponding button in the gamepad.buttons array from gamepadButtonsMapping
              const buttonIndex = gamepadButtonsMapping[<GamepadButtons>code];

              // Transfer value from Button object
              // Corresponds to 0 or 1 for digital inputs
              // Between 0-1 for analog inputs
              value = gamepad.buttons[buttonIndex].value;
            }
          }
        }

        if (code in GamepadStickDirections) {
          for (const gamepad of gamepads) {
            if (gamepad) {
              const { axes } = gamepad;

              // Read configuration for stick & save reference to the controller stick axis
              const stickMapping = gamepadStickMapping[<GamepadStickDirections>code];

              // The stick axes have a value of 0 when not touched
              // Otherwise a random value between -1 and 1 depending on position and direction
              const relevantAxis = axes[stickMapping.axis];

              switch (stickMapping.type) {
                case 'positive':
                  // Test if the controller stick is outside the deadzone
                  if (relevantAxis > this.analogDeadzone) {
                    // Transfer stick value
                    value = relevantAxis;
                  }
                  break;
                case 'negative':
                  if (relevantAxis < -this.analogDeadzone) {
                    // Transfer the absolute value of the stick
                    value = Math.abs(relevantAxis);
                  }
                  break;
              }
            }
          }
        }

        // Transfer value & prevent the value from getting smaller
        mappedKeys[key] = Math.max(mappedKeys[key] ?? 0, value);

        // Break if the maximum value has already been reached to save power
        if (mappedKeys[key] === 1) {
          break codesLoop;
        }
      }

      // If overrides are configured, overwrite these keys and set to 0
      const overridesKey = this.template[key].overrides;
      // Test if the key has been pressed
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
