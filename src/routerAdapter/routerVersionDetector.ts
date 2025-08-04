import * as RR from 'react-router';

export type RouterMajorVersion = 4 | 5 | 6 | 7 | null;

export function detectReactRouterVersion(): RouterMajorVersion {
  try {
    const api: Record<string, any> = RR;

    // React Router v6+ — есть createBrowserRouter (или createRoutesFromElements)
    if ('createBrowserRouter' in api || 'createRoutesFromElements' in api) {
      return 6;
    }

    // React Router v5 — есть useHistory
    if ('useHistory' in api) {
      return 5;
    }

    // React Router v4 — есть withRouter, но нет useHistory
    if ('withRouter' in api) {
      return 4;
    }

    // React Router v7 (будет) — можно проверять по новым API
    if ('createStaticHandler' in api) {
      return 7;
    }

    return null;
  } catch {
    return null;
  }
}
