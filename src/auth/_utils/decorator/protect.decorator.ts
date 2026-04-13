import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../strategies/jwt-auth.guard';
import { UserRoleType } from '../../../users/_utils/enum/user-role.enum';

export const ROLES_KEY = 'roles';

export function Protect(...roles: UserRoleType[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
