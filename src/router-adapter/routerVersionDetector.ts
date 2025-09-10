import * as RR from 'react-router';

export type RouterMajorVersion = 4 | 5 | 6 | 7 | null;

export function detectReactRouterVersion(): RouterMajorVersion {
  try {
    if (!RR || typeof RR !== 'object' || !('Router' in RR)) {
      return null;
    }

    const api: Record<string, unknown> = RR;

    if (typeof api.createStaticHandler === 'function') {
      return 7;
    }

    if (
      typeof api.createBrowserRouter === 'function' ||
      typeof api.createRoutesFromElements === 'function'
    ) {
      return 6;
    }

    if (typeof api.useHistory === 'function') {
      return 5;
    }

    if (typeof api.withRouter === 'function') {
      return 4;
    }

    return null;
  } catch {
    return null;
  }
}
