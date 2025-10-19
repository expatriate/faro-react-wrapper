import {
  createReactRouterV5Options,
  ReactIntegration,
  ReactRouterHistory,
} from '@grafana/faro-react';
import { Route } from 'react-router-dom';
import { ReactIntegrationSettings } from '../routerAdapter.ts';

export function initAdapterV5(history: ReactRouterHistory): ReactIntegrationSettings {
  return {
    version: 5,
    dependencies: {
      history,
      Route,
    },
    adapter: new ReactIntegration({
      router: createReactRouterV5Options({
        history,
        Route,
      }),
    }),
  };
}
