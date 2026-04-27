import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthInfo } from '../types/auth-info.types';
import { UsersService } from '../../../users/users.service';
import { extractBearerTokenFromHeaders } from '../middlewares/auth-middleware';
import { LogtoService } from '../../logto.service';
import { AuthorizationError } from '../errors/authorization-error.types';

@Injectable()
export class CheckRegisteredUserGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly logtoService: LogtoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const token = extractBearerTokenFromHeaders(request.headers);
      const payload = await this.logtoService.validateJwt(token);
      request.auth = await this.logtoService.createNewUserAuthInfo(payload);
      const authInfo = request.auth as AuthInfo;
      request.auth.user = await this.userService.findOrCreateUser(authInfo);
      return true;
    } catch (error) {
      throw new AuthorizationError(error.message);
    }
  }
}
