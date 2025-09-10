import { createReactRouterV6Options, ReactIntegration } from '@grafana/faro-react';
import {
  createRoutesFromChildren,
  matchRoutes,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { ReactIntegrationSettings } from '../routerAdapter.ts';

export function initAdapterV7(): ReactIntegrationSettings {
  return {
    version: 7,
    dependencies: {
      matchRoutes,
      Routes,
      useLocation,
      useNavigationType,
    },
    adapter: new ReactIntegration({
      router: createReactRouterV6Options({
        createRoutesFromChildren,
        matchRoutes,
        Routes,
        useLocation,
        useNavigationType,
      }),
    }),
  };
}
