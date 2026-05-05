export const EmailTemplateEnum = {
  WELCOME: 'welcome',
  UPDATE_PROFILE: 'update-profile',
  DELETE_ACCOUNT: 'delete-account',
} as const satisfies Record<string, string>;
