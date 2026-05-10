import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables, SmtpConfig } from '../_utils/config/env.config.js';
import { UserLogtoEmailTypes } from './_utils/types/user-logto-email.types.js';
import { EmailTemplateEnum } from './_utils/enums/email-template.enum';
import { EmailTemplateEnumValueType } from './_utils/types/email-template-type';
import { EmailMeta } from './_utils/types/email-data';
import { EmailExceptionsTypes } from './_utils/errors/email-exceptions.types';

@Injectable()
export class EmailMapper {
  private readonly senderEmail: string;
  private readonly senderName: string;
  private readonly emailExceptions: EmailExceptionsTypes;

  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    const smtp = configService.get<SmtpConfig>('SMTP');
    this.senderEmail = smtp.SMTP_SENDER_EMAIL;
    this.senderName = smtp.SMTP_SENDER_NAME;
  }

  toUserRegisteredEmail(emailDto: UserLogtoEmailTypes) {
    return this.buildEmail(EmailTemplateEnum.WELCOME, emailDto);
  }

  toUserProfileUpdatedEmail(emailDto: UserLogtoEmailTypes) {
    return this.buildEmail(EmailTemplateEnum.UPDATE_PROFILE, emailDto);
  }

  toUserAccountDeletedEmail(emailDto: UserLogtoEmailTypes) {
    return this.buildEmail(EmailTemplateEnum.DELETE_ACCOUNT, emailDto);
  }

  private buildEmail(template: EmailTemplateEnumValueType, dto: UserLogtoEmailTypes) {
    const emailConfig = this.emailMetaMap.get(template);
    if (!emailConfig) throw this.emailExceptions.ERROR_EMAIL_META_REQUIRED;

    return {
      from: { name: this.senderName, address: this.senderEmail },
      to: dto.email,
      subject: emailConfig.subject,
      template,
      context: emailConfig.context(dto),
    };
  }

  //c'est mieux de faire map ou record ici?
  private readonly emailMetaMap = new Map<EmailTemplateEnumValueType, EmailMeta>([
    [
      EmailTemplateEnum.WELCOME,
      {
        subject: 'Bienvenue sur le Blog !',
        context: dto => ({ username: dto.username, email: dto.email }),
      },
    ],
    [
      EmailTemplateEnum.UPDATE_PROFILE,
      {
        subject: 'Mise à jour de votre profil',
        context: dto => ({ username: dto.username }),
      },
    ],
    [
      EmailTemplateEnum.DELETE_ACCOUNT,
      {
        subject: 'Confirmation de suppression de compte',
        context: dto => ({ username: dto.username }),
      },
    ],
  ]);
}
