import {
  createReactRouterV5Options,
  ReactIntegration,
  ReactRouterHistory,
} from '@grafana/faro-react';
import { BrowserHistory } from 'history';
import { ReactIntegrationSettings } from '../routerAdapter.ts';

type GetRouterAdapterParams = {
  history: BrowserHistory;
  Route: any;
};

export function initAdapterV5(params: GetRouterAdapterParams): ReactIntegrationSettings {
  return {
    version: 5,
    dependencies: {
      history: params.history,
      Route: params.Route,
    },
    adapter: new ReactIntegration({
      router: createReactRouterV5Options({
        history: params.history as unknown as ReactRouterHistory,
        Route: params.Route,
      }),
    }),
  };
}
