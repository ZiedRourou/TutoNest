import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { jwtVerify } from 'jose';
import { LOGTO_JWKS_TOKEN, LOGTO_URIS_TOKEN } from 'src/_utils/constants';
import { AuthInfo } from 'src/logto/_utils/types/auth-info.types';
import { decodeLogtoPayload, LogtoPayload } from './_utils/schemas/logto-payload.types';
import { LogtoMapper } from './logto.mapper';
import type { Jwks, JwksUris } from './_utils/types/jwks-set.types';
import UsersService from '../users/users.service';
import { UserDocument } from '../users/users.schema';
import { LogtoExceptions } from './_utils/errors/logto-exceptions.types';

@Injectable()
export class LogtoAuthService {
  constructor(
    private readonly logtoMapper: LogtoMapper,
    private readonly exceptions: LogtoExceptions,

    @Inject(LOGTO_JWKS_TOKEN) private readonly jwks: Jwks,
    @Inject(LOGTO_URIS_TOKEN) private readonly logtoUris: JwksUris,
    private readonly userService: UsersService,
  ) {}

  async validateJwt(token: string): Promise<LogtoPayload> {
    const { payload } = await jwtVerify(token, this.jwks, {
      issuer: this.logtoUris.issuerUri,
    });

    return decodeLogtoPayload(payload);
  }

  async createAuthInfo(payload: LogtoPayload): Promise<AuthInfo> {
    const sub = payload.sub;
    if (!sub) throw this.exceptions.ERROR_INVALID_PAYLOAD;

    const user: UserDocument = await this.userService.findUserOrFail(payload.userLogtoId);
    return this.logtoMapper.toAuthInfo(payload, user);
  }
}
