import { Module } from '@nestjs/common';

import { ArticleModule } from './article/article.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { EnvironmentVariables, MongoConfig, validateEnv } from './_utils/config/env.config';
import { LogtoModule } from './logto/logto.module';
import { CommentModule } from './comment/comment.module';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { UserExceptionsTypes } from './users/_utils/errors/user-exceptions.types';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateEnv, isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        uri: configService.get<MongoConfig>('MONGO').MONGODB_URL,
      }),
    }),
    ArticleModule,
    UsersModule,
    CommentModule,
    LogtoModule,
    EmailModule,
    WebhooksModule,
  ],
  controllers: [UsersController],
  providers: [EmailService, UserExceptionsTypes],
  exports: [EmailService],
})
export class AppModule {}
