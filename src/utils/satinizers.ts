export function sanitizeUrl(input: string): string {
  try {
    const url = new URL(input);

    let pathname = url.pathname;

    const replacers: { regex: RegExp; replace: string }[] = [
      // UUID
      {
        regex: /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi,
        replace: ':id',
      },
      // длинные hex/id (например Mongo ObjectId или другие hash-like строки)
      { regex: /\b[0-9a-f]{12,}\b/gi, replace: ':id' },
      // числовые id
      { regex: /\b\d{6,}\b/g, replace: ':id' },
      {
        regex: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[a-z0-9]+\b/g,
        replace: ':id',
      },
    ];

    replacers.forEach(({ regex, replace }) => {
      pathname = pathname.toLowerCase().replace(regex, replace);
    });

    return url.host + pathname;
  } catch {
    return input;
  }
}

export function sanitizePageUrlParams(beacon: Record<string, any>): Record<string, any> {
  if (!beacon.meta?.page?.url) return { ...beacon };

  return {
    ...beacon,
    meta: {
      ...beacon.meta,
      page: {
        ...beacon.meta.page,
        url: sanitizeUrl(beacon.meta.page.url),
      },
    },
  };
}

export function sanitizeEventUrlParams(beacon: Record<string, any>): Record<string, any> {
  if (beacon.type !== 'event') return { ...beacon };
  if (beacon.payload?.name !== 'faro.performance.resource') return { ...beacon };
  if (!beacon.payload.attributes?.name) return { ...beacon };

  return {
    ...beacon,
    payload: {
      ...beacon.payload,
      attributes: {
        ...beacon.payload.attributes,
        name: sanitizeUrl(beacon.payload.attributes.name),
      },
    },
  };
}

export function sanitizeContextLabelsValues(beacon: Record<string, any>): Record<string, any> {
  if (beacon.type !== 'measurement') return { ...beacon };
  if (beacon.payload?.type !== 'custom') return { ...beacon };
  if (!beacon.payload.context?.['measurement.labels']) return { ...beacon };

  try {
    const labels = JSON.parse(beacon.payload.context['measurement.labels']);
    return {
      ...beacon,
      payload: {
        ...beacon.payload,
        context: {
          ...beacon.payload.context,
          'measurement.labels': labels,
        },
      },
    };
  } catch {
    return { ...beacon };
  }
}
