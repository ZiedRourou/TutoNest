import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { extractBearerTokenFromHeaders } from '../middlewares/auth-middleware';
import { AuthorizationError } from '../errors/authorization-error.types';
import { LogtoAuthService } from '../../logto-auth-service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly logtoAuthService: LogtoAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const token = extractBearerTokenFromHeaders(request.headers);
      const payload = await this.logtoAuthService.validateJwt(token);
      request.auth = await this.logtoAuthService.createAuthInfo(payload);
      return true;
    } catch (error) {
      throw new AuthorizationError(error.message);
    }
  }
}
