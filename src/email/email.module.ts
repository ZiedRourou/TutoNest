import path from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { EnvironmentVariables } from '../_utils/config/env.config'
import { EmailMapper } from './email.mapper'
import { EmailService } from './email.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const templatesDir = path.join(__dirname, 'templates')

        return {
          transport: {
            ...(configService.get('SMTP').SMTP_SERVICE && {
              service: configService.get('SMTP').SMTP_SERVICE,
            }),
            host: configService.get('SMTP').SMTP_HOST,
            port: configService.get('SMTP').SMTP_PORT,
            secure: false,
            auth: {
              user: configService.get('SMTP').SMTP_USER,
              pass: configService.get('SMTP').SMTP_PASSWORD,
            },
          },
          template: {
            dir: templatesDir,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: false,
            },
          },
        }
      },
    }),
  ],
  providers: [EmailService, EmailMapper],
  exports: [EmailService, EmailMapper],
})
export class EmailModule {}
