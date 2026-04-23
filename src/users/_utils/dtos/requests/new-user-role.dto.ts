import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../../enum/user-role.enum';
import type { NonAdminRoleEnumValueType } from '../../types/user-role.type';
import { ALLOWED_ROLES } from '../../../../_utils/constants';

export class NewUserRoleDto {
  @ApiProperty({
    enum: ALLOWED_ROLES,
    example: UserRoleEnum.AUTHOR,
    description: 'User Role (excluding ADMIN)',
  })
  @IsIn(ALLOWED_ROLES, {
    message: `Role must be one of: ${ALLOWED_ROLES}`,
  })
  role: NonAdminRoleEnumValueType;
}
