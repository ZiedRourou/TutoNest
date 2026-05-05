import type { LogtoUser } from 'src/logto/_utils/types/responses/responses.type';

export enum LogtoWebhookEvent {
  USER_CREATED = 'User.Created',
}

/**
 * Base webhook payload structure shared across all events
 */
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

export interface UserCreatedWebhookPayloadBASIC extends BaseWebhookPayload {
  event: LogtoWebhookEvent.USER_CREATED;
  data: LogtoUser;
}

/**
 * Discriminated union of all possible webhook payloads
 * TypeScript will narrow the type based on the event property
 */
export type LogtoWebhookPayload = UserCreatedWebhookPayloadBASIC;
