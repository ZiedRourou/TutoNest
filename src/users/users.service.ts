import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LogtoService } from '../logto/logto.service';
import { UserExceptionsTypes } from './_utils/errors/user-exceptions.types';
import { LogtoUser } from '../logto/_utils/types/responses/responses.type';
import { UpdateAccountDto } from './_utils/dtos/requests/update-user-dto';
import { LogtoRequests } from '../logto/logto.requests';
import { MongoId } from '../_utils/types/mongo-id.type';
import { UpdateUserPasswordDto } from './_utils/dtos/requests/update-user-password.dto';
import { LogtoId } from '../logto/_utils/types/logto.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
    @Inject(forwardRef(() => LogtoService))
    private readonly logtoService: LogtoService,
    private readonly userException: UserExceptionsTypes,
    private readonly logtoRequests: LogtoRequests,
  ) {}

  getUser(user: UserDocument) {
    return this.usersMapper.toGetUserDto(user);
  }

  async findUserOrFail(userLogtoId: LogtoId) {
    return await this.usersRepository.findOneByIdOrThrow(userLogtoId);
  }

  async findOrCreateUser(logtoUser: LogtoUser) {
    const existing = await this.usersRepository.userWithLogtoIdExist(logtoUser.id);

    if (existing) {
      return existing;
    }

    return await this.usersRepository.createUser(logtoUser);
  }

  async updateUserByLogtoId(logtoId: LogtoId, updateData: UpdateAccountDto) {
    await this.usersRepository.updateByLogtoId(logtoId, updateData);
    return;
  }

  async removeUserByLogtoId(logtoId: LogtoId) {
    const result = await this.usersRepository.deleteByLogtoId(logtoId);

    if (!result) {
      throw this.userException.ERROR_NOT_FOUND_USER;
    }
  }

  async updateAccount(user: LogtoUser, dto: UpdateAccountDto) {
    await this.logtoService.updateAccount(user, dto);
  }

  async updateUserPassword(user: LogtoUser, updateUserPasswordDto: UpdateUserPasswordDto) {
    if (user.hasPassword && !updateUserPasswordDto.oldPassword) {
      throw this.userException.ERROR_OLD_PASSWORD_REQUIRED;
    }

    await this.logtoService.updatePassword(user, updateUserPasswordDto);
  }

  async deleteAccount(user: LogtoUser) {
    await this.logtoService.deleteUser(user);
  }
}
