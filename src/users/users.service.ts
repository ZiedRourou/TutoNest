import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';
import { AuthInfo } from '../logto/_utils/types/auth-info.types';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
  ) {}

  getUser(user: UserDocument) {
    return this.usersMapper.toGetUserDto(user);
  }

  async findOrCreateUser(userInfo: AuthInfo): Promise<UserDocument> {
    const existing = await this.usersRepository.userWithLogtoIdExist(userInfo.userLogtoId);

    if (existing) return existing;

    const newUser = await this.usersRepository.createUser(userInfo);
    if (!newUser) throw new ForbiddenException('Error creating user');

    return newUser;
  }
}
