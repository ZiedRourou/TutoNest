import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class LogtoExceptions {
  DEFAULT_LOGTO_ERROR = new InternalServerErrorException('Error during request to logto');
  ERROR_UPDATE_USER_PASSWORD = new BadRequestException('Failed to update user password');
  ERROR_UPDATE_USER = new BadRequestException('Failed to update user data');
  ERROR_DELETE_USER = new BadRequestException('Failed to delete user');
}
