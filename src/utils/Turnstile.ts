export function executeTurnstile(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Overlay the game, otherwise an interactive challenge renders below the fold and silently times out
    const container = document.createElement('div');
    container.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1;';
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
