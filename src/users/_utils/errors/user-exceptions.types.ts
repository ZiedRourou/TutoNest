import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserExceptionsTypes {
  ERROR_NOT_FOUND_USER = new NotFoundException('User not found');
  ERROR_CREATE_USER_MONGO_DB = new NotFoundException('Failed to create user');
  ERROR_OLD_PASSWORD_REQUIRED = new NotFoundException('error old password requires');
  ERROR_DELETE_USER_MONGO_DB = new NotFoundException('Failed to delete user');
}
