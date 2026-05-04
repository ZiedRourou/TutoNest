import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserLogtoEmailTypes } from './_utils/types/user-logto-email.types.js';
import { EmailMapper } from './email.mapper.js';
import { EmailData } from './_utils/types/email-data.js';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly emailMapper: EmailMapper,
  ) {}

  private async sendEmail(emailData: EmailData) {
    try {
      await this.mailerService.sendMail({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
        ...(emailData.context !== undefined && { context: emailData.context }),
        ...(emailData.attachments !== undefined && { attachments: emailData.attachments }),
      });
    } catch (e) {
      this.logger.error('Failed to send email', e);
    }
  }

  async sendNewUserRegistered(dto: UserLogtoEmailTypes) {
    return this.sendEmail(this.emailMapper.mapToUserRegisteredEmail(dto));
  }

  async sendUserProfileUpdated(dto: UserLogtoEmailTypes) {
    return this.sendEmail(this.emailMapper.mapToUserProfileUpdatedEmail(dto));
  }

  async sendUserAccountDeleted(dto: { email: string; username: string }) {
    return this.sendEmail(this.emailMapper.mapToUserAccountDeletedEmail(dto));
  }
}
