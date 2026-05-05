import { EmailTemplate } from '../enums/email-template.enum';

export interface EmailAttachment {
  filename: string;
  path: string;
  cid?: string;
}

export interface EmailData {
  from: { name: string; address: string };
  to: string;
  subject: string;
  template: EmailTemplate;
  context?: Record<string, any>;
  attachments?: EmailAttachment[];
}

export interface EmailDataTest {
  from: { name: string; address: string };
  to: string;
  subject: string;
  template: EmailTemplate;
  context: Record<string, any>;
  attachments?: EmailAttachment[];
}
