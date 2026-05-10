import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class EmailExceptionsTypes {
  ERROR_EMAIL_META_REQUIRED = new BadRequestException('No email meta found for this template');
}
