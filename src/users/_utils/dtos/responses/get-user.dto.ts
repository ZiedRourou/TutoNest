import { UserRoleEnum } from '../../enum/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import type { UserRoleEnumValueType } from '../../types/user-role.type';
import type { MongoId } from '../../../../_utils/types/mongo-id.type';

export class GetUserDto {
  @ApiProperty()
  id: MongoId;

  @ApiProperty()
  username: string;

  @ApiProperty({ enum: UserRoleEnum })
  role: UserRoleEnumValueType;
}
