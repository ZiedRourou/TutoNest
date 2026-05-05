import { Body, Controller, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import type { LogtoWebhookPayload } from './_utils/types/logto-webhook.types';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('logto')
  handleLogtoWebhook(@Body() payload: LogtoWebhookPayload) {
    return this.webhooksService.handleLogtoWebhookEvent(payload);
  }
}
