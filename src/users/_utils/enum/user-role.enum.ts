export const UserRoleEnum = {
  ADMIN: 'ADMIN',
  AUTHOR: 'AUTHOR',
  LECTOR: 'LECTOR',
} as const satisfies Record<string, string>;

const { ADMIN, ...assignableRoles } = UserRoleEnum;

export const UserRoleAssignableEnum = assignableRoles;
