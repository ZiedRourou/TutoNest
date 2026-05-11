import { EmailTemplateEnumValueType } from './email-template-type';
import { UserLogtoEmailTypes } from './user-logto-email.types';

export type EmailAttachment = {
  filename: string;
  path: string;
  cid?: string;
};

export type EmailMeta = {
  subject: string;
  context: (dto: UserLogtoEmailTypes) => Record<string, string>;
};

export type EmailData = {
  from: { name: string; address: string };
  to: string;
  subject: string;
  template: EmailTemplateEnumValueType;
  context?: Record<string, unknown>;
  attachments?: EmailAttachment[];
};
