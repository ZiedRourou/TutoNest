import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { extractBearerTokenFromHeaders } from '../middlewares/auth-middleware';
import { LogtoService } from '../../logto.service';
import { AuthorizationError } from '../errors/authorization-error.types';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly logtoService: LogtoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const token = extractBearerTokenFromHeaders(request.headers);
      const payload = await this.logtoService.validateJwt(token);
      request.auth = await this.logtoService.createAuthInfo(payload);
      return true;
    } catch (error) {
      throw new AuthorizationError(error.message);
    }
  }
}
