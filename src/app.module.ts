import { Module } from '@nestjs/common';

import { ArticleModule } from './article/article.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { EnvironmentVariables, validateEnv } from './_utils/config/env.config';
import { LogtoModule } from './logto/logto.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateEnv, isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        uri: configService.get('MONGODB_URL'),
      }),
    }),
    ArticleModule,
    UsersModule,
    CommentModule,
    LogtoModule,
  ],
  controllers: [UsersController],
})
export class AppModule {}
