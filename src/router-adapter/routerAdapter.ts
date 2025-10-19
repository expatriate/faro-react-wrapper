import { ReactIntegration, ReactRouterHistory } from '@grafana/faro-react';
import { initAdapterV4 } from './adapters/router-v4.ts';
import { initAdapterV5 } from './adapters/router-v5.ts';
import { initAdapterV6 } from './adapters/router-v6.ts';
import { initAdapterV7 } from './adapters/router-v7.ts';

import { RouterMajorVersion } from './routerVersionDetector.ts';

export type ReactIntegrationSettings = {
  adapter: ReactIntegration;
  version: RouterMajorVersion;
  dependencies: Record<string, unknown>;
};

export function getRouterAdapter(
  version: RouterMajorVersion,
  history?: ReactRouterHistory,
  route?: any,
): ReactIntegrationSettings {
  switch (version) {
    case 4:
      if (history) return initAdapterV4(history, route);
      throw new Error(`Router adapter need history to initialize`);
    case 5:
      if (history) return initAdapterV5(history, route);
      throw new Error(`Router adapter need history to initialize`);
    case 6:
      return initAdapterV6();
    case 7:
      return initAdapterV7();
    default:
      throw new Error(`Unsupported React Router version: ${version}`);
  }
}
