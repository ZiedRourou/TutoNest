import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';
import { AuthInfo } from '../logto/_utils/types/auth-info.types';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NewUserRoleDto } from './_utils/dtos/requests/new-user-role.dto';
import { LogtoService } from '../logto/logto.service';
import { UserExceptionsTypes } from './_utils/errors/user-exceptions.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
    @Inject(forwardRef(() => LogtoService))
    private readonly logtoService: LogtoService,
    private readonly userException: UserExceptionsTypes,
  ) {}

  getUser(user: UserDocument) {
    return this.usersMapper.toGetUserDto(user);
  }

  async findUserOrFail(userLogtoId: string) {
    return await this.usersRepository.findOneByIdOrThrow(userLogtoId);
  }

  async findOrCreateUser(userInfo: AuthInfo): Promise<UserDocument> {
    const existing = await this.usersRepository.userWithLogtoIdExist(userInfo.userLogtoId);

    if (existing) return existing;

    const newUser = await this.usersRepository.createUser(userInfo);
    if (!newUser) throw this.userException.ERROR_CREATE_USER_MONGO_DB;

    return newUser;
  }

  async updateUserRole(user: UserDocument, newRole: NewUserRoleDto) {
    await Promise.all([
      this.usersRepository.updateUserRole(user._id, newRole),
      this.logtoService.updateUserRole(user.userLogtoId, newRole),
    ]);
  }

  async deleteUser(user: UserDocument) {
    await Promise.all([this.usersRepository.deleteUser(user._id), this.logtoService.deleteUser(user.userLogtoId)]);
  }
}
