import { LogtoUser } from 'src/logto/_utils/types/responses/responses.type'

export enum LogtoWebhookEvent {
  POST_REGISTER = 'PostRegister',
  POST_SIGN_IN = 'PostSignIn',
  POST_RESET_PASSWORD = 'PostResetPassword',
  USER_CREATED = 'User.Created',
  USER_UPDATED = 'User.Data.Updated',
  USER_DELETED = 'User.Deleted',
  ORGANIZATION_CREATED = 'Organization.Created',
  ORGANIZATION_UPDATED = 'Organization.Data.Updated',
  ORGANIZATION_DELETED = 'Organization.Deleted',
  ORGANIZATION_MEMBERSHIP_UPDATED = 'Organization.Membership.Updated',
}

/**
 * Base webhook payload structure shared across all events
 */
interface BaseWebhookPayload {
  createdAt: string
  userAgent?: string
  ip?: string
  hookId?: string
  path?: string
  method?: string
  status?: number
  matchedRoute?: string
}

/**
 * PostRegister webhook payload
 */
export interface PostRegisterWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.POST_REGISTER
  sessionId?: string
  interactionEvent?: string
  userId?: string
  user?: LogtoUser
  applicationId?: string
}

/**
 * PostSignIn webhook payload
 */
export interface PostSignInWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.POST_SIGN_IN
  sessionId?: string
  interactionEvent?: string
  userId?: string
  user?: LogtoUser
  applicationId?: string
}

/**
 * PostResetPassword webhook payload
 */
export interface PostResetPasswordWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.POST_RESET_PASSWORD
  sessionId?: string
  interactionEvent?: string
  userId?: string
  user?: LogtoUser
}

/**
 * User.Created webhook payload
 */
export interface UserCreatedWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.USER_CREATED
  sessionId: string
  data: LogtoUser
  params?: { userId: string }
}

/**
 * User.Data.Updated webhook payload
 */
export interface UserUpdatedWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.USER_UPDATED
  data: LogtoUser
  params?: { userId: string }
}

/**
 * User.Deleted webhook payload
 */
export interface UserDeletedWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.USER_DELETED
  data: LogtoUser
  params?: { userId: string }
}

/**
 * Organization.Created webhook payload
 */
export interface OrganizationCreatedWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.ORGANIZATION_CREATED
  data: {
    id: string
    name: string
    description?: string
    customData?: Record<string, unknown>
    createdAt: number
  }
  params?: { id: string }
}

/**
 * Organization.Data.Updated webhook payload
 */
export interface OrganizationUpdatedWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.ORGANIZATION_UPDATED
  data: {
    id: string
    name: string
    description?: string
    customData?: Record<string, unknown>
    createdAt: number
  }
  params?: { id: string }
}

/**
 * Organization.Deleted webhook payload
 */
export interface OrganizationDeletedWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.ORGANIZATION_DELETED
  data: {
    id: string
    name: string
    description?: string
    customData?: Record<string, unknown>
    createdAt: number
  }
  params?: { id: string }
}

/**
 * Organization.Membership.Updated webhook payload
 */
export interface OrganizationMembershipUpdatedWebhookPayload extends BaseWebhookPayload {
  event: LogtoWebhookEvent.ORGANIZATION_MEMBERSHIP_UPDATED
  organizationId: string
  interactionEvent?: string
  applicationId?: string
  sessionId?: string
  application?: {
    id: string
    type: string
    name: string
    description: string | null
  }
  params?: {
    id: string
  }
}

/**
 * Discriminated union of all possible webhook payloads
 * TypeScript will narrow the type based on the event property
 */
export type LogtoWebhookPayload =
  | PostRegisterWebhookPayload
  | PostSignInWebhookPayload
  | PostResetPasswordWebhookPayload
  | UserCreatedWebhookPayload
  | UserUpdatedWebhookPayload
  | UserDeletedWebhookPayload
  | OrganizationCreatedWebhookPayload
  | OrganizationUpdatedWebhookPayload
  | OrganizationDeletedWebhookPayload
  | OrganizationMembershipUpdatedWebhookPayload
