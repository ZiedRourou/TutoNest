import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/_utils/constants';
import { ProtectOptions } from '../decorators/protect.decorator';
import { AuthInfo } from '../types/auth-info.types';
import { UserPermissionEnumValueType } from '../../../users/_utils/types/user-permission.type';
import { UserRoleEnumValueType } from '../../../users/_utils/types/user-role.type';
import { UsersService } from '../../../users/users.service';

@Injectable()
export class CheckRegisteredUserGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authInfo = request.auth as AuthInfo;
    const user = await this.userService.findOrCreateUser(authInfo);
    request.user = user;
    return true;
  }
}
