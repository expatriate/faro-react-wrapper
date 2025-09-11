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
import { sanitizeEventUrlParams, sanitizePageUrlParams } from '../utils/satinizers.ts';

interface FaroConfig {
  faroUrl: string;
  faroKey: string;
}

type Sanitizer = (beacon: Record<string, any>) => Record<string, any>;

export class FaroService {
  private instance: Faro | null = null;
  private sanitizers = [sanitizePageUrlParams, sanitizeEventUrlParams];

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
        if (!this.sanitizers?.length) return beforeSend?.(beacon) ?? beacon;

        let beaconData: any = { ...beacon };

        this.sanitizers?.forEach((el) => {
          beaconData = { ...el(beaconData) };
        });

        return beforeSend?.(beaconData) ?? beaconData;
      },

      ...rest,
    });

    this._isInitialized = true;

    return this.instance;
  }

  addSanitizer(sanitizer: Sanitizer | Sanitizer[]) {
    const newSanitizers = Array.isArray(sanitizer) ? sanitizer : [sanitizer];
    this.sanitizers = [...this.sanitizers, ...newSanitizers];
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
      this.sanitizers = [];
    }
  }
}
