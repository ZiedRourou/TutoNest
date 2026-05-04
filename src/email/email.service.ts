import * as fs from 'node:fs'
import path from 'node:path'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import * as Handlebars from 'handlebars'
import { LogtoUserWithOrganizations } from 'src/logto/_utils/types/user-with-organization.type'
import { SendContactEmailDto } from 'src/users/_utils/dto/requests/send-contact-email.dto'
import { SendLogtoEmailDto } from './_utils/dto/send-logto-email.dto'
import { EmailData } from './_utils/types/email-data'
import { JitUserEmail } from './_utils/types/jit-user-email.type'
import { EmailMapper } from './email.mapper'

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name)

  constructor(
    private readonly mailerService: MailerService,
    private readonly emailMapper: EmailMapper,
  ) {}

  onModuleInit() {
    this.registerPartials()
  }

  private async sendEmail(emailData: EmailData) {
    try {
      await this.mailerService.sendMail({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
        context: emailData.context,
        attachments: emailData.attachments,
      })
    } catch (e) {
      this.logger.error('Failed to send email', e)
    }
  }

  sendContactEmail = (user: LogtoUserWithOrganizations, dto: SendContactEmailDto) => {
    const context = {
      productName: dto.productName,
      name: user.name ?? 'No name',
      email: user.primaryEmail ?? '',
      nameOrganization: user.currentOrganization.name,
      messageContent: dto.messageContent,
    }
    const emailData = this.emailMapper.mapToContactEmail(context)
    return this.sendEmail(emailData)
  }

  async sendJitUserJoinedEmail(dto: JitUserEmail) {
    const emailData = this.emailMapper.mapToJitUserJoined(dto)
    return this.sendEmail(emailData)
  }

  async sendLogtoEmail(dto: SendLogtoEmailDto) {
    const emailData = await this.emailMapper.mapToLogtoEmail(dto)
    return this.sendEmail(emailData)
  }

  private registerPartials() {
    const partialsDir = path.join(__dirname, 'templates', 'partials')
    if (!fs.existsSync(partialsDir)) {
      this.logger.warn(`Email partials directory not found at ${partialsDir}, skipping partial registration`)
      return
    }

    const filenames = fs.readdirSync(partialsDir)

    filenames.forEach((filename) => {
      const matches = /^([^.]+).hbs$/.exec(filename)
      if (!matches) return

      const name = matches[1]
      const template = fs.readFileSync(path.join(partialsDir, filename), 'utf8')
      Handlebars.registerPartial(name, template)
    })
  }
}
