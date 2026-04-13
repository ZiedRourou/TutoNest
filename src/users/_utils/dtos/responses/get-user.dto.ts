import { UserRoleEnum } from '../../enum/user-role.enum';
import type { UserRoleType } from '../../enum/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRoleEnum })
  role: UserRoleType;
}
