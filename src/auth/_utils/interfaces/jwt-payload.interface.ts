import { UserRoleEnumValueType } from '../../../users/_utils/enum/user-role.enum';

export default interface JwtPayloadInterface {
  id: string;
  role: UserRoleEnumValueType;
  email: string;
}
