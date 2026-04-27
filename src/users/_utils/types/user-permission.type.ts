import { UserPermissionEnum } from '../enum/user-permission.type';

export type UserPermissionEnumValueType = (typeof UserPermissionEnum)[keyof typeof UserPermissionEnum];
