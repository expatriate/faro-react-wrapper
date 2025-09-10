import {
  createReactRouterV4Options,
  ReactIntegration,
  ReactRouterHistory,
} from '@grafana/faro-react';
import { createBrowserHistory } from 'history';
import { Route } from 'react-router-dom';
import { ReactIntegrationSettings } from '../routerAdapter.ts';

export function initAdapterV4(): ReactIntegrationSettings {
  const history = createBrowserHistory();
  return {
    version: 4,
    dependencies: {
      history,
      Route,
    },
    adapter: new ReactIntegration({
      router: createReactRouterV4Options({
        history: history as unknown as ReactRouterHistory,
        Route,
      }),
    }),
  };
}
