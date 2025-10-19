import {
  createReactRouterV4Options,
  ReactIntegration,
  ReactRouterHistory,
} from '@grafana/faro-react';
import { ReactIntegrationSettings } from '../routerAdapter.ts';

export function initAdapterV4(history: ReactRouterHistory, Route: any): ReactIntegrationSettings {
  return {
    version: 4,
    dependencies: {
      history,
      Route,
    },
    adapter: new ReactIntegration({
      router: createReactRouterV4Options({
        history,
        Route,
      }),
    }),
  };
}
