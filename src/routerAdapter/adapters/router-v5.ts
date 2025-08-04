import {
  createReactRouterV4Options,
  ReactIntegration,
  ReactRouterHistory,
} from '@grafana/faro-react';
import { createBrowserHistory } from 'history';
import { Route } from 'react-router-dom';

export function initAdapter5() {
  const history = createBrowserHistory();
  return new ReactIntegration({
    router: createReactRouterV4Options({
      history: history as unknown as ReactRouterHistory,
      Route,
    }),
  });
}
