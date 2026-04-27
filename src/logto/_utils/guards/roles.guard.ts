import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/_utils/constants';
import { ProtectOptions } from '../decorators/protect.decorator';
import { AuthInfo } from '../types/auth-info.types';
import { UserPermissionEnumValueType } from '../../../users/_utils/types/user-permission.type';
import { UserRoleEnumValueType } from '../../../users/_utils/types/user-role.type';
import { AuthorizationError } from '../errors/authorization-error.types';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const opts = this.reflector.getAllAndOverride<ProtectOptions>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if ((!opts?.roles && !opts?.permissions) || (opts.roles?.length === 0 && opts.permissions?.length === 0)) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const auth = request.auth as AuthInfo;

    const userRole = auth.role;
    const userPermissions = auth.scopes;

    const roles = opts?.roles ?? [];
    const permissions = opts?.permissions ?? [];
    const requiredRoles = roles.length > 0 ? new Set(roles) : null;
    const requiredPermissions = permissions.length > 0 ? new Set(permissions) : null;

    if (requiredRoles && requiredRoles.has(userRole as UserRoleEnumValueType)) return true;

    if (
      requiredPermissions &&
      userPermissions.some(perm => requiredPermissions.has(perm as UserPermissionEnumValueType))
    )
      return true;

    throw new AuthorizationError('Insufficient permissions or roles to access this resource');
  }
}
