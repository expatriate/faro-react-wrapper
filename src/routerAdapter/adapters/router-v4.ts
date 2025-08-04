import {
  createReactRouterV5Options,
  ReactIntegration,
  ReactRouterHistory,
} from '@grafana/faro-react';
import { createBrowserHistory } from 'history';
import { Route } from 'react-router-dom';

export function initAdapter4() {
  const history = createBrowserHistory();
  return new ReactIntegration({
    router: createReactRouterV5Options({
      history: history as unknown as ReactRouterHistory,
      Route,
    }),
  });
}
