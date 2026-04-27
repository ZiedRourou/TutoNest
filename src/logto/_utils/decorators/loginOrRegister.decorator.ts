import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRoleEnumValueType } from '../../../users/_utils/types/user-role.type';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { ROLES_KEY } from '../../../_utils/constants';
import { UserPermissionEnumValueType } from '../../../users/_utils/types/user-permission.type';
import { CheckRegisteredUserGuard } from '../guards/check-registered-user.guard';

export type ProtectOptions = {
  roles?: UserRoleEnumValueType[];
  permissions?: UserPermissionEnumValueType[];
};

export function LoginOrRegister(_opts?: ProtectOptions) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, _opts),
    ApiBearerAuth(),
    UseGuards(CheckRegisteredUserGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
