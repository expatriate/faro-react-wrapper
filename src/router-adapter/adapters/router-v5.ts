import {
  createReactRouterV5Options,
  ReactIntegration,
  ReactRouterHistory,
} from '@grafana/faro-react';
import { ReactIntegrationSettings } from '../routerAdapter.ts';

export function initAdapterV5(history: ReactRouterHistory, Route: any): ReactIntegrationSettings {
  return {
    version: 5,
    dependencies: {
      history,
      Route,
    },
    adapter: new ReactIntegration({
      router: createReactRouterV5Options({
        history: history as unknown as ReactRouterHistory,
        Route,
      }),
    }),
  };
}
