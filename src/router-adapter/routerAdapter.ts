import { ReactIntegration } from '@grafana/faro-react';
import { initAdapterV4 } from './adapters/router-v4.ts';
import { initAdapterV5 } from './adapters/router-v5.ts';
import { initAdapterV6 } from './adapters/router-v6.ts';
import { initAdapterV7 } from './adapters/router-v7.ts';

import { detectReactRouterVersion, RouterMajorVersion } from './routerVersionDetector.ts';

export type ReactIntegrationSettings = {
  adapter: ReactIntegration;
  version: RouterMajorVersion;
  dependencies: Record<string, unknown>;
};

export function getRouterAdapter(): ReactIntegrationSettings {
  const detectedRouterVersion = detectReactRouterVersion();

  switch (detectedRouterVersion) {
    case 4:
      return initAdapterV4();
    case 5:
      return initAdapterV5();
    case 6:
      return initAdapterV6();
    case 7:
      return initAdapterV7();
    default:
      throw new Error(`Unsupported React Router version: ${detectedRouterVersion}`);
  }
}
