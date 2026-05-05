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
import { LogtoUser } from './_utils/types/responses/responses.type';
import { UpdateAccountDto } from '../users/_utils/dtos/requests/update-user-dto';
import { UpdateUserPasswordDto } from '../users/_utils/dtos/requests/update-user-password.dto';

@Injectable()
export class LogtoService {
  constructor(
    private readonly logtoRequests: LogtoRequests,
    private readonly logtoMapper: LogtoMapper,
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

  async updateAccount(user: LogtoUser, dto: UpdateAccountDto) {
    if (!dto.username) {
      throw new BadRequestException('Username is required');
    }
    await this.logtoRequests.updateUserProfile(user.id, dto);
  }

  async updatePassword(user: LogtoUser, updateUserPasswordDto: UpdateUserPasswordDto) {
    if (user.hasPassword && updateUserPasswordDto.oldPassword) {
      const isPasswordValid = await this.logtoRequests.verifyUserPassword(user.id, updateUserPasswordDto.oldPassword);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid old password');
      }
    }

    return this.logtoRequests.updateUserPassword(user.id, updateUserPasswordDto.newPassword);
  }

  async deleteUser(user: LogtoUser) {
    return this.logtoRequests.deleteUser(user.id);
  }
}
