import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [UsersModule, EmailModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
