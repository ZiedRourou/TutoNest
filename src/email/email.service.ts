import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailMapper } from './email.mapper';
import { EmailData } from './_utils/types/email-data';
import { EmailTemplate } from './_utils/enums/email-template.enum';
import { JitUserEmail } from './_utils/types/jit-user-email.type';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly emailMapper: EmailMapper,
    private readonly mailerService: MailerService,
  ) {}

  private async sendEmail(emailData: EmailData) {
    try {
      await this.mailerService.sendMail({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
        context: emailData.context,
        attachments: emailData.attachments,
      });
    } catch (e) {
      this.logger.error('Failed to send email', e);
    }
  }

  sendTestMail() {
    const context = {
      from: { name: 'test', address: 'senderAddres@gmail.com' },
      to: 'receiverAddress@gmail.com',
      subject: 'Random subject',
      template: EmailTemplate.TEST,
      context: {
        name: 'test',
        email: 'testEmailInteracted@jesaispas.com',
        messageContent: 'Vous avez recu un mail',
      },
    };

    // const emailData = this.emailMapper.mapToContactEmail(context);
    return this.sendEmail(context);
    // return this.sendEmail();
  }

  async sendWebHookMail(dto: JitUserEmail) {
    const mail: EmailData = this.emailMapper.mapToJitUserJoined(dto);
    this.sendEmail(mail);
  }
}
