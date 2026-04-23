import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserExceptionsTypes {
  ERROR_NOT_FOUND_USER = new NotFoundException('User not found');
  ERROR_USER_NOT_FOUND = new NotFoundException('User not found');
  ERROR_CREATE_USER_MONGO_DB = new NotFoundException('User not found');
  ERROR_UPDATE_USER_ROLE_MONGO_DB = new NotFoundException('User not found');
  ERROR_DELETE_USER_MONGO_DB = new NotFoundException('User not found');
}
