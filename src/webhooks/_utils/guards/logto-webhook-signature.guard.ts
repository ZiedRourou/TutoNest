import { createHmac, timingSafeEqual } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { EnvironmentVariables } from '../../../_utils/config/env.config';
import { LogtoPayload } from '../../../logto/_utils/schemas/logto-payload.types';
import { LogtoExceptions } from '../../../logto/_utils/errors/logto-exceptions.types';

@Injectable()
export class LogtoWebhookSignatureGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly exceptions: LogtoExceptions,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['logto-signature-sha-256'];
    const body = request.body;

    if (!signature) {
      throw this.exceptions.ERROR_MISSING_WEBHOOK_SIGNATURE;
    }

    const isValid = this.verifySignature(body, signature);

    if (!isValid) {
      throw this.exceptions.ERROR_INVALID_WEBHOOK_SIGNATURE;
    }

    return true;
  }

  private verifySignature(payload: LogtoPayload, signature: string): boolean {
    const signingKey = this.configService.get('LOGTO').LOGTO_WEBHOOK_SIGNING_KEY;

    if (!signingKey) {
      throw this.exceptions.ERROR_SIGNING_KEY;
    }

    const expectedSignature = createHmac('sha256', signingKey).update(JSON.stringify(payload)).digest('hex');

    try {
      const signatureBuffer = Buffer.from(signature, 'hex');
      const expectedBuffer = Buffer.from(expectedSignature, 'hex');

      if (signatureBuffer.length !== expectedBuffer.length) {
        return false;
      }

      return timingSafeEqual(signatureBuffer, expectedBuffer);
    } catch (_error) {
      return false;
    }
  }
}
