import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class LogtoExceptions {
  DEFAULT_LOGTO_ERROR = new InternalServerErrorException('Error during request to logto');
  ERROR_FETCH_USER_INFORMATIONS = new BadRequestException('Failed to fetch user informations');
}
