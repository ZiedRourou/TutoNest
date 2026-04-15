import { UserRoleEnumValueType } from '../../../users/_utils/types/user-role.type';

export default interface JwtPayloadInterface {
  id: string;
  role: UserRoleEnumValueType;
  email: string;
}
