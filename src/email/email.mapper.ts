import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../_utils/config/env.config.js';
import { UserLogtoEmailTypes } from './_utils/types/user-logto-email.types.js';
import { EmailData } from './_utils/types/email-data.js';
import { EmailTemplate } from './_utils/enums/email-template.enum.js';

@Injectable()
export class EmailMapper {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  // private readonly smtpConfig: SMTPConfig = this.configService.get<SMTPConfig>('SMTP');
  mapToUserRegisteredEmail = (dto: UserLogtoEmailTypes): EmailData => ({
    from: { name: 'TutoNest Blog', address: 'this.senderEmail' },
    to: dto.email,
    subject: 'Bienvenue sur le Blog !',
    template: EmailTemplate.CONTACT,
    context: { username: dto.username, email: dto.email },
  });

  mapToUserProfileUpdatedEmail = (dto: UserLogtoEmailTypes): EmailData => ({
    from: { name: 'TutoNest Blog', address: 'this.senderEmail' },
    to: dto.email,
    subject: 'Mise à jour de votre profil',
    template: EmailTemplate.UPDATE_PROFILE,
    context: { username: dto.username },
  });

  mapToUserAccountDeletedEmail = (dto: { email: string; username: string }): EmailData => ({
    from: { name: 'TutoNest Blog', address: 'this.senderEmail' },
    to: dto.email,
    subject: 'Confirmation de suppression de compte',
    template: EmailTemplate.DELETE_ACCOUNT,
    context: { username: dto.username },
  });
}
