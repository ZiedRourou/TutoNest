import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { EnvironmentVariables, LogtoConfig } from 'src/_utils/config/env.config';
import { extractBearerToken } from 'src/_utils/functions/extract-bearer-token.function';

@Injectable()
export class LogtoEmailWebhookAuthGuard implements CanActivate {
  private readonly logger = new Logger(LogtoEmailWebhookAuthGuard.name);

  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.error('Missing Authorization header in LogTo email webhook request');
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = extractBearerToken(authHeader);

    if (!token) {
      this.logger.error('Invalid Authorization header format in LogTo email webhook request');
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    const expectedToken = this.configService.get<LogtoConfig>('LOGTO', { infer: true }).LOGTO_WEBHOOK_SIGNING_KEY;

    if (token !== expectedToken) {
      this.logger.error('Invalid authorization token in LogTo email webhook request');
      throw new UnauthorizedException('Invalid authorization token');
    }

    return true;
  }
}
