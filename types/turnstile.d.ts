interface TurnstileRenderOptions {
  sitekey: string;
  action?: string;
  appearance?: 'always' | 'execute' | 'interaction-only';
  callback?: (token: string) => void;
  'error-callback'?: (errorCode: string) => void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
}

interface TurnstileInstance {
  render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string | undefined;
  remove: (widgetId: string) => void;
}

interface Window {
  turnstile: TurnstileInstance;
}
