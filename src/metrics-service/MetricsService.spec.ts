import { constructMetricContext } from './helpers/constructMetricContext.ts';
import { MetricsService } from './MetricsService.ts';

jest.mock('./helpers/constructMetricContext.ts', () => ({
  constructMetricContext: jest.fn(() => ({ mocked: 'context' })),
}));

describe('MetricsService', () => {
  let pushMeasurement: jest.Mock;
  let fakeFaroService: any;
  let service: MetricsService;

  beforeEach(() => {
    pushMeasurement = jest.fn();
    const instance = { api: { pushMeasurement } };
    fakeFaroService = { getInstance: jest.fn(() => instance) };
    service = new MetricsService(fakeFaroService);
    jest.clearAllMocks();
  });

  test('sends custom metric with numeric value and context', () => {
    service.sendCustomMetric({ name: 'metric_one', value: 42, extra: 'x' } as any);

    expect(pushMeasurement).toHaveBeenCalledTimes(1);
    expect(pushMeasurement).toHaveBeenCalledWith(
      { type: 'custom', values: { metric_one: 42 } },
      { context: { mocked: 'context' } },
    );

    expect(constructMetricContext).toHaveBeenCalledWith({ extra: 'x' });
  });

  test('converts non-numeric value to 0', () => {
    service.sendCustomMetric({ name: 'm', value: 'not-a-number' } as any);

    expect(pushMeasurement).toHaveBeenCalledWith(
      { type: 'custom', values: { m: 0 } },
      { context: { mocked: 'context' } },
    );
  });

  test('catches errors from pushMeasurement and warns', () => {
    pushMeasurement.mockImplementation(() => {
      throw new Error('boom');
    });
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => service.sendCustomMetric({ name: 'm', value: 1 } as any)).not.toThrow();

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
