import { Injectable } from '@nestjs/common';
import { LogtoRequests } from './logto.requests';
import { UserDocument } from '../users/users.schema';
import { LogtoUser } from './_utils/types/responses/responses.type';
import { UpdateUserDto } from '../users/_utils/dtos/requests/update-user-dto';
import { UpdateUserPasswordDto } from '../users/_utils/dtos/requests/update-user-password.dto';
import { LogtoExceptions } from './_utils/errors/logto-exceptions.types';
import { LogtoId } from './_utils/types/logto.types';

@Injectable()
export class LogtoService {
  constructor(
    private readonly logtoRequests: LogtoRequests,
    private readonly logtoException: LogtoExceptions,
  ) {}

  async updateAccount(dto: UpdateUserDto) {
    if (!dto.username) {
      throw this.logtoException.ERROR_USERNAME_REQUIRED;
    }
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

  async updateUserProfilePicture(userLogtoId: LogtoId, key: string) {
    await this.logtoRequests.updateUserProfilePicture(userLogtoId, key);
    return;
  }
  async updateUserRole(userLogtoId: LogtoId, roleId: [string]) {
    await this.logtoRequests.updateRoleToUser(userLogtoId, roleId);
    return;
  }

  async getRoles() {
    return await this.logtoRequests.getRoles();
  }
}
