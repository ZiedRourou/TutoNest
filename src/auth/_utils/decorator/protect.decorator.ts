import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../strategy/jwt-auth.guard';
import { UserRoleEnum } from '../../../users/_utils/user-role.enum';

export const ROLES_KEY = 'roles';

export function Protect(...roles: UserRoleEnum[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
