import { Injectable } from '@nestjs/common';
import { LogtoRequests } from './logto.requests';
import { UserDocument } from '../users/users.schema';
import { LogtoUser } from './_utils/types/responses/responses.type';
import { UpdateUserDto } from '../users/_utils/dtos/requests/update-user-dto';
import { UpdateUserPasswordDto } from '../users/_utils/dtos/requests/update-user-password.dto';
import { LogtoExceptions } from './_utils/errors/logto-exceptions.types';

@Injectable()
export class LogtoService {
  constructor(
    private readonly logtoRequests: LogtoRequests,
    private readonly logtoException: LogtoExceptions,
  ) {}

  async updateAccount(user: UserDocument, dto: UpdateUserDto) {
    if (!dto.username) {
      throw this.logtoException.ERROR_USERNAME_REQUIRED;
    }
    await this.logtoRequests.updateUserProfile(user.userLogtoId, dto);
    return;
  }

  async updatePassword(user: LogtoUser, updateUserPasswordDto: UpdateUserPasswordDto) {
    if (user.hasPassword && updateUserPasswordDto.oldPassword) {
      const isPasswordValid = await this.logtoRequests.verifyUserPassword(user.id, updateUserPasswordDto.oldPassword);
      if (!isPasswordValid) {
        throw this.logtoException.ERROR_INVALID_USER_PASSWORD;
      }
    }

    await this.logtoRequests.updateUserPassword(user.id, updateUserPasswordDto.newPassword);
    return;
  }

  async deleteUser(user: LogtoUser) {
    await this.logtoRequests.deleteUser(user.id);
    return;
  }
}
