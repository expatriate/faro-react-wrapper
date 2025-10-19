import { ReactIntegration } from '@grafana/faro-react';
import { initAdapterV4 } from './adapters/router-v4.ts';
import { initAdapterV5 } from './adapters/router-v5.ts';
import { initAdapterV6 } from './adapters/router-v6.ts';
import { initAdapterV7 } from './adapters/router-v7.ts';

import { BrowserHistory } from 'history';
import { RouterMajorVersion } from './routerVersionDetector.ts';

export type ReactIntegrationSettings = {
  adapter: ReactIntegration;
  version: RouterMajorVersion;
  dependencies: Record<string, unknown>;
};

type GetRouterAdapterParams = {
  history: BrowserHistory;
  Route: any;
};

export function getRouterAdapter(
  version: RouterMajorVersion,
  params?: GetRouterAdapterParams,
): ReactIntegrationSettings {
  switch (version) {
    case 4:
      if (params) return initAdapterV4(params);
      throw new Error(`Router adapter needs additional params to initialize`);
    case 5:
      if (params) return initAdapterV5(params);
      throw new Error(`Router adapter needs additional params to initialize`);
    case 6:
      return initAdapterV6();
    case 7:
      return initAdapterV7();
    default:
      throw new Error(`Unsupported React Router version: ${version}`);
  }
}
