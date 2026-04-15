import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../strategies/jwt-auth.guard';
import type { UserRoleEnumValueType } from '../../../users/_utils/enum/user-role.enum';

export const ROLES_KEY = 'roles';

export function Protect(...roles: UserRoleEnumValueType[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
