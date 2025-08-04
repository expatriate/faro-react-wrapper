import { ReactIntegration } from '@grafana/faro-react';
import { initAdapter4 } from './adapters/router-v4.ts';
import { initAdapter5 } from './adapters/router-v5.ts';
import { initAdapter6 } from './adapters/router-v6.ts';
import { initAdapter7 } from './adapters/router-v7.ts';

import { detectReactRouterVersion, RouterMajorVersion } from './routerVersionDetector.ts';

let detectedRouterVersion: RouterMajorVersion = null;

export function initRouterAdapter(): ReactIntegration {
  detectedRouterVersion = detectReactRouterVersion();

  switch (detectedRouterVersion) {
    case 4:
      return initAdapter4();
    case 5:
      return initAdapter5();
    case 6:
      return initAdapter6();
    case 7:
      return initAdapter7();
    default:
      throw new Error('Cannot detect React Router version');
  }
}
