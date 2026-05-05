import { Injectable, Logger } from '@nestjs/common';
import {
  LogtoWebhookEvent,
  LogtoWebhookPayload,
  UserCreatedWebhookPayloadBASIC,
} from './_utils/types/logto-webhook.types';
import { EmailService } from '../email/email.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly emailService: EmailService) {}

  handleLogtoWebhookEvent(payload: LogtoWebhookPayload) {
    this.logger.log(`Received logto webhook event : ${payload.event}`);

    try {
      switch (payload.event) {
        case LogtoWebhookEvent.USER_CREATED:
          this.handleUserCreatedWebhook(payload);

        default:
          this.logger.log('Unhandled logto webhook event...YET');
      }
    } catch (error) {
      this.logger.log(`Error processing webhook event: ${payload.event}`, error);
    }
  }

  private async handleUserCreatedWebhook(payload: UserCreatedWebhookPayloadBASIC) {
    const user = payload.userAgent;

    await this.emailService.sendWebHookMail({
      email: payload.data.primaryEmail ?? '',
      newUserEmail: payload.data.primaryEmail ?? '',
      username: payload.data.username ?? '',
    });
  }
}
