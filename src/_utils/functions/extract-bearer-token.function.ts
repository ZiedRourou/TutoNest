import { BEARER_PREFIX } from '../constants';

/**
 * Extracts the Bearer token from an Authorization header
 * @param authHeader - The Authorization header value
 * @returns The extracted token, or null if the header format is invalid
 * @example
 * extractBearerToken('Bearer abc123') // returns 'abc123'
 * extractBearerToken('abc123') // returns 'abc123'
 * extractBearerToken('') // returns null
 */
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const trimmed = authHeader.trim();

  if (trimmed.startsWith(BEARER_PREFIX)) {
    const token = trimmed.slice(BEARER_PREFIX.length).trim();
    return token || null;
  }

  return trimmed || null;
}
