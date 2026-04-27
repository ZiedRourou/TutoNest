export const UserPermissionEnum = {
  READ_ARTICLE: 'read:article',
  WRITE_ARTICLE: 'write:article',
  SUPER_ADMIN: 'super:admin',
} as const satisfies Record<string, string>;
