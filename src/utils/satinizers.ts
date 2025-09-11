export function sanitizeUrl(input: string): string {
  try {
    const url = new URL(input);

    let pathname = url.pathname;

    const replacers: { regex: RegExp; replace: string }[] = [
      // UUID v4/v1/etc
      {
        regex: /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi,
        replace: ':id',
      },
      // длинные hex/id (например Mongo ObjectId или другие hash-like строки)
      { regex: /\b[0-9a-f]{12,}\b/gi, replace: ':id' },
      // числовые id
      { regex: /\b\d{6,}\b/g, replace: ':id' },
    ];

    replacers.forEach(({ regex, replace }) => {
      pathname = pathname.replace(regex, replace);
    });

    return url.origin + pathname;
  } catch {
    return input;
  }
}

export function sanitizePageUrlParams(beacon: Record<string, any>): Record<string, any> {
  if (beacon.meta?.page?.url) {
    beacon.meta.page.url = sanitizeUrl(beacon.meta.page.url);
  }

  return beacon;
}

export function sanitizeEventUrlParams(beacon: Record<string, any>): Record<string, any> {
  if (beacon.type === 'event') {
    if (beacon.payload?.name === 'faro.performance.resource' && beacon.payload.attributes?.name) {
      beacon.payload.attributes.name = sanitizeUrl(beacon.payload?.attributes.name);
    }
  }

  return beacon;
}
