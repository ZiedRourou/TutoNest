import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../_utils/config/env.config.js';
import { UserLogtoEmailTypes } from './_utils/types/user-logto-email.types.js';
import { EmailData } from './_utils/types/email-data.js';
import { EmailTemplateEnum } from './_utils/enums/email-template.enum';

@Injectable()
export class EmailMapper {
  private readonly senderEmail: string;
  private readonly senderName: string;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    const smtp = configService.get('SMTP');
    this.senderEmail = smtp.SMTP_SENDER_EMAIL;
    this.senderName = smtp.SMTP_SENDER_NAME;
  }

  toUserRegisteredEmail = (dto: UserLogtoEmailTypes): EmailData => ({
    from: { name: this.senderName, address: this.senderEmail },
    to: dto.email,
    subject: 'Bienvenue sur le Blog !',
    template: EmailTemplateEnum.WELCOME,
    context: { username: dto.username, email: dto.email },
  });

  toUserProfileUpdatedEmail = (dto: UserLogtoEmailTypes): EmailData => ({
    from: { name: this.senderName, address: this.senderEmail },
    to: dto.email,
    subject: 'Mise à jour de votre profil',
    template: EmailTemplateEnum.UPDATE_PROFILE,
    context: { username: dto.username },
  });

  toUserAccountDeletedEmail = (dto: { email: string; username: string }): EmailData => ({
    from: { name: this.senderName, address: this.senderEmail },
    to: dto.email,
    subject: 'Confirmation de suppression de compte',
    template: EmailTemplateEnum.DELETE_ACCOUNT,
    context: { username: dto.username },
  });
}
