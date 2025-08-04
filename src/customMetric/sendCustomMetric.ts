import { getFaroInstance } from '../lib/init.ts';
import { CustomMetricBase } from './types.ts';

function constructMetricContext({
  description,
  unit,
  status,
  result,
  type,
  buckets,
}: Omit<CustomMetricBase, 'timestamp' | 'name'>): Record<string, string> {
  const context: Record<string, string> = {
    'measurement.description': description,
    'measurement.unit': unit,
    'measurement.metric.type': type,
  };

  if (status) {
    context['measurement.status'] = status;
  }

  if (result) {
    context['measurement.result'] = result;
  }

  if (buckets) {
    context['measurement.buckets'] = buckets;
  }

  return context;
}

export function sendCustomMetric({ name, timestamp, ...rest }: CustomMetricBase) {
  const faroInstance = getFaroInstance();

  const context = constructMetricContext(rest);

  if (faroInstance) {
    faroInstance.api.pushMeasurement(
      {
        type: 'internal_framework_measurements',
        values: {
          [name]: timestamp,
        },
      },
      {
        context,
      },
    );
  } else {
    throw new Error("[Faro-react-wrapper] Can't find a grafana faro instance ");
  }
}
