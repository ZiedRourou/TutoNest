import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EnvironmentVariables } from '../_utils/config/env.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { EmailMapper } from './email.mapper';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const templateDir = path.join(__dirname, 'templates');

        return {
          transport: {
            host: configService.get('SMTP').SMTP_HOST,
            port: configService.get('SMTP').SMTP_PORT,
          },
          template: {
            dir: templateDir,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: false,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService, EmailMapper],
  exports: [EmailService, EmailMapper],
})
export class EmailModule {}
