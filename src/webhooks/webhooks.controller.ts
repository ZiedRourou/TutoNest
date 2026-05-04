import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service.js';
import * as logtoWebhookTypes from './_utils/types/logto-webhook.types.js';
import { LogtoWebhookSignatureGuard } from './_utils/guards/logto-webhook-signature.guard.js';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('logto')
  @UseGuards(LogtoWebhookSignatureGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  handleLogtoWebhook(@Body() payload: logtoWebhookTypes.LogtoWebhookPayload): Promise<void> {
    return this.webhooksService.handleLogtoWebhookEvent(payload);
  }
}
