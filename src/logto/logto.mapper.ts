import { Injectable } from '@nestjs/common';
import { LogtoPayload } from './_utils/schemas/logto-payload.types';
import { AuthInfo } from './_utils/types/auth-info.types';
import { UserDocument } from '../users/users.schema';

@Injectable()
export class LogtoMapper {
  toAuthInfo = (payload: LogtoPayload, user?: UserDocument): AuthInfo => ({
    sub: payload.sub,
    clientId: payload.client_id,
    userLogtoId: payload.userLogtoId,
    scopes: (payload.scope as string)?.split(' ') ?? [],
    role: payload.role,
    username: payload.username,
    user,
  });
}
