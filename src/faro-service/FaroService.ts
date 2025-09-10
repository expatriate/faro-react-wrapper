import {
  BrowserConfig,
  Faro,
  getWebInstrumentations,
  initializeFaro,
  MeasurementEvent,
  ReactIntegration,
  TransportItem,
} from '@grafana/faro-react';
import { OtlpHttpTransport } from '@grafana/faro-transport-otlp-http';
import { sanitizeUrl } from '../utils/helpers.ts';

interface FaroConfig {
  faroUrl: string;
  faroKey: string;
}

export class FaroService {
  private instance: Faro | null = null;
  private _isInitialized = false;

  init({
    faroKey,
    faroUrl,
    transports = [],
    instrumentations = [],
    beforeSend,
    routerAdapter,
    ...rest
  }: FaroConfig & BrowserConfig & { routerAdapter?: ReactIntegration }): Faro {
    if (this._isInitialized) {
      console.warn('[Faro-react-wrapper] FaroService already initialized');
      return this.instance!;
    }

    this.instance = initializeFaro({
      transports: [
        new OtlpHttpTransport({
          apiKey: faroKey,
          logsURL: faroUrl,
          otlpTransform: this.createOtlpTransforms(),
        }),
        ...transports,
      ],

      instrumentations: [
        ...getWebInstrumentations(),
        ...(routerAdapter ? [routerAdapter] : []),
        ...instrumentations,
      ],

      beforeSend: (beacon) => {
        if (beacon.meta?.page?.url) {
          beacon.meta.page.url = sanitizeUrl(beacon.meta.page.url);
        }

        return beforeSend?.(beacon) ?? beacon;
      },

      ...rest,
    });

    this._isInitialized = true;

    return this.instance;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  getInstance(): Faro {
    if (!this.instance) {
      throw new Error('Faro not initialized. Call init() first.');
    }
    return this.instance;
  }

  private createOtlpTransforms(): {
    createErrorLogBody?: ((item: TransportItem<unknown>) => string) | undefined;
    createMeasurementLogBody?: (item: TransportItem<MeasurementEvent>) => string;
  } {
    return {
      createMeasurementLogBody(item) {
        const { payload } = item;
        const [name, value] = Object.entries(payload.values).flat();
        const result = payload.context?.result;

        return (
          `faro_signal=measurement type=${payload.type} name=${name} value=${value}` +
          (result ? ` result=${result}` : '')
        );
      },
      createErrorLogBody(item: any) {
        const { payload } = item;
        return `faro_signal=error type=${payload.type} message="${payload.value}"`;
      },
    };
  }

  destroy() {
    if (this.instance) {
      this.instance = null;
      this._isInitialized = false;
    }
  }
}
