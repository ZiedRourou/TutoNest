import { IncomingHttpHeaders } from 'http';
import { BEARER_PREFIX } from '../../../_utils/constants';
import { AuthorizationError } from '../errors/authorization-error.types';

export function extractBearerTokenFromHeaders({ authorization }: IncomingHttpHeaders) {
  if (!authorization) {
    throw new AuthorizationError('Authorization header is missing', 401);
  }

  if (!authorization.startsWith(BEARER_PREFIX)) {
    throw new AuthorizationError(`Authorization header must start with "${BEARER_PREFIX}"`, 401);
  }

  return authorization.slice(BEARER_PREFIX.length);
}
