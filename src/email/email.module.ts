import { Module } from '@nestjs/common';
import path from 'node:path';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { EnvironmentVariables } from '../_utils/config/env.config';
import { EmailService } from './email.service';
import { EmailMapper } from './email.mapper';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const templatesDir = path.join(__dirname, 'templates');
        return {
          transport: {
            host: configService.get('SMTP').SMTP_HOST,
            port: configService.get('SMTP').SMTP_PORT,
            secure: false,
          },
          template: {
            dir: templatesDir,
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
