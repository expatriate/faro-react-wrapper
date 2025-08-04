import {
  Faro,
  getWebInstrumentations,
  initializeFaro,
  ReactIntegration,
  Transport,
} from '@grafana/faro-react';
import { OtlpHttpTransport } from '@grafana/faro-transport-otlp-http';
import { initRouterAdapter } from '../routerAdapter/routerAdapter.ts';

interface InitProps {
  environment: 'development' | 'staging' | 'production';
  config: {
    faroUrl: string;
    faroKey: string;
  };
  name: string;
  transports?: Transport[];
  instrumentations?: ReactIntegration[];
  isPaused?: boolean;
  version?: string;
}

let faroInstance: Faro | null = null;

export function getFaroInstance(): Faro | null {
  return faroInstance;
}

export function initFaro({
  environment,
  config: { faroKey, faroUrl },
  name,
  transports = [],
  instrumentations = [],
  isPaused,
  version,
}: InitProps) {
  const routerInstrumentation = initRouterAdapter();

  faroInstance = initializeFaro({
    paused: isPaused,

    app: {
      name,
      version,
      environment,
    },

    transports: [
      new OtlpHttpTransport({
        apiKey: faroKey,
        logsURL: faroUrl,

        otlpTransform: {
          createMeasurementLogBody(item) {
            const { payload } = item;
            const [name, value] = Object.entries(payload.values).flat();
            const result = payload.context?.result;

            return (
              `faro_signal=measurement type=${payload.type} name=${name} value=${value}` +
              (result ? ` result=${result}` : '')
            );
          },
          createErrorLogBody(item) {
            const { payload } = item;

            return `faro_signal=error type=${payload.type} message="${payload.value}"`;
          },
        },
      }),

      ...transports,
    ],

    instrumentations: [...getWebInstrumentations(), ...instrumentations, routerInstrumentation],
  });
}
