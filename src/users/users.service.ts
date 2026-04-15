import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const userExist = await this.usersRepository.userWithEmailExists(createUserDto.email);

    if (userExist) {
      throw new ConflictException('Email already exists');
    }
    const newUser = await this.usersRepository.createUser(createUserDto);
    return this.usersMapper.toGetUserDto(newUser);
  }

  getUser(user: UserDocument) {
    return this.usersMapper.toGetUserDto(user);
  }
}
