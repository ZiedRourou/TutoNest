import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { jwtVerify } from 'jose';
import { LOGTO_JWKS_TOKEN, LOGTO_URIS_TOKEN } from 'src/_utils/constants';
import { AuthInfo } from 'src/logto/_utils/types/auth-info.types';

import { LogtoRequests } from './logto.requests';
import { decodeLogtoPayload, LogtoPayload } from './_utils/schemas/logto-payload.types';
import { LogtoMapper } from './logto.mapper';
import type { Jwks, JwksUris } from './_utils/types/jwks-set.types';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/users.schema';
import { NewUserRoleDto } from '../users/_utils/dtos/requests/new-user-role.dto';
import { MongoId } from '../_utils/types/mongo-id.type';

@Injectable()
export class LogtoService {
  constructor(
    private readonly logtoRequests: LogtoRequests,
    private readonly logtoMapper: LogtoMapper,
    //provider injecté car ici type pas classe
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
    if (!sub) throw new BadRequestException('Invalid Payload');

    const user: UserDocument = await this.userService.findUserOrFail(payload.userLogtoId);
    return this.logtoMapper.toAuthInfo(payload, user);
  }
  async createNewUserAuthInfo(payload: LogtoPayload): Promise<AuthInfo> {
    const sub = payload.sub;
    if (!sub) throw new BadRequestException('Invalid Payload');

    return this.logtoMapper.toAuthInfo(payload);
  }

  async updateUserRole(userLogtoId: MongoId<string>, newRole: NewUserRoleDto) {
    return this.logtoRequests.updateUserRole(userLogtoId, newRole);
  }
  async deleteUser(userLogtoId: MongoId<string>) {
    return this.logtoRequests.deleteUser(userLogtoId);
  }
}
