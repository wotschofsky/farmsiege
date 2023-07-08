import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import PropsContext from '../../lib/PropsContext';
import Rectangle, { RectangleProps } from '../../lib/components/native/Rectangle';
import Text, { TextProps } from '../../lib/components/native/Text';
import TextWidthCalculator, { TextWidthCalculatorProps } from '../../lib/components/helpers/TextWidthCalculator';

type OnEnterCallback = (value: string) => void;

export type InputProps = {
  width: number;
  maxLength?: number;
  placeholder?: string;
  onEnter?: OnEnterCallback;
};

export default class Input extends Component<InputProps> {
  private timer = 0;
  private text = '';
  private textWidth = 0;
  private inputWidth = 0;
  private maxLength = Infinity;
  private onEnterCallback: OnEnterCallback = () => {};

  protected onTick(ctx: PropsContext<InputProps>, timeDifference: number): void {
    this.timer += timeDifference;

    this.inputWidth = ctx.props.width;
    this.onEnterCallback = ctx.props.onEnter || ((): void => {});
    this.maxLength = ctx.props.maxLength || Infinity;
  }

  private get limitReached(): boolean {
    // true if text no longer fits in the field or has reached the fixed limit
    return this.textWidth > this.inputWidth - 32 || this.text.length >= this.maxLength;
  }

  private get caretOpacity(): number {
    const duration = 1200;

    const time = this.timer % duration;
    const isShown = time >= duration / 2;

    return isShown ? 1 : 0;
  }

  protected template: Template = [
    // Background
    {
      component: new Rectangle(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<InputProps>): RectangleProps => ({
        width: ctx.props.width,
        height: 48,
        color: '#fff'
      })
    },

    // Entered text
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(8, 24),
      props: (): TextProps => ({
        text: this.text,
        baseline: 'middle',
        color: '#222',
        font: 'Heartbit',
        size: 48
      })
    },

    // Placeholder
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(8, 24),
      props: (ctx: PropsContext<InputProps>): TextProps => ({
        text: <string>ctx.props.placeholder,
        baseline: 'middle',
        color: '#aaa',
        font: 'Heartbit',
        size: 48
      }),
      show: (ctx: PropsContext<InputProps> | undefined): boolean => {
        if (!ctx) {
          return false;
        }
        return !!ctx.props.placeholder && !this.text;
      }
    },

    // Calculate text width in pixels
    {
      component: new TextWidthCalculator(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextWidthCalculatorProps => ({
        text: this.text,
        font: 'Heartbit',
        size: 48,
        callback: (width: number): void => {
          this.textWidth = width;
        }
      })
    },

    // Caret
    {
      component: new Rectangle(),
      position: (): Coordinates => new Coordinates(this.textWidth + 8, 8),
      props: (): RectangleProps => ({
        width: 3,
        height: 32,
        color: `rgba(34, 34, 34, ${this.caretOpacity})`
      })
    },

    // Event Listener
    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<InputProps>): EventListenerProps => ({
        size: new Dimensions(ctx.props.width, 48),
        onKeypress: (event: KeyboardEvent): void => {
          event.preventDefault();

          switch (event.key) {
            case 'Enter':
              this.onEnterCallback(this.text);
              this.text = '';
              return;
            case 'Delete':
              return;
            case 'Backspace':
              return;
          }

          // Key press
          if (!this.limitReached) {
            this.text += event.key;
          }
        },
        // Additional Keydown event since Backspace is not passed to onKeypress in all browsers
        onKeydown: (event: KeyboardEvent): void => {
          if (event.key === 'Backspace') {
            event.preventDefault();
            this.text = this.text.slice(0, this.text.length - 1);
          }
        }
      })
    }
  ];
}
