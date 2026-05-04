import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './article/article.module';
import { EnvironmentVariables, MongoConfig, validateEnv } from './_utils/config/env.config';
import { UsersModule } from './users/users.module';
import { CommentModule } from './comment/comment.module';
import { LogtoModule } from './logto/logto.module';
import { EmailModule } from './email/email.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { UsersController } from './users/users.controller';

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
})
export class AppModule {}
