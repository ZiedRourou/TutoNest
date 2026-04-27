import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersRepository } from '../../users.repository';
import { UserDocument } from '../../users.schema';
import { UserExceptionsTypes } from '../errors/user-exceptions.types';

@Injectable()
export class UserByIdPipe implements PipeTransform<string, Promise<UserDocument>> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userException: UserExceptionsTypes,
  ) {}

  transform(userId: string) {
    if (!Types.ObjectId.isValid(userId)) throw this.userException.ERROR_NOT_FOUND_USER;
    return this.usersRepository.findOneByIdOrThrow(userId);
  }
}
