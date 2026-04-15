import { UserRoleEnum } from '../enum/user-role.enum';

export type UserRoleEnumValueType = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];
