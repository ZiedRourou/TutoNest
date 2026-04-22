import { IncomingHttpHeaders } from 'node:http';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { jwtVerify } from 'jose';
import { LOGTO_JWKS_TOKEN, LOGTO_URIS_TOKEN } from 'src/_utils/constants';
import { AuthInfo } from 'src/logto/_utils/types/auth-info.types';
import { LogtoUser } from 'src/logto/_utils/types/responses/responses.type';

import { LogtoRequests } from './logto.requests';
import { AuthorizationError } from './_utils/middlewares/auth-middleware';
import { decodeLogtoPayload, LogtoPayload } from './_utils/schemas/logto-payload.types';
import { extractBearerToken } from './_utils/functions/extract-bearer-token.function';
import { LogtoMapper } from './logto.mapper';
import type { Jwks, JwksUris } from './_utils/types/jwks-set.types';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/users.schema';
import { Types } from 'mongoose';
import { AuthorId } from '../users/_utils/types/author.type';

@Injectable()
export class LogtoService {
  constructor(
    private readonly logtoRequests: LogtoRequests,
    private readonly logtoMapper: LogtoMapper,
    @Inject(LOGTO_JWKS_TOKEN) private readonly jwks: Jwks,
    @Inject(LOGTO_URIS_TOKEN) private readonly logtoUris: JwksUris,
    private readonly userService: UsersService,
  ) {}

  getUserInformations = (id: string) => this.logtoRequests.fetchUserInformations(id);

  searchUsersByIdIn = (ids: string[]): Promise<LogtoUser[]> => {
    const searchParams: Record<string, string> = {
      'search.id': ids.join(','),
      'mode.id': 'exact',
    };
    return this.logtoRequests.getUsers(searchParams);
  };

  extractBearerTokenFromHeaders({ authorization }: IncomingHttpHeaders): string {
    const token = extractBearerToken(authorization);

    if (!token) {
      throw new AuthorizationError('Authorization header is missing or invalid', 401);
    }
    return token;
  }

  async validateJwt(token: string): Promise<LogtoPayload> {
    const { payload } = await jwtVerify(token, this.jwks, {
      issuer: this.logtoUris.issuerUri,
    });

    return decodeLogtoPayload(payload);
  }

  async createAuthInfo(payload: LogtoPayload): Promise<AuthInfo> {
    const sub = payload.sub;
    if (!sub) throw new BadRequestException('Invalid Payload');

    const user: UserDocument = await this.userService.findUserOrFail(payload.userLogtoId);
    return this.logtoMapper.toAuthInfo(payload, user);
  }
}
