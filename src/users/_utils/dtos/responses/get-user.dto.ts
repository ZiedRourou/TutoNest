import { UserRoleEnum } from '../../enum/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';
import type { UserRoleEnumValueType } from '../../types/user-role.type';

export class GetUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ enum: UserRoleEnum })
  role: UserRoleEnumValueType;
}
