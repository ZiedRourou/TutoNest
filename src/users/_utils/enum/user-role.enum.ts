export const UserRoleEnum = {
  ADMIN: 'ADMIN',
  AUTHOR: 'AUTHOR',
  LECTOR: 'LECTOR',
} as const satisfies Record<string, string>;

export const UserRoleAssignableEnum = {
  AUTHOR: 'AUTHOR',
  LECTOR: 'LECTOR',
} as const satisfies Record<string, string>;
