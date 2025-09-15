export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);

    const sensitiveParams = ['accessToken', 'refreshToken'];
    sensitiveParams.forEach((param) => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, '***');
      }
    });

    return urlObj.toString();
  } catch {
    return url;
  }
}

export function safeNumberConversion(value: unknown): number {
  const num = Number(value);
  if (isNaN(num)) {
    return 0;
  }
  return num;
}
