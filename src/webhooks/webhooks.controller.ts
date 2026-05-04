import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MeiliProctect } from 'src/meilisearch/_utils/decorators/meili-protect.decorator'
import { LogtoEmailWebhookAuthGuard } from './_utils/guards/logto-email-webhook-auth.guard'
import { LogtoWebhookSignatureGuard } from './_utils/guards/logto-webhook-signature.guard'
import { PayfactWebhookGuard } from './_utils/guards/payfact-webhook.guard'
import { LogtoEmailWebhookDto } from './_utils/types/logto-email-webhook.types'
import { LogtoWebhookPayload } from './_utils/types/logto-webhook.types'
import { MeilisearchWebhook } from './_utils/types/meilisearch-webhook.type'
import { SubscriptionWebhookDto } from './_utils/types/payfact-webhook.type'
import { WebhooksService } from './webhooks.service'

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('logto')
  @UseGuards(LogtoWebhookSignatureGuard)
  handleLogtoWebhook(@Body() payload: LogtoWebhookPayload) {
    return this.webhooksService.handleLogtoWebhookEvent(payload)
  }

  @Post('logto/email')
  @UseGuards(LogtoEmailWebhookAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Handle LogTo email webhook for custom email templates',
  })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  handleLogtoEmailWebhook(@Body() dto: LogtoEmailWebhookDto) {
    return this.webhooksService.handleLogtoEmailWebhook(dto)
  }

  @MeiliProctect()
  @Post('meilisearch/oreus')
  handleMeiliWebhook(@Body() tasks: MeilisearchWebhook[]) {
    return this.webhooksService.handleMeilisearchSynchroWebhook(tasks)
  }

  @UseGuards(PayfactWebhookGuard)
  @Post('payfact')
  handlePayfactWebhook(@Body() payload: SubscriptionWebhookDto) {
    return this.webhooksService.handlePayfactWebhook(payload)
  }
}
