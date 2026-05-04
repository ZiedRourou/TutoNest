import { forwardRef, Global, Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LOGTO_JWKS_TOKEN, LOGTO_URIS_TOKEN } from 'src/_utils/constants';
import { LogtoMapper } from './logto.mapper';
import { LogtoRequests } from './logto.requests';
import { LogtoService } from './logto.service';
import { LogtoExceptions } from './_utils/errors/logto-exceptions.types';
import { logtoProviders } from './logto.provider';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'http-bearer' }), forwardRef(() => UsersModule)],
  providers: [LogtoService, ...logtoProviders, LogtoRequests, Logger, LogtoExceptions, LogtoMapper],
  exports: [LogtoService, LogtoRequests, LogtoMapper, LOGTO_URIS_TOKEN, LOGTO_JWKS_TOKEN],
})
export class LogtoModule {}
