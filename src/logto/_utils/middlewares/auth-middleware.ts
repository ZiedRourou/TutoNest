import { IncomingHttpHeaders } from 'http';

export class AuthorizationError extends Error {
  name = 'AuthorizationError';
  constructor(
    message: string,
    public status = 403,
  ) {
    super(message);
  }
}

export function extractBearerTokenFromHeaders({ authorization }: IncomingHttpHeaders): string {
  const bearerPrefix = 'Bearer ';

  if (!authorization) {
    throw new AuthorizationError('Authorization header is missing', 401);
  }

  if (!authorization.startsWith(bearerPrefix)) {
    throw new AuthorizationError(`Authorization header must start with "${bearerPrefix}"`, 401);
  }

  return authorization.slice(bearerPrefix.length);
}
