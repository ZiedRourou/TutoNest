import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserExceptionsTypes {
  ERROR_NOT_FOUND_USER = new BadRequestException('User not found');
  ERROR_CREATE_USER_MONGO_DB = new BadRequestException('Failed to create user');
  ERROR_OLD_PASSWORD_REQUIRED = new BadRequestException('error old password requires');
}
