export function executeTurnstile(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    let widgetId: string | undefined;

    const cleanup = (): void => {
      if (widgetId) {
        window.turnstile.remove(widgetId);
      }
      container.remove();
    };

    widgetId = window.turnstile.render(container, {
      sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
      action,
      appearance: 'interaction-only',
      callback: (token: string): void => {
        cleanup();
        resolve(token);
      },
      'error-callback': (errorCode: string): void => {
        cleanup();
        reject(new Error(`Turnstile error: ${errorCode}`));
      },
      'expired-callback': (): void => {
        cleanup();
        reject(new Error('Turnstile token expired'));
      },
      'timeout-callback': (): void => {
        cleanup();
        reject(new Error('Turnstile challenge timed out'));
      }
    });

    if (!widgetId) {
      cleanup();
      reject(new Error('Failed to render Turnstile widget'));
    }
  });
}
