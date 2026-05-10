import { Logger, Module } from '@nestjs/common';
import { RustfsService } from './rustfs.service';
import { ConfigModule } from '@nestjs/config';
import { RustfsMapper } from './rustfs.mapper';
import { rustfsProviders } from './rustfs.provider';
import { RustfsExceptionsTypes } from './_utils/errors/rustfs-exceptions.types';

@Module({
  imports: [ConfigModule],
  providers: [RustfsService, RustfsMapper, ...rustfsProviders, Logger, RustfsExceptionsTypes],
  exports: [RustfsService, RustfsMapper],
})
export class RustfsModule {}
