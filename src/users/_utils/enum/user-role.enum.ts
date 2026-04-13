export const UserRoleEnum = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;
export type UserRoleType = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];
