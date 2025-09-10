import { safeStringifyLabels } from '../../utils/helpers.ts';
import { CustomMetricBase, MEASUREMENT_KEYS } from '../types.ts';

export function constructMetricContext({
  description,
  unit,
  status,
  result,
  type,
  labels,
  buckets,
}: Omit<CustomMetricBase, 'timestamp' | 'name' | 'value'>): Record<string, string> {
  return {
    [MEASUREMENT_KEYS.DESCRIPTION]: description,
    [MEASUREMENT_KEYS.UNIT]: unit,
    [MEASUREMENT_KEYS.TYPE]: type,
    ...(labels && { [MEASUREMENT_KEYS.LABELS]: safeStringifyLabels(labels) }),
    ...(status && { [MEASUREMENT_KEYS.STATUS]: status }),
    ...(result && { [MEASUREMENT_KEYS.RESULT]: result }),
    ...(buckets && { [MEASUREMENT_KEYS.BUCKETS]: safeStringifyLabels(buckets) }),
  };
}
