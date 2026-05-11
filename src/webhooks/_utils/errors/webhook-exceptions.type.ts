import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class WebhookExceptionsType {
  ERROR_MISSING_WEBHOOK_SIGNATURE = new BadRequestException('Missing webhook signature');
  ERROR_INVALID_WEBHOOK_SIGNATURE = new BadRequestException('INVALID webhook signature');
  ERROR_SIGNING_KEY = new BadRequestException('Invalid signing key');
}
