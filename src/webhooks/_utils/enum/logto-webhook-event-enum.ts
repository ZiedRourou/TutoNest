export const LogtoWebhookEventEnum = {
  USER_CREATED: 'User.Created',
  USER_UPDATED: 'User.Updated',
  USER_DELETED: 'User.Deleted',
} as const satisfies Record<string, string>;
