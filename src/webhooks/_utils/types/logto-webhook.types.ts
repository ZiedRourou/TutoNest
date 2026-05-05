import { LogtoUser } from '../../../logto/_utils/types/responses/responses.type';
import { LogtoWebhookEventEnum } from '../enum/logto-webhook-event-enum';

export type UserCreatedWebhookPayload = BaseWebhookPayload & {
  event: typeof LogtoWebhookEventEnum.USER_CREATED;
  data: LogtoUser;
};

export type UserUpdatedWebhookPayload = BaseWebhookPayload & {
  event: typeof LogtoWebhookEventEnum.USER_UPDATED;
  data: LogtoUser;
};

export type UserDeletedWebhookPayload = BaseWebhookPayload & {
  event: typeof LogtoWebhookEventEnum.USER_DELETED;
  data: LogtoUser;
};

export type LogtoWebhookPayload = UserCreatedWebhookPayload | UserUpdatedWebhookPayload | UserDeletedWebhookPayload;

interface BaseWebhookPayload {
  createdAt: string;
  userAgent?: string;
  ip?: string;
  hookId?: string;
  path?: string;
  method?: string;
  status?: number;
  matchedRoute?: string;
}
