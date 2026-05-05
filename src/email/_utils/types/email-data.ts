import { EmailTemplateEnumValueType } from './email-template-type';

export type EmailAttachment = {
  filename: string;
  path: string;
  cid?: string;
};

export type EmailData = {
  from: { name: string; address: string };
  to: string;
  subject: string;
  template: EmailTemplateEnumValueType;
  context?: Record<string, unknown>;
  attachments?: EmailAttachment[];
};
