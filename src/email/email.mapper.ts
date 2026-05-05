import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables, SMTPConfig } from '../_utils/config/env.config';
import { EmailTemplate } from './_utils/enums/email-template.enum';
import { EmailData, EmailDataTest } from './_utils/types/email-data';
import { ContactEmailContext } from './templates/contexts/contact.context';
import { Injectable } from '@nestjs/common';
import { BasicMailDataDto } from './_utils/dto/basic-mail-data.dto';
import { JitUserEmail } from './_utils/types/jit-user-email.type';

@Injectable()
export class EmailMapper {
  constructor() {}

  mapToJitUserJoined = (dto: JitUserEmail): EmailData => ({
    from: { name: 'OREUS', address: 'this.smtpConfig.SMTP_SENDER' },
    to: dto.email,
    subject: 'New member join your organization',
    template: EmailTemplate.TEST,
    context: {
      username: dto.username,
      email: dto.newUserEmail,
    },
  });
}
