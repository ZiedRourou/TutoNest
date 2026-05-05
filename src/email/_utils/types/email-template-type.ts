import { EmailTemplateEnum } from '../enums/email-template.enum';

export type EmailTemplateEnumValueType = (typeof EmailTemplateEnum)[keyof typeof EmailTemplateEnum];
