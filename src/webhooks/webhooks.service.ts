import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service.js';
import UsersService from '../users/users.service.js';
import {
  type LogtoWebhookPayload,
  type UserCreatedWebhookPayload,
  type UserUpdatedWebhookPayload,
  type UserDeletedWebhookPayload,
} from './_utils/types/logto-webhook.types.js';
import { LogtoWebhookEventEnum } from './_utils/enum/logto-webhook-event-enum';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  async handleLogtoWebhookEvent(payload: LogtoWebhookPayload): Promise<void> {
    this.logger.log(`event logto: ${payload.event}`);

    try {
      switch (payload.event) {
        case LogtoWebhookEventEnum.USER_CREATED:
          await this.handleUserCreated(payload);
          break;

        case LogtoWebhookEventEnum.USER_UPDATED:
          await this.handleUserUpdated(payload);
          break;

        case LogtoWebhookEventEnum.USER_DELETED:
          await this.handleUserDeleted(payload);
          break;

        default:
          this.logger.log(`error switch case event webhook Logto: ${payload}`);
      }
    } catch (error) {
      this.logger.error(`error catch webhook ${payload.event}`);
      throw error;
    }
  }

  private async handleUserCreated(payload: UserCreatedWebhookPayload) {
    const { data } = payload;
    const username = data.username ?? 'Nouvel utilisateur';

    await this.usersService.findOrCreateUser({ ...data, username });

    if (data.primaryEmail) {
      await this.emailService.sendNewUserRegistered({
        email: data.primaryEmail,
        username,
      });
    }
  }

  private async handleUserUpdated(payload: UserUpdatedWebhookPayload) {
    const { data } = payload;

    if (!data.primaryEmail || !data.username) {
      this.logger.warn(`email or username not found webhook event update `);
      return;
    }

    const username = data.username;
    const email = data.primaryEmail;

    await this.usersService.updateUserByLogtoId(data.id, {
      email,
      username,
    });

    if (email) {
      await this.emailService.sendUserProfileUpdated({ email, username });
    }
  }

  private async handleUserDeleted(payload: UserDeletedWebhookPayload) {
    const { data } = payload;

    await this.usersService.removeUserByLogtoId(data.id);

    if (data.primaryEmail) {
      await this.emailService.sendUserAccountDeleted({
        email: data.primaryEmail,
        username: data.username ?? 'Utilisateur',
      });
    }
  }
}
