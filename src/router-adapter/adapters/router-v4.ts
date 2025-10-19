import {
  createReactRouterV4Options,
  ReactIntegration,
  ReactRouterHistory,
} from '@grafana/faro-react';
import { Route } from 'react-router-dom';
import { ReactIntegrationSettings } from '../routerAdapter.ts';

export function initAdapterV4(history: ReactRouterHistory): ReactIntegrationSettings {
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
