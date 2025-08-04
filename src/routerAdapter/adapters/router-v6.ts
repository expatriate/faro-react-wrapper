import { createReactRouterV6Options, ReactIntegration } from '@grafana/faro-react';
import {
  createRoutesFromChildren,
  matchRoutes,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

export function initAdapter6() {
  return new ReactIntegration({
    router: createReactRouterV6Options({
      createRoutesFromChildren,
      matchRoutes,
      Routes,
      useLocation,
      useNavigationType,
    }),
  });
}
