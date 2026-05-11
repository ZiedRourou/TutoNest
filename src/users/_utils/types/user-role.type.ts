import { UserRoleAssignableEnum, UserRoleEnum } from '../enum/user-role.enum';

export type UserRoleEnumValueType = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];
export type UserRoleAssignableEnumValueType = (typeof UserRoleAssignableEnum)[keyof typeof UserRoleAssignableEnum];
