import {
  createReactRouterV5Options,
  ReactIntegration,
  ReactRouterHistory,
} from '@grafana/faro-react';
import { createBrowserHistory } from 'history';
import { Route } from 'react-router-dom';
import { ReactIntegrationSettings } from '../routerAdapter.ts';

export function initAdapterV5(): ReactIntegrationSettings {
  const history = createBrowserHistory();
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
