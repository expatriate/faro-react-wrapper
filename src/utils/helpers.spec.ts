import { sanitizeUrl } from './helpers.ts';

describe('sanitizeUrl', () => {
  test('masks accessToken query parameter and preserves other params', () => {
    const input = 'https://example.com/path?accessToken=abc123&foo=bar';
    const result = sanitizeUrl(input);
    const parsed = new URL(result);

    expect(parsed.searchParams.get('accessToken')).toBe('***');
    expect(parsed.searchParams.get('foo')).toBe('bar');
  });

  test('masks refreshToken query parameter', () => {
    const input = 'https://example.com/path?refreshToken=ref456';
    const result = sanitizeUrl(input);
    const parsed = new URL(result);

    expect(parsed.searchParams.get('refreshToken')).toBe('***');
  });

  test('masks both accessToken and refreshToken when present', () => {
    const input = 'https://example.com/path?accessToken=a&refreshToken=b&x=1';
    const result = sanitizeUrl(input);
    const parsed = new URL(result);

    expect(parsed.searchParams.get('accessToken')).toBe('***');
    expect(parsed.searchParams.get('refreshToken')).toBe('***');
    expect(parsed.searchParams.get('x')).toBe('1');
  });

  test('returns original string for invalid URLs', () => {
    const input = 'not-a-valid-url?accessToken=123';
    const result = sanitizeUrl(input);

    expect(result).toBe(input);
  });

  test('preserves fragment/hash and other params while masking sensitive ones', () => {
    const input = 'https://example.com/path?foo=bar&accessToken=tok#section';
    const result = sanitizeUrl(input);
    const parsed = new URL(result);

    expect(parsed.hash).toBe('#section');
    expect(parsed.searchParams.get('accessToken')).toBe('***');
    expect(parsed.searchParams.get('foo')).toBe('bar');
  });
});
