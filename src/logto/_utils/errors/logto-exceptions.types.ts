import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class LogtoExceptions {
  DEFAULT_LOGTO_ERROR = new InternalServerErrorException('Error during request to logto');
  ERROR_LOGTO_PASSWORD_VERIFY = new InternalServerErrorException('Error during request to logto for password verify');
  ERROR_UPDATE_USER_PASSWORD = new BadRequestException('Failed to update user password');
  ERROR_INVALID_USER_PASSWORD = new BadRequestException('invalid user password');
  ERROR_UPDATE_USER = new BadRequestException('Failed to update user data');
  ERROR_UPDATE_USER_ROLE = new BadRequestException('Failed to update user role');
  ERROR_UPDATE_USER_AVATAR = new BadRequestException('Failed to update user profile picture');
  ERROR_DELETE_USER = new BadRequestException('Failed to delete user');
  ERROR_USERNAME_REQUIRED = new BadRequestException('username required');
  ERROR_MISSING_WEBHOOK_SIGNATURE = new BadRequestException('Missing webhook signature');
  ERROR_INVALID_WEBHOOK_SIGNATURE = new BadRequestException('INVALID webhook signature');
  ERROR_SIGNING_KEY = new BadRequestException('Invalid signing key');
  ERROR_INVALID_PAYLOAD = new BadRequestException('Invalid Payload');
}
