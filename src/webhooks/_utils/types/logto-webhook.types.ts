import { LogtoRequests } from '../../../logto/logto.requests';
import { LogtoUser } from '../../../logto/_utils/types/responses/responses.type';

export enum LogtoWebhookEvent {
  USER_CREATED = 'User.Created',
  USER_UPDATED = 'User.Updated',
  USER_DELETED = 'User.Deleted',
}

export interface UserCreatedWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.USER_CREATED;
  data: LogtoUser;
}

export interface UserUpdatedWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.USER_UPDATED;
  data: LogtoUser;
}

export interface UserDeletedWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.USER_DELETED;
  data: LogtoUser;
}

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
